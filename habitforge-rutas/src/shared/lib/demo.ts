import { crearStore } from './crearStore'

/* ------------------------------------------------------------------
 * Telemetría de la demo: alimenta el "Panel del expositor".
 * No es parte de una app real; existe para que el público VEA lo que
 * normalmente pasa a escondidas (guardias, chunks, navegaciones).
 * ------------------------------------------------------------------ */

export type TipoEvento = 'nav' | 'guardia' | 'chunk' | 'error' | 'sesion'
export type EventoDemo = { id: number; hora: string; tipo: TipoEvento; mensaje: string }

const leerBool = (k: string, porDefecto: boolean) => {
  try {
    const v = localStorage.getItem(k)
    return v === null ? porDefecto : v === '1'
  } catch {
    return porDefecto
  }
}

// Cuántas veces se ha descargado el documento HTML completo en esta pestaña.
// En una SPA bien hecha, este número NO sube al navegar entre páginas.
const RECARGAS_KEY = 'demo:recargas'
let recargas = 1
try {
  recargas = Number(sessionStorage.getItem(RECARGAS_KEY) ?? '0') + 1
  sessionStorage.setItem(RECARGAS_KEY, String(recargas))
} catch { /* sin storage: no pasa nada */ }

export const demoStore = crearStore({
  recargasDocumento: recargas,
  navegacionesSpa: 0,
  chunksPendientes: 0,
  redLenta: leerBool('demo:red-lenta', true),
  panelAbierto: leerBool('demo:panel', true),
  eventos: [] as EventoDemo[],
})

let siguienteId = 1
export function registrarEvento(tipo: TipoEvento, mensaje: string) {
  const hora = new Date().toLocaleTimeString('es-HN', { hour12: false })
  // Los loaders padre/hijo corren en paralelo: evitamos registrar dos veces lo mismo
  if (demoStore.obtener().eventos[0]?.mensaje === mensaje) return
  demoStore.actualizar((s) => ({
    ...s,
    eventos: [{ id: siguienteId++, hora, tipo, mensaje }, ...s.eventos].slice(0, 12),
  }))
}

export function contarNavegacionSpa() {
  demoStore.actualizar((s) => ({ ...s, navegacionesSpa: s.navegacionesSpa + 1 }))
}

export function cambiarChunksPendientes(delta: number) {
  demoStore.actualizar((s) => ({ ...s, chunksPendientes: Math.max(0, s.chunksPendientes + delta) }))
}

export function alternarOpcion(clave: 'redLenta' | 'panelAbierto') {
  demoStore.actualizar((s) => {
    const valor = !s[clave]
    try {
      localStorage.setItem(clave === 'redLenta' ? 'demo:red-lenta' : 'demo:panel', valor ? '1' : '0')
    } catch { /* ignorar */ }
    return { ...s, [clave]: valor }
  })
}

export const esperar = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms))

/** Latencia artificial para que el público alcance a ver el fallback de Suspense. */
export const latenciaRed = (base = 900) => (demoStore.obtener().redLenta ? base : 0)

/** Momento en que arrancó la app: todo .js descargado después es "bajo demanda". */
export const ARRANQUE_MS = performance.now()
