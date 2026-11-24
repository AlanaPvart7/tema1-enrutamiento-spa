import { Suspense, type ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import RootShell from '../layouts/RootShell'
import PublicLayout from '../layouts/PublicLayout'
import AppLayout from '../layouts/AppLayout'
import PrivateRoute from '../features/auth/components/PrivateRoute'
import LoginPage, { loginAction } from '../features/auth/components/LoginPage'
import { exigirRol, exigirSesion, protegida, soloInvitados } from '../features/auth/guards/guardias'
import InicioPage from '../features/inicio/InicioPage'
import NotFoundPage from '../features/errores/components/NotFoundPage'
import RouteErrorPage from '../features/errores/components/RouteErrorPage'
import ComponenteRoto from '../features/errores/components/ComponenteRoto'
import { habitoDetalleLoader, habitosLoader, type HabitoDetalleData } from '../features/habitos/components/loaders'
import PageLoader from '../shared/components/PageLoader'
import type { HandleRuta } from '../shared/components/Breadcrumbs'
import { paginas } from './paginas'

/** <Suspense> por ruta. La `key` fuerza un fallback nuevo en cada página perezosa. */
const perezosa = (Pagina: ComponentType, nombre: string) => (
  <Suspense key={nombre} fallback={<PageLoader etiqueta={`Descargando chunk "${nombre}"…`} />}>
    <Pagina />
  </Suspense>
)

const migas = (texto: string | ((data: never) => string)): HandleRuta => ({
  migas: typeof texto === 'string' ? () => texto : (texto as (d: unknown) => string),
})

const rutas: RouteObject[] = [
  {
    element: <RootShell />,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <div className="min-h-screen bg-slate-950" />,
    children: [
      // ───────────── Zona PÚBLICA ─────────────
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <InicioPage /> },
          { path: 'login', loader: soloInvitados, action: loginAction, element: <LoginPage /> },
        ],
      },

      // ───────────── Zona PRIVADA (frontera protegida) ─────────────
      {
        // Capa 1: loader → bloquea ANTES de renderizar o descargar chunks
        loader: ({ request }) => { exigirSesion(request); return null },
        // Capa 2: componente → expulsa si la sesión muere estando dentro
        element: <PrivateRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                // Ruta sin path: sus errores se muestran DENTRO del layout (el menú sigue vivo)
                errorElement: <RouteErrorPage />,
                children: [
                  { path: 'dashboard', element: perezosa(paginas.Dashboard, 'Dashboard'), handle: migas('Dashboard') },
                  {
                    path: 'mis-habitos',
                    handle: migas('Mis hábitos'),
                    children: [
                      { index: true, loader: protegida(habitosLoader), element: perezosa(paginas.MisHabitos, 'MisHabitos') },
                      {
                        path: ':habitoId',
                        loader: protegida(habitoDetalleLoader),
                        element: perezosa(paginas.HabitoDetalle, 'HabitoDetalle'),
                        handle: migas((d: HabitoDetalleData) => d?.habito.nombre ?? 'Detalle'),
                      },
                    ],
                  },
                  {
                    path: 'admin',
                    loader: ({ request }) => { exigirRol(request, 'admin'); return null },
                    element: perezosa(paginas.Admin, 'Admin'),
                    handle: migas('Administración'),
                  },
                  {
                    path: 'laboratorio-errores',
                    handle: migas('Laboratorio de errores'),
                    children: [
                      { index: true, element: perezosa(paginas.Laboratorio, 'Laboratorio') },
                      { path: 'componente-roto', element: <ComponenteRoto />, handle: migas('Componente roto') },
                      { path: 'chunk-perdido', element: perezosa(paginas.ChunkPerdido, 'ReporteAnual'), handle: migas('Chunk perdido') },
                      {
                        path: 'servidor-caido',
                        handle: migas('Servidor caído'),
                        loader: protegida(() => {
                          throw new Response('La API de hábitos respondió 500 Internal Server Error.', { status: 500, statusText: 'Error del servidor' })
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ───────────── Ruta COMODÍN: cualquier URL no declarada ─────────────
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(rutas)
