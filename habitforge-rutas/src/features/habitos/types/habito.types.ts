export type CategoriaHabito = 'Salud' | 'Estudio' | 'Productividad' | 'Bienestar'

export interface Habito {
  id: number
  nombre: string
  icono: string
  categoria: CategoriaHabito
  descripcion: string
  metaDiaria: string
  rachaActual: number
  mejorRacha: number
  /** Lunes → Domingo de la semana actual */
  semana: boolean[]
}
