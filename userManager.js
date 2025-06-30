document.addEventListener("DOMContentLoaded", async () => {
  const formNuevo = document.getElementById("formNuevoUsuario");
  const formModificar = document.getElementById("formModificarUsuario");
  const tbody = document.querySelector("#tablaUsuarios tbody");
  const selectModificar = document.getElementById("usuarioModificar");
  let listaUsuarios = JSON.parse(localStorage.getItem("usuarios-local") || "[]");

  if (!listaUsuarios.length) {
    try {
      const res = await fetch("usuarios.json");
      listaUsuarios = await res.json();
      localStorage.setItem("usuarios-local", JSON.stringify(listaUsuarios));
    } catch (e) {
      console.error("No se pudo cargar usuarios.json:", e);
    }
  }

  function renderUsuarios() {
    tbody.innerHTML = "";
    selectModificar.innerHTML = '<option value="">Selecciona un usuario</option>';
    listaUsuarios.forEach((u, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.usuario}</td>
        <td>${u.clave}</td>
        <td>${u.factor}</td>
        <td>${u.usuario === "LTAM" ? "Sí" : "No"}</td>
        <td><button onclick="eliminarUsuario(${index})">Eliminar</button></td>
      `;
      tbody.appendChild(row);

      const option = document.createElement("option");
      option.value = u.usuario;
      option.text = u.usuario;
      selectModificar.appendChild(option);
    });
  }

  if (formNuevo) {
    formNuevo.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formNuevo));
      const usuario = data.nuevoUsuario.trim();
      const clave = data.nuevaClave.trim();
      const factor = parseFloat(data.nuevoFactor);

      if (!usuario || !clave || isNaN(factor)) {
        document.getElementById("estadoNuevoUsuario").textContent = "⚠️ Todos los campos son obligatorios.";
        return;
      }

      if (listaUsuarios.find(u => u.usuario === usuario)) {
        document.getElementById("estadoNuevoUsuario").textContent = "⚠️ El usuario ya existe.";
        return;
      }

      listaUsuarios.push({ usuario, clave, factor });
      localStorage.setItem("usuarios-local", JSON.stringify(listaUsuarios));
      renderUsuarios();
      document.getElementById("estadoNuevoUsuario").textContent = `✅ Usuario "${usuario}" creado correctamente.`;
      formNuevo.reset();
    });
  }

  if (formModificar) {
    formModificar.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formModificar));
      const usuario = data.usuarioModificar;
      const nuevaClave = data.nuevaClaveModificar.trim();
      const nuevoFactor = parseFloat(data.nuevoFactorModificar);

      if (!usuario) {
        document.getElementById("estadoModificarUsuario").textContent = "⚠️ Selecciona un usuario.";
        return;
      }

      if (!nuevaClave && isNaN(nuevoFactor)) {
        document.getElementById("estadoModificarUsuario").textContent = "⚠️ Ingresa al menos una nueva contraseña o factor.";
        return;
      }

      const userIndex = listaUsuarios.findIndex(u => u.usuario === usuario);
      if (userIndex === -1) {
        document.getElementById("estadoModificarUsuario").textContent = "⚠️ Usuario no encontrado.";
        return;
      }

      if (nuevaClave) {
        listaUsuarios[userIndex].clave = nuevaClave;
      }
      if (!isNaN(nuevoFactor)) {
        listaUsuarios[userIndex].factor = nuevoFactor;
      }

      localStorage.setItem("usuarios-local", JSON.stringify(listaUsuarios));
      renderUsuarios();
      document.getElementById("estadoModificarUsuario").textContent = `✅ Usuario "${usuario}" actualizado correctamente.`;
      formModificar.reset();
    });
  }

  window.eliminarUsuario = function(index) {
    if (listaUsuarios[index].usuario === "LTAM") {
      alert("No se puede eliminar el usuario administrador.");
      return;
    }
    if (confirm("¿Eliminar este usuario?")) {
      listaUsuarios.splice(index, 1);
      localStorage.setItem("usuarios-local", JSON.stringify(listaUsuarios));
      renderUsuarios();
    }
  };

  renderUsuarios();
});