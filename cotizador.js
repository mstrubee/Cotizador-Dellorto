
let preciosBase = {};
let factorCliente = 1;
let productosCotizados = [];

const VIDRIOS_VALIDOS = [
  "Incoloro", "Mateluz", "Templado",
  "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
  "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2",
  "Laminado_templado", "Low E Eco", "Low E Super"
];

const ESPECIALES = {
  "Incoloro": [4, 5, 6, 8, 10, 12],
  "Templado": [4, 5, 6, 8, 10, 12],
  "Laminado_templado": [8, 10, 13.52, 17.52, 21.52],
  "Low E Eco": [4, 5, 6],
  "Low E Super": [4, 5, 6]
};

window.onload = async () => {
  cargarUsuarioActivo();
  preciosBase = await fetchPrecios();
  factorCliente = cargarFactorCliente();
  document.getElementById("fechaCotizacion").valueAsDate = new Date();
  document.getElementById("btnDuplicar").addEventListener("click", duplicarSeleccion);
  document.getElementById("btnEliminar").addEventListener("click", eliminarSeleccion);
};

function cargarUsuarioActivo() {
  const user = localStorage.getItem("usuario");
  document.getElementById("username").innerText = user || "Desconocido";
}

function cargarFactorCliente() {
  const factor = localStorage.getItem("factor");
  return factor ? parseFloat(factor) : 1;
}

async function fetchPrecios() {
  const res = await fetch("precios_base.json");
  return await res.json();
}

function agregarProducto(baseData = null) {
  const id = productosCotizados.length;
  productosCotizados.push({ id });

  const container = document.createElement("div");
  container.className = "fila-producto";
  container.id = `linea-${id}`;

  container.innerHTML = `
    <input type="checkbox" class="check-linea" />
    <label class="linea-num">${id + 1}</label>
    <input type="text" id="nombre-${id}" placeholder="Nombre" value="${baseData?.nombre || ''}" />
    <input type="number" id="cantidad-${id}" placeholder="Cantidad" min="1" value="${baseData?.cantidad || 1}" />
    <select id="tipo-${id}" onchange="actualizarOpciones(${id})">
      <option value="Vidrio" ${baseData?.tipo === "Vidrio" ? 'selected' : ''}>Vidrio</option>
      <option value="Termopanel" ${baseData?.tipo === "Termopanel" ? 'selected' : ''}>Termopanel</option>
    </select>
    <div class="subcampos" id="opciones-${id}"></div>
    <div class="precio-linea" id="precioLinea-${id}">$ 0</div>
  `;

  document.getElementById("productos").appendChild(container);
  actualizarOpciones(id, baseData);
}
window.agregarProducto = agregarProducto;

