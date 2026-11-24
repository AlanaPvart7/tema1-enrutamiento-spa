import { redirect, type LoaderFunctionArgs } from 'react-router-dom'
import { registrarEvento } from '../../../shared/lib/demo'
import { authStore, type Sesion } from '../store/authStore'
import type { Rol } from '../lib/tokenDemo'

/**
 * 🛡️ GUARDIA DE NAVEGACIÓN (capa 1: loader)
 * Se ejecuta ANTES de renderizar la ruta y ANTES de descargar su chunk.
 * Si no hay sesión vigente, corta la navegación con un redirect a /login
 * recordando a dónde quería ir el usuario (?redirectTo=...).
 */
export function exigirSesion(request: Request): Sesion {
  const sesion = authStore.sesionActual()
  if (!sesion) {
    const url = new URL(request.url)
    const destino = url.pathname + url.search
    registrarEvento('guardia', `🛡️ Acceso denegado a ${url.pathname} → /login`)
    throw redirect(`/login?redirectTo=${encodeURIComponent(destino)}`)
  }
  return sesion
}

/** Autorización por ROL: con sesión pero sin permiso → 403 (lo atrapa el errorElement). */
export function exigirRol(request: Request, rol: Rol): Sesion {
  const sesion = exigirSesion(request)
  if (sesion.rol !== rol) {
    registrarEvento('guardia', `⛔ ${sesion.sub} no tiene rol "${rol}" → 403`)
    throw new Response(`Esta sección requiere el rol "${rol}".`, { status: 403, statusText: 'Prohibido' })
  }
  return sesion
}

/**
 * Envuelve el loader de una ruta privada. Necesario porque React Router ejecuta
 * los loaders padre e hijo EN PARALELO: cada loader privado debe protegerse solo.
 */
export function protegida<T>(loader: (args: LoaderFunctionArgs) => T) {
  return (args: LoaderFunctionArgs) => {
    exigirSesion(args.request)
    return loader(args)
  }
}

/** Evita que un usuario ya autenticado vuelva a ver /login. */
export function soloInvitados({ request }: LoaderFunctionArgs) {
  if (authStore.sesionActual()) {
    throw redirect(destinoSeguro(new URL(request.url).searchParams.get('redirectTo')))
  }
  return null
}

/**
 * Protección contra "Open Redirect": solo aceptamos rutas internas.
 * /login?redirectTo=https://sitio-malo.com  → se ignora y va a /dashboard
 */
export function destinoSeguro(destino: string | null) {
  return destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : '/dashboard'
}
