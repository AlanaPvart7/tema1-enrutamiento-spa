import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { cambiarChunksPendientes, esperar, registrarEvento } from './demo'

// Retardo artificial de 1000 ms solo la primera vez que se descarga un chunk
export const RETARDO_CHUNK_MS = 1000
export type ComponentePerezoso<T extends ComponentType<object>> = LazyExoticComponent<T> & {
  /** Descarga el chunk ANTES de que el usuario haga clic (ej. al pasar el mouse por el menú). */
  precargar: () => Promise<{ default: T }>
}

/**
 * Envoltura de React.lazy:
 *  1. Cada `import()` dinámico = un archivo .js separado (code splitting de Vite/Rollup).
 *  2. Añade `precargar()` para descargar el chunk con anticipación (prefetch on hover).
 *  3. Si la descarga falla, permite reintentar (no se queda "cacheado" el error).
 */
export function lazyConPrecarga<T extends ComponentType<object>>(
  nombre: string,
  importar: () => Promise<{ default: T }>,
): ComponentePerezoso<T> {
  let promesa: Promise<{ default: T }> | null = null

  const cargar = () => {
    if (!promesa) {
      registrarEvento('chunk', `⬇️ Descargando chunk "${nombre}"…`)
      cambiarChunksPendientes(+1)
      const inicio = performance.now()
      promesa = esperar(RETARDO_CHUNK_MS)
        .then(importar)
        .then((modulo) => {
          registrarEvento('chunk', `✅ "${nombre}" listo en ${Math.round(performance.now() - inicio)} ms`)
          return modulo
        })
        .catch((error) => {
          promesa = null
          registrarEvento('error', `💥 Falló la descarga de "${nombre}"`)
          throw error
        })
        .finally(() => cambiarChunksPendientes(-1))
    }
    return promesa
  }

  const Componente = lazy(cargar) as ComponentePerezoso<T>
  Componente.precargar = cargar
  return Componente
}
