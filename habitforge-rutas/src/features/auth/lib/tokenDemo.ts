/**
 * JWT de juguete (header.payload.firma) para la demo.
 * ⚠️ La firma real la genera el backend .NET (Tema 2). Aquí solo nos interesa
 * el campo `exp` para demostrar que la guardia también valida la VIGENCIA.
 */
export type Rol = 'estudiante' | 'admin'
export type PayloadToken = { sub: string; nombre: string; rol: Rol; exp: number }

const b64url = (obj: object) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

export function firmarTokenDemo(datos: Omit<PayloadToken, 'exp'>, segundosDeVida: number) {
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ ...datos, exp })}.firma-demo`
}

export function leerToken(token: string | null): PayloadToken | null {
  if (!token) return null
  try {
    const base = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(base)))) as PayloadToken
  } catch {
    return null
  }
}

export const tokenVigente = (p: PayloadToken | null): p is PayloadToken => !!p && p.exp * 1000 > Date.now()
