
// cotizador.js completo funcional

let contadorProductos = 0;

function agregarProducto(desdeStorage = false, data = {}) {
  const cuerpoTabla = document.getElementById("cuerpoTabla");

  const fila = document.createElement("tr");
  const idLinea = contadorProductos++;

  fila.innerHTML = `
    <td><input type="checkbox" id="check-${idLinea}"></td>
    <td id="num-${idLinea}">${idLinea + 1}</td>
    <td><input type="text" id="nombre-${idLinea}" value="${data[`nombre-${idLinea}`] || ""}"></td>
    <td><input type="number" id="cantidad-${idLinea}" value="${data[`cantidad-${idLinea}`] || 1}"></td>
    <td>
      <select id="tipo-${idLinea}" onchange="actualizarEspesores(${idLinea})">
        <option value="Vidrio">Vidrio</option>
        <option value="Termopanel">Termopanel</option>
      </select>
    </td>
    <td><input type="number" id="alto-${idLinea}" value="${data[`alto-${idLinea}`] || 1000}"></td>
    <td><input type="number" id="ancho-${idLinea}" value="${data[`ancho-${idLinea}`] || 1000}"></td>
    <td>
      <select id="vidrio-${idLinea}"></select>
    </td>
    <td>
      <select id="espesor-${idLinea}"></select>
    </td>
    <td><select id="terminacion-${idLinea}"></select></td>
    <td><select id="perforacion-${idLinea}"></select></td>
    <td><input type="number" id="nroPerforaciones-${idLinea}" value="0"></td>
    <td><select id="destajado-${idLinea}"></select></td>
    <td><input type="number" id="nroDestajes-${idLinea}" value="0"></td>
    <td id="m2-${idLinea}">0</td>
    <td id="ml-${idLinea}">0</td>
    <td id="peso-${idLinea}">0</td>
    <td id="precioLinea-${idLinea}">$ 0</td>
  `;

  cuerpoTabla.appendChild(fila);

  cargarOpcionesVidrio(idLinea);
  calcularLinea(idLinea);
}

function duplicarSeleccion() {
  const checks = document.querySelectorAll('input[type="checkbox"]');
  checks.forEach((check, idx) => {
    if (check.checked) {
      const inputs = document.querySelectorAll(`#cuerpoTabla tr:nth-child(${idx + 1}) input, select`);
      const data = {};
      inputs.forEach(input => {
        data[input.id] = input.value;
      });
      agregarProducto(false, data);
    }
  });
}

function borrarSeleccion() {
  const checks = document.querySelectorAll('input[type="checkbox"]');
  checks.forEach((check, idx) => {
    if (check.checked) {
      check.closest("tr").remove();
    }
  });
  actualizarNumeracion();
}

function actualizarNumeracion() {
  document.querySelectorAll("#cuerpoTabla tr").forEach((fila, idx) => {
    const num = fila.querySelector("td:nth-child(2)");
    if (num) num.innerText = idx + 1;
  });
}

function exportarPDF() {
  const resumenHTML = document.createElement("div");
  resumenHTML.innerHTML = `
    <h2>Resumen de Cotización</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>m²</th>
          <th>mL</th>
          <th>Peso</th>
          <th>Precio Neto</th>
        </tr>
      </thead>
      <tbody>
        ${
          Array.from(document.querySelectorAll("#cuerpoTabla tr")).map((fila, idx) => {
            const nombre = fila.querySelector('[id^="nombre-"]')?.value || "-";
            const m2 = fila.querySelector('[id^="m2-"]')?.innerText || "-";
            const ml = fila.querySelector('[id^="ml-"]')?.innerText || "-";
            const peso = fila.querySelector('[id^="peso-"]')?.innerText || "-";
            const precio = fila.querySelector('[id^="precioLinea-"]')?.innerText || "-";
            return `<tr><td>${idx + 1}</td><td>${nombre}</td><td>${m2}</td><td>${ml}</td><td>${peso}</td><td>${precio}</td></tr>`;
          }).join("")
        }
      </tbody>
    </table>
    <br>
    <div>${document.getElementById("resumenCotizacion").innerHTML}</div>
  `;
  html2pdf().from(resumenHTML).save("Cotizacion.pdf");
}

// LocalStorage
function guardarEnLocalStorage() {
  const encabezado = {
    empresa: document.getElementById("empresa")?.value || "",
    obra: document.getElementById("obra")?.value || "",
    direccion: document.getElementById("direccion")?.value || "",
    presupuesto: document.getElementById("presupuesto")?.value || "",
    folio: document.getElementById("folio")?.value || "",
    supervisor: document.getElementById("supervisor")?.value || ""
  };

  const productos = Array.from(document.querySelectorAll("#cuerpoTabla tr")).map(fila => {
    const datos = {};
    fila.querySelectorAll("input, select").forEach(input => {
      datos[input.id] = input.value;
    });
    return datos;
  });

  localStorage.setItem("cotizacion_encabezado", JSON.stringify(encabezado));
  localStorage.setItem("cotizacion_productos", JSON.stringify(productos));
}

function cargarDesdeLocalStorage() {
  const encabezado = JSON.parse(localStorage.getItem("cotizacion_encabezado") || "{}");
  Object.entries(encabezado).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.value = valor;
  });

  const productos = JSON.parse(localStorage.getItem("cotizacion_productos") || "[]");
  productos.forEach((datos, idx) => {
    agregarProducto(true, datos);
  });
}

function borrarCotizacionLocal() {
  localStorage.removeItem("cotizacion_encabezado");
  localStorage.removeItem("cotizacion_productos");
  location.reload();
}

document.addEventListener("change", () => guardarEnLocalStorage());
window.addEventListener("DOMContentLoaded", () => cargarDesdeLocalStorage());
