import { useSyncExternalStore } from 'react'

/**
 * Mini "store" externo a React (patrón usado por Zustand/Redux).
 * Lo necesitamos porque los LOADERS del router se ejecutan FUERA de los componentes,
 * así que no pueden usar useContext: leen el estado directamente con `obtener()`.
 */
export function crearStore<T>(inicial: T) {
  let estado = inicial
  const oyentes = new Set<() => void>()

  return {
    obtener: () => estado,
    actualizar(cambio: T | ((previo: T) => T)) {
      estado = typeof cambio === 'function' ? (cambio as (p: T) => T)(estado) : cambio
      oyentes.forEach((o) => o())
    },
    suscribir(oyente: () => void) {
      oyentes.add(oyente)
      return () => oyentes.delete(oyente)
    },
  }
}

export function useStore<T>(store: ReturnType<typeof crearStore<T>>) {
  return useSyncExternalStore(store.suscribir, store.obtener, store.obtener)
}
