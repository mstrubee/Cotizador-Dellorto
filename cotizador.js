let contadorProductos = 0;
let preciosBase = {};
let productosCotizados = [];

const tiposVidrio = [
  "Incoloro", "Mateluz", "Templado", "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
  "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2", "Laminado_templado", "LowE Eco", "LowE Plus"
];

const espesoresPorVidrio = {
  "Incoloro": [4, 5, 6, 8, 10, 12],
  "Mateluz": [4, 5, 6],
  "Templado": [4, 5, 6, 8, 10, 12],
  "Laminado_33_1": [6],
  "Laminado_44_1": [8],
  "Laminado_55_1": [10],
  "Laminado_66_1": [12],
  "Laminado_33_2": [6],
  "Laminado_44_2": [8],
  "Laminado_55_2": [10],
  "Laminado_66_2": [12],
  "Laminado_templado": [8, 10, 13.52, 17.52, 21.52],
  "LowE Eco": [4, 5, 6],
  "LowE Plus": [4, 5, 6]
};

const coloresSeparador = ["Negro", "Plata Mate", "Bronce"];
const espesoresSeparador = [6, 8, 10, 12, 15, 19, 20];

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
    <td><select id="tipo-${id}" onchange="actualizarCampos(${id}); calcularLinea(${id})">
      <option value="Vidrio">Vidrio</option>
      <option value="Termopanel">Termopanel</option>
    </select></td>
    <td><input type="number" id="alto-${id}" value="1000" min="0" onchange="calcularLinea(${id})"></td>
    <td><input type="number" id="ancho-${id}" value="1000" min="0" onchange="calcularLinea(${id})"></td>
    <td><select id="vidrioA-${id}" onchange="actualizarEspesores(${id}, 'A'); calcularLinea(${id})"></select></td>
    <td><select id="espesorA-${id}" onchange="actualizarCamposPorEspesor(${id}); calcularLinea(${id})"></select></td>
    <td><select id="vidrioB-${id}" onchange="actualizarEspesores(${id}, 'B'); calcularLinea(${id})" style="display: none;"></select></td>
    <td><select id="espesorB-${id}" onchange="actualizarCamposPorEspesor(${id}); calcularLinea(${id})" style="display: none;"></select></td>
    <td><select id="separador-${id}" onchange="actualizarEspesoresSeparador(${id}); calcularLinea(${id})" style="display: none;"></select></td>
    <td><select id="espesorSeparador-${id}" onchange="calcularLinea(${id})" style="display: none;"></select></td>
    <td><select id="colorSeparador-${id}" onchange="calcularLinea(${id})" style="display: none;"></select></td>
    <td><select id="terminacion-${id}" onchange="calcularLinea(${id})"></select></td>
    <td><select id="perforacion-${id}" onchange="calcularLinea(${id})"></select><input type="number" id="cantPerforacion-${id}" min="0" value="0" style="width: 60px" onchange="calcularLinea(${id})"></td>
    <td><select id="destajado-${id}" onchange="calcularLinea(${id})"></select><input type="number" id="cantDestajado-${id}" min="0" value="0" style="width: 60px" onchange="calcularLinea(${id})"></td>
    <td id="m2-${id}">0</td>
    <td id="ml-${id}">0</td>
    <td id="peso-${id}">0</td>
    <td id="precio-${id}">$0</td>
  `;

  tbody.appendChild(tr);
  actualizarCampos(id);
  calcularLinea(id);
}

function actualizarCampos(id) {
  const tipo = document.getElementById(`tipo-${id}`).value;
  document.getElementById(`vidrioB-${id}`).style.display = tipo === "Termopanel" ? "table-cell" : "none";
  document.getElementById(`espesorB-${id}`).style.display = tipo === "Termopanel" ? "table-cell" : "none";
  document.getElementById(`separador-${id}`).style.display = tipo === "Termopanel" ? "table-cell" : "none";
  document.getElementById(`espesorSeparador-${id}`).style.display = tipo === "Termopanel" ? "table-cell" : "none";
  document.getElementById(`colorSeparador-${id}`).style.display = tipo === "Termopanel" ? "table-cell" : "none";
  cargarOpcionesVidrio(id, 'A');
  if (tipo === "Termopanel") {
    cargarOpcionesVidrio(id, 'B');
    cargarOpcionesSeparador(id);
    actualizarEspesoresSeparador(id);
    cargarOpcionesColorSeparador(id);
  }
  actualizarCamposPorEspesor(id);
}

function cargarOpcionesVidrio(id, vidrio) {
  const select = document.getElementById(`vidrio${vidrio}-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  tiposVidrio.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.text = tipo;
    select.appendChild(option);
  });
}

