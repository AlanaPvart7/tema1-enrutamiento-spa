import { useEffect, useState } from 'react'
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom'
import { registrarEvento } from '../../../shared/lib/demo'

type Vista = { codigo: string; icono: string; titulo: string; mensaje: string; tono: string; recargar?: boolean }

/** Traduce cualquier error lanzado en loaders, actions o renders a una vista amigable. */
function clasificar(error: unknown): Vista {
  if (isRouteErrorResponse(error)) {
    const detalle = typeof error.data === 'string' ? error.data : error.statusText
    switch (error.status) {
      case 401: return { codigo: '401', icono: '🔐', titulo: 'Necesitas iniciar sesión', mensaje: detalle, tono: 'amber' }
      case 403: return { codigo: '403', icono: '⛔', titulo: 'No tienes permiso para ver esto', mensaje: detalle, tono: 'rose' }
      case 404: return { codigo: '404', icono: '🔎', titulo: error.statusText || 'Recurso no encontrado', mensaje: detalle, tono: 'indigo' }
      default: return { codigo: String(error.status), icono: '🛠️', titulo: 'El servidor tuvo un problema', mensaje: detalle, tono: 'rose' }
    }
  }
  const mensaje = error instanceof Error ? error.message : String(error)
  if (/dynamically imported module|Loading chunk|Importing a module script failed/i.test(mensaje)) {
    return {
      codigo: 'CHUNK', icono: '📦', tono: 'amber', recargar: true,
      titulo: 'Hay una nueva versión de la aplicación',
      mensaje: 'No se pudo descargar una parte de la app (típico después de un nuevo despliegue o al perder la conexión). Recarga para obtener la versión más reciente.',
    }
  }
  return { codigo: 'ERROR', icono: '🐞', titulo: 'Algo se rompió en esta vista', mensaje: 'Un componente lanzó una excepción al renderizar. El resto de la aplicación sigue funcionando.', tono: 'rose' }
}

const TONOS: Record<string, string> = {
  amber: 'from-amber-500/20 text-amber-300 border-amber-500/30',
  rose: 'from-rose-500/20 text-rose-300 border-rose-500/30',
  indigo: 'from-indigo-500/20 text-indigo-300 border-indigo-500/30',
}

export default function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const vista = clasificar(error)
  const [verDetalle, setVerDetalle] = useState(false)

  useEffect(() => {
    registrarEvento('error', `🧯 errorElement atrapó: ${vista.codigo} · ${vista.titulo}`)
  }, [vista.codigo, vista.titulo])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6 animate-entrar">
      <div className={`w-full max-w-xl rounded-2xl border bg-gradient-to-b to-slate-900 p-8 text-center ${TONOS[vista.tono]}`}>
        <div className="text-5xl">{vista.icono}</div>
        <p className="mt-4 font-mono text-sm tracking-widest opacity-80">{vista.codigo}</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{vista.titulo}</h1>
        <p className="mt-3 text-sm text-slate-300">{vista.mensaje}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {vista.recargar ? (
            <button onClick={() => window.location.reload()} className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">Recargar aplicación</button>
          ) : (
            <button onClick={() => navigate(-1)} className="cursor-pointer rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500">← Regresar</button>
          )}
          <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">Ir al dashboard</Link>
        </div>

        {error instanceof Error && (
          <div className="mt-6 text-left">
            <button onClick={() => setVerDetalle((v) => !v)} className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
              {verDetalle ? '▾' : '▸'} Detalles técnicos (solo para desarrolladores)
            </button>
            {verDetalle && <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] text-rose-300">{error.message}</pre>}
          </div>
        )}
      </div>
    </div>
  )
}
