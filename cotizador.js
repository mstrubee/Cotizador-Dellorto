let itemCount = 0;

function agregarItem() {
  const tbody = document.getElementById("listaProductos");
  if (!tbody) {
    console.error("Elemento #listaProductos no encontrado");
    return;
  }

  itemCount++;
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" class="tipo" value="Vidrio"></td>
    <td><input type="text" class="nombre" value="Incoloro"></td>
    <td><input type="number" class="espesor" value="4"></td>
    <td><input type="number" class="precio" value="8165"></td>
    <td><button onclick="eliminarItem(this)">Eliminar</button></td>
  `;
  tbody.appendChild(newRow);
  console.log("Ítem añadido, ID:", itemCount);
}

function eliminarItem(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  console.log("Ítem eliminado");
}

// Cargar precios iniciales (si aplica)
document.addEventListener("DOMContentLoaded", () => {
  const precios = JSON.parse(localStorage.getItem("precios") || "{}");
  if (precios.vidrios) {
    precios.vidrios.forEach(item => agregarItem(item));
  }
});

window.agregarItem = agregarItem;
window.eliminarItem = eliminarItem;