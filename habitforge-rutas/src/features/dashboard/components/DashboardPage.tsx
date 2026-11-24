import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/store/authStore'
import { HABITOS_DEMO } from '../../habitos/api/habitosApi'
import { GraficoRachas, GraficoTendencia } from './GraficoProgreso'

export default function DashboardPage() {
  const { sesion } = useAuth()
  const total = HABITOS_DEMO.length
  const hechosHoy = HABITOS_DEMO.filter((h) => h.semana[6]).length
  const mejor = Math.max(...HABITOS_DEMO.map((h) => h.rachaActual))
  const cumplimiento = Math.round((HABITOS_DEMO.flatMap((h) => h.semana).filter(Boolean).length / (total * 7)) * 100)

  return (
    <div className="animate-entrar">
      <header className="border-b border-slate-800 pb-6">
        <p className="text-sm text-slate-400">Hola, {sesion?.nombre} 👋</p>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Componente "pesado": incluye la librería de gráficas, por eso se descarga <strong className="text-slate-200">solo</strong> cuando visitas esta ruta.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi titulo="Hábitos activos" valor={total} acento="text-indigo-300" />
        <Kpi titulo="Completados hoy" valor={`${hechosHoy}/${total}`} acento="text-emerald-300" />
        <Kpi titulo="Racha más larga" valor={`${mejor} días`} acento="text-amber-300" />
        <Kpi titulo="Cumplimiento semanal" valor={`${cumplimiento}%`} acento="text-sky-300" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-slate-300">Hábitos completados · últimos 14 días</h2>
          <GraficoTendencia />
        </section>
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-300">Racha actual por hábito</h2>
          <GraficoRachas />
        </section>
      </div>

      <Link to="/mis-habitos" className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">
        Ver mis hábitos →
      </Link>
    </div>
  )
}

function Kpi({ titulo, valor, acento }: { titulo: string; valor: string | number; acento: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500">{titulo}</p>
      <p className={`mt-2 text-3xl font-bold ${acento}`}>{valor}</p>
    </div>
  )
}
