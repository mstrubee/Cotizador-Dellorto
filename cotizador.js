

function cargarOpcionesVidrio(idLinea) {
  const vidrioSelect = document.getElementById(`vidrio-${idLinea}`);
  vidrioSelect.innerHTML = `<option value="">Seleccione</option>`;
  const tipos = ['Incoloro', 'Mateluz', 'Templado', 'Laminado_33_1', 'Laminado_44_1', 'Laminado_55_1', 'Laminado_66_1', 'Laminado_33_2', 'Laminado_44_2', 'Laminado_55_2', 'Laminado_66_2', 'Laminado_templado', 'Low E Eco', 'Low E Super'];
  tipos.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.text = tipo;
    vidrioSelect.appendChild(option);
  });
  vidrioSelect.addEventListener("change", () => actualizarEspesores(idLinea));
}

function actualizarEspesores(idLinea) {
  const vidrio = document.getElementById(`vidrio-${idLinea}`)?.value;
  const espesorSelect = document.getElementById(`espesor-${idLinea}`);
  espesorSelect.innerHTML = "";

  if (!vidrio || !{'Incoloro': [4, 5, 6, 8, 10, 12], 'Mateluz': [4, 5, 6], 'Templado': [4, 5, 6, 8, 10, 12], 'Laminado_templado': [8, 10, 13.52, 17.52, 21.52], 'Low E Eco': [4, 5, 6], 'Low E Super': [4, 5, 6], 'Laminado_33_1': [6, 8, 10, 12], 'Laminado_33_2': [6, 8, 10, 12], 'Laminado_44_1': [6, 8, 10, 12], 'Laminado_44_2': [6, 8, 10, 12], 'Laminado_55_1': [6, 8, 10, 12], 'Laminado_55_2': [6, 8, 10, 12], 'Laminado_66_1': [6, 8, 10, 12], 'Laminado_66_2': [6, 8, 10, 12]}.hasOwnProperty(vidrio)) return;

  const espesores = {'Incoloro': [4, 5, 6, 8, 10, 12], 'Mateluz': [4, 5, 6], 'Templado': [4, 5, 6, 8, 10, 12], 'Laminado_templado': [8, 10, 13.52, 17.52, 21.52], 'Low E Eco': [4, 5, 6], 'Low E Super': [4, 5, 6], 'Laminado_33_1': [6, 8, 10, 12], 'Laminado_33_2': [6, 8, 10, 12], 'Laminado_44_1': [6, 8, 10, 12], 'Laminado_44_2': [6, 8, 10, 12], 'Laminado_55_1': [6, 8, 10, 12], 'Laminado_55_2': [6, 8, 10, 12], 'Laminado_66_1': [6, 8, 10, 12], 'Laminado_66_2': [6, 8, 10, 12]}[vidrio];
  espesores.forEach(e => {
    const option = document.createElement("option");
    option.value = e;
    option.text = `${e} mm`;
    espesorSelect.appendChild(option);
  });
}
