// ⚠️ Este archivo requiere SheetJS (xlsx.full.min.js) para leer archivos .xlsx

function cargarNuevoListado() {
  const fileInput = document.getElementById("archivoExcel");
  const file = fileInput.files[0];
  if (!file) return alert("Selecciona un archivo primero.");

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const valores = XLSX.utils.sheet_to_json(hoja, { header: 1 });

    localStorage.setItem("preciosExcel", JSON.stringify(valores));
    document.getElementById("adminStatus").textContent = "📦 Archivo cargado correctamente.";
  };
  reader.readAsArrayBuffer(file);
}

function validarAdmin() {
  const clave = document.getElementById("adminClave").value.trim();
  if (clave === "6658") {
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Clave incorrecta.");
  }
}