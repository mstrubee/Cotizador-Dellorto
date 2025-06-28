document.addEventListener("DOMContentLoaded", () => {
  const formNuevo = document.getElementById("formNuevoUsuario");
  if (!formNuevo) return;

  formNuevo.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formNuevo));
    const nuevos = JSON.parse(localStorage.getItem("usuarios-local") || "[]");

    const existe = nuevos.find(u => u.usuario === data.nuevoUsuario);
    if (existe) {
      document.getElementById("estadoNuevoUsuario").textContent = ⚠️ Ya existe un usuario con ese nombre.`;
      return;
    }

    const nuevo = {
      usuario: data.nuevoUsuario,
      password: data.nuevaClave,
      factor: parseFloat(data.nuevoFactor),
      admin: false
    };

    nuevos.push(nuevo);
    localStorage.setItem("usuarios-local", JSON.stringify(nuevos));

    document.getElementById("estadoNuevoUsuario").textContent = `✅ Usuario "${nuevo.usuario}" creado correctamente.`;
    formNuevo.reset();
  });
});