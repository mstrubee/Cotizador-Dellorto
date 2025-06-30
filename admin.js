function verificarClave() {
  const clave = document.getElementById("adminClave").value;
  console.log("Verificando clave de administrador:", clave);
  if (clave === "6658") {
    console.log("Clave de administrador correcta, mostrando panel");
    document.querySelector(".login-container").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    inicializarPreciosPorDefecto();
  } else {
    console.log("Clave de administrador incorrecta");
    document.getElementById("errorClave").innerText = "Clave de administrador incorrecta";
  }
}

function inicializarPreciosPorDefecto() {
  if (localStorage.getItem("precios")) {
    console.log("Precios ya existen en localStorage, omitiendo inicialización por defecto");
    const precios = JSON.parse(localStorage.getItem("precios"));
    mostrarPreciosEnTabla(precios);
    return;
  }

  const preciosPorDefecto = {
    vidrios: [
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 4, precio_m2: 8165 },
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 5, precio_m2: 9531 },
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 6, precio_m2: 11221 },
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 8, precio_m2: 14867 },
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 10, precio_m2: 17935 },
      { tipo: "Vidrio", nombre: "Incoloro", espesor: 12, precio_m2: 24481 },
      { tipo: "Vidrio", nombre: "Mateluz", espesor: 4, precio_m2: 16623 },
      { tipo: "Vidrio", nombre: "Mateluz", espesor: 5, precio_m2: 24769 },
      { tipo: "Vidrio", nombre: "Mateluz", espesor: 6, precio_m2: 27597 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 4, precio_m2: 15930 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 5, precio_m2: 18845 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 6, precio_m2: 22373 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 8, precio_m2: 29810 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 10, precio_m2: 36608 },
      { tipo: "Vidrio", nombre: "Templado", espesor: 12, precio_m2: 50400 },
      { tipo: "Vidrio", nombre: "Laminado_templado", espesor: 8, precio_m2: 47860 },
      { tipo: "Vidrio", nombre: "Laminado_templado", espesor: 10, precio_m2: 53690 },
      { tipo: "Vidrio", nombre: "Laminado_templado", espesor: 13.52, precio_m2: 64746 },
      { tipo: "Vidrio", nombre: "Laminado_templado", espesor: 17.52, precio_m2: 79620 },
      { tipo: "Vidrio", nombre: "Laminado_templado", espesor: 21.52, precio_m2: 93216 },
      { tipo: "Vidrio", nombre: "LowE Eco", espesor: 4, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "LowE Eco", espesor: 5, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "LowE Eco", espesor: 6, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "LowE Plus", espesor: 4, precio_m2: 25352 },
      { tipo: "Vidrio", nombre: "LowE Plus", espesor: 5, precio_m2: 30366 },
      { tipo: "Vidrio", nombre: "LowE Plus", espesor: 6, precio_m2: 34050 },
      { tipo: "Vidrio", nombre: "Laminado_33_1", espesor: 6, precio_m2: 21170 },
      { tipo: "Vidrio", nombre: "Laminado_44_1", espesor: 8, precio_m2: 26889 },
      { tipo: "Vidrio", nombre: "Laminado_55_1", espesor: 10, precio_m2: 33333 },
      { tipo: "Vidrio", nombre: "Laminado_66_1", espesor: 12, precio_m2: 59778 },
      { tipo: "Vidrio", nombre: "Laminado_33_2", espesor: 6, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "Laminado_44_2", espesor: 8, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "Laminado_55_2", espesor: 10, precio_m2: "A PEDIDO" },
      { tipo: "Vidrio", nombre: "Laminado_66_2", espesor: 12, precio_m2: "A PEDIDO" },
    ],
    separadores: [
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 6, precio_ml: 2182 },
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 8, precio_ml: 2182 },
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 10, precio_ml: 2182 },
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 12, precio_ml: 2182 },
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 13, precio_ml: "n/d" },
      { tipo: "Separador", nombre: "Aluminio (sep.PSF)", espesor: 15, precio_ml: 2250 },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 6, precio_ml: 2545 },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 8, precio_ml: 2545 },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 10, precio_ml: 2545 },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 12, precio_ml: 2545 },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 13, precio_ml: "n/d" },
      { tipo: "Separador", nombre: "Silicona (sep.SEN)", espesor: 15, precio_ml: 3636 },
    ],
    terminaciones: [
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 4, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 5, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 6, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 8, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 10, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco", espesor: 12, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco laminado_33_1", espesor: 6, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco laminado_44_1", espesor: 8, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco laminado_55_1", espesor: 10, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido opaco laminado_66_1", espesor: 12, precio_ml: "n/d" },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 4, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 5, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 6, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 8, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 10, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 12, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 15, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 16, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 17, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 18, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante", espesor: 19, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante laminado_33_1", espesor: 6, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante laminado_44_1", espesor: 8, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante laminado_55_1", espesor: 10, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Pulido brillante laminado_66_1", espesor: 12, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Botado arista", espesor: 4, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Botado arista", espesor: 5, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Botado arista", espesor: 6, precio_ml: 0 },
      { tipo: "Terminación", nombre: "Botado arista", espesor: 8