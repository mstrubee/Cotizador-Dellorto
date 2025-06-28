// Convierte milímetros a metros cuadrados
function calcularM2(ancho, alto) {
  return (ancho * alto) / 1_000_000;
}

// Convierte milímetros a metros lineales de perímetro
function calcularML(ancho, alto) {
  return 2 * (ancho + alto) / 1000;
}

// Calcula el peso para un vidrio
function calcularPesoVidrio(m2, espesor) {
  return 2.5 * m2 * espesor;
}

// Calcula el peso para un termopanel
function calcularPesoTermopanel(m2, data) {
  const eA = parseFloat(data.espesorA) || 0;
  const eB = parseFloat(data.espesorB) || 0;
  return 2.5 * m2 * (eA + eB);
}

// Formatea número como "$ 5.000"
function formatNumber(numero) {
  return numero.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}