function actualizarOpciones(id, baseData = null) {
  const tipo = document.getElementById(`tipo-${id}`).value;
  const contenedor = document.getElementById(`opciones-${id}`);
  contenedor.innerHTML = "";

  const vidrioOptions = generarOpcionesVidrios();

  if (tipo === "Vidrio") {
    contenedor.innerHTML = `
      <select id="vidrioTipo-${id}" onchange="cargarEspesores(${id})">${vidrioOptions}</select>
      <select id="espesor-${id}" onchange="cargarTerminaciones(${id})"></select>
      <input type="number" id="alto-${id}" placeholder="Alto (mm)" value="${baseData?.alto || ''}" />
      <input type="number" id="ancho-${id}" placeholder="Ancho (mm)" value="${baseData?.ancho || ''}" />
      <select id="terminacion-${id}"></select>
      <select id="perforacion-${id}"></select>
      <input type="number" id="numPerforaciones-${id}" placeholder="N° perf" min="0" />
      <select id="destajado-${id}"></select>
      <input type="number" id="numDestajes-${id}" placeholder="N° dest" min="0" />
    `;

    const tipoVidrio = baseData?.vidrioTipo || document.getElementById(`vidrioTipo-${id}`).value;
    document.getElementById(`vidrioTipo-${id}`).value = tipoVidrio;
    cargarEspesores(id, baseData?.espesor);
  } else {
    contenedor.innerHTML = `
      <select id="vidrioA-${id}" onchange="cargarEspesores(${id}, 'A')">${vidrioOptions}</select>
      <select id="espesorA-${id}"></select>
      <select id="vidrioB-${id}" onchange="cargarEspesores(${id}, 'B')">${vidrioOptions}</select>
      <select id="espesorB-${id}"></select>
      <select id="separador-${id}">
        <option value="PSF">Aluminio (sep.PSF)</option>
        <option value="SEN">Silicona (sep.SEN)</option>
      </select>
      <select id="espesorSep-${id}">
        <option>6</option><option>8</option><option>10</option>
        <option>12</option><option>15</option><option>19</option><option>20</option>
      </select>
      <select id="colorSep-${id}">
        <option>Negro</option><option>Plata Mate</option><option>Bronce</option>
      </select>
      <input type="number" id="alto-${id}" placeholder="Alto (mm)" />
      <input type="number" id="ancho-${id}" placeholder="Ancho (mm)" />
    `;

    if (baseData) {
      document.getElementById(`vidrioA-${id}`).value = baseData?.vidrioA || "Incoloro";
      document.getElementById(`vidrioB-${id}`).value = baseData?.vidrioB || "Incoloro";
    }

    cargarEspesores(id, 'A', baseData?.espesorA);
    cargarEspesores(id, 'B', baseData?.espesorB);
  }
}

function generarOpcionesVidrios() {
  return VIDRIOS_VALIDOS.map(v => `<option value="${v}">${v}</option>`).join("");
}

function cargarEspesores(id, parte = null, selected = null) {
  const vidrioSelect = parte ? `vidrio${parte}-${id}` : `vidrioTipo-${id}`;
  const espesorSelect = parte ? `espesor${parte}-${id}` : `espesor-${id}`;

  const tipo = document.getElementById(vidrioSelect).value;
  let espesores = ESPECIALES[tipo] || preciosBase.vidrios.filter(v => v.nombre === tipo).map(v => v.espesor);

  const select = document.getElementById(espesorSelect);
  select.innerHTML = espesores.map(e => `<option value="${e}" ${e === selected ? "selected" : ""}>${e}</option>`).join("");

  if (!parte) cargarTerminaciones(id);
}

function cargarTerminaciones(id) {
  const espesor = parseFloat(document.getElementById(`espesor-${id}`).value);
  const terminacion = document.getElementById(`terminacion-${id}`);
  const perforacion = document.getElementById(`perforacion-${id}`);
  const destajado = document.getElementById(`destajado-${id}`);

  terminacion.innerHTML = `<option value="">Sin terminación</option>`;
  perforacion.innerHTML = `<option value="">Sin perforación</option>`;
  destajado.innerHTML = `<option value="">Sin destaje</option>`;

  if ([4, 6, 8, 10].includes(espesor)) terminacion.innerHTML += `<option value="Botado Arista">Botado Arista</option>`;
  if ([4, 5, 6].includes(espesor)) terminacion.innerHTML += `<option value="Botado Arista x TP">Botado Arista x TP</option>`;
  if (espesor >= 4 && espesor <= 19) perforacion.innerHTML += `<option value="Perforado normal">Perforado normal</option>`;
  if (espesor >= 4 && espesor <= 12) {
    perforacion.innerHTML += `<option value="Perforado avellanado">Perforado avellanado</option>`;
    destajado.innerHTML += `<option value="Destajado normal">Destajado normal</option>`;
    destajado.innerHTML += `<option value="Destajado central">Destajado central</option>`;
  }
}

