import { crearStore, useStore } from '../../../shared/lib/crearStore'
import { esperar, registrarEvento } from '../../../shared/lib/demo'
import { firmarTokenDemo, leerToken, tokenVigente, type PayloadToken, type Rol } from '../lib/tokenDemo'

const TOKEN_KEY = 'habitforge:token'
const DURACION_SESION_S = 15 * 60

export type Sesion = PayloadToken & { token: string }
export type MotivoCierre = 'manual' | 'expirada' | null

// Usuarios "quemados" para la demo (en el proyecto real esto lo valida la API .NET).
const USUARIOS: Record<string, { clave: string; nombre: string; rol: Rol }> = {
  estudiante: { clave: '1234', nombre: 'Ana Estudiante', rol: 'estudiante' },
  admin: { clave: 'admin123', nombre: 'Ing. Administradora', rol: 'admin' },
}

function sesionGuardada(): Sesion | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const payload = leerToken(token)
    return token && tokenVigente(payload) ? { ...payload, token } : null
  } catch {
    return null
  }
}

const store = crearStore<{ sesion: Sesion | null; motivoCierre: MotivoCierre }>({
  sesion: sesionGuardada(),
  motivoCierre: null,
})

let temporizador: ReturnType<typeof setTimeout> | undefined
function programarExpiracion(sesion: Sesion | null) {
  clearTimeout(temporizador)
  if (!sesion) return
  temporizador = setTimeout(() => authStore.cerrarSesion('expirada'), sesion.exp * 1000 - Date.now())
}
programarExpiracion(store.obtener().sesion)

function guardar(sesion: Sesion | null, motivoCierre: MotivoCierre = null) {
  try {
    if (sesion) localStorage.setItem(TOKEN_KEY, sesion.token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* ignorar */ }
  store.actualizar({ sesion, motivoCierre })
  programarExpiracion(sesion)
}

export const authStore = {
  suscribir: store.suscribir,
  /** Lectura SINCRÓNICA: la usan los loaders (guardias) fuera de React. */
  sesionActual(): Sesion | null {
    const { sesion } = store.obtener()
    if (sesion && !tokenVigente(sesion)) {
      guardar(null, 'expirada')
      return null
    }
    return sesion
  },

  async iniciarSesion(usuario: string, clave: string): Promise<Sesion> {
    await esperar(600) // simula la llamada POST /api/auth/login
    const u = USUARIOS[usuario.trim().toLowerCase()]
    if (!u || u.clave !== clave) throw new Error('Usuario o contraseña incorrectos')
    const token = firmarTokenDemo({ sub: usuario.trim().toLowerCase(), nombre: u.nombre, rol: u.rol }, DURACION_SESION_S)
    const sesion = { ...(leerToken(token) as PayloadToken), token }
    guardar(sesion)
    registrarEvento('sesion', `🔑 Sesión iniciada como ${sesion.sub} (${sesion.rol})`)
    return sesion
  },

  cerrarSesion(motivo: Exclude<MotivoCierre, null> = 'manual') {
    if (!store.obtener().sesion) return
    guardar(null, motivo)
    registrarEvento('sesion', motivo === 'expirada' ? '⏰ El token expiró: sesión purgada' : '👋 Sesión cerrada')
  },

  /** Solo para la demo: reemplaza el token por uno que vence en N segundos. */
  expirarEn(segundos: number) {
    const s = store.obtener().sesion
    if (!s) return
    const token = firmarTokenDemo({ sub: s.sub, nombre: s.nombre, rol: s.rol }, segundos)
    guardar({ ...(leerToken(token) as PayloadToken), token })
    registrarEvento('sesion', `⏳ Token reemplazado: vence en ${segundos} s`)
  },
}

export const useAuth = () => useStore(store)
