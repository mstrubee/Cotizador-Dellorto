function exportarPDF() {
  const resumen = document.getElementById("tablaResumen");
  if (!resumen) {
    alert("No hay resumen para exportar. Asegúrate de generar una cotización primero.");
    return;
  }

  try {
    const opt = {
      margin: 0.5,
      filename: `Cotizacion_${localStorage.getItem("usuario") || "anonimo"}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().from(resumen).set(opt).save();
  } catch (error) {
    alert("Error al generar el PDF: " + error.message);
  }
}