function duplicarSeleccion() {
  const seleccionado = document.querySelector(".check-linea:checked");
  if (!seleccionado) return alert("Seleccione una línea para duplicar.");
  const id = seleccionado.closest(".fila-producto").id.replace("linea-", "");
  const baseData = {};
  document.querySelectorAll(`#linea-${id} input, #linea-${id} select`).forEach(el => {
    const campo = el.id.split("-")[0];
    baseData[campo] = el.value;
  });
  agregarProducto(baseData);
}

function eliminarSeleccion() {
  document.querySelectorAll(".check-linea:checked").forEach(check => {
    check.closest(".fila-producto").remove();
  });
}

function calcularPrecioLinea(id) {
  try {
    const tipo = document.getElementById(`tipo-${id}`).value;
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value) || 1;
    const alto = parseFloat(document.getElementById(`alto-${id}`).value) || 0;
    const ancho = parseFloat(document.getElementById(`ancho-${id}`).value) || 0;
    const m2 = (alto * ancho) / 1_000_000;

    let precioTotal = 0;

    if (tipo === "Vidrio") {
      const vidrioTipo = document.getElementById(`vidrioTipo-${id}`).value;
      const espesor = parseFloat(document.getElementById(`espesor-${id}`).value);
      const match = preciosBase.vidrios.find(v => v.nombre === vidrioTipo && parseFloat(v.espesor) === espesor);
      let precioBase = (typeof match?.precio_m2 === 'number') ? match.precio_m2 : 0;
      precioTotal = precioBase * m2 * factorCliente;
    } else {
      // Termopanel: vidrio A + vidrio B + separador
      const vA = document.getElementById(`vidrioA-${id}`).value;
      const eA = parseFloat(document.getElementById(`espesorA-${id}`).value);
      const vB = document.getElementById(`vidrioB-${id}`).value;
      const eB = parseFloat(document.getElementById(`espesorB-${id}`).value);
      const sepTipo = document.getElementById(`separador-${id}`).value;
      const sepEspesor = parseFloat(document.getElementById(`espesorSep-${id}`).value);
      const sepColor = document.getElementById(`colorSep-${id}`).value;
      const perimetro = 2 * ((alto + ancho) / 1000); // metros lineales

      const matchA = preciosBase.vidrios.find(v => v.nombre === vA && parseFloat(v.espesor) === eA);
      const matchB = preciosBase.vidrios.find(v => v.nombre === vB && parseFloat(v.espesor) === eB);
      const matchSep = preciosBase.separadores.find(s => s.nombre === sepTipo && parseFloat(s.espesor) === sepEspesor && s.color === sepColor);

      const precioA = (typeof matchA?.precio_m2 === 'number') ? matchA.precio_m2 : 0;
      const precioB = (typeof matchB?.precio_m2 === 'number') ? matchB.precio_m2 : 0;
      const precioSep = (typeof matchSep?.precio_ml === 'number') ? matchSep.precio_ml : 0;

      precioTotal = ((precioA + precioB) * m2 + precioSep * perimetro) * factorCliente;
    }

    document.getElementById(`precioLinea-${id}`).innerText = `$ ${Math.round(precioTotal * cantidad).toLocaleString("es-CL")}`;
  } catch (e) {
    console.error("Error al calcular precio:", e);
  }
}

// Recalcular precios cada vez que haya cambios en un campo relevante
document.addEventListener("input", (e) => {
  const padre = e.target.closest(".fila-producto");
  if (padre) {
    const id = parseInt(padre.id.replace("linea-", ""));
    calcularPrecioLinea(id);
  }
});

