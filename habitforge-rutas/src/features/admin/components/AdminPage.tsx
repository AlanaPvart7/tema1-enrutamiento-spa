const USUARIOS = [
  { usuario: 'admin', nombre: 'Ing. Administradora', rol: 'admin', habitos: 4, estado: 'Activo' },
  { usuario: 'estudiante', nombre: 'Ana Estudiante', rol: 'estudiante', habitos: 6, estado: 'Activo' },
  { usuario: 'carlos.m', nombre: 'Carlos Mejía', rol: 'estudiante', habitos: 3, estado: 'Activo' },
  { usuario: 'sofia.r', nombre: 'Sofía Rivera', rol: 'estudiante', habitos: 0, estado: 'Inactivo' },
]

export default function AdminPage() {
  return (
    <div className="animate-entrar">
      <header className="border-b border-slate-800 pb-6">
        <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300">Requiere rol: admin</span>
        <h1 className="mt-3 text-2xl font-bold text-white">Panel de administración</h1>
        <p className="mt-1 text-sm text-slate-400">Autorización por rol: un estudiante autenticado recibe un <strong className="text-slate-200">403</strong> en vez de esta vista.</p>
      </header>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-3">Usuario</th><th className="px-5 py-3">Nombre</th><th className="px-5 py-3">Rol</th><th className="px-5 py-3">Hábitos</th><th className="px-5 py-3">Estado</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {USUARIOS.map((u) => (
              <tr key={u.usuario} className="bg-slate-950 text-slate-300">
                <td className="px-5 py-3 font-mono text-xs">{u.usuario}</td>
                <td className="px-5 py-3">{u.nombre}</td>
                <td className="px-5 py-3">{u.rol}</td>
                <td className="px-5 py-3">{u.habitos}</td>
                <td className="px-5 py-3"><span className={u.estado === 'Activo' ? 'text-emerald-400' : 'text-slate-500'}>● {u.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
