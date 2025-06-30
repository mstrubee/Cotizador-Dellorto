function verificarClave() {
  const clave = document.getElementById("adminClave").value;
  if (clave === "6658") {
    document.querySelector(".login-container").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    document.getElementById("errorClave").innerText = "Clave incorrecta";
  }
}

function cargarExcel() {
  const fileInput = document.getElementById("archivoExcel");
  const file = fileInput.files[0];
  if (!file) {
    alert("Selecciona un archivo Excel.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const hoja = workbook.SheetNames[0];
      const hojaDatos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja], { header: 1 });

      const resultado = procesarDatos(hojaDatos);
      localStorage.setItem("precios", JSON.stringify(resultado));
      mostrarPreciosEnTabla(resultado);
      alert("Precios cargados exitosamente.");
    } catch (e) {
      alert("Error al procesar el archivo Excel: " + e.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function procesarDatos(filas) {
  const json = {
    vidrios: [],
    separadores: [],
    terminaciones: [],
    perforaciones: [],
    destajados: [],
    servicios: {
      instalacion: { precio: 5000 },
      transporte: { precio: 3000 }
    }
  };

  for (let fila of filas) {
    const nombre = fila[0];
    const espesor = fila[1];
    const valor = fila[2];

    if (!nombre || !espesor || valor === undefined) continue;

    const obj = {
      nombre: nombre.toString().trim(),
      espesor: parseFloat(espesor),
      precio: typeof valor === "number" ? Math.round(valor) : valor.toString().trim()
    };

    if (nombre.toLowerCase().includes("separador")) {
      json.separadores.push({ ...obj, tipo: "Separador", precio_ml: obj.precio });
    } else if (nombre.toLowerCase().includes("terminacion") || nombre.toLowerCase().includes("botado")) {
      json.terminaciones.push({ ...obj, tipo: "Terminacion", precio_ml: obj.precio });
    } else if (nombre.toLowerCase().includes("perforado")) {
      json.perforaciones.push({ ...obj, tipo: "Perforacion", precio: obj.precio });
    } else if (nombre.toLowerCase().includes("destajado")) {
      json.destajados.push({ ...obj, tipo: "Destajado", precio: obj.precio });
    } else {
      json.vidrios.push({ ...obj, tipo: "Vidrio", precio_m2: obj.precio });
    }
  }

  return json;
}

function mostrarPreciosEnTabla(precios) {
  const tbody = document.querySelector("#tablaPrecios tbody");
  tbody.innerHTML = "";

  const categorias = [
    { nombre: "Vidrios", datos: precios.vidrios, precioKey: "precio_m2" },
    { nombre: "Separadores", datos: precios.separadores, precioKey: "precio_ml" },
    { nombre: "Terminaciones", datos: precios.terminaciones, precioKey: "precio_ml" },
    { nombre: "Perforaciones", datos: precios.perforaciones, precioKey: "precio" },
    { nombre: "Destajados", datos: precios.destajados, precioKey: "precio" },
    { nombre: "Servicios", datos: [
      { nombre: "Instalación", precio: precios.servicios.instalacion.precio, tipo: "Servicio" },
      { nombre: "Transporte", precio: precios.servicios.transporte.precio, tipo: "Servicio" }
    ], precioKey: "precio" }
  ];

  categorias.forEach(categoria => {
    categoria.datos.forEach(item => {
      const row = document.createElement("tr");
      const precioValue = item[categoria.precioKey] || item.precio;
      row.innerHTML = `
        <td>${categoria.nombre}</td>
        <td>${item.nombre}</td>
        <td>${item.espesor || "N/A"}</td>
        <td contenteditable="true" class="precio-editable" data-categoria="${categoria.nombre.toLowerCase()}" data-nombre="${item.nombre}" data-espesor="${item.espesor || 'N/A'}">${precioValue}</td>
      `;
      tbody.appendChild(row);
    });
  });

  // Agregar eventos para guardar cambios en precios
  document.querySelectorAll(".precio-editable").forEach(cell => {
    cell.addEventListener("blur", guardarPreciosModificados);
  });
}

function guardarPreciosModificados(event) {
  const cell = event.target;
  const categoria = cell.dataset.categoria;
  const nombre = cell.dataset.nombre;
  const espesor = cell.dataset.espesor === "N/A" ? null : parseFloat(cell.dataset.espesor);
  const nuevoPrecio = cell.innerText.trim();

  let precios = JSON.parse(localStorage.getItem("precios") || "{}");

  if (categoria === "servicios") {
    if (nombre === "Instalación") {
      precios.servicios.instalacion.precio = nuevoPrecio === "A PEDIDO" || nuevoPrecio === "n/d" ? nuevoPrecio : parseFloat(nuevoPrecio) || 0;
    } else if (nombre === "Transporte") {
      precios.servicios.transporte.precio = nuevoPrecio === "A PEDIDO" || nuevoPrecio === "n/d" ? nuevoPrecio : parseFloat(nuevoPrecio) || 0;
    }
  } else {
    const key = categoria === "vidrios" ? "precio_m2" : categoria === "separadores" || categoria === "terminaciones" ? "precio_ml" : "precio";
    const array = precios[categoria] || [];
    const item = array.find(i => i.nombre === nombre && (espesor === null || i.espesor === espesor));
    if (item) {
      item[key] = nuevoPrecio === "A PEDIDO" || nuevoPrecio === "n/d" ? nuevoPrecio : parseFloat(nuevoPrecio) || 0;
    }
  }

  localStorage.setItem("precios", JSON.stringify(precios));
  alert("Precio actualizado correctamente.");
}

function exportarPreciosExcel() {
  const precios = JSON.parse(localStorage.getItem("precios") || "{}");
  const ws_data = [["Tipo", "Nombre", "Espesor", "Precio"]];

  const categorias = [
    { nombre: "Vidrios", datos: precios.vidrios, precioKey: "precio_m2" },
    { nombre: "Separadores", datos: precios.separadores, precioKey: "precio_ml" },
    { nombre: "Terminaciones", datos: precios.terminaciones, precioKey: "precio_ml" },
    { nombre: "Perforaciones", datos: precios.perforaciones, precioKey: "precio" },
    { nombre: "Destajados", datos: precios.destajados, precioKey: "precio" },
    { nombre: "Servicios", datos: [
      { nombre: "Instalación", precio: precios.servicios.instalacion.precio, tipo: "Servicio" },
      { nombre: "Transporte", precio: precios.servicios.transporte.precio, tipo: "Servicio" }
    ], precioKey: "precio" }
  ];

  categorias.forEach(categoria => {
    categoria.datos.forEach(item => {
      ws_data.push([categoria.nombre, item.nombre, item.espesor || "N/A", item[categoria.precioKey] || item.precio]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Precios");
  XLSX.writeFile(wb, `Precios_Cotizador_${Date.now()}.xlsx`);
}

window.verificarClave = verificarClave;
window.cargarExcel = cargarExcel;
window.exportarPreciosExcel = exportarPre iciosExcel;