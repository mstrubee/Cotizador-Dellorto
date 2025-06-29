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
├── admin.js
├── usuarios.json
├── precios_base.json
├── README.md
└── .gitignore
