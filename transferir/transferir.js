$(document).ready(function () {
  // Al hacer clic en volver, regresa a la carpeta menu
  $("#btn-volver-menu").click(function () {
    window.location.href = "../menu/menu.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias a los elementos del HTML
  const montoPrincipalEl = document.getElementById(
    "monto-principal-transferir",
  );
  const inputMonto = document.querySelector(".form-control");
  const btnEnviar = document.getElementById("btn-enviar");
  const contenedorAlertas = document.getElementById("contenedor-alertas");

  // 2. Recuperar el saldo desde localStorage
  const montoGuardado = localStorage.getItem("monto-principal-deposito");

  let saldoActual;
  if (montoGuardado && !isNaN(parseFloat(montoGuardado))) {
    saldoActual = parseFloat(montoGuardado);
  } else {
    saldoActual = 306000; // Respaldo por defecto
  }

  // FUNCIÓN: Renderizar el saldo formateado en pantalla y guardar en localStorage
  function actualizarPantallaYSaldos() {
    const saldoFormateado = saldoActual.toLocaleString("es-CL");
    montoPrincipalEl.textContent = `$ ${saldoFormateado}`;
    localStorage.setItem("monto-principal-deposito", saldoActual);
  }

  // FUNCIÓN: Mostrar alertas idénticas
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

  // Inicializar pantalla
  if (montoPrincipalEl) {
    actualizarPantallaYSaldos();
  }

  // 3. Evento de envío de dinero
  if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
      // Limpiamos la entrada por si ponen puntos o comas manuales
      const montoIngresado = parseFloat(inputMonto.value);

      // Validación de número correcto
      if (isNaN(montoIngresado) || montoIngresado <= 0) {
        mostrarMensajePantalla(
          "Por favor, ingrese un monto válido y mayor a cero.",
          "warning",
        );
        return;
      }

      // Validación crítica de fondos
      if (montoIngresado > saldoActual) {
        mostrarMensajePantalla(
          "Fondos insuficientes. No posees el saldo necesario para esta operación.",
          "danger",
        );
        return;
      }

      // Procesar retiro
      saldoActual = saldoActual - montoIngresado;

      actualizarPantallaYSaldos();
      inputMonto.value = "";

      // Muestra mensaje de éxito en verde
      mostrarMensajePantalla(
        `¡Transferencia exitosa! Has enviado $${montoIngresado.toLocaleString("es-CL")}. Redirigiendo...`,
        "success",
      );

      // NUEVO: Registrar el movimiento en el historial
      const historial = localStorage.getItem("historial-transacciones")
        ? JSON.parse(localStorage.getItem("historial-transacciones"))
        : [];
      historial.push({
        tipo: "Transferencia",
        monto: montoIngresado, // o montoAEnviar, según el nombre de tu variable
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
