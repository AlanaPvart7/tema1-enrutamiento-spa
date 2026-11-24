import { useEffect, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'
import { authStore, useAuth } from '../../features/auth/store/authStore'
import { useStore } from '../lib/crearStore'
import { alternarOpcion, ARRANQUE_MS, demoStore, type TipoEvento } from '../lib/demo'

type Recurso = { nombre: string; kb: number; ms: number; inicial: boolean }

/** Observa qué archivos JS descarga el navegador (lo mismo que la pestaña Network). */
function useRecursosJs() {
  const [recursos, setRecursos] = useState<Recurso[]>([])
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const vistos = new Set<string>()
    const obs = new PerformanceObserver((lista) => {
      const nuevos = (lista.getEntries() as PerformanceResourceTiming[])
        .filter((e) => /\.(m?js|tsx?)(\?|$)/.test(e.name) && !e.name.includes('node_modules') && !e.name.includes('@vite') && !vistos.has(e.name))
        .map((e) => {
          vistos.add(e.name)
          return {
            nombre: new URL(e.name).pathname.split('/').pop()!.split('?')[0],
            kb: (e.transferSize || e.encodedBodySize || e.decodedBodySize) / 1024,
            ms: e.duration,
            inicial: e.startTime < ARRANQUE_MS,
          }
        })
      if (nuevos.length) setRecursos((r) => [...r, ...nuevos])
    })
    obs.observe({ type: 'resource', buffered: true })
    return () => obs.disconnect()
  }, [])
  return recursos
}

function useCuentaRegresiva(expSegundos?: number) {
  const [ahora, setAhora] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!expSegundos) return null
  const restante = Math.max(0, Math.round(expSegundos - ahora / 1000))
  return `${String(Math.floor(restante / 60)).padStart(2, '0')}:${String(restante % 60).padStart(2, '0')}`
}

const COLOR_EVENTO: Record<TipoEvento, string> = {
  nav: 'text-sky-300', guardia: 'text-amber-300', chunk: 'text-indigo-300', error: 'text-rose-300', sesion: 'text-emerald-300',
}

export default function PanelExpositor() {
  const demo = useStore(demoStore)
  const { sesion } = useAuth()
  const { pathname, search } = useLocation()
  const navigation = useNavigation()
  const recursos = useRecursosJs()
  const expiraEn = useCuentaRegresiva(sesion?.exp)

  const iniciales = recursos.filter((r) => r.inicial)
  const bajoDemanda = recursos.filter((r) => !r.inicial)
  const kbIniciales = iniciales.reduce((t, r) => t + r.kb, 0)

  if (!demo.panelAbierto) {
    return (
      <button onClick={() => alternarOpcion('panelAbierto')}
        className="fixed bottom-4 right-4 z-40 cursor-pointer rounded-full border border-indigo-500/40 bg-slate-900 px-4 py-2 text-xs font-semibold text-indigo-300 shadow-xl hover:bg-slate-800">
        🎤 Panel del expositor
      </button>
    )
  }

  return (
    <aside className="fixed bottom-4 right-4 z-40 flex max-h-[85vh] w-80 flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950/95 text-xs text-slate-300 shadow-2xl backdrop-blur">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <span className="font-semibold text-white">🎤 Panel del expositor</span>
        <button onClick={() => alternarOpcion('panelAbierto')} className="cursor-pointer text-slate-500 hover:text-white" aria-label="Ocultar panel">✕</button>
      </header>

      <div className="space-y-4 overflow-y-auto p-4">
        <section>
          <p className="font-mono text-[11px] text-slate-500">RUTA ACTUAL</p>
          <p className="mt-1 truncate font-mono text-sm text-white">{pathname}{search}</p>
          <p className="mt-1 text-slate-500">Router: <span className={navigation.state === 'idle' ? 'text-emerald-400' : 'text-amber-300'}>{navigation.state}</span></p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-900 p-2.5">
            <p className="text-[10px] uppercase text-slate-500">Recargas completas</p>
            <p className="text-2xl font-bold text-emerald-300">{demo.recargasDocumento}</p>
          </div>
          <div className="rounded-lg bg-slate-900 p-2.5">
            <p className="text-[10px] uppercase text-slate-500">Navegaciones SPA</p>
            <p className="text-2xl font-bold text-sky-300">{demo.navegacionesSpa}</p>
          </div>
        </section>

        <section className="rounded-lg bg-slate-900 p-2.5">
          <p className="text-[10px] uppercase text-slate-500">Sesión (token)</p>
          {sesion ? (
            <>
              <p className="mt-1 text-white">{sesion.sub} · <span className="text-indigo-300">{sesion.rol}</span> · expira en <span className="font-mono text-amber-300">{expiraEn}</span></p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => authStore.expirarEn(5)} className="cursor-pointer rounded border border-amber-500/40 px-2 py-1 text-amber-300 hover:bg-amber-500/10">Expirar en 5 s</button>
                <button onClick={() => authStore.cerrarSesion('manual')} className="cursor-pointer rounded border border-slate-700 px-2 py-1 hover:bg-slate-800">Cerrar sesión</button>
              </div>
            </>
          ) : (
            <p className="mt-1 text-rose-300">Sin sesión · las rutas privadas están bloqueadas</p>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[11px] text-slate-500">JS INICIAL</p>
            <p className="text-slate-400">{iniciales.length} archivo(s){kbIniciales > 0 && ` · ${kbIniciales.toFixed(1)} KB`}</p>
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate-500">CHUNKS BAJO DEMANDA</p>
          <ul className="mt-1 space-y-1">
            {bajoDemanda.length === 0 && <li className="text-slate-600">Aún ninguno: navega a una ruta privada.</li>}
            {bajoDemanda.slice(-6).map((r, i) => (
              <li key={i} className="flex justify-between gap-2 rounded bg-slate-900 px-2 py-1 font-mono">
                <span className="truncate text-indigo-300">{r.nombre}</span>
                <span className="shrink-0 text-slate-500">{r.kb > 0 ? `${r.kb.toFixed(1)} KB` : `${Math.round(r.ms)} ms`}</span>
              </li>
            ))}
          </ul>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-slate-400">
            <input type="checkbox" checked={demo.redLenta} onChange={() => alternarOpcion('redLenta')} className="accent-indigo-500" />
            Simular red lenta (para ver el Suspense)
          </label>
        </section>

        <section>
          <p className="font-mono text-[11px] text-slate-500">BITÁCORA</p>
          <ul className="mt-1 space-y-1">
            {demo.eventos.length === 0 && <li className="text-slate-600">Sin eventos todavía.</li>}
            {demo.eventos.slice(0, 7).map((e) => (
              <li key={e.id} className="flex gap-2">
                <span className="shrink-0 font-mono text-slate-600">{e.hora}</span>
                <span className={COLOR_EVENTO[e.tipo]}>{e.mensaje}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
