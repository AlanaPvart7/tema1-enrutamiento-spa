# HabitForge · Demo de Enrutamiento SPA, Rutas Privadas y Lazy Loading

Exposición **Unidad 3 · Tema 1** (IS-912). React 19 + React Router 7 (`createBrowserRouter` + `<RouterProvider />`) + Vite + TypeScript + Tailwind v4, organizada por *features* (Vertical Slicing) como en clase.

## Cómo correrla

```bash
npm install
npm run dev        # desarrollo  → http://localhost:5173
npm run demo       # PARA EXPONER: compila y abre la versión de producción (chunks reales)
```

> Para la exposición usen **`npm run demo`**: en modo `dev` Vite sirve archivo por archivo y no se aprecia el *code splitting*. En `preview` se ven los chunks `.js` reales con su peso.

**Cuentas de prueba**

| Usuario | Contraseña | Rol |
|---|---|---|
| `estudiante` | `1234` | estudiante (recibe 403 en `/admin`) |
| `admin` | `admin123` | admin |

## Qué demuestra cada punto del temario

| Punto | Dónde está en el código |
|---|---|
| 1. React Router DOM con `createBrowserRouter` | `src/app/router.tsx`, `src/main.tsx` |
| 2. Rutas privadas (guardia en 2 capas + roles) | `src/features/auth/guards/guardias.ts`, `src/features/auth/components/PrivateRoute.tsx` |
| 3. Lazy loading con `React.lazy` + `Suspense` | `src/app/paginas.ts`, `src/shared/lib/lazyConPrecarga.ts`, función `perezosa()` en el router |
| 4. 404 con ruta comodín `*` + `errorElement` | `src/features/errores/components/` |

## Extras (lo que la hace destacar)

- **Panel del expositor** (esquina inferior derecha): contador de *recargas completas* contra *navegaciones SPA*, cuenta regresiva del token, chunks `.js` descargados bajo demanda con su peso y una bitácora en vivo de guardias, chunks y errores.
- **La guardia recuerda a dónde ibas**: `/login?redirectTo=/mis-habitos/3` → al iniciar sesión vuelve ahí. Además valida `redirectTo` contra *Open Redirect*.
- **Expiración del token**: con el botón "Expirar en 5 s" la sesión muere sola y la app te saca a `/login` sin recargar.
- **Autorización por rol**: `/admin` responde **403** a un estudiante.
- **Prefetch on hover**: al pasar el mouse por el menú se descarga el chunk antes del clic.
- **Laboratorio de errores**: 404 de URL, 404 de datos, 403, 500, componente roto y *chunk* perdido, todos atrapados con vistas amigables **sin tumbar el layout**.
- **404 inteligente**: sugiere la ruta correcta (`/dashbord` → "¿Quisiste decir /dashboard?").
- Barra de progreso global (`useNavigation`), migas de pan (`handle` + `useMatches`), filtros en la URL (`useSearchParams`), login con `<Form>` + `action` del router y `ScrollRestoration`.

## Estructura

```
src/
├── app/            router.tsx (mapa de rutas) · paginas.ts (imports perezosos)
├── layouts/        RootShell · PublicLayout · AppLayout
├── features/
│   ├── auth/       guardias, PrivateRoute, store de sesión, LoginPage, token demo
│   ├── dashboard/  página "pesada" con gráficas (Recharts)
│   ├── habitos/    api, types, loaders, lista y detalle (/mis-habitos/:habitoId)
│   ├── admin/      página solo para rol admin
│   ├── errores/    errorElement, 404, laboratorio
│   └── inicio/     landing pública
└── shared/         PageLoader (skeleton), TopProgressBar, Breadcrumbs, PanelExpositor
```

> ⚠️ El JWT es de juguete (sin firma real) para que la demo no dependa del backend. La seguridad real la hace la API .NET (Tema 2): la guardia del frontend protege la **experiencia**, no los datos.
