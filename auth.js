document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      console.log("Intentando autenticar usuario:", username);

      const valido = await validarCredenciales(username, password);
      if (valido) {
        console.log("Autenticación exitosa, redirigiendo...");
        if (username === "LTAM" && password === "6658") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        console.log("Autenticación fallida para usuario:", username);
        document.getElementById("loginError").innerText = "Usuario o contraseña incorrectos";
      }
    });
  }
});

async function validarCredenciales(username, password) {
  try {
    let usuarios = JSON.parse(localStorage.getItem("usuarios-local") || "[]");
    if (!usuarios.length) {
      try {
        const res = await fetch("usuarios.json");
        usuarios = await res.json();
        localStorage.setItem("usuarios-local", JSON.stringify(usuarios));
      } catch (e) {
        console.error("Error al cargar usuarios.json:", e);
        // Respaldo con usuario administrador por defecto
        usuarios = [{ usuario: "LTAM", clave: "6658", factor: 1 }];
        localStorage.setItem("usuarios-local", JSON.stringify(usuarios));
      }
    }
    const usuario = usuarios.find(u => u.usuario === username && u.clave === password);
    if (usuario) {
      console.log("Usuario encontrado:", usuario.usuario);
      localStorage.setItem("usuario", usuario.usuario);
      localStorage.setItem("factor", usuario.factor);
      return true;
    }
    console.log("No se encontró usuario con las credenciales proporcionadas");
    return false;
  } catch (e) {
    console.error("Error al validar credenciales:", e);
    document.getElementById("loginError").innerText = "Error al validar credenciales. Contacta al administrador.";
    return false;
  }
}

function logout() {
  console.log("Cerrando sesión...");
  localStorage.removeItem("usuario");
  localStorage.removeItem("factor");
  window.location.replace("login.html");
}
window.logout = logout;