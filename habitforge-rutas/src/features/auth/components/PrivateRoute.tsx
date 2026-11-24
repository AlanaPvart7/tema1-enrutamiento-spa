import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

/**
 * 🛡️ GUARDIA DE NAVEGACIÓN (capa 2: componente)
 * El loader protege al ENTRAR a la ruta. Este componente protege MIENTRAS
 * el usuario está dentro: si el token expira o cierra sesión, reacciona al
 * instante y lo saca a /login sin recargar la página.
 */
export default function PrivateRoute() {
  const { sesion, motivoCierre } = useAuth()
  const location = useLocation()

  if (!sesion) {
    if (motivoCierre === 'manual') return <Navigate to="/login" replace />
    const params = new URLSearchParams({ redirectTo: location.pathname + location.search })
    if (motivoCierre === 'expirada') params.set('motivo', 'expirada')
    // replace: el botón "Atrás" no debe regresar a la ruta protegida
    return <Navigate to={`/login?${params}`} replace />
  }

  return <Outlet />
}