function actualizarTotales() {
  let totalNeto = 0;
  const resumen = document.getElementById("resumenCotizacion");
  const filas = document.querySelectorAll(".fila-producto");

  filas.forEach(f => {
    const id = f.id.split("-")[1];
    const precioTexto = document.getElementById(`precioLinea-${id}`).innerText.replace(/[^0-9]/g, '');
    const precio = parseInt(precioTexto) || 0;
    totalNeto += precio;
  });

  const iva = Math.round(totalNeto * 0.19);
  const totalFinal = totalNeto + iva;

  resumen.innerHTML = `
    <p>Total Neto: <strong>$ ${totalNeto.toLocaleString("es-CL")}</strong></p>
    <p>IVA (19%): <strong>$ ${iva.toLocaleString("es-CL")}</strong></p>
    <p>Total Final: <strong>$ ${totalFinal.toLocaleString("es-CL")}</strong></p>
  `;
}

function calcularDatosLinea(id) {
  try {
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value) || 1;
    const alto = parseFloat(document.getElementById(`alto-${id}`).value) || 0;
    const ancho = parseFloat(document.getElementById(`ancho-${id}`).value) || 0;
    const m2 = (alto * ancho) / 1_000_000;
    const ml = 2 * (alto + ancho) / 1000;
    let peso = 0;
    let precio = 0;

    const tipo = document.getElementById(`tipo-${id}`).value;

    if (tipo === "Vidrio") {
      const vidrioTipo = document.getElementById(`vidrioTipo-${id}`).value;
      const espesor = parseFloat(document.getElementById(`espesor-${id}`).value);
      const match = preciosBase.vidrios.find(v => v.nombre === vidrioTipo && parseFloat(v.espesor) === espesor);
      const precioBase = typeof match?.precio_m2 === "number" ? match.precio_m2 : 0;
      precio = precioBase * m2 * cantidad * factorCliente;
      peso = 2.5 * m2 * espesor;
    } else {
      const vA = document.getElementById(`vidrioA-${id}`).value;
      const eA = parseFloat(document.getElementById(`espesorA-${id}`).value);
      const vB = document.getElementById(`vidrioB-${id}`).value;
      const eB = parseFloat(document.getElementById(`espesorB-${id}`).value);
      const sepTipo = document.getElementById(`separador-${id}`).value;
      const sepEspesor = parseFloat(document.getElementById(`espesorSep-${id}`).value);
      const sepColor = document.getElementById(`colorSep-${id}`).value;

      const matchA = preciosBase.vidrios.find(v => v.nombre === vA && parseFloat(v.espesor) === eA);
      const matchB = preciosBase.vidrios.find(v => v.nombre === vB && parseFloat(v.espesor) === eB);
      const matchSep = preciosBase.separadores.find(s => s.nombre === sepTipo && parseFloat(s.espesor) === sepEspesor && s.color === sepColor);
      const matchTerm = preciosBase.terminaciones.find(t => t.tipo === "Botado Arista x TP" && parseFloat(t.espesor) === eA);

      const precioA = typeof matchA?.precio_m2 === "number" ? matchA.precio_m2 : 0;
      const precioB = typeof matchB?.precio_m2 === "number" ? matchB.precio_m2 : 0;
      const precioSep = typeof matchSep?.precio_ml === "number" ? matchSep.precio_ml : 0;
      const precioTerm = typeof matchTerm?.precio === "number" ? matchTerm.precio : 0;

      precio = ((precioA + precioB) * m2 + precioSep * ml + precioTerm) * cantidad * factorCliente;
      peso = 2.5 * m2 * (eA + eB);
    }

    document.getElementById(`m2-${id}`).innerText = m2.toFixed(2);
    document.getElementById(`ml-${id}`).innerText = ml.toFixed(2);
    document.getElementById(`peso-${id}`).innerText = peso.toFixed(2);
    document.getElementById(`precioLinea-${id}`).innerText = `$ ${Math.round(precio).toLocaleString("es-CL")}`;
  } catch (e) {
    console.error("Error calculando línea", e);
  }
  actualizarTotales();
}

// Recalcular todo al editar
document.addEventListener("input", (e) => {
  const fila = e.target.closest(".fila-producto");
  if (fila) {
    const id = parseInt(fila.id.replace("linea-", ""));
    calcularDatosLinea(id);
  }
});
