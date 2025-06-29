let contadorProductos = 0;
let preciosBase = {};
let productosCotizados = [];

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

async function cargarPrecios() {
  try {
    const res = await fetch("precios_base.json");
    preciosBase = await res.json();
    localStorage.setItem("precios", JSON.stringify(preciosBase));
  } catch (e) {
    console.error("Error al cargar precios_base.json:", e);
    preciosBase = JSON.parse(localStorage.getItem("precios") || "{}");
  }
}

function agregarProducto() {
  const tbody = document.getElementById("cuerpoTabla");
  const id = contadorProductos++;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="checkbox" class="seleccionar-linea"></td>
    <td class="numero-linea">${id + 1}</td>
    <td><input type="text" id="nombre-${id}" placeholder="Nombre"></td>
    <td><input type="number" id="cantidad-${id}" value="1" min="1" onchange="calcularLinea(${id})"></td>
    <td><select id="tipo-${id}" onchange="cargarOpcionesVidrio(${id}); calcularLinea(${id})">
      <option value="Vidrio">Vidrio</option>
      <option value="Termopanel">Termopanel</option>
    </select></td>
    <td><input type="number" id="alto-${id}" value="1000" min="0" onchange="calcularLinea(${id})"></td>
    <td><input type="number" id="ancho-${id}" value="1000" min="0" onchange="calcularLinea(${id})"></td>
    <td><select id="vidrio-${id}" onchange="actualizarEspesores(${id}); calcularLinea(${id})"></select></td>
    <td><select id="espesor-${id}" onchange="actualizarCamposPorEspesor(${id}); calcularLinea(${id})"></select></td>
    <td><select id="terminacion-${id}" onchange="calcularLinea(${id})"></select></td>
    <td><select id="perforacion-${id}" onchange="calcularLinea(${id})"></select><input type="number" id="cantPerforacion-${id}" min="0" value="0" style="width: 60px" onchange="calcularLinea(${id})"></td>
    <td><select id="destajado-${id}" onchange="calcularLinea(${id})"></select><input type="number" id="cantDestajado-${id}" min="0" value="0" style="width: 60px" onchange="calcularLinea(${id})"></td>
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
  actualizarCamposPorEspesor(id);
}

function actualizarCamposPorEspesor(id) {
  const espesor = parseFloat(document.getElementById(`espesor-${id}`).value || 0);
  const terminacion = document.getElementById(`terminacion-${id}`);
  const perforacion = document.getElementById(`perforacion-${id}`);
  const destajado = document.getElementById(`destajado-${id}`);

  terminacion.innerHTML = '<option value="">Ninguna</option>';
  if ([4, 6, 8, 10].includes(espesor)) terminacion.innerHTML += "<option value='Botado Arista'>Botado Arista</option>";
  if ([4, 5, 6].includes(espesor)) terminacion.innerHTML += "<option value='Botado Arista x TP'>Botado Arista x TP</option>";

  perforacion.innerHTML = '<option value="">Ninguna</option>';
  if (espesor >= 4 && espesor <= 19) perforacion.innerHTML += "<option value='Perforado normal'>Perforado normal</option>";
  if (espesor >= 4 && espesor <= 12) perforacion.innerHTML += "<option value='Perforado avellanado'>Perforado avellanado</option>";

  destajado.innerHTML = '<option value="">Ninguna</option>';
  if (espesor >= 4 && espesor <= 12) {
    destajado.innerHTML += "<option value='Destajado normal'>Destajado normal</option>";
    destajado.innerHTML += "<option value='Destajado central'>Destajado central</option>";
  }
}

function calcularLinea(id) {
  const alto_mm = parseFloat(document.getElementById(`alto-${id}`).value || 0);
  const ancho_mm = parseFloat(document.getElementById(`ancho-${id}`).value || 0);
  const espesor = parseFloat(document.getElementById(`espesor-${id}`).value || 0);
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value || 1);
  const vidrio = document.getElementById(`vidrio-${id}`).value;
  const tipo = document.getElementById(`tipo-${id}`).value;
  const terminacion = document.getElementById(`terminacion-${id}`).value;
  const perforacion = document.getElementById(`perforacion-${id}`).value;
  const cantPerforacion = parseInt(document.getElementById(`cantPerforacion-${id}`).value || 0);
  const destajado = document.getElementById(`destajado-${id}`).value;
  const cantDestajado = parseInt(document.getElementById(`cantDestajado-${id}`).value || 0);
  const factor = parseFloat(localStorage.getItem("factor") || 1);

  const m2 = calcularM2(ancho_mm, alto_mm) * cantidad;
  const ml = calcularML(ancho_mm, alto_mm) * cantidad;
  const peso = calcularPesoVidrio(m2, espesor);

  let precio = 0;
  if (vidrio && espesor) {
    const vidrioData = preciosBase.vidrios?.find(v => v.nombre === vidrio && v.espesor === espesor);
    if (vidrioData && vidrioData.precio_m2 !== "A PEDIDO") {
      precio += parseFloat(vidrioData.precio_m2) * m2 * factor;
    }

    if (tipo === "Termopanel") {
      const separador = preciosBase.separadores?.find(s => s.espesor === espesor);
      if (separador && separador.precio_ml !== "n/d") {
        precio += parseFloat(separador.precio_ml) * ml * factor;
        precio += parseFloat(vidrioData?.precio_m2 || 0) * m2 * factor; // Segundo vidrio
      }
    }

    if (terminacion) {
      const terminacionData = preciosBase.terminaciones?.find(t => t.nombre === terminacion && t.espesor === espesor);
      if (terminacionData && terminacionData.precio_ml !== "n/d") {
        precio += parseFloat(terminacionData.precio_ml) * ml * factor;
      }
    }

    if (perforacion && cantPerforacion > 0) {
      const perforacionData = preciosBase.perforaciones?.find(p => p.nombre === perforacion && p.espesor === espesor);
      if (perforacionData && perforacionData.precio !== "n/d") {
        precio += parseFloat(perforacionData.precio) * cantPerforacion * factor;
      }
    }

    if (destajado && cantDestajado > 0) {
      const destajadoData = preciosBase.destajados?.find(d => d.nombre === destajado && d.espesor === espesor);
      if (destajadoData && destajadoData.precio !== "n/d") {
        precio += parseFloat(destajadoData.precio) * cantDestajado * factor;
      }
    }
  }

  document.getElementById(`m2-${id}`).innerText = m2.toFixed(3);
  document.getElementById(`ml-${id}`).innerText = ml.toFixed(3);
  document.getElementById(`peso-${id}`).innerText = peso.toFixed(1);
  document.getElementById(`precio-${id}`).innerText = `$${Math.round(precio).toLocaleString()}`;

  // Actualizar productosCotizados para storage.js
  productosCotizados[id] = {
    id: id + 1,
    nombre: document.getElementById(`nombre-${id}`).value,
    cantidad,
    tipo,
    alto_mm,
    ancho_mm,
    vidrio,
    espesor,
    terminacion,
    perforacion,
    cantPerforacion,
    destajado,
    cantDestajado,
    m2,
    ml,
    peso,
    precio
  };

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

document.addEventListener("DOMContentLoaded", () => {
  cargarPrecios();
  document.getElementById("agregarProducto").addEventListener("click", agregarProducto);
});