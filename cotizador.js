
let contadorProductos = 0;

const tiposVidrio = [
  "Incoloro", "Mateluz", "Templado", "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
  "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2", "Laminado_templado", "Low E Eco", "Low E Super"
];

const espesoresPorVidrio = {
  "Incoloro": [4, 5, 6, 8, 10, 12],
  "Mateluz": [4, 5, 6],
  "Templado": [4, 5, 6, 8, 10, 12],
  "Laminado_33_1": [6, 8, 10, 12],
  "Laminado_44_1": [6, 8, 10, 12],
  "Laminado_55_1": [6, 8, 10, 12],
  "Laminado_66_1": [6, 8, 10, 12],
  "Laminado_33_2": [6, 8, 10, 12],
  "Laminado_44_2": [6, 8, 10, 12],
  "Laminado_55_2": [6, 8, 10, 12],
  "Laminado_66_2": [6, 8, 10, 12],
  "Laminado_templado": [8, 10, 13.52, 17.52, 21.52],
  "Low E Eco": [4, 5, 6],
  "Low E Super": [4, 5, 6]
};

function agregarProducto() {
  const tbody = document.getElementById("cuerpoTabla");
  const id = contadorProductos++;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="checkbox" class="seleccionar-linea"></td>
    <td class="numero-linea">${id + 1}</td>
    <td><input type="text" id="nombre-${id}" placeholder="Nombre"></td>
    <td><input type="number" id="cantidad-${id}" value="1" min="1"></td>
    <td><select id="tipo-${id}" onchange="cargarOpcionesVidrio(${id})">
      <option value="Vidrio">Vidrio</option>
      <option value="Termopanel">Termopanel</option>
    </select></td>
    <td><input type="number" id="alto-${id}" value="1000"></td>
    <td><input type="number" id="ancho-${id}" value="1000"></td>
    <td><select id="vidrio-${id}" onchange="actualizarEspesores(${id})"></select></td>
    <td><select id="espesor-${id}" onchange="calcularLinea(${id})"></select></td>
    <td id="m2-${id}">0</td>
    <td id="ml-${id}">0</td>
    <td id="peso-${id}">0</td>
    <td id="precio-${id}">$0</td>
  `;

  tbody.appendChild(tr);
  cargarOpcionesVidrio(id);
  calcularLinea(id);
}

function cargarOpcionesVidrio(id) {
  const select = document.getElementById(`vidrio-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  tiposVidrio.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.text = tipo;
    select.appendChild(option);
  });
}

function actualizarEspesores(id) {
  const vidrio = document.getElementById(`vidrio-${id}`).value;
  const select = document.getElementById(`espesor-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  if (espesoresPorVidrio[vidrio]) {
    espesoresPorVidrio[vidrio].forEach(e => {
      const option = document.createElement("option");
      option.value = e;
      option.text = `${e} mm`;
      select.appendChild(option);
    });
  }
}

function calcularLinea(id) {
  const alto = parseFloat(document.getElementById(`alto-${id}`).value || 0) / 1000;
  const ancho = parseFloat(document.getElementById(`ancho-${id}`).value || 0) / 1000;
  const espesor = parseFloat(document.getElementById(`espesor-${id}`).value || 0);
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value || 1);

  const m2 = alto * ancho * cantidad;
  const ml = 2 * (alto + ancho) * cantidad;
  const peso = 2.5 * m2 * espesor;

  document.getElementById(`m2-${id}`).innerText = m2.toFixed(2);
  document.getElementById(`ml-${id}`).innerText = ml.toFixed(2);
  document.getElementById(`peso-${id}`).innerText = peso.toFixed(1);
  document.getElementById(`precio-${id}`).innerText = "$0";

  actualizarResumen();
}

function actualizarResumen() {
  const resumen = document.getElementById("resumenCotizacion");
  const precios = Array.from(document.querySelectorAll('[id^="precio-"]')).map(e => {
    const txt = e.innerText.replace(/[^0-9]/g, '');
    return parseInt(txt) || 0;
  });
  const totalNeto = precios.reduce((a, b) => a + b, 0);
  const iva = totalNeto * 0.19;
  const total = totalNeto + iva;

  resumen.innerHTML = `
    <p>Total Neto: $${totalNeto.toLocaleString()}</p>
    <p>IVA (19%): $${iva.toLocaleString()}</p>
    <p>Total Final: $${total.toLocaleString()}</p>
  `;
}

function duplicarSeleccion() {
  const filas = document.querySelectorAll("#cuerpoTabla tr");
  filas.forEach((fila, idx) => {
    if (fila.querySelector(".seleccionar-linea").checked) {
      agregarProducto();
    }
  });
}

function borrarSeleccion() {
  const filas = document.querySelectorAll("#cuerpoTabla tr");
  filas.forEach(fila => {
    if (fila.querySelector(".seleccionar-linea").checked) {
      fila.remove();
    }
  });
  actualizarNumeracion();
}

function actualizarNumeracion() {
  document.querySelectorAll("#cuerpoTabla tr").forEach((fila, i) => {
    fila.querySelector(".numero-linea").innerText = i + 1;
  });
}
