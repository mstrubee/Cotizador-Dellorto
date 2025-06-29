// Convertir mm a metros
function mmToM(mm) {
  return mm / 1000;
}

// Calcular m²
function calcularM2(ancho_mm, alto_mm) {
  const ancho_m = mmToM(ancho_mm);
  const alto_m = mmToM(alto_mm);
  return parseFloat((ancho_m * alto_m).toFixed(3));
}

// Calcular metros lineales de perímetro
function calcularML(ancho_mm, alto_mm) {
  const ancho_m = mmToM(ancho_mm);
  const alto_m = mmToM(alto_mm);
  return parseFloat(((2 * ancho_m) + (2 * alto_m)).toFixed(3));
}

// Calcular peso vidrio
function calcularPesoVidrio(m2, espesor) {
  return p
