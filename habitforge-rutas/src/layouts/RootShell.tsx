import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import TopProgressBar from '../shared/components/TopProgressBar'
import PanelExpositor from '../shared/components/PanelExpositor'
import { contarNavegacionSpa, demoStore, registrarEvento } from '../shared/lib/demo'
import { useStore } from '../shared/lib/crearStore'

/** Raíz de toda la app: elementos globales que sobreviven a cualquier navegación. */
export default function RootShell() {
  const { pathname } = useLocation()
  const primera = useRef(true)
  const { panelAbierto } = useStore(demoStore)

  useEffect(() => {
    if (primera.current) {
      primera.current = false
      registrarEvento('nav', `📄 Documento cargado en ${pathname}`)
      return
    }
    contarNavegacionSpa()
    registrarEvento('nav', `🧭 Navegación SPA → ${pathname}`)
  }, [pathname])

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased">
      <TopProgressBar />
      {/* Deja espacio al panel para que no tape el contenido */}
      <div className={panelAbierto ? 'lg:pr-[21rem]' : ''}>
        <Outlet />
      </div>
      <PanelExpositor />
      <ScrollRestoration />
    </div>
  )
}
