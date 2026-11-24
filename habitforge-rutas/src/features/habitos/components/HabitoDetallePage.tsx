import { Link, useLoaderData } from 'react-router-dom'
import type { HabitoDetalleData } from './loaders'

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function HabitoDetallePage() {
  const { habito } = useLoaderData() as HabitoDetalleData
  const cumplidos = habito.semana.filter(Boolean).length

  return (
    <div className="max-w-3xl animate-entrar">
      <Link to="/mis-habitos" className="text-sm text-slate-400 hover:text-white">← Todos mis hábitos</Link>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{habito.icono}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{habito.nombre}</h1>
            <p className="text-sm text-slate-400">{habito.categoria} · Meta: {habito.metaDiaria}</p>
          </div>
        </div>
        <p className="mt-6 text-slate-300">{habito.descripcion}</p>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <Dato titulo="Racha actual" valor={`${habito.rachaActual} 🔥`} />
          <Dato titulo="Mejor racha" valor={`${habito.mejorRacha} 🏆`} />
          <Dato titulo="Esta semana" valor={`${cumplidos}/7`} />
        </div>

        <div className="mt-8 flex justify-between gap-2">
          {habito.semana.map((ok, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-slate-500">{DIAS[i]}</span>
              <span className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-bold ${ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'}`}>
                {ok ? '✓' : '·'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Ruta dinámica <code className="font-mono text-indigo-400">/mis-habitos/:habitoId</code>. Prueba con un id inexistente:{' '}
        <Link to="/mis-habitos/999" className="font-mono text-indigo-400 underline">/mis-habitos/999</Link>
      </p>
    </div>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{titulo}</p>
      <p className="mt-1 text-xl font-bold text-white">{valor}</p>
    </div>
  )
}
