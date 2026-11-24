import { lazyConPrecarga } from '../shared/lib/lazyConPrecarga'

/**
 * 📦 CODE SPLITTING
 * Cada import() dinámico le indica a Vite que genere un archivo .js independiente.
 * El navegador lo descarga la primera vez que se visita la ruta (o al hacer hover en el menú).
 *
 * Forma "pura" sin envoltura:  const Dashboard = lazy(() => import('...'))
 */
export const paginas = {
  Dashboard: lazyConPrecarga('Dashboard', () => import('../features/dashboard/components/DashboardPage')),
  MisHabitos: lazyConPrecarga('MisHabitos', () => import('../features/habitos/components/MisHabitosPage')),
  HabitoDetalle: lazyConPrecarga('HabitoDetalle', () => import('../features/habitos/components/HabitoDetallePage')),
  Admin: lazyConPrecarga('Admin', () => import('../features/admin/components/AdminPage')),
  Laboratorio: lazyConPrecarga('Laboratorio', () => import('../features/errores/components/LaboratorioErroresPage')),

  // Simula un chunk que ya no existe en el servidor (p. ej. tras un nuevo despliegue)
  ChunkPerdido: lazyConPrecarga('ReporteAnual', () =>
    Promise.reject(new TypeError('Failed to fetch dynamically imported module: /assets/ReporteAnual-4f9a2c.js')),
  ),
}
