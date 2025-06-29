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
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const hoja = workbook.SheetNames[0];
    const hojaDatos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja], { header: 1 });

    const resultado = procesarDatos(hojaDatos);
    document.getElementById("resultadoCarga").innerText = JSON.stringify(resultado, null, 2);
  };
  reader.readAsArrayBuffer(file);
}

function procesarDatos(filas) {
  const json = {
    vidrios: [],
    separadores: []
  };

  for (let fila of filas) {
    const nombre = fila[0];
    const espesor = fila[1];
    const valor = fila[2];

    if (!nombre || !espesor || valor === undefined) continue;

    const obj = {
      nombre: nombre.toString().trim(),
      espesor: parseFloat(espesor),
      valor: typeof valor === "number" ? Math.round(valor) : valor.toString().trim()
    };

    if (nombre.toLowerCase().includes("separador")) {
      json.separadores.push(obj);
    } else {
      json.vidrios.push(obj);
    }
  }

  return json;
}
