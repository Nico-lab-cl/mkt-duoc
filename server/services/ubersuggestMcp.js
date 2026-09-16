import crypto from 'crypto';
import https from 'https';

// Deshabilitar rechazo de certificados si el entorno local tiene certificados corporativos/proxy
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const MCP_SERVER_URL = 'https://ubersuggest-mcp.neilpatelapi.com/mcp';
const OAUTH_AUTH_URL = 'https://ubersuggest-mcp.neilpatelapi.com/authorize';
const OAUTH_TOKEN_URL = 'https://ubersuggest-mcp.neilpatelapi.com/token';
const CLIENT_ID = 'ubersuggest-mcp';
const SCOPES = 'profile domain keywords serp backlinks site_audit content projects utility';

// Cache temporal en memoria para code_verifier de PKCE durante el flujo de login
const pkceStore = new Map();

// Helper para generar strings base64url seguros
function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Genera el code_verifier y code_challenge para PKCE
function generatePKCE() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

export class UbersuggestMcpService {
  constructor(pool) {
    this.pool = pool;
    this.initTables();
  }

  async initTables() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS seo_integrations (
          id SERIAL PRIMARY KEY,
          provider VARCHAR(50) UNIQUE NOT NULL DEFAULT 'ubersuggest',
          access_token TEXT,
          refresh_token TEXT,
          token_type VARCHAR(50) DEFAULT 'Bearer',
          expires_at TIMESTAMP,
          scope TEXT,
          account_email TEXT,
          is_active BOOLEAN DEFAULT false,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS seo_queries_cache (
          id SERIAL PRIMARY KEY,
          cache_key TEXT UNIQUE NOT NULL,
          tool_name VARCHAR(100) NOT NULL,
          query_params JSONB NOT NULL,
          response_data JSONB NOT NULL,
          hits INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP
        );
      `);
      console.log('✅ Tablas SEO de Ubersuggest inicializadas en PostgreSQL');
    } catch (err) {
      console.error('❌ Error al inicializar tablas SEO:', err.message);
    }
  }

  /**
   * Genera la URL de autorización para el inicio de sesión OAuth 2.0 con Ubersuggest
   */
  getAuthorizationUrl(redirectUri) {
    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');

    // Guardar el verifier asociado al state (expira en 15 minutos)
    pkceStore.set(state, {
      verifier,
      redirectUri,
      createdAt: Date.now()
    });

    // Limpiar entradas antiguas de PKCE
    for (const [s, data] of pkceStore.entries()) {
      if (Date.now() - data.createdAt > 15 * 60 * 1000) {
        pkceStore.delete(s);
      }
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: state
    });

    return {
      authUrl: `${OAUTH_AUTH_URL}?${params.toString()}`,
      state
    };
  }

  /**
   * Intercambia el código de autorización devuelto por Ubersuggest por tokens de acceso
   */
  async handleOAuthCallback(code, state) {
    const stored = pkceStore.get(state);
    if (!stored) {
      throw new Error('Estado de autorización inválido o expirado. Por favor intenta iniciar sesión nuevamente.');
    }

    const { verifier, redirectUri } = stored;
    pkceStore.delete(state);

    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    });

    const response = await fetch(OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: bodyParams.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Error en token exchange:', errText);
      throw new Error(`Error al canjear token con Ubersuggest: ${errText}`);
    }

    const tokenData = await response.json();
    const expiresIn = tokenData.expires_in || 86400 * 30; // 30 días por defecto
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Guardar o actualizar en la base de datos
    await this.pool.query(`
      INSERT INTO seo_integrations (provider, access_token, refresh_token, token_type, expires_at, scope, is_active, updated_at)
      VALUES ('ubersuggest', $1, $2, $3, $4, $5, true, NOW())
      ON CONFLICT (provider) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = COALESCE(EXCLUDED.refresh_token, seo_integrations.refresh_token),
        token_type = EXCLUDED.token_type,
        expires_at = EXCLUDED.expires_at,
        scope = EXCLUDED.scope,
        is_active = true,
        updated_at = NOW()
    `, [
      tokenData.access_token,
      tokenData.refresh_token || null,
      tokenData.token_type || 'Bearer',
      expiresAt,
      tokenData.scope || SCOPES
    ]);

    return {
      success: true,
      message: 'Ubersuggest conectado exitosamente'
    };
  }

  /**
   * Obtiene un token de acceso válido, refrescándolo si ha expirado
   */
  async getValidToken() {
    const res = await this.pool.query(`
      SELECT * FROM seo_integrations WHERE provider = 'ubersuggest' AND is_active = true LIMIT 1
    `);

    if (res.rows.length === 0 || !res.rows[0].access_token) {
      return null;
    }

    const integration = res.rows[0];
    const now = new Date();
    const expiresAt = new Date(integration.expires_at);

    // Si expira en menos de 5 minutos y tenemos refresh_token, refrescamos
    if (integration.refresh_token && (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000)) {
      try {
        console.log('🔄 Refrescando token de Ubersuggest...');
        const bodyParams = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          refresh_token: integration.refresh_token
        });

        const refreshRes = await fetch(OAUTH_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: bodyParams.toString()
        });

        if (refreshRes.ok) {
          const newTokenData = await refreshRes.json();
          const expiresIn = newTokenData.expires_in || 86400 * 30;
          const newExpiresAt = new Date(Date.now() + expiresIn * 1000);

          await this.pool.query(`
            UPDATE seo_integrations SET
              access_token = $1,
              refresh_token = COALESCE($2, refresh_token),
              expires_at = $3,
              updated_at = NOW()
            WHERE provider = 'ubersuggest'
          `, [newTokenData.access_token, newTokenData.refresh_token || null, newExpiresAt]);

          return newTokenData.access_token;
        }
      } catch (err) {
        console.error('⚠️ Error refrescando token:', err.message);
      }
    }

    return integration.access_token;
  }

  /**
   * Estado de la integración de Ubersuggest
   */
  async getStatus() {
    const res = await this.pool.query(`
      SELECT provider, is_active, expires_at, updated_at, account_email
      FROM seo_integrations WHERE provider = 'ubersuggest' LIMIT 1
    `);

    if (res.rows.length === 0 || !res.rows[0].is_active) {
      return {
        connected: false,
        provider: 'ubersuggest',
        mcpEndpoint: MCP_SERVER_URL
      };
    }

    const row = res.rows[0];
    const isExpired = new Date(row.expires_at) < new Date();

    return {
      connected: !isExpired && row.is_active,
      provider: 'ubersuggest',
      mcpEndpoint: MCP_SERVER_URL,
      expiresAt: row.expires_at,
      updatedAt: row.updated_at,
      accountEmail: row.account_email
    };
  }

  /**
   * Desconectar Ubersuggest
   */
  async disconnect() {
    await this.pool.query(`
      UPDATE seo_integrations SET is_active = false, access_token = null, refresh_token = null
      WHERE provider = 'ubersuggest'
    `);
    return { success: true };
  }

  /**
   * Ejecuta una llamada RPC contra el servidor MCP de Ubersuggest
   */
  async executeMcpTool(toolName, params = {}) {
    const token = await this.getValidToken();
    if (!token) {
      throw new Error('Ubersuggest no está conectado. El profesor debe conectar su cuenta en el panel SEO.');
    }

    // Comprobar caché (para no consumir créditos si se repite la misma consulta en 24h)
    const cacheKey = `${toolName}:${JSON.stringify(params)}`.toLowerCase();
    const cacheRes = await this.pool.query(`
      SELECT response_data, expires_at FROM seo_queries_cache WHERE cache_key = $1
    `, [cacheKey]);

    if (cacheRes.rows.length > 0) {
      const cached = cacheRes.rows[0];
      if (!cached.expires_at || new Date(cached.expires_at) > new Date()) {
        await this.pool.query(`UPDATE seo_queries_cache SET hits = hits + 1 WHERE cache_key = $1`, [cacheKey]);
        return {
          ...cached.response_data,
          _fromCache: true
        };
      }
    }

    // Llamada JSON-RPC al MCP Server
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };

    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`❌ Error en MCP tool ${toolName}:`, response.status, errBody);
      throw new Error(`Error en servidor MCP (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    
    // Si la respuesta contiene contenido devuelto por la herramienta MCP
    let finalResult = data;
    if (data.result && data.result.content && data.result.content[0]) {
      const firstContent = data.result.content[0];
      if (firstContent.type === 'text') {
        try {
          finalResult = JSON.parse(firstContent.text);
        } catch {
          finalResult = { text: firstContent.text, rawResult: data.result };
        }
      }
    }

    // Guardar en caché por 24 horas
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    try {
      await this.pool.query(`
        INSERT INTO seo_queries_cache (cache_key, tool_name, query_params, response_data, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (cache_key) DO UPDATE SET
          response_data = EXCLUDED.response_data,
          expires_at = EXCLUDED.expires_at,
          created_at = NOW()
      `, [cacheKey, toolName, JSON.stringify(params), JSON.stringify(finalResult), expiresAt]);
    } catch (e) {
      console.warn('⚠️ No se pudo guardar en caché SEO:', e.message);
    }

    return finalResult;
  }

  /**
   * Helper para listar todas las herramientas disponibles en el servidor MCP
   */
  async listMcpTools() {
    const token = await this.getValidToken();
    if (!token) return { tools: [] };

    try {
      const response = await fetch(MCP_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {}
        })
      });

      if (!response.ok) return { tools: [] };
      const data = await response.json();
      return data.result || { tools: [] };
    } catch (e) {
      console.error('Error listando herramientas MCP:', e.message);
      return { tools: [] };
    }
  }
}
