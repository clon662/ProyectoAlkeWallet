$(document).ready(function () {
  // Al hacer clic en volver, regresa a la carpeta menu
  $("#btn-volver-menu").click(function () {
    window.location.href = "../menu/menu.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias a los elementos del HTML
  const montoPrincipalEl = document.getElementById("monto-principal-deposito");
  const inputMonto = document.querySelector(".form-control");
  const btnIngresar = document.getElementById("btn-ingresar");
  const contenedorAlertas = document.getElementById("contenedor-alertas");

  // 2. Recuperar el saldo desde localStorage
  const montoGuardado = localStorage.getItem("monto-principal-deposito");

  let saldoActual;

  if (montoGuardado && !isNaN(parseFloat(montoGuardado))) {
    saldoActual = parseFloat(montoGuardado);
  } else {
    saldoActual = 306000; // Respaldo por si acaso
  }

  //Renderizar el saldo formateado en pantalla y guardar en localStorage
  function actualizarPantallaYSaldos() {
    // Para la interfaz usamos toLocaleString
    montoPrincipalEl.textContent = `$ ${saldoActual.toLocaleString("es-CL")}`;
    //Para el almacenamiento guardamos el número ENTERO (ej: 306000), SIN!!!!! caracteres raros
    localStorage.setItem("monto-principal-deposito", saldoActual);
  }

  // FUNCIÓN: Mostrar alertas
  function mostrarMensajePantalla(mensaje, tipo = "danger") {
    if (contenedorAlertas) {
      contenedorAlertas.innerHTML = "";
      const alertaDiv = document.createElement("div");
      alertaDiv.className = `alert alert-${tipo} text-center py-2 px-3 m-0 rounded-3 small fw-medium`;
      alertaDiv.role = "alert";
      alertaDiv.textContent = mensaje;
      contenedorAlertas.appendChild(alertaDiv);
    }
  }

  // Inicializar la pantalla con el saldo correcto
  if (montoPrincipalEl) {
    actualizarPantallaYSaldos();
  } else {
    console.error(
      "Error: No se encontró el elemento 'monto-principal-deposito' en el HTML.",
    );
  }

  // 3. Evento de depósito
  if (btnIngresar) {
    btnIngresar.addEventListener("click", () => {
      const montoIngresado = parseFloat(inputMonto.value);

      // Validación de número correcto
      if (isNaN(montoIngresado) || montoIngresado <= 0) {
        mostrarMensajePantalla(
          "Por favor, ingrese un monto válido y mayor a cero.",
          "warning",
        );
        return;
      }

      // Procesar el depósito sumando números puros
      saldoActual = saldoActual + montoIngresado;

      // Guardar el nuevo saldo en localStorage y actualizar la vista actual
      actualizarPantallaYSaldos();
      inputMonto.value = "";

      // Mostrar mensaje de éxito
      mostrarMensajePantalla(
        `¡Depósito exitoso! Has ingresado $${montoIngresado.toLocaleString("es-CL")}. Redirigiendo al menú...`,
        "success",
      );

      //Registrar el movimiento en el historial
      const historial = localStorage.getItem("historial-transacciones")
        ? JSON.parse(localStorage.getItem("historial-transacciones"))
        : [];
      historial.push({
        tipo: "Abono",
        detalle: "Por: Pedro Pacheco",
        monto: montoIngresado,
        fecha: new Date().toLocaleString("es-CL"),
      });
      localStorage.setItem(
        "historial-transacciones",
        JSON.stringify(historial),
      );

      // Redirección automática al menú tras 1.5 segundos
      setTimeout(() => {
        window.location.href = "../menu/menu.html";
      }, 1500);
    });
  }
});
