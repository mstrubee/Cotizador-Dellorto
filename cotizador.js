
let preciosBase = {};
let factorCliente = 1;
let productosCotizados = [];

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
      <select id="vidrioTipo-${id}">${vidrioOptions}</select>
      <select id="espesor-${id}"></select>
      <input type="number" id="alto-${id}" placeholder="Alto (mm)" value="${baseData?.alto || ''}" />
      <input type="number" id="ancho-${id}" placeholder="Ancho (mm)" value="${baseData?.ancho || ''}" />
      <select id="terminacion-${id}"></select>
      <select id="perforacion-${id}"></select>
      <input type="number" id="numPerforaciones-${id}" placeholder="N° perf" min="0" value="${baseData?.numPerforaciones || 0}" />
      <select id="destajado-${id}"></select>
      <input type="number" id="numDestajes-${id}" placeholder="N° dest" min="0" value="${baseData?.numDestajes || 0}" />
    `;

    const tipoVidrio = baseData?.vidrioTipo || document.getElementById(`vidrioTipo-${id}`).value;
    document.getElementById(`vidrioTipo-${id}`).value = tipoVidrio;
    cargarEspesores(id, null, baseData?.espesor);
  } else {
    contenedor.innerHTML = `
      <select id="vidrioA-${id}">${vidrioOptions}</select>
      <select id="espesorA-${id}"></select>
      <select id="vidrioB-${id}">${vidrioOptions}</select>
      <select id="espesorB-${id}"></select>
      <select id="separador-${id}">
        <option value="Separador polisulfuro">Aluminio (sep.PSF)</option>
        <option value="Separador silicona">Silicona (sep.SEN)</option>
      </select>
      <select id="espesorSep-${id}">
        <option>6</option><option>8</option><option>10</option><option>12</option>
        <option>15</option><option>19</option><option>20</option>
      </select>
      <select id="colorSep-${id}">
        <option>Negro</option><option>Plata Mate</option><option>Bronce</option>
      </select>
      <input type="number" id="alto-${id}" placeholder="Alto (mm)" value="${baseData?.alto || ''}" />
      <input type="number" id="ancho-${id}" placeholder="Ancho (mm)" value="${baseData?.ancho || ''}" />
    `;

    document.getElementById(`vidrioA-${id}`).value = baseData?.vidrioA || "Incoloro";
    document.getElementById(`vidrioB-${id}`).value = baseData?.vidrioB || "Incoloro";
    cargarEspesores(id, 'A', baseData?.espesorA);
    cargarEspesores(id, 'B', baseData?.espesorB);
  }
}

function generarOpcionesVidrios() {
  const permitidos = [
    "Incoloro", "Bronce", "Mateluz", "Semilla", "Templado",
    "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
    "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2",
    "Laminado_templado", "LowE Eco", "LowE Super"
  ];
  const tiposUnicos = [...new Set(preciosBase.vidrios.map(v => v.nombre))];
  return tiposUnicos
    .filter(v => permitidos.includes(v))
    .map(v => `<option value="${v}">${v}</option>`)
    .join("");
}

function cargarEspesores(id, parte = null, selected = null) {
  const tipo = parte
    ? document.getElementById(`vidrio${parte}-${id}`).value
    : document.getElementById(`vidrioTipo-${id}`).value;

  const espesores = preciosBase.vidrios
    .filter(v => v.nombre === tipo)
    .map(v => v.espesor);

  const targetId = parte ? `espesor${parte}-${id}` : `espesor-${id}`;
  const target = document.getElementById(targetId);

  target.innerHTML = espesores
    .map(e => `<option ${e === selected ? 'selected' : ''}>${e}</option>`)
    .join("");

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

  if ([4, 6, 8, 10].includes(espesor))
    terminacion.innerHTML += `<option value="Botado Arista">Botado Arista</option>`;
  if ([4, 5, 6].includes(espesor))
    terminacion.innerHTML += `<option value="Botado Arista x TP">Botado Arista x TP</option>`;
  if (espesor >= 4 && espesor <= 19)
    perforacion.innerHTML += `<option value="Perforado normal">Perforado normal</option>`;
  if (espesor >= 4 && espesor <= 12) {
    perforacion.innerHTML += `<option value="Perforado avellanado">Perforado avellanado</option>`;
    destajado.innerHTML += `<option value="Destajado normal">Destajado normal</option>`;
    destajado.innerHTML += `<option value="Destajado central">Destajado central</option>`;
  }
}

function duplicarSeleccion() {
  const seleccionado = document.querySelector(".check-linea:checked");
  if (!seleccionado) {
    alert("Seleccione una línea para duplicar.");
    return;
  }

  const id = seleccionado.closest(".fila-producto").id.replace("linea-", "");
  const baseData = {};
  const inputs = document.querySelectorAll(`#linea-${id} input, #linea-${id} select`);
  inputs.forEach(el => {
    const campo = el.id.split("-")[0];
    baseData[campo] = el.value;
  });

  agregarProducto(baseData);
}

function eliminarSeleccion() {
  const seleccionados = document.querySelectorAll(".check-linea:checked");
  seleccionados.forEach(check => check.closest(".fila-producto").remove());
}
