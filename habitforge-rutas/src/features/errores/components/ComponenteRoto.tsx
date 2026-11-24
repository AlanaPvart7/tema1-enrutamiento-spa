type HabitoApi = { racha: { actual: number } }

/**
 * Simula un bug real: la API devolvió `undefined` y el componente asume que hay datos.
 * La excepción ocurre DURANTE el render → la atrapa el errorElement más cercano.
 */
export default function ComponenteRoto() {
  const habito = JSON.parse('null') as HabitoApi // "respuesta" vacía de la API
  return <p>Racha actual: {habito.racha.actual}</p>
}
