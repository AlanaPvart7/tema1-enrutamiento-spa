// ⚖️ Este archivo importa Recharts (~100 KB gzip). Como solo lo usa el Dashboard
// (que se carga con React.lazy), Recharts NO forma parte del bundle inicial.
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { HABITOS_DEMO } from '../../habitos/api/habitosApi'

const ULTIMOS_14_DIAS = Array.from({ length: 14 }, (_, i) => ({
  dia: `D${i + 1}`,
  completados: [3, 4, 4, 2, 5, 6, 5, 4, 6, 5, 6, 6, 5, 6][i],
}))

const tooltip = { contentStyle: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' } }

export function GraficoTendencia() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={ULTIMOS_14_DIAS} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1e293b" vertical={false} />
        <XAxis dataKey="dia" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip {...tooltip} />
        <Area type="monotone" dataKey="completados" stroke="#818cf8" strokeWidth={2} fill="url(#relleno)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function GraficoRachas() {
  const datos = HABITOS_DEMO.map((h) => ({ nombre: h.icono, racha: h.rachaActual }))
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={datos} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid stroke="#1e293b" vertical={false} />
        <XAxis dataKey="nombre" fontSize={18} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} cursor={{ fill: '#1e293b' }} />
        <Bar dataKey="racha" fill="#34d399" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
