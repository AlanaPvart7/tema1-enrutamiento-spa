/** Fallback de <Suspense>: esqueleto con la forma de la página mientras llega el chunk. */
export default function PageLoader({ etiqueta = 'Descargando módulo…' }: { etiqueta?: string }) {
  return (
    <div className="animate-pulse" role="status" aria-live="polite">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        <span className="font-mono text-xs text-indigo-300">{etiqueta}</span>
      </div>
      <div className="mt-6 h-7 w-1/3 rounded bg-slate-800" />
      <div className="mt-3 h-4 w-2/3 rounded bg-slate-800/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-slate-900" />)}
      </div>
      <div className="mt-4 h-64 rounded-xl bg-slate-900" />
    </div>
  )
}
