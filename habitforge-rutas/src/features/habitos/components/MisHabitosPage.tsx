import { Link, useLoaderData, useSearchParams } from 'react-router-dom'
import type { HabitosData } from './loaders'

export default function MisHabitosPage() {
  const { habitos } = useLoaderData() as HabitosData
  // El filtro vive en la URL (?q=...): se puede compartir el enlace y sobrevive a F5
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const filtrados = habitos.filter((h) => `${h.nombre} ${h.categoria}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="animate-entrar">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis hábitos</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ruta privada · chunk cargado con <code className="font-mono text-indigo-400">React.lazy</code> · datos con <code className="font-mono text-indigo-400">loader</code>
          </p>
        </div>
        <input value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          placeholder="Filtrar… (se refleja en la URL)"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none sm:max-w-xs" />
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((h) => (
          <Link key={h.id} to={`/mis-habitos/${h.id}`}
            className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-indigo-500">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{h.icono}</span>
              <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">{h.categoria}</span>
            </div>
            <h2 className="mt-4 font-semibold text-white group-hover:text-indigo-300">{h.nombre}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{h.descripcion}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-amber-300">🔥 {h.rachaActual} días</span>
              <span className="font-mono text-slate-500">/mis-habitos/{h.id} →</span>
            </div>
          </Link>
        ))}
        {filtrados.length === 0 && <p className="text-sm text-slate-500">Ningún hábito coincide con “{q}”.</p>}
      </div>
    </div>
  )
}
