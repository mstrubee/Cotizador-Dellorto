
let preciosBase = {};
let factorCliente = 1;
let productosCotizados = [];

// Inicializa la página
window.onload = async () => {
  cargarUsuarioActivo();
  preciosBase = await fetchPrecios();
  factorCliente = cargarFactorCliente();
  document.getElementById("fechaCotizacion").valueAsDate = new Date();

  // Vincular botones duplicar y eliminar
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
  const container = document.createElement("div");
  container.className = "producto fila-producto";
  container.id = `linea-${id}`;

  container.innerHTML = `
    <input type="checkbox" class="check-linea" />
    <label class="linea-num">${id + 1}</label>
    <input type="text" placeholder="Nombre" id="nombre-${id}" value="${baseData?.nombre || ''}" />
    <input type="number" placeholder="Cantidad" id="cantidad-${id}" min="1" value="${baseData?.cantidad || 1}" />
    <select id="tipo-${id}" onchange="actualizarOpciones(${id})">
      <option value="Vidrio" ${baseData?.tipo === "Vidrio" ? 'selected' : ''}>Vidrio</option>
      <option value="Termopanel" ${baseData?.tipo === "Termopanel" ? 'selected' : ''}>Termopanel</option>
    </select>
    <div id="opciones-${id}" class="subcampos"></div>
    <div id="precioLinea-${id}" class="precio-linea">$ 0</div>
  `;

  document.getElementById("productos").appendChild(container);
  productosCotizados.push({ id });
  actualizarOpciones(id, baseData);
}
window.agregarProducto = agregarProducto;

function actualizarOpciones(id, baseData = null) {
  const tipo = document.getElementById(`tipo-${id}`).value;
  const contenedor = document.getElementById(`opciones-${id}`);
  contenedor.innerHTML = "";

  if (tipo === "Vidrio") {
    contenedor.innerHTML = `
      <select id="vidrioTipo-${id}" onchange="cargarEspesores(${id})">${generarOpcionesVidrios(baseData?.vidrioTipo)}</select>
      <select id="espesor-${id}"></select>
      <input type="number" placeholder="Alto (mm)" id="alto-${id}" value="${baseData?.alto || ''}" />
      <input type="number" placeholder="Ancho (mm)" id="ancho-${id}" value="${baseData?.ancho || ''}" />
      <select id="terminacion-${id}"></select>
      <select id="perforacion-${id}"></select>
      <input type="number" placeholder="N° perf" id="numPerforaciones-${id}" min="0" value="${baseData?.numPerforaciones || 0}" />
      <select id="destajado-${id}"></select>
      <input type="number" placeholder="N° dest" id="numDestajes-${id}" min="0" value="${baseData?.numDestajes || 0}" />
    `;
    cargarEspesores(id, null, baseData?.espesor);
  } else {
    contenedor.innerHTML = `
      <select id="vidrioA-${id}" onchange="cargarEspesores(${id}, 'A')">${generarOpcionesVidrios(baseData?.vidrioA)}</select>
      <select id="espesorA-${id}"></select>
      <select id="vidrioB-${id}" onchange="cargarEspesores(${id}, 'B')">${generarOpcionesVidrios(baseData?.vidrioB)}</select>
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
      <input type="number" placeholder="Alto (mm)" id="alto-${id}" value="${baseData?.alto || ''}" />
      <input type="number" placeholder="Ancho (mm)" id="ancho-${id}" value="${baseData?.ancho || ''}" />
    `;
    cargarEspesores(id, 'A', baseData?.espesorA);
    cargarEspesores(id, 'B', baseData?.espesorB);
  }
}

function generarOpcionesVidrios(seleccionado = "") {
  const permitidos = [
    "Incoloro", "Bronce", "Mateluz", "Semilla", "Templado",
    "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
    "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2",
    "Laminado_templado", "LowE Eco", "LowE Super"
  ];

  const tiposUnicos = [
    ...new Set(preciosBase.vidrios.map(v => v.nombre))
  ].filter(v => permitidos.includes(v));

  return tiposUnicos.map(v => 
    `<option value="${v}" ${v === seleccionado ? 'selected' : ''}>${v}</option>`
  ).join("");
}

function cargarEspesores(id, parte = "", espesorSeleccionado = null) {
  const selectId = parte ? `vidrio${parte}-${id}` : `vidrioTipo-${id}`;
  const tipo = document.getElementById(selectId).value;
  const espesores = preciosBase.vidrios
    .filter(v => v.nombre === tipo)
    .map(v => v.espesor);
  const target = document.getElementById(`espesor${parte}-${id}`);
  target.innerHTML = espesores.map(e => 
    `<option ${e === espesorSeleccionado ? 'selected' : ''}>${e}</option>`
  ).join("");

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

  if ([4, 6, 8, 10].includes(espesor)) {
    terminacion.innerHTML += `<option value="Botado Arista">Botado Arista</option>`;
  }
  if ([4, 5, 6].includes(espesor)) {
    terminacion.innerHTML += `<option value="Botado Arista x TP">Botado Arista x TP</option>`;
  }
  if (espesor >= 4 && espesor <= 19) {
    perforacion.innerHTML += `<option value="Perforado normal">Perforado normal</option>`;
  }
  if (espesor >= 4 && espesor <= 12) {
    perforacion.innerHTML += `<option value="Perforado avellanado">Perforado avellanado</option>`;
    destajado.innerHTML += `<option value="Destajado normal">Destajado normal</option>`;
    destajado.innerHTML += `<option value="Destajado central">Destajado central</option>`;
  }
}

// Duplicar línea seleccionada
function duplicarSeleccion() {
  const seleccionados = document.querySelectorAll(".check-linea:checked");
  if (seleccionados.length !== 1) {
    alert("Selecciona una sola línea para duplicar.");
    return;
  }
  const id = seleccionados[0].closest(".producto").id.replace("linea-", "");
  const copia = document.getElementById(`linea-${id}`);
  const inputs = copia.querySelectorAll("input, select");
  const datos = {};
  inputs.forEach(el => {
    const campo = el.id.split("-")[0];
    datos[campo] = el.value;
  });
  agregarProducto(datos);
}

// Eliminar líneas seleccionadas
function eliminarSeleccion() {
  const seleccionados = document.querySelectorAll(".check-linea:checked");
  seleccionados.forEach(check => {
    const div = check.closest(".producto");
    div.remove();
  });
}
