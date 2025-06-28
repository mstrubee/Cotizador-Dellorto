function guardarCotizacionLocal(nombre, datos) {
  const key = `cotizacion-${nombre}-${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(datos));
}

function cargarCotizacionesGuardadas() {
  return Object.entries(localStorage)
    .filter(([k]) => k.startsWith("cotizacion-"))
    .map(([_, v]) => JSON.parse(v));
}