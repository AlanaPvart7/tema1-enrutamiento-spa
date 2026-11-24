import { NavLink, Outlet } from 'react-router-dom'
import { authStore, useAuth } from '../features/auth/store/authStore'
import Breadcrumbs from '../shared/components/Breadcrumbs'
import { Marca } from './PublicLayout'
import { paginas } from '../app/paginas'

const MENU = [
  { a: '/dashboard', texto: 'Dashboard', icono: '📊', precargar: paginas.Dashboard.precargar },
  { a: '/mis-habitos', texto: 'Mis hábitos', icono: '✅', precargar: paginas.MisHabitos.precargar },
  { a: '/admin', texto: 'Administración', icono: '🛠️', precargar: paginas.Admin.precargar, soloAdmin: true },
  { a: '/laboratorio-errores', texto: 'Laboratorio de errores', icono: '🧯', precargar: paginas.Laboratorio.precargar },
]

/** Cascarón privado: menú lateral + cabecera. Solo se monta si la guardia lo permite. */
export default function AppLayout() {
  const { sesion } = useAuth()
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 p-5 md:flex">
        <Marca />
        <nav className="mt-8 flex flex-col gap-1">
          {MENU.map((m) => (
            <NavLink key={m.a} to={m.a}
              // Prefetch: al pasar el mouse descargamos el chunk antes del clic
              // (no precargamos /admin si el rol no lo permite)
              onMouseEnter={() => { if (!m.soloAdmin || sesion?.rol === 'admin') m.precargar().catch(() => {}) }}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/15 font-medium text-indigo-300' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
              <span>{m.icono}</span>
              <span className="flex-1">{m.texto}</span>
              {m.soloAdmin && <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">admin</span>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-slate-800 p-3">
          <p className="truncate text-sm font-medium text-white">{sesion?.nombre}</p>
          <p className="text-xs text-slate-500">Rol: {sesion?.rol}</p>
          <button onClick={() => authStore.cerrarSesion('manual')} className="mt-3 w-full cursor-pointer rounded-md border border-slate-700 py-1.5 text-xs text-slate-300 hover:border-rose-500/60 hover:text-rose-300">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-4 md:px-10">
          <Breadcrumbs />
          <nav className="flex gap-3 text-sm md:hidden">
            {MENU.map((m) => <NavLink key={m.a} to={m.a} title={m.texto}>{m.icono}</NavLink>)}
          </nav>
        </header>
        <main className="flex-1 px-6 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
