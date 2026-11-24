import { useNavigation } from 'react-router-dom'
import { useStore } from '../lib/crearStore'
import { demoStore } from '../lib/demo'

/** Barra superior estilo YouTube/GitHub: visible mientras corren loaders o se descargan chunks. */
export default function TopProgressBar() {
  const navigation = useNavigation()
  const { chunksPendientes } = useStore(demoStore)
  const activo = navigation.state !== 'idle' || chunksPendientes > 0
  return (
    <div className={`fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden transition-opacity ${activo ? 'opacity-100' : 'opacity-0'}`}>
      <div className="animate-barra h-full w-2/5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
    </div>
  )
}
