import { Link } from 'react-router-dom'
import { useAuth } from '../auth/store/authStore'

const PUNTOS = [
  {
    n: 1, titulo: 'Navegación SPA', icono: '🧭',
    texto: 'createBrowserRouter + RouterProvider. Cambia de página y mira el contador de "Recargas completas" del panel: no se mueve.',
    acciones: [{ a: '/dashboard', t: 'Ir al dashboard' }],
  },
  {
    n: 2, titulo: 'Rutas privadas', icono: '🛡️',
    texto: 'Sin sesión, escribe en la barra de direcciones /mis-habitos/3. La guardia intercepta y te manda a /login… y luego te regresa.',
    acciones: [{ a: '/mis-habitos/3', t: 'Forzar /mis-habitos/3' }, { a: '/admin', t: 'Probar /admin' }],
  },
  {
    n: 3, titulo: 'Lazy loading', icono: '📦',
    texto: 'Cada página es un chunk .js aparte. Abre F12 → Network → JS y observa cómo se descargan bajo demanda.',
    acciones: [{ a: '/dashboard', t: 'Cargar chunk pesado' }],
  },
  {
    n: 4, titulo: 'Errores y 404', icono: '🧯',
    texto: 'Ruta comodín (*) con sugerencias y errorElement que distingue 403, 404, 500, componentes rotos y chunks perdidos.',
    acciones: [{ a: '/dashbord', t: 'Ruta mal escrita' }, { a: '/laboratorio-errores', t: 'Laboratorio' }],
  },
]

export default function InicioPage() {
  const { sesion } = useAuth()
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 animate-entrar">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Unidad 3 · Tema 1</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
        Enrutamiento SPA, Rutas Privadas y Lazy Loading con React Router
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-400">
        HabitForge navega sin recargar la página, defiende sus fronteras contra accesos no autorizados y descarga el código solo cuando hace falta.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={sesion ? '/dashboard' : '/login'} className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
          {sesion ? 'Entrar al dashboard' : 'Iniciar sesión'}
        </Link>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {PUNTOS.map((p) => (
          <article key={p.n} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-xl">{p.icono}</span>
              <div>
                <p className="text-xs font-semibold text-indigo-400">PUNTO {p.n}</p>
                <h2 className="font-semibold text-white">{p.titulo}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{p.texto}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.acciones.map((x) => (
                <Link key={x.a} to={x.a} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-indigo-500 hover:text-white">
                  {x.t} →
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
