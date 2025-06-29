
// Fragmento de cotizador.js con validación dinámica por espesor

function actualizarOpcionesDinamicas(id) {
  const tipoProducto = document.getElementById(`tipo-${id}`).value;
  const espesor = parseFloat(document.getElementById(`espesor-${id}`)?.value);
  const terminacionSelect = document.getElementById(`terminacion-${id}`);
  const perforacionSelect = document.getElementById(`perforacion-${id}`);
  const destajadoSelect = document.getElementById(`destajado-${id}`);

  if (!terminacionSelect || !perforacionSelect || !destajadoSelect || isNaN(espesor)) return;

  // Filtrar terminaciones
  terminacionSelect.innerHTML = "";
  if (tipoProducto === "Termopanel") {
    terminacionSelect.innerHTML = "<option>Botado Arista x TP</option>";
  } else {
    if ([4,6,8,10].includes(espesor)) {
      terminacionSelect.innerHTML += "<option>Botado Arista</option>";
    }
    if ([4,5,6].includes(espesor)) {
      terminacionSelect.innerHTML += "<option>Botado Arista x TP</option>";
    }
  }

  // Filtrar perforaciones
  perforacionSelect.innerHTML = "";
  if ([4,5,6,8,10,12,15,16,17,18,19].includes(espesor)) {
    perforacionSelect.innerHTML += "<option>Perforado normal</option>";
  }
  if ([4,5,6,8,10,12].includes(espesor)) {
    perforacionSelect.innerHTML += "<option>Perforado avellanado</option>";
  }

  // Filtrar destajes
  destajadoSelect.innerHTML = "";
  if ([4,5,6,8,10,12].includes(espesor)) {
    destajadoSelect.innerHTML += "<option>Destajado normal</option>";
    destajadoSelect.innerHTML += "<option>Destajado central</option>";
  }
}

// Adjuntar evento a cambios de espesor
document.addEventListener("change", (e) => {
  const fila = e.target.closest(".fila-producto");
  if (!fila) return;
  const id = fila.id.split("-")[1];
  if (e.target.id.includes("espesor") || e.target.id.includes("tipo-")) {
    actualizarOpcionesDinamicas(id);
  }
});