function cargarOpcionesSeparador(id) {
  const select = document.getElementById(`separador-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  const separadores = ["Aluminio (sep.PSF)", "Silicona (sep.SEN)"];
  separadores.forEach(sep => {
    const option = document.createElement("option");
    option.value = sep;
    option.text = sep;
    select.appendChild(option);
  });
}

function actualizarEspesoresSeparador(id) {
  const select = document.getElementById(`espesorSeparador-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  espesoresSeparador.forEach(e => {
    const option = document.createElement("option");
    option.value = e;
    option.text = `${e} mm`;
    select.appendChild(option);
  });
}

function cargarOpcionesColorSeparador(id) {
  const select = document.getElementById(`colorSeparador-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  coloresSeparador.forEach(color => {
    const option = document.createElement("option");
    option.value = color;
    option.text = color;
    select.appendChild(option);
  });
}

function actualizarEspesores(id, vidrio) {
  const tipoVidrio = document.getElementById(`vidrio${vidrio}-${id}`).value;
  const select = document.getElementById(`espesor${vidrio}-${id}`);
  select.innerHTML = '<option value="">Selecciona</option>';
  if (espesoresPorVidrio[tipoVidrio]) {
    espesoresPorVidrio[tipoVidrio].forEach(e => {
      const option = document.createElement("option");
      option.value = e;
      option.text = `${e} mm`;
      select.appendChild(option);
    });
  }
  actualizarCamposPorEspesor(id);
}

function actualizarCamposPorEspesor(id) {
  const tipo = document.getElementById(`tipo-${id}`).value;
  const espesorA = parseFloat(document.getElementById(`espesorA-${id}`).value || 0);

  const terminacion = document.getElementById(`terminacion-${id}`);
  terminacion.innerHTML = '<option value="">Ninguna</option>';
  if (tipo === "Vidrio") {
    if ([4, 6, 8, 10].includes(espesorA)) {
      terminacion.innerHTML += "<option value='Botado Arista'>Botado Arista</option>";
    }
  } else {
    if ([4, 5, 6].includes(espesorA)) {
      terminacion.innerHTML += "<option value='Botado Arista x TP'>Botado Arista x TP</option>";
      terminacion.value = "Botado Arista x TP"; // Por defecto para termopaneles
    }
  }

  const perforacion = document.getElementById(`perforacion-${id}`);
  perforacion.innerHTML = '<option value="">Ninguna</option>';
  if (espesorA >= 4 && espesorA <= 19) perforacion.innerHTML += "<option value='Perforado normal'>Perforado normal</option>";
  if (espesorA >= 4 && espesorA <= 12) perforacion.innerHTML += "<option value='Perforado avellanado'>Perforado avellanado</option>";

  const destajado = document.getElementById(`destajado-${id}`);
  destajado.innerHTML = '<option value="">Ninguna</option>';
  if (espesorA >= 4 && espesorA <= 12) {
    destajado.innerHTML += "<option value='Destajado normal'>Destajado normal</option>";
    destajado.innerHTML += "<option value='Destajado central'>Destajado central</option>";
  }
}

function calcularLinea(id) {
  const alto_mm = parseFloat(document.getElementById(`alto-${id}`).value || 0);
  const ancho_mm = parseFloat(document.getElementById(`ancho-${id}`).value || 0);
  const espesorA = parseFloat(document.getElementById(`espesorA-${id}`).value || 0);
  const espesorB = parseFloat(document.getElementById(`espesorB-${id}`).value || 0);
  const espesorSeparador = parseFloat(document.getElementById(`espesorSeparador-${id}`).value || 0);
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value || 1);
  const vidrioA = document.getElementById(`vidrioA-${id}`).value;
  const vidrioB = document.getElementById(`vidrioB-${id}`).value;
  const tipo = document.getElementById(`tipo-${id}`).value;
  const separador = document.getElementById(`separador-${id}`).value;
  const colorSeparador = document.getElementById(`colorSeparador-${id}`).value;
  const terminacion = document.getElementById(`terminacion-${id}`).value;
  const perforacion = document.getElementById(`perforacion-${id}`).value;
  const cantPerforacion = parseInt(document.getElementById(`cantPerforacion-${id}`).value || 0);
  const destajado = document.getElementById(`destajado-${id}`).value;
  const cantDestajado = parseInt(document.getElementById(`cantDestajado-${id}`).value || 0);
  const factor = parseFloat(localStorage.getItem("factor") || 1);

  const m2 = calcularM2(ancho_mm, alto_mm) * cantidad;
  const ml = calcularML(ancho_mm, alto_mm) * cantidad;
  const peso = tipo === "Termopanel" ? calcularPesoVidrio(m2, espesorA + espesorB) : calcularPesoVidrio(m2, espesorA);

  let precio = 0;
  let aPedido = false;

  if (vidrioA && espesorA) {
    const vidrioAData = preciosBase.vidrios?.find(v => v.nombre === vidrioA && v.espesor === espesorA);
    if (vidrioAData && vidrioAData.precio_m2 !== "A PEDIDO") {
      precio += parseFloat(vidrioAData.precio_m2) * m2 * factor;
    } else if (vidrioAData?.precio_m2 === "A PEDIDO") {
      aPedido = true;
    }
  }

  if (tipo === "Termopanel" && vidrioB && espesorB) {
    const vidrioBData = preciosBase.vidrios?.find(v => v.nombre === vidrioB && v.espesor === espesorB);
    if (vidrioBData && vidrioBData.precio_m2 !== "A PEDIDO") {
      precio += parseFloat(vidrioBData.precio_m2) * m2 * factor;
    } else if (vidrioBData?.precio_m2 === "A PEDIDO") {
      aPedido = true;
    }
    if (separador && espesorSeparador) {
      const separadorData = preciosBase.separadores?.find(s => s.nombre === separador && s.espesor === espesorSeparador);
      if (separadorData && separadorData.precio_ml !== "n/d") {
        precio += parseFloat(separadorData.precio_ml) * ml * factor;
      } else if (separadorData?.precio_ml === "n/d") {
        aPedido = true;
      }
    }
  }

  if (terminacion) {
    const terminacionData = preciosBase.terminaciones?.find(t => t.nombre === terminacion && t.espesor === espesorA);
    if (terminacionData && terminacionData.precio_ml !== "n/d") {
      precio += parseFloat(terminacionData.precio_ml) * ml * factor;
    } else if (terminacionData?.precio_ml === "n/d") {
      aPedido = true;
    }
  }

  if (perforacion && cantPerforacion > 0) {
    const perforacionData = preciosBase.perforaciones?.find(p => p.nombre === perforacion && p.espesor === espesorA);
    if (perforacionData && perforacionData.precio !== "n/d") {
      precio += parseFloat(perforacionData.precio) * cantPerforacion * factor;
    } else if (perforacionData?.precio === "n/d") {
      aPedido = true;
    }
  }

  if (destajado && cantDestajado > 0) {
    const destajadoData = preciosBase.destajados?.find(d => d.nombre === destajado && d.espesor === espesorA);
    if (destajadoData && destajadoData.precio !== "n/d") {
      precio += parseFloat(destajadoData.precio) * cantDestajado * factor;
    } else if (destajadoData?.precio === "n/d") {
      aPedido = true;
    }
  }

  document.getElementById(`m2-${id}`).innerText = m2.toFixed(3);
  document.getElementById(`ml-${id}`).innerText = ml.toFixed(3);
  document.getElementById(`peso-${id}`).innerText = peso.toFixed(1);
  document.getElementById(`precio-${id}`).innerText = aPedido ? "A PEDIDO" : `$${Math.round(precio).toLocaleString()}`;
  document.getElementById(`precio-${id}`).style.color = aPedido ? "red" : "inherit";

  productosCotizados[id] = {
    id: id + 1,
    nombre: document.getElementById(`nombre-${id}`).value,
    cantidad,
    tipo,
    vidrioA,
    espesorA,
    vidrioB,
    espesorB,
    separador,
    espesorSeparador,
    colorSeparador,
    terminacion,
    perforacion,
    cantPerforacion,
    destajado,
    cantDestajado,
    m2,
    ml,
    peso,
    precio: aPedido ? "A PEDIDO" : precio
  };

  actualizarResumen();
}

function actualizarResumen() {
  const resumen = document.getElementById("resumenCotizacion");
  const precios = Array.from(document.querySelectorAll('[id^="precio-"]')).map(e => {
    const txt = e.innerText;
    return txt === "A PEDIDO" ? 0 : parseInt(txt.replace(/[^0-9]/g, '')) || 0;
  });
  const aPedido = productosCotizados.some(p => p && p.precio === "A PEDIDO");
  const totalNeto = precios.reduce((a, b) => a + b, 0);
  const iva = aPedido ? 0 : totalNeto * 0.19;
  const total = aPedido ? 0 : totalNeto + iva;

  resumen.innerHTML = `
    <p>Total Neto: ${aPedido ? "A PEDIDO" : `$${totalNeto.toLocaleString()}`}</p>
    <p>IVA (19%): ${aPedido ? "A PEDIDO" : `$${iva.toLocaleString()}`}</p>
    <p>Total Final: ${aPedido ? "A PEDIDO" : `$${total.toLocaleString()}`}</p>
  `;
  if (aPedido) {
    resumen.style.color = "red";
  } else {
    resumen.style.color = "inherit";
  }
}

function agregarSimilar() {
  const selected = document.querySelector(".seleccionar-linea:checked");
  if (!selected) {
    alert("Selecciona una línea para añadir una similar.");
    return;
  }
  const id = parseInt(selected.closest("tr").querySelector(".numero-linea").innerText) - 1;
  const producto = productosCotizados[id];
  if (!producto) return;

  agregarProducto();
  const newId = contadorProductos - 1;
  document.getElementById(`nombre-${newId}`).value = producto.nombre;
  document.getElementById(`cantidad-${newId}`).value = producto.cantidad;
  document.getElementById(`tipo-${newId}`).value = producto.tipo;
  document.getElementById(`alto-${newId}`).value = producto.alto_mm;
  document.getElementById(`ancho-${newId}`).value = producto.ancho_mm;
  document.getElementById(`vidrioA-${newId}`).value = producto.vidrioA;
  actualizarEspesores(newId, 'A');
  document.getElementById(`espesorA-${newId}`).value = producto.espesorA;
  if (producto.tipo === "Termopanel") {
    document.getElementById(`vidrioB-${newId}`).value = producto.vidrioB;
    actualizarEspesores(newId, 'B');
    document.getElementById(`espesorB-${newId}`).value = producto.espesorB;
    document.getElementById(`separador-${newId}`).value = producto.separador;
    document.getElementById(`espesorSeparador-${newId}`).value = producto.espesorSeparador;
    document.getElementById(`colorSeparador-${newId}`).value = producto.colorSeparador;
  }
  document.getElementById(`terminacion-${newId}`).value = producto.terminacion;
  document.getElementById(`perforacion-${newId}`).value = producto.perforacion;
  document.getElementById(`cantPerforacion-${newId}`).value = producto.cantPerforacion;
  document.getElementById(`destajado-${newId}`).value = producto.destajado;
  document.getElementById(`cantDestajado-${newId}`).value = producto.cantDestajado;
  actualizarCamposPorEspesor(newId);
  calcularLinea(newId);
}

function borrarSeleccion() {
  const selected = document.querySelectorAll(".seleccionar-linea:checked");
  if (selected.length === 0) {
    alert("Selecciona al menos una línea para eliminar.");
    return;
  }
  selected.forEach(checkbox => {
    const id = parseInt(checkbox.closest("tr").querySelector(".numero-linea").innerText) - 1;
    productosCotizados[id] = null;
    checkbox.closest("tr").remove();
  });
  // Re-numerar líneas
  const filas = document.querySelectorAll("#cuerpoTabla tr");
  productosCotizados = productosCotizados.filter(p => p);
  filas.forEach((fila, index) => {
    fila.querySelector(".numero-linea").innerText = index + 1;
    const oldId = parseInt(fila.querySelector(".numero-linea").innerText) - 1;
    if (productosCotizados[oldId]) {
      productosCotizados[oldId].id = index + 1;
    }
    // Actualizar IDs de los elementos
    fila.querySelectorAll("[id]").forEach(el => {
      const oldIdMatch = el.id.match(/-(.*)$/);
      if (oldIdMatch) {
        el.id = el.id.replace(oldIdMatch[1], index);
      }
    });
  });
  contadorProductos = filas.length;
  actualizarResumen();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPrecios();
  document.getElementById("agregarProducto").addEventListener("click", agregarProducto);
  document.getElementById("agregarSimilar").addEventListener("click", agregarSimilar);
  document.getElementById("borrarSeleccion").addEventListener("click", borrarSeleccion);
});