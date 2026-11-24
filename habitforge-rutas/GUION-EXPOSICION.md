# 🎤 Guion de la exposición (≈ 12–15 min)

**Antes de empezar**
1. `npm run demo` (versión de producción). Navegador en **pantalla completa** y zoom al 110–125 %.
2. Abran **F12 → Network → filtro "JS"** y marquen **Disable cache**.
3. Si quedó una sesión abierta de un ensayo, ciérrenla desde el panel ("Cerrar sesión").
4. Dejen visible el **🎤 Panel del expositor** (esquina inferior derecha).

---

## Integrante 1 · Introducción y Navegación SPA (punto 1)

**Decir:** "En una web tradicional cada clic pide un HTML nuevo al servidor y la página parpadea. En una SPA el HTML se descarga **una sola vez**, y después JavaScript cambia la vista y la URL con la *History API*."

**Hacer:**
1. Mostrar `src/app/router.tsx`: el árbol de rutas con `createBrowserRouter` y en `main.tsx` el `<RouterProvider router={router} />`.
2. Explicar el anidamiento: `RootShell` → zona pública / zona privada → `AppLayout` → páginas (el `<Outlet />` es "el hueco donde se pinta la ruta hija").
3. En la app, navegar Inicio → Iniciar sesión → Inicio varias veces.
4. Señalar el panel: **"Recargas completas" se queda en 1** y **"Navegaciones SPA" sube**. Esa es la prueba de que no se recarga la página.

## Integrante 2 · Rutas privadas, defensa de fronteras (punto 2)

**Hacer (sin sesión):**
1. Escribir directo en la barra de direcciones: `localhost:4173/mis-habitos/3` y Enter.
2. Cae en `/login` con el aviso **"🛡️ Ruta protegida… /mis-habitos/3"**. En la bitácora: *"Acceso denegado a /mis-habitos/3 → /login"*.
3. Mostrar en **Network** que **NO se descargó** el chunk de la página: la guardia cortó la navegación antes.
4. Iniciar sesión como `estudiante / 1234` → **vuelve solito a `/mis-habitos/3`** (gracias a `?redirectTo=`).

**Explicar el código** (`guardias.ts` y `PrivateRoute.tsx`): la guardia tiene **dos capas**:
- **Capa 1, el `loader`** con `exigirSesion()`: se ejecuta **antes** de renderizar y lanza `redirect('/login')`.
- **Capa 2, el componente `<PrivateRoute />`**: vigila la sesión **mientras** estás dentro.

**Demostrar la capa 2:** en el panel, clic en **"Expirar en 5 s"** y esperar → la app los expulsa a `/login` con *"⏰ Tu sesión expiró"*, sin recargar.

**Extra (roles):** como estudiante, entrar a **Administración** → **403**. Luego cerrar sesión, entrar como `admin / admin123` → sí entra.

**Extra (seguridad):** abrir `/login?redirectTo=https://google.com` e iniciar sesión → va a `/dashboard`, no a Google. `destinoSeguro()` evita un **Open Redirect**.

## Integrante 3 · Lazy Loading y Code Splitting (punto 3)

**Decir:** "Sin lazy loading, el usuario descarga TODA la app, incluso páginas que nunca abre. Con `React.lazy` + `import()` dinámico, Vite parte el código en archivos separados (*chunks*)."

**Hacer:**
1. Mostrar `src/app/paginas.ts` (`lazy(() => import(...))`) y la función `perezosa()` del router (`<Suspense fallback={<PageLoader/>}>`).
2. Con Network abierto, ir al **Dashboard** → aparece el *skeleton* "Descargando chunk Dashboard…" y en Network el archivo **`DashboardPage-xxxx.js` (~400 KB, por la librería de gráficas)**. El panel también lo lista en "Chunks bajo demanda".
3. Comparar: el **JS inicial** (panel) contra el chunk del dashboard. "Si no fuera lazy, ese peso lo pagaría también quien solo abre el login."
4. **Prefetch:** pasar el mouse sobre "Laboratorio de errores" **sin hacer clic** → en Network ya se descargó. Al hacer clic carga al instante.
5. (Opcional) Desmarcar "Simular red lenta" para mostrar la velocidad real.
6. (Opcional) En la terminal, `npm run build` muestra la lista de chunks generados en `dist/assets`.

## Integrante 4 · Errores y 404 (punto 4)

**Hacer:**
1. Escribir `/dashbord` (mal escrito) → **404 corporativo** con **"¿Quisiste decir /dashboard?"**. Explicar `{ path: '*' }` al final del router.
2. Ir a **Laboratorio de errores** y abrir cada tarjeta:
   - `/mis-habitos/999` → 404 **de datos** (la URL existe, el hábito no: el `loader` lanza `Response` 404).
   - **Servidor caído** → 500.
   - **Componente roto** → excepción de JavaScript al renderizar.
   - **Chunk perdido** → el `import()` falla (lo típico tras un nuevo despliegue) y se ofrece "Recargar aplicación".
3. Recalcar: **el menú lateral sigue funcionando**. El `errorElement` está en una ruta sin `path` dentro del layout, así que el error solo reemplaza el contenido.
4. Mostrar `RouteErrorPage.tsx`: `useRouteError()` + `isRouteErrorResponse()` para distinguir 403/404/500/bug/chunk.

## Cierre (cualquiera)

"Resumen: (1) navegación sin recargas, (2) fronteras protegidas en dos capas y con roles, (3) el código se descarga bajo demanda y (4) cualquier error termina en una vista amigable. **Importante:** la guardia del frontend protege la *experiencia*; la seguridad real de los datos la garantiza el backend .NET validando el JWT (Tema 2)."

---

## ❓ Preguntas que les puede hacer la ingeniera

- **¿Por qué dos capas de guardia y no solo el componente?** El loader actúa *antes* de renderizar y de descargar el chunk. El componente reacciona si la sesión muere estando dentro (expiración o logout en otra acción).
- **¿Por qué cada loader privado llama `exigirSesion` (`protegida()`)?** React Router ejecuta los loaders padre e hijo **en paralelo**, así que un hijo no puede confiar en que el padre ya validó.
- **¿Por qué `replace` en los redirects?** Para que el botón "Atrás" no regrese a la ruta protegida.
- **¿Si alguien modifica el localStorage puede entrar?** Puede *ver la interfaz*, pero la API rechaza un token sin firma válida (401). El frontend nunca es la última línea de defensa.
- **¿Por qué el `key` en `<Suspense>`?** Para que cada página tenga su propio fallback; si no, React reutiliza la vista anterior mientras carga.
- **¿`errorElement` vs Error Boundary de React?** `errorElement` es el error boundary del router: atrapa errores de *loaders*, *actions* y del render de esa ruta.
- **¿Por qué `createBrowserRouter` y no `<BrowserRouter>`?** Habilita el *Data API* (loaders, actions, errorElement, useNavigation), que es lo que permite proteger rutas antes de renderizar.
