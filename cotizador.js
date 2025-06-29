
let preciosBase = {};
let factorCliente = 1;
let productosCotizados = [];

// Inicializa la página
window.onload = async () => {
  cargarUsuarioActivo();
  preciosBase = await fetchPrecios();
  factorCliente = cargarFactorCliente();
  document.getElementById("fechaCotizacion").valueAsDate = new Date();
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

function agregarProducto() {
  const id = productosCotizados.length;
  const container = document.createElement("div");
  container.className = "producto";
  container.innerHTML = `
    <h3>Producto ${id + 1}</h3>
    <input type="text" placeholder="Nombre" id="nombre-${id}" />
    <input type="number" placeholder="Cantidad" id="cantidad-${id}" min="1" />
    <select id="tipo-${id}" onchange="actualizarOpciones(${id})">
      <option value="Vidrio">Vidrio</option>
      <option value="Termopanel">Termopanel</option>
    </select>
    <div id="opciones-${id}"></div>
  `;
  document.getElementById("productos").appendChild(container);
  productosCotizados.push({ id });
  actualizarOpciones(id);
}
window.agregarProducto = agregarProducto;

function actualizarOpciones(id) {
  const tipo = document.getElementById(`tipo-${id}`).value;
  const contenedor = document.getElementById(`opciones-${id}`);
  contenedor.innerHTML = "";

  if (tipo === "Vidrio") {
    contenedor.innerHTML = `
      <select id="vidrioTipo-${id}">${generarOpcionesVidrios()}</select>
      <select id="espesor-${id}"></select>
      <input type="number" placeholder="Alto (mm)" id="alto-${id}" />
      <input type="number" placeholder="Ancho (mm)" id="ancho-${id}" />
    `;
    document.getElementById(`vidrioTipo-${id}`).addEventListener("change", () => cargarEspesores(id));
    cargarEspesores(id);
  } else {
    contenedor.innerHTML = `
      <h4>Vidrio A</h4>
      <select id="vidrioA-${id}">${generarOpcionesVidrios()}</select>
      <select id="espesorA-${id}"></select>
      <h4>Vidrio B</h4>
      <select id="vidrioB-${id}">${generarOpcionesVidrios()}</select>
      <select id="espesorB-${id}"></select>
      <label>Separador:</label>
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
      <input type="number" placeholder="Alto (mm)" id="alto-${id}" />
      <input type="number" placeholder="Ancho (mm)" id="ancho-${id}" />
    `;
    document.getElementById(`vidrioA-${id}`).addEventListener("change", () => cargarEspesores(id, "A"));
    document.getElementById(`vidrioB-${id}`).addEventListener("change", () => cargarEspesores(id, "B"));
    cargarEspesores(id, "A");
    cargarEspesores(id, "B");
  }
}

function generarOpcionesVidrios() {
  const permitidos = [
    "Incoloro", "Bronce", "Mateluz", "Semilla", "Templado",
    "Laminado_33_1", "Laminado_44_1", "Laminado_55_1", "Laminado_66_1",
    "Laminado_33_2", "Laminado_44_2", "Laminado_55_2", "Laminado_66_2",
    "Laminado_templado", "LowE Eco", "LowE Super"
  ];

  const tiposUnicos = [
    ...new Set(preciosBase.vidrios.map(v => v.nombre))
  ].filter(v => permitidos.includes(v));

  return tiposUnicos.map(v => `<option value="${v}">${v}</option>`).join("");
}

function cargarEspesores(id, parte = "") {
  const selectId = parte ? `vidrio${parte}-${id}` : `vidrioTipo-${id}`;
  const tipo = document.getElementById(selectId).value;
  const espesores = preciosBase.vidrios
    .filter(v => v.nombre === tipo)
    .map(v => v.espesor);
  const target = document.getElementById(`espesor${parte}-${id}`);
  target.innerHTML = espesores.map(e => `<option>${e}</option>`).join("");

  if (!parte) {
    target.addEventListener("change", () => {
      const nuevoEspesor = parseFloat(target.value);
      const contenedor = document.getElementById(`opciones-${id}`);
      const viejo = contenedor.querySelector(".terminaciones");
      if (viejo) viejo.remove();
      agregarOpcionesEspeciales(id, nuevoEspesor);
    });
    const espInicial = parseFloat(target.value);
    if (!isNaN(espInicial)) agregarOpcionesEspeciales(id, espInicial);
  }
}

function agregarOpcionesEspeciales(id, espesor) {
  const contenedor = document.getElementById(`opciones-${id}`);
  const terminacionesHTML = [];

  if ([4, 6, 8, 10].includes(espesor)) {
    terminacionesHTML.push(`<label><input type="checkbox" id="botado-${id}"/> Botado Arista</label>`);
  }
  if ([4, 5, 6].includes(espesor)) {
    terminacionesHTML.push(`<label><input type="checkbox" id="botadoTP-${id}"/> Botado Arista x TP</label>`);
  }
  if (espesor >= 4 && espesor <= 19) {
    terminacionesHTML.push(`<label><input type="checkbox" id="perforado-${id}"/> Perforado normal</label>`);
  }
  if (espesor >= 4 && espesor <= 12) {
    terminacionesHTML.push(`<label><input type="checkbox" id="avellanado-${id}"/> Perforado avellanado</label>`);
    terminacionesHTML.push(`<label><input type="checkbox" id="destajado-${id}"/> Destajado normal</label>`);
    terminacionesHTML.push(`<label><input type="checkbox" id="destajadoC-${id}"/> Destajado central</label>`);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "terminaciones";
  wrapper.innerHTML = `<h4>Terminaciones y Cortes</h4>` + terminacionesHTML.join("<br/>");

  contenedor.appendChild(wrapper);
}
