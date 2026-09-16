export const N8N_WEBHOOK_URL = process.env.N8N_STUDENT_WEBHOOK_URL || 'https://n8n-n8n.db8enk.easypanel.host/webhook/b869a36b-328a-4a64-a3ed-dc48584b84cd';

/**
 * Genera la plantilla HTML responsive para el correo de bienvenida del alumno
 */
export function generateWelcomeEmailHtml({ full_name, email, tmpPassword, career_year, campus, login_url }) {
  const safeName = full_name || 'Estudiante';
  const safeEmail = email || '';
  const safeYear = career_year || '1er Año';
  const safeCampus = campus || 'Sede Duoc UC';
  const safeUrl = login_url || 'https://softwarespectra.cl';

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida al Simulador de Marketing Inbound</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 20px !important; }
            .header-title { font-size: 24px !important; }
            .code-box { font-size: 28px !important; padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; padding: 40px 0;">
        <tr>
            <td align="center">
                <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #111827; border: 1px solid #1f2937; border-top: 4px solid #f97316; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); width: 68px; height: 68px; border-radius: 18px; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);">
                                        <font size="6" color="#ffffff" style="font-family: Arial, sans-serif; font-weight: bold; line-height: 68px;">🎯</font>
                                    </td>
                                </tr>
                            </table>
                            <h1 class="header-title" style="margin: 20px 0 5px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Simulador de Inbound Marketing</h1>
                            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 2px;">softwarespectra.cl</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px; text-align: left;">
                            <p style="margin: 0 0 15px 0; font-size: 17px; line-height: 1.6; color: #94a3b8;">
                                ¡Hola <strong style="color: #f1f5f9;">${safeName}</strong>! 👋
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                                Tu profesor te ha registrado exitosamente en la plataforma de <strong>Simulación de Inbound Marketing & MarTech</strong>.
                            </p>

                            <!-- Ficha de Datos del Alumno -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 12px; margin-bottom: 25px; border: 1px solid #334155;">
                                <tr>
                                    <td style="padding: 18px 20px;">
                                        <table border="0" cellpadding="4" cellspacing="0" width="100%" style="font-size: 13px; color: #cbd5e1;">
                                            <tr>
                                                <td width="35%" style="color: #94a3b8; font-weight: 600;">📧 Correo:</td>
                                                <td><strong style="color: #ffffff;">${safeEmail}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="color: #94a3b8; font-weight: 600;">🎓 Año de Carrera:</td>
                                                <td><strong style="color: #ffffff;">${safeYear}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="color: #94a3b8; font-weight: 600;">📍 Sede:</td>
                                                <td><strong style="color: #ffffff;">${safeCampus}</strong></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                                Tu <strong>contraseña temporal</strong> de acceso es:
                            </p>

                            <!-- Contraseña Temporal Highlight -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center" class="code-box" style="background-color: #0f172a; border: 2px dashed #f97316; border-radius: 14px; padding: 20px; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #fb923c; box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7);">
                                        ${tmpPassword}
                                    </td>
                                </tr>
                            </table>

                            <!-- Alerta de Cambio Obligatorio -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #451a03; border-left: 4px solid #f97316; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 14px 16px; font-size: 13px; color: #fed7aa; line-height: 1.5;">
                                        🔒 <strong>Paso importante:</strong> Al ingresar por primera vez con esta clave, el sistema te solicitará de forma obligatoria definir tu contraseña personal definitiva.
                                    </td>
                                </tr>
                            </table>

                            <!-- Botón de Ingreso -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${safeUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; font-size: 15px; font-weight: 800; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.5); text-transform: uppercase; letter-spacing: 0.5px;">
                                            Ingresar al Simulador Ahora
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 25px 40px; background-color: #0f172a; border-top: 1px solid #1f2937; text-align: center;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                                Duoc UC — Escuela de Administración y Negocios
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #475569;">
                                Plataforma de simulación interactiva para estudiantes de Marketing.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Función central para enviar la notificación a n8n con subject, html y metacampos
 */
export async function sendStudentNotificationWebhook({
  event = 'new_student_welcome',
  full_name,
  email,
  tmpPassword,
  career_year,
  campus,
  login_url = 'https://softwarespectra.cl'
}) {
  const emailNormalized = email ? email.trim().toLowerCase() : '';
  const firstName = full_name ? full_name.trim().split(' ')[0] : 'Estudiante';
  const lastName = full_name ? full_name.trim().split(' ').slice(1).join(' ') : '';
  
  const isReset = event === 'admin_reset_password' || event === 'student_resend_password';
  const subject = isReset 
    ? `🔑 Tu nueva contraseña temporal para el Simulador de Marketing - ${full_name}`
    : `🎉 ¡Bienvenido/a al Simulador de Marketing! Tus credenciales de acceso`;

  const html = generateWelcomeEmailHtml({
    full_name,
    email: emailNormalized,
    tmpPassword,
    career_year,
    campus,
    login_url
  });

  const metacampos = {
    alumno_id: null,
    nombre_completo: full_name,
    primer_nombre: firstName,
    apellidos: lastName,
    email_institucional: emailNormalized,
    clave_temporal: tmpPassword,
    ano_carrera: career_year || '1er Año',
    sede_duoc: campus || 'Sede Duoc UC',
    plataforma_url: login_url,
    tipo_evento: event,
    fecha_envio: new Date().toISOString()
  };

  const payload = {
    // Variables directas para nodo de correo en n8n
    to: emailNormalized,
    email: emailNormalized,
    subject: subject,
    html: html,
    text: `Hola ${full_name},\n\nTu clave temporal de acceso al Simulador de Marketing (https://softwarespectra.cl) es: ${tmpPassword}\n\nAl ingresar, se te pedirá cambiar tu contraseña.\n\nSede: ${campus || 'Duoc UC'}\nAño de Carrera: ${career_year || '1er Año'}`,
    
    // Variables para compatibilidad
    Nombre: full_name,
    first_name: firstName,
    last_name: lastName,
    "Contraseña temporal": tmpPassword,
    new_password: tmpPassword,
    career_year: career_year || '',
    "Año de carrera": career_year || '',
    campus: campus || '',
    "Sede": campus || '',
    login_url: login_url,

    // Metacampo estructurado
    metacampos: metacampos
  };

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const bodyText = await res.text();
    console.log(`📡 Webhook n8n enviado (${res.status}):`, bodyText);
    return { success: res.ok, status: res.status, response: bodyText };
  } catch (err) {
    console.error('❌ Error enviando webhook a n8n:', err.message);
    return { success: false, error: err.message };
  }
}
