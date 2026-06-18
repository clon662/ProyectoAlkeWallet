$(document).ready(function () {
  // Evento al hacer clic en el botón Ingresar
  $("#btn-ingresar").click(function () {
    // 1. Obtener los valores eliminando espacios en blanco extra
    let username = $("#basic-addon1").next("input").val().trim();
    let password = $("#basic-addon2").next("input").val().trim();

    // 3. Validar que el campos de input:
    // 2. Validar que ambos campos contengan datos
    if (username === "" || password === "") {
      mostrarError("Debe ingresar email y contraseña");
      return; // Detiene la ejecución
    }

    // 2. Validar las credenciales correctas
    if (username === "admin@wallet.com" && password === "adm123") {
      mostrarExito("¡Bienvenido al sistema! Redireccionando...");

      // Espera 1.5 segundos para que se vea el alert verde y luego redirige
      setTimeout(function () {
        window.location.href = "../menu/menu.html";
      }, 1500);
    } else {
      mostrarError("Credenciales incorrectas");
    }
  });

  // Función para mostrar el alert de error
  function mostrarError(mensaje) {
    $("#alert-success").hide();

    $("#alert-danger").text(mensaje).removeClass("d-none").fadeIn();
  }

  // Función para mostrar el alert de éxito
  function mostrarExito(mensaje) {
    $("#alert-danger").hide();

    $("#alert-success").text(mensaje).removeClass("d-none").fadeIn();
  }
});
