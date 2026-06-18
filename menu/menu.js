$(document).ready(function () {
  // Al hacer clic en cerrar sesión, regresa a la carpeta login
  $("#btn-logout").click(function () {
    window.location.href = "../login/login.html";
  });
});

// Al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  // 1. Obtenemos el elemento h1 donde se mostrará el monto
  const h1_Monto = document.getElementById("monto-principal");

  // 2. Intentamos recuperar el saldo desde localStorage
  const montoGuardado = localStorage.getItem("monto-principal-deposito");

  let monto;

  // Validamos rigurosamente que lo que haya en localStorage sea un número válido
  if (montoGuardado && !isNaN(parseFloat(montoGuardado))) {
    monto = parseFloat(montoGuardado);
  } else {
    monto = 306000; // Si no hay nada o está roto, usamos el valor por defecto
  }

  // 3. Formateamos el monto a formato chileno y lo asignamos al h1
  if (h1_Monto) {
    h1_Monto.textContent = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(monto);
  } else {
    console.error(
      "Error: No se encontró el elemento con ID 'monto-principal' en el HTML del menú.",
    );
  }

  // 4. Aseguramos que quede guardado el número limpio en localStorage
  localStorage.setItem("monto-principal-deposito", monto);

  // 5. Configurar el evento del botón depositar dinero
  const btn_depositar_dinero = document.querySelector(
    "#id-btn-depositar-dinero",
  );
  if (btn_depositar_dinero) {
    btn_depositar_dinero.addEventListener("click", function () {
      console.log("Botón de depositar dinero clickeado, saldo actual:", monto);
      // Guardamos antes de irnos por seguridad
      localStorage.setItem("monto-principal-deposito", monto);
      window.location.href = "../deposito/deposito.html";
    });
  } else {
    console.error(
      "Error: No se encontró el botón con ID 'id-btn-depositar-dinero' en el HTML.",
    );
  }

  // Configurar el evento del botón enviar dinero
  const btn_enviar_dinero = document.querySelector("#id-btn-enviar-dinero");
  if (btn_enviar_dinero) {
    btn_enviar_dinero.addEventListener("click", function () {
      console.log("Botón de enviar dinero clickeado, saldo actual:", monto);
      // Guardamos el saldo actual en el localStorage por seguridad antes de cambiar de página
      localStorage.setItem("monto-principal-deposito", monto);
      window.location.href = "../transferir/transferir.html"; // Asegúrate de que la ruta sea correcta
    });
  }

  const btn_movimientos = document.querySelector("#id-btn-ver-movimientos");
  if (btn_movimientos) {
    btn_movimientos.addEventListener("click", function () {
      window.location.href = "../movimientos/movimientos.html";
    });
  }
});
