$(document).ready(function () {
  $("#btn-volver-menu").click(function () {
    window.location.href = "../menu/menu.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const listaMovimientosEl = document.getElementById("lista-movimientos");
  const btnLimpiar = document.getElementById("btn-limpiar-historial");
  const contenedorAlertas = document.getElementById("contenedor-alertas");

  // 1. Recuperar historial desde localStorage
  const historialGuardado = localStorage.getItem("historial-transacciones");
  let movimientos = historialGuardado ? JSON.parse(historialGuardado) : [];

  // FUNCIÓN: Mostrar alertas en la pantalla.
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

  // 2. Renderizar movimientos en la lista
  function renderizarMovimientos() {
    listaMovimientosEl.innerHTML = "";

    if (movimientos.length === 0) {
      listaMovimientosEl.innerHTML = `
        <li class="list-group-item text-center text-muted border-0 py-3 small italic">
          No registras transacciones recientes.
        </li>`;
      return;
    }

    // Recorremos al revés para mostrar primero el más nuevo
    movimientos.reverse().forEach((mov) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2 small border-bottom";

      // Si es Abono pintamos azul (Depósito), si es Transferencia pintamos verde (Envío)
      const esAbono = mov.tipo === "Abono";
      const badgeClass = esAbono
        ? "text-primary fw-bold"
        : "text-success fw-bold";
      const signo = esAbono ? "+" : "-";

      // Tomamos el detalle (Nombre y Apellido) que guardamos previamente
      const detalleUsuario = mov.detalle ? mov.detalle : "";

      li.innerHTML = `
        <div>
          <span class="d-block fw-bold text-dark">${mov.tipo}</span>
          <span class="text-secondary extra-small d-block mb-1" style="font-size: 11px; font-style: italic;">${detalleUsuario}</span>
          <span class="text-muted extra-small d-block" style="font-size: 10px;">${mov.fecha}</span>
        </div>
        <span class="${badgeClass}">
          ${signo} $${mov.monto.toLocaleString("es-CL")}
        </span>
      `;
      listaMovimientosEl.appendChild(li);
    });

    movimientos.reverse(); // Devolvemos el array a su orden para no romper la memoria
  }

  // 3. Evento para borrar el historial SIN ventanas emergentes del sistema
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
      // Si el historial ya está vacío, avisamos con advertencia
      if (movimientos.length === 0) {
        mostrarMensajePantalla(
          "El historial ya se encuentra vacío.",
          "warning",
        );
        return;
      }

      // Vaciamos los datos
      localStorage.setItem("historial-transacciones", JSON.stringify([]));
      movimientos = [];
      renderizarMovimientos();

      // Mostramos mensaje de éxito en verde arriba de la lista
      mostrarMensajePantalla(
        "Historial de movimientos borrado con éxito.",
        "success",
      );

      // Borrar el mensaje de éxito después de 3 segundos para que no se quede ahí para siempre (esto es opcional *)
      setTimeout(() => {
        if (contenedorAlertas) contenedorAlertas.innerHTML = "";
      }, 3000);
    });
  }

  renderizarMovimientos();
});
