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
       } catch (e) {
         console.error("Error al eliminar ítem:", e);
       }
     }

     // Inicialización segura
     document.addEventListener("DOMContentLoaded", () => {
       try {
         console.log("DOM cargado, inicializando...");
       } catch (e) {
         console.error("Error en inicialización:", e);
       }
     });

     window.agregarItem = agregarItem;
     window.eliminarItem = eliminarItem;