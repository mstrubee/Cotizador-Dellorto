document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("loginError");

    try {
      const users = await cargarUsuarios();
      const user = users.find(u => u.usuario === username && u.password === password);
      
      if (user) {
        localStorage.setItem("dellorto-user", JSON.stringify(user));
        window.location.href = "index.html";
      } else {
        errorDiv.textContent = "Usuario o contraseña incorrectos.";
      }
    } catch (err) {
      console.error("Error al validar:", err);
      errorDiv.textContent = "Error al validar usuario.";
    }
  });
});

// Combina usuarios por defecto y los creados dinámicamente
async function cargarUsuarios() {
  let base = [];
  try {
    const res = await fetch("data/usuarios.json");
    base = await res.json();
  } catch {
    console.warn("usuarios.json no disponible");
  }

  const locales = JSON.parse(localStorage.getItem("usuarios-local") || "[]");
  return [...base, ...locales];
}