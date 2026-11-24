/** fetch con la sesión firmada del usuario (id + auth_token que entrega el login). */
export async function authFetch(user, url, opts = {}) {
  const r = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': String(user.id),
      'x-auth-token': user.auth_token || '',
      ...(opts.headers || {})
    }
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(d.error || 'Error de conexión');
    e.status = r.status;
    e.code = d.code;
    e.data = d;
    throw e;
  }
  return d;
}

export const EVAL_ID = 'eft-final';

export const fmtTiempo = (seg) => {
  const s = Math.max(0, Math.floor(seg));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
