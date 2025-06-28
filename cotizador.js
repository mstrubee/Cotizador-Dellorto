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
  const tiposUnicos = [...new Set(preciosBase.vidrios.map(v => v.nombre))];
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
}

// [Funciones de cálculo, resumen, IVA, peso y PDF se agregan en los siguientes módulos]

