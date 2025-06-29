# Cotizador GPT

Sistema web para cotizar productos de vidrio y termopaneles con factor personalizado por cliente. Diseñado para ser usado directamente desde navegador, sin backend, con estética minimalista tipo Apple.

## 🔐 Accesos

- Cliente: credenciales entregadas por el administrador
- Admin: acceso mediante contraseña `6658`

## 🧠 Funcionalidades

- Login seguro con factor de precio personalizado
- Cálculo de m², metros lineales, peso y precio por ítem
- Tipos de vidrio, espesores, terminaciones y perforaciones
- Termopaneles con doble vidrio + separadores configurables
- Exportación directa a PDF
- Guardado automático en LocalStorage
- Admin Panel para cargar nuevo Excel de precios
- Visual limpio, botones suaves y UI responsiva

## 📁 Estructura del Proyecto

```plaintext
.
├── index.html
├── login.html
├── admin.html
├── styles.css
├── auth.js
├── cotizador.js
├── dataLoader.js
├── pdfExporter.js
├── storage.js
├── utils.js
├── userManager.js
├── admin.js
├── usuarios.json
├── precios_base.json
├── README.md
└── .gitignore
```

## 🚀 Cómo ejecutar

1. Clona el repositorio.
2. Abre `index.html` en un navegador o usa un servidor local (como `Live Server` en VS Code).
3. Usa las credenciales de `usuarios.json` para iniciar sesión.
4. Para el panel de admin, usa el usuario `LTAM` con la clave `6658`.

## 📦 Dependencias externas

- [html2pdf.js](https://cdnjs.com/libraries/html2pdf.js) (para exportar PDFs)
- [SheetJS](https://cdnjs.com/libraries/xlsx) (para cargar Excel en admin)

## 🛠️ Notas de desarrollo

- Los precios se cargan desde `precios_base.json` o `localStorage`.
- Los usuarios se gestionan en `localStorage` (`usuarios-local`) y se sincronizan con `usuarios.json`.
- Los cálculos de termopaneles asumen doble vidrio + separador.