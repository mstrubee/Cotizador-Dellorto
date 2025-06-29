// Validación de login
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const valido = await validarCredenciales(username, password);
      if (valido) {
        window.location.href = "index.html";
      } else {
        document.getElementById("loginError").innerText = "Credenciales incorrectas";
      }
    });
  }
});

async function validarCredenciales(username, password) {
  const res = await fetch("usuarios.json");
  const usuarios = await res.json();
  const usuario = usuarios.find(u => u.usuario === username && u.clave === password);

  if (usuario) {
    localStorage.setItem("usuario", usuario.usuario);
    localStorage.setItem("factor", usuario.factor);
    return true;
  }
  return false;
}

// Cierre de sesión
function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("factor");
  window.location.href = "login.html";
}
window.logout = logout;
