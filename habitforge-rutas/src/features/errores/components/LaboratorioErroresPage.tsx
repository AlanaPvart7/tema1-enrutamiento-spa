import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/store/authStore'

export default function LaboratorioErroresPage() {
  const { sesion } = useAuth()
  const casos = [
    { a: '/ruta-que-no-existe', codigo: '404', titulo: 'URL inexistente', detalle: 'La captura la ruta comodín path: "*"' },
    { a: '/mis-habitos/999', codigo: '404', titulo: 'Recurso inexistente', detalle: 'La URL es válida, pero el loader lanza 404' },
    { a: '/admin', codigo: '403', titulo: 'Sin permisos', detalle: sesion?.rol === 'admin' ? 'Entra como "estudiante" para ver el 403' : 'Tu rol no es admin → 403' },
    { a: '/laboratorio-errores/servidor-caido', codigo: '500', titulo: 'Servidor caído', detalle: 'El loader lanza un Response 500' },
    { a: '/laboratorio-errores/componente-roto', codigo: 'BUG', titulo: 'Componente roto', detalle: 'Excepción de JavaScript al renderizar' },
    { a: '/laboratorio-errores/chunk-perdido', codigo: 'CHUNK', titulo: 'Chunk perdido', detalle: 'Falla la descarga del import() dinámico' },
  ]
  return (
    <div className="animate-entrar">
      <header className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Laboratorio de errores</h1>
        <p className="mt-1 text-sm text-slate-400">
          Cada tarjeta provoca un fallo distinto. Todos terminan en el mismo <code className="font-mono text-indigo-400">errorElement</code>, que los traduce a una vista amigable
          <strong className="text-slate-200"> sin tumbar el layout</strong> (el menú sigue funcionando).
        </p>
      </header>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {casos.map((c) => (
          <Link key={c.a} to={c.a} className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-rose-500/60">
            <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-300">{c.codigo}</span>
            <h2 className="mt-3 font-semibold text-white">{c.titulo}</h2>
            <p className="mt-1 text-sm text-slate-400">{c.detalle}</p>
            <p className="mt-3 font-mono text-xs text-slate-500 group-hover:text-slate-300">{c.a} →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
