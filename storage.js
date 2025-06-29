function guardarCotizacion() {
  const cotizacion = {
    empresa: document.getElementById("nombreEmpresa").value,
    obra: document.getElementById("obra").value,
    direccion: document.getElementById("direccion").value,
    folio: document.getElementById("folio").value,
    supervisor: document.getElementById("supervisor").value,
    version: generarVersion(),
    fecha: new Date().toLocaleDateString(),
    entrega: document.getElementById("entrega").value,
    productos: productosCotizados, // aún se debe poblar con datos reales
    servicios: {
      instalacion: document.getElementById("servicioInstalacion").checked,
      transporte: document.getElementById("servicioTransporte").checked
    }
  };

  const usuario = localStorage.getItem("usuario") || "desconocido";
  const historial = JSON.parse(localStorage.getItem(`cotizaciones_${usuario}`)) || [];

  historial.push(cotizacion);
  localStorage.setItem(`cotizaciones_${usuario}`, JSON.stringify(historial));

  alert("Cotización guardada exitosamente.");
}

function generarVersion() {
  const usuario = localStorage.getItem("usuario") || "default";
  const historial = JSON.parse(localStorage.getItem(`cotizaciones_${usuario}`)) || [];
  return historial.length + 1;
}
