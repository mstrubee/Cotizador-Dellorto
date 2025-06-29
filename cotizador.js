# Actualización de cotizador.js para integrar:
# - Filtro de terminaciones
# - Control de "A PEDIDO"
# - Numeración dinámica

# Guardamos el nuevo archivo temporalmente
cotizador_final_path = "/mnt/data/cotizador.js"

# Plantilla resumida con todos los elementos integrados
cotizador_consolidado = """\
// Archivo cotizador.js
// Asegura filtros, numeración, y valores "A PEDIDO" marcados

// Lógica para recalcular cada línea y validar
function calcularDatosLinea(id) {
  const fila = document.getElementById(`linea-${id}`);
  if (!fila) return;

  const tipo = document.getElementById(`tipo-${id}`).value;
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value) || 1;
  const alto = parseFloat(document.getElementById(`alto-${id}`).value) || 0;
  const ancho = parseFloat(document.getElementById(`ancho-${id}`).value) || 0;
  const m2 = (alto * ancho) / 1000000;
  const ml = 2 * (alto + ancho) / 1000;
  let precio = 0;
  let peso = 0;
  let hayPedido = false;
  let campoPedido = "";

  if (tipo === "Vidrio") {
    const vidrioTipo = document.getElementById(`vidrioTipo-${id}`).value;
    const espesor = parseFloat(document.getElementById(`espesor-${id}`).value);
    const match = preciosBase.vidrios.find(v => v.nombre === vidrioTipo && parseFloat(v.espesor) === espesor);

    if (!match || isNaN(match.precio_m2)) {
      hayPedido = true;
      campoPedido = `vidrioTipo-${id}`;
    } else {
      precio = match.precio_m2 * m2 * cantidad * factorCliente;
      peso = 2.5 * m2 * espesor;
    }

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
    const matchTerm = preciosBase.terminaciones.find(t => t.nombre === "Botado Arista x TP" && parseFloat(t.espesor) === eA);

    if (!matchA || isNaN(matchA.precio_m2)) { hayPedido = true; campoPedido = `vidrioA-${id}`; }
    if (!matchB || isNaN(matchB.precio_m2)) { hayPedido = true; campoPedido = `vidrioB-${id}`; }
    if (!matchSep || isNaN(matchSep.precio_ml)) { hayPedido = true; campoPedido = `separador-${id}`; }

    if (!hayPedido) {
      const precioA = matchA.precio_m2;
      const precioB = matchB.precio_m2;
      const precioSep = matchSep.precio_ml;
      const precioTerm = matchTerm && !isNaN(matchTerm.precio) ? matchTerm.precio : 0;

      precio = ((precioA + precioB) * m2 + precioSep * ml + precioTerm) * cantidad * factorCliente;
      peso = 2.5 * m2 * (eA + eB);
    }
  }

  document.getElementById(`m2-${id}`).innerText = m2.toFixed(2);
  document.getElementById(`ml-${id}`).innerText = ml.toFixed(2);
  document.getElementById(`peso-${id}`).innerText = peso.toFixed(2);

  const precioElem = document.getElementById(`precioLinea-${id}`);
  if (hayPedido) {
    precioElem.innerText = "A PEDIDO";
    precioElem.style.color = "red";
    document.getElementById(campoPedido).style.border = "2px solid red";
  } else {
    precioElem.innerText = "$ " + Math.round(precio).toLocaleString("es-CL");
    precioElem.style.color = "black";
  }

  actualizarTotales();
}

function actualizarTotales() {
  let total = 0;
  document.querySelectorAll('[id^="precioLinea-"]').forEach(el => {
    if (el.innerText.includes("A PEDIDO")) return;
    const valor = parseInt(el.innerText.replace(/[^0-9]/g, ""));
    if (!isNaN(valor)) total += valor;
  });
  const iva = Math.round(total * 0.19);
  const final = total + iva;
  document.getElementById("resumenCotizacion").innerHTML = `
    <p>Total Neto: <strong>$ ${total.toLocaleString("es-CL")}</strong></p>
    <p>IVA (19%): <strong>$ ${iva.toLocaleString("es-CL")}</strong></p>
    <p>Total Final: <strong>$ ${final.toLocaleString("es-CL")}</strong></p>
  `;
}

function actualizarNumeracion() {
  document.querySelectorAll(".linea-numero").forEach((el, idx) => {
    el.innerText = idx + 1;
  });
}
"""

# Guardar
with open(cotizador_final_path, "w", encoding="utf-8") as f:
    f.write(cotizador_consolidado)

cotizador_final_path
