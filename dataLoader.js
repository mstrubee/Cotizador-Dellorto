// Cargar archivo de precios y devolver como objeto procesado
async function fetchPrecios() {
  try {
    const res = await fetch("precios_base.json");
    const rawData = await res.json();

    const vidrios = rawData.vidrios.map(item => {
      return {
        nombre: item.nombre.trim(),
        espesor: parseFloat(item.espesor),
        valor: parsearValor(item.valor)
      };
    });

    const separadores = rawData.separadores.map(item => {
      return {
        nombre: item.nombre.trim(),
        espesor: parseFloat(item.espesor),
        valor: parsearValor(item.valor)
      };
    });

    return {
      vidrios,
      separadores
    };

  } catch (err) {
    console.error("Error al cargar precios:", err);
    return {
      vidrios: [],
      separadores: []
    };
  }
}

// Convierte valores numéricos o deja "n/d", "A PEDIDO"
function parsearValor(valor) {
  if (typeof valor === "string") {
    const v = valor.trim().toUpperCase();
    if (v === "N/D" || v === "A PEDIDO") return v;
  }
  const num = parseFloat(valor);
  return isNaN(num) ? "n/d" : Math.round(num);
}
