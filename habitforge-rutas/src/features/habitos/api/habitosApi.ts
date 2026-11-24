import { esperar, latenciaRed } from '../../../shared/lib/demo'
import type { Habito } from '../types/habito.types'

// Simula GET /api/habitos del backend .NET (Clases 1-9)
const HABITOS: Habito[] = [
  { id: 1, nombre: 'Leer 20 minutos', icono: '📚', categoria: 'Estudio', descripcion: 'Lectura técnica o novela antes de dormir.', metaDiaria: '20 min', rachaActual: 12, mejorRacha: 21, semana: [true, true, true, false, true, true, true] },
  { id: 2, nombre: 'Tomar 2 L de agua', icono: '💧', categoria: 'Salud', descripcion: 'Mantenerse hidratado durante clases y laboratorio.', metaDiaria: '8 vasos', rachaActual: 5, mejorRacha: 30, semana: [true, true, false, true, true, true, false] },
  { id: 3, nombre: 'Practicar React', icono: '⚛️', categoria: 'Estudio', descripcion: 'Un ejercicio diario de componentes, hooks o routing.', metaDiaria: '1 ejercicio', rachaActual: 18, mejorRacha: 18, semana: [true, true, true, true, true, false, true] },
  { id: 4, nombre: 'Caminar 30 minutos', icono: '🚶', categoria: 'Salud', descripcion: 'Caminata ligera después del almuerzo.', metaDiaria: '30 min', rachaActual: 3, mejorRacha: 14, semana: [false, true, false, true, true, false, false] },
  { id: 5, nombre: 'Meditar', icono: '🧘', categoria: 'Bienestar', descripcion: 'Respiración consciente para bajar el estrés de parciales.', metaDiaria: '10 min', rachaActual: 7, mejorRacha: 9, semana: [true, false, true, true, true, true, true] },
  { id: 6, nombre: 'Planificar el día', icono: '🗓️', categoria: 'Productividad', descripcion: 'Escribir las 3 tareas más importantes del día.', metaDiaria: '3 tareas', rachaActual: 9, mejorRacha: 25, semana: [true, true, true, true, false, true, true] },
]

export async function obtenerHabitos(): Promise<Habito[]> {
  await esperar(latenciaRed(500))
  return HABITOS
}

export async function obtenerHabitoPorId(id: number): Promise<Habito | undefined> {
  await esperar(latenciaRed(500))
  return HABITOS.find((h) => h.id === id)
}

export const HABITOS_DEMO = HABITOS
