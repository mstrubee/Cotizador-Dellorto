// Variables de usuario
let usuarioActual = JSON.parse(localStorage.getItem("dellorto-user"));
let factorUsuario = usuarioActual?.factor || 1;

// Cotizaciones guardadas
let cotizacionActual = {
  cliente: usuarioActual?.usuario || "cliente",
  items: [],
  servicios: [],
  totalNeto: 0,
  iva: 0,
  totalFinal: 0,
  fecha: new Date().toLocaleDateString(),
  folio: Date.now()
};

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCotizacion");
  if (!form) return;

  // Escucha envío
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const alto = parseFloat(data.alto);
    const ancho = parseFloat(data.ancho);
    const cantidad = parseInt(data.cantidad);
    const elemento = data.elemento;

    const m2 = calcularM2(ancho, alto);
    const ml = calcularML(ancho, alto);
    const espesor = parseFloat(data.espesor);
    const peso = elemento === "Vidrio"
      ? calcularPesoVidrio(m2, espesor)
      : calcularPesoTermopanel(m2, data);

    const precioUnidad = obtenerPrecioBase(data) * factorUsuario;
    const totalLinea = precioUnidad * m2 * cantidad;

    cotizacionActual.items.push({
      nombre: data.nombre,
      cantidad,
      elemento,
      tipo: data.tipo || "Termopanel",
      m2,
      ml,
      peso,
      precioUnidad,
      total: totalLinea
    });

    renderResumen();
    form.reset();
  });
});

// 🔄 Mostrar resumen
function renderResumen() {
  const resumenDiv = document.getElementById("tablaResumen");
  if (!resumenDiv) return;

  let html = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th><th>Tipo</th><th>Cantidad</th><th>m²</th><th>mL</th>
          <th>Peso (kg)</th><th>Unitario</th><th>Total</th>
        </tr>
      </thead><tbody>
  `;

  let total = 0;
  cotizacionActual.items.forEach(item => {
    html += `<tr>
      <td>${item.nombre}</td><td>${item.tipo}</td><td>${item.cantidad}</td>
      <td>${item.m2.toFixed(2)}</td><td>${item.ml.toFixed(2)}</td>
      <td>${item.peso.toFixed(1)}</td>
      <td>$ ${formatNumber(item.precioUnidad)}</td>
      <td>$ ${formatNumber(item.total)}</td>
    </tr>`;
    total += item.total;
  });

  const iva = total * 0.19;
  const totalFinal = total + iva;

  html += `</tbody></table><br>
    <div><strong>Total Neto:</strong> $ ${formatNumber(total)}</div>
    <div><strong>IVA (19%):</strong> $ ${formatNumber(iva)}</div>
    <div><strong>Total Final:</strong> $ ${formatNumber(totalFinal)}</div>
  `;

  resumenDiv.innerHTML = html;

  // Actualizar totales
  cotizacionActual.totalNeto = total;
  cotizacionActual.iva = iva;
  cotizacionActual.totalFinal = totalFinal;
}

// Placeholder – Debe reemplazarse por precios reales
function obtenerPrecioBase(data) {
  // Aquí deberás vincular los precios reales desde el Excel cargado
  const base = 10000; // temporal
  return base;
}

function guardarCotizacion() {
  const key = `cotizacion-${cotizacionActual.folio}`;
  localStorage.setItem(key, JSON.stringify(cotizacionActual));
  alert("Cotización guardada localmente.");
}

function exportarPDF() {
  window.print();
}