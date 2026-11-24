import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { registrarEvento } from '../../../shared/lib/demo'

const RUTAS_CONOCIDAS = ['/', '/login', '/dashboard', '/mis-habitos', '/admin', '/laboratorio-errores']

/** Distancia de Levenshtein: cuántas letras hay que cambiar para pasar de a → b. */
function distancia(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}

export default function NotFoundPage() {
  const { pathname } = useLocation()
  const sugerencias = RUTAS_CONOCIDAS.map((r) => ({ r, d: distancia(pathname.toLowerCase(), r) }))
    .filter((x) => x.d <= 4 && x.r !== '/')
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)

  useEffect(() => registrarEvento('error', `🔎 Ruta comodín (*) atrapó ${pathname}`), [pathname])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div aria-hidden className="pointer-events-none absolute select-none text-[18rem] font-black leading-none text-slate-900 md:text-[26rem]">404</div>
      <div className="relative max-w-lg text-center animate-entrar">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl shadow-lg shadow-indigo-600/30">🧭</div>
        <h1 className="mt-6 text-3xl font-bold text-white">Esta página no existe</h1>
        <p className="mt-3 text-slate-400">
          Buscamos <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-sm text-rose-300">{pathname}</code> en todo el mapa de rutas y no encontramos nada.
        </p>

        {sugerencias.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">¿Quisiste decir…?</p>
            <div className="mt-3 flex justify-center gap-2">
              {sugerencias.map(({ r }) => (
                <Link key={r} to={r} className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 font-mono text-sm text-indigo-300 hover:bg-indigo-500/20">{r}</Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500">Ir al inicio</Link>
          <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">Ir al dashboard</Link>
        </div>
        <p className="mt-10 text-xs text-slate-600">HabitForge · Ruta comodín <code className="font-mono">path: "*"</code></p>
      </div>
    </div>
  )
}
