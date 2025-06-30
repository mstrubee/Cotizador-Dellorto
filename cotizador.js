let itemCount = 0;

function agregarItem() {
  try {
    const tbody = document.getElementById("listaProductos");
    if (!tbody) throw new Error("Elemento #listaProductos no encontrado");
    
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
    actualizarLog("Ítem añadido, ID: " + itemCount);
    console.log("Ítem añadido, ID:", itemCount);
  } catch (e) {
    console.error("Error al agregar ítem:", e);
    document.getElementById("errorMensaje").innerText = "Error al cargar la aplicación. Contacta al administrador.";
  }
}

function eliminarItem(button) {
  try {
    const row = button.parentElement.parentElement;
    row.remove();
    console.log("Ítem eliminado");
    actualizarLog("Ítem eliminado");
  } catch (e) {
    console.error("Error al eliminar ítem:", e);
  }
}

function cargarSecciones() {
  try {
    const logMensaje = document.getElementById("logMensaje");
    logMensaje.innerText = "Intentando cargar secciones...";
    console.log("Intentando cargar secciones...");

    const tbody = document.getElementById("listaProductos");
    if (!tbody) throw new Error("Elemento #listaProductos no encontrado");

    const precios = JSON.parse(localStorage.getItem("precios") || "{}");
    if (!precios || !precios.vidrios || precios.vidrios.length === 0) {
      logMensaje.innerText = "No hay precios en localStorage.";
      console.log("No hay precios en localStorage.");
      return;
    }

    tbody.innerHTML = ""; // Limpiar tabla antes de cargar
    precios.vidrios.forEach(item => {
      itemCount++;
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" class="tipo" value="${item.tipo}"></td>
        <td><input type="text" class="nombre" value="${item.nombre}"></td>
        <td><input type="number" class="espesor" value="${item.espesor}"></td>
        <td><input type="number" class="precio" value="${item.precio_m2 || item.precio}"></td>
        <td><button onclick="eliminarItem(this)">Eliminar</button></td>
      `;
      tbody.appendChild(newRow);
      actualizarLog("Ítem cargado, ID: " + itemCount);
      console.log("Ítem cargado, ID:", itemCount);
    });
  } catch (e) {
    console.error("Error al cargar secciones:", e);
    document.getElementById("errorMensaje").innerText = "Error al cargar la aplicación. Contacta al administrador.";
  }
}

function actualizarLog(mensaje) {
  const logMensaje = document.getElementById("logMensaje");
  if (logMensaje) {
    logMensaje.innerText = mensaje;
  }
}

// Inicialización automática
document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("DOM cargado, inicializando...");
    actualizarLog("DOM cargado, inicializando...");
    cargarSecciones(); // Intentar cargar secciones automáticamente
  } catch (e) {
    console.error("Error en inicialización:", e);
    document.getElementById("errorMensaje").innerText = "Error al cargar la aplicación. Contacta al administrador.";
  }
});

window.agregarItem = agregarItem;
window.eliminarItem = eliminarItem;
window.cargarSecciones = cargarSecciones;