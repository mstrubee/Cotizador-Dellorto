let listaUsuarios = [];

// Cargar usuarios desde localStorage o desde el archivo original
document.addEventListener("DOMContentLoaded", async () => {
  const guardados = localStorage.getItem("usuarios_admin");
  if (guardados) {
    listaUsuarios = JSON.parse(guardados);
    renderUsuarios();
  } else {
    try {
      const res = await fetch("usuarios.json");
      listaUsuarios = await res.json();
      guardarUsuarios();
      renderUsuarios();
    } catch (e) {
      alert("No se pudo cargar usuarios.json");
    }
  }
});

function renderUsuarios() {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = "";
  listaUsuarios.forEach((u, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.usuario}</td>
      <td>${u.clave}</td>
      <td>${u.factor}</td>
      <td><button onclick="eliminarUsuario(${index})">Eliminar</button></td>
    `;
    tbody.appendChild(row);
  });
}

function agregarUsuario() {
  const usuario = document.getElementById("nuevoUsuario").value.trim();
  const clave = document.getElementById("nuevaClave").value.trim();
  const factor = parseFloat(document.getElementById("nuevoFactor").value);

  if (!usuario || !clave || isNaN(factor)) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  if (listaUsuarios.find(u => u.usuario === usuario)) {
    alert("El usuario ya existe.");
    return;
  }

  listaUsuarios.push({ usuario, clave, factor });
  guardarUsuarios();
  renderUsuarios();

  document.getElementById("nuevoUsuario").value = "";
  document.getElementById("nuevaClave").value = "";
  document.getElementById("nuevoFactor").value = "";
}

function eliminarUsuario(index) {
  if (confirm("¿Eliminar este usuario?")) {
    listaUsuarios.splice(index, 1);
    guardarUsuarios();
    renderUsuarios();
  }
}

function guardarUsuarios() {
  localStorage.setItem("usuarios_admin", JSON.stringify(listaUsuarios));
}
