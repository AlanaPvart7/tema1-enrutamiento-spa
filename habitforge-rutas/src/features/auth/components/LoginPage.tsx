import { useRef } from 'react'
import { Form, Link, redirect, useActionData, useNavigation, useSearchParams, type ActionFunctionArgs } from 'react-router-dom'
import { authStore } from '../store/authStore'
import { destinoSeguro } from '../guards/guardias'

/** Action del router: recibe el <Form method="post"> sin useState ni onSubmit manual. */
export async function loginAction({ request }: ActionFunctionArgs) {
  const datos = await request.formData()
  try {
    await authStore.iniciarSesion(String(datos.get('usuario') ?? ''), String(datos.get('clave') ?? ''))
  } catch (e) {
    return { error: (e as Error).message }
  }
  // Regresa al usuario EXACTAMENTE a donde quería ir antes de que la guardia lo detuviera
  return redirect(destinoSeguro(new URL(request.url).searchParams.get('redirectTo')))
}

const CUENTAS = [
  { usuario: 'estudiante', clave: '1234', etiqueta: 'Estudiante', detalle: 'Sin acceso a /admin' },
  { usuario: 'admin', clave: 'admin123', etiqueta: 'Administrador', detalle: 'Acceso total' },
]

export default function LoginPage() {
  const [params] = useSearchParams()
  const resultado = useActionData() as { error?: string } | undefined
  const navigation = useNavigation()
  const enviando = navigation.state !== 'idle' && navigation.formMethod?.toLowerCase() === 'post'
  const form = useRef<HTMLFormElement>(null)

  const redirectTo = params.get('redirectTo')
  const expirada = params.get('motivo') === 'expirada'

  const usarCuenta = (usuario: string, clave: string) => {
    if (!form.current) return
    ;(form.current.elements.namedItem('usuario') as HTMLInputElement).value = usuario
    ;(form.current.elements.namedItem('clave') as HTMLInputElement).value = clave
  }

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2 animate-entrar">
      <section className="hidden md:block">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Acceso seguro</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Bienvenido de vuelta a HabitForge</h1>
        <p className="mt-4 text-slate-400">
          Las rutas internas están protegidas por una <strong className="text-slate-200">guardia de navegación</strong>.
          Sin un token vigente, el router intercepta la petición y te trae aquí.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          <li className="flex gap-3"><span className="text-emerald-400">✔</span> Te devolvemos a la página que intentabas abrir.</li>
          <li className="flex gap-3"><span className="text-emerald-400">✔</span> El botón "Atrás" no vuelve a la ruta privada.</li>
          <li className="flex gap-3"><span className="text-emerald-400">✔</span> Si el token expira, se cierra la sesión sola.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-indigo-950/40">
        {redirectTo && (
          <div role="alert" className={`mb-6 rounded-lg border p-4 text-sm ${expirada ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'}`}>
            <p className="font-semibold">{expirada ? '⏰ Tu sesión expiró' : '🛡️ Ruta protegida'}</p>
            <p className="mt-1 text-xs opacity-90">
              {expirada ? 'Vuelve a iniciar sesión para regresar a ' : 'Necesitas iniciar sesión para entrar a '}
              <code className="rounded bg-slate-950/60 px-1.5 py-0.5 font-mono">{redirectTo}</code>
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-white">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-slate-400">Usa una de las cuentas de prueba.</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {CUENTAS.map((c) => (
            <button key={c.usuario} type="button" onClick={() => usarCuenta(c.usuario, c.clave)}
              className="cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-3 text-left transition-colors hover:border-indigo-500">
              <span className="block text-sm font-semibold text-white">{c.etiqueta}</span>
              <span className="block font-mono text-xs text-slate-500">{c.usuario} / {c.clave}</span>
              <span className="mt-1 block text-[11px] text-slate-400">{c.detalle}</span>
            </button>
          ))}
        </div>

        <Form ref={form} method="post" replace className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Usuario</span>
            <input name="usuario" autoComplete="username" required
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              placeholder="estudiante" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Contraseña</span>
            <input name="clave" type="password" autoComplete="current-password" required
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              placeholder="••••" />
          </label>

          {resultado?.error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{resultado.error}</p>}

          <button disabled={enviando}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
            {enviando ? 'Validando credenciales…' : 'Entrar'}
          </button>
        </Form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300">← Volver al inicio</Link>
        </p>
      </section>
    </div>
  )
}
