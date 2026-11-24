import { Link, useMatches } from 'react-router-dom'

export type HandleRuta = { migas?: (data: unknown) => string }

/** Migas de pan generadas a partir del árbol de rutas (route.handle + useMatches). */
export default function Breadcrumbs() {
  const migas = useMatches()
    .filter((m) => (m.handle as HandleRuta | undefined)?.migas)
    .map((m) => ({ ruta: m.pathname, texto: (m.handle as HandleRuta).migas!(m.data) }))

  return (
    <nav aria-label="Migas de pan" className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-slate-500 hover:text-slate-300">HabitForge</Link>
      {migas.map((m, i) => (
        <span key={m.ruta} className="flex items-center gap-2">
          <span className="text-slate-700">/</span>
          {i === migas.length - 1 ? <span className="text-slate-200">{m.texto}</span> : <Link to={m.ruta} className="text-slate-500 hover:text-slate-300">{m.texto}</Link>}
        </span>
      ))}
    </nav>
  )
}
