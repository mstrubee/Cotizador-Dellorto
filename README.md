# Cotizador Dellorto

Sistema web para generar cotizaciones de vidrios y termopaneles con precios personalizados por cliente.

## 🧩 Estructura

- `login.html`: inicio de sesión
- `index.html`: interfaz del cotizador
- `styles.css`: diseño visual elegante
- `scripts/`: lógica de cotización, carga, almacenamiento
- `data/usuarios.json`: lista de usuarios y factores
- `data/precios-ejemplo.xlsx`: lista de precios base

## 🚀 Uso

1. Abre `login.html` en tu navegador.
2. Accede con un usuario válido (`usuario: cliente1 / contraseña: 1234`).
3. Llena la cotización seleccionando tipo, medidas, y servicios.
4. Revisa el resumen, guarda o imprime.
5. Si eres admin, carga nuevos precios vía Excel usando la clave `6658`.

## 📦 Requisitos

- Navegador moderno (Chrome, Edge, Firefox)
- [SheetJS](https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js) para leer `.xlsx`

## 📄 Licencia

Uso privado interno — desarrollado para Matías Strube.