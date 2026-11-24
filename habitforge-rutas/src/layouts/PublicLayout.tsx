import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/store/authStore'

export function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">✓</span>
      <span className="font-bold tracking-tight text-white">HabitForge</span>
    </Link>
  )
}

export default function PublicLayout() {
  const { sesion } = useAuth()
  const clase = ({ isActive }: { isActive: boolean }) => `text-sm ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
  return (
    <>
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Marca />
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={clase}>Inicio</NavLink>
            {sesion ? (
              <NavLink to="/dashboard" className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500">Mi panel</NavLink>
            ) : (
              <NavLink to="/login" className={clase}>Iniciar sesión</NavLink>
            )}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
    </>
  )
}
