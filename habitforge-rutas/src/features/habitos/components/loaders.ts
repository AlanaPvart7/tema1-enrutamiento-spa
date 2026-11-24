import type { LoaderFunctionArgs } from 'react-router-dom'
import { obtenerHabitoPorId, obtenerHabitos } from '../api/habitosApi'

// Los loaders viven en el router (bundle inicial) para que la petición de datos
// arranque EN PARALELO con la descarga del chunk de la página.
export async function habitosLoader() {
  return { habitos: await obtenerHabitos() }
}

export async function habitoDetalleLoader({ params }: LoaderFunctionArgs) {
  const habito = await obtenerHabitoPorId(Number(params.habitoId))
  if (!habito) {
    // Error de DATOS: la URL es válida pero el recurso no existe → 404 que atrapa el errorElement
    throw new Response(`No existe un hábito con id "${params.habitoId}".`, { status: 404, statusText: 'Hábito no encontrado' })
  }
  return { habito }
}

export type HabitosData = Awaited<ReturnType<typeof habitosLoader>>
export type HabitoDetalleData = Awaited<ReturnType<typeof habitoDetalleLoader>>
