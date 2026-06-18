$(document).ready(function () {
  $("#btn-volver-menu").click(function () {
    window.location.href = "../menu/menu.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Elementos Interfaz
  const montoPrincipalEl = document.getElementById(
    "monto-principal-transferir",
  );
  const inputMonto = document.getElementById("input-monto-transferir");
  const btnEnviar = document.getElementById("btn-enviar");
  const contenedorAlertas = document.getElementById("contenedor-alertas");

  // Elementos Nuevos (Buscador y Secciones)
  const seccionDestinatarios = document.getElementById("seccion-destinatarios");
  const seccionFormularioEnvio = document.getElementById(
    "seccion-formulario-envio",
  );
  const buscador = document.getElementById("buscador-destinatario");
  const tablaBody = document.getElementById("tabla-destinatarios-body");
  const btnCambiarDestinatario = document.getElementById(
    "btn-cambiar-destinatario",
  );

  // Elementos Ficha Destinatario Seleccionado
  const txtNombre = document.getElementById("destinatario-nombre");
  const txtBanco = document.getElementById("destinatario-banco");
  const txtCbu = document.getElementById("destinatario-cbu");
  const txtAlias = document.getElementById("destinatario-alias");

  // Variable de control para el destinatario seleccionado
  let destinatarioSeleccionado = null;

  // 1. Lista de 5 destinatarios:
  const destinatarios = [
    {
      nombre: "Juan Pérez",
      cbu: "0070001234567890123451",
      alias: "juan.perez.alkewallet",
      banco: "Banco de Chile",
    },
    {
      nombre: "María González",
      cbu: "0160009876543210987652",
      alias: "maria.lucro.pago",
      banco: "Banco Estado",
    },
    {
      nombre: "Carlos Muñoz",
      cbu: "0340005555555555555553",
      alias: "carlos.muno.wallet",
      banco: "BCI",
    },
    {
      nombre: "Ana Silva",
      cbu: "0720001112223334445554",
      alias: "ana.silva.transfer",
      banco: "Santander",
    },
    {
      nombre: "Diego Contreras",
      cbu: "1910008889997776665555",
      alias: "diego.contra.coins",
      banco: "Scotiabank",
    },
  ];

  // 2. Cargar Saldo de LocalStorage
  const montoGuardado = localStorage.getItem("monto-principal-deposito");
  let saldoActual =
    montoGuardado && !isNaN(parseFloat(montoGuardado))
      ? parseFloat(montoGuardado)
      : 306000;

  function actualizarPantallaYSaldos() {
    montoPrincipalEl.textContent = `$ ${saldoActual.toLocaleString("es-CL")}`;
    localStorage.setItem("monto-principal-deposito", saldoActual);
  }

  function mostrarMensajePantalla(mensaje, tipo = "danger") {
    if (contenedorAlertas) {
      contenedorAlertas.innerHTML = `<div class="alert alert-${tipo} text-center py-2 px-3 m-0 rounded-3 small fw-medium" role="alert">${mensaje}</div>`;
    }
  }

  // 3. Renderizar la Tabla de Destinatarios
  function cargarTablaDestinatarios(filtro = "") {
    tablaBody.innerHTML = "";

    const listaFiltrada = destinatarios.filter(
      (d) =>
        d.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        d.alias.toLowerCase().includes(filtro.toLowerCase()) ||
        d.cbu.includes(filtro),
    );

    if (listaFiltrada.length === 0) {
      tablaBody.innerHTML = `<tr><td class="text-center text-muted p-3">No se encontraron destinatarios</td></tr>`;
      return;
    }

    listaFiltrada.forEach((d) => {
      const tr = document.createElement("tr");
      tr.className = "pointer border-bottom";
      tr.innerHTML = `
        <td class="p-2">
          <div class="fw-bold text-dark">${d.nombre}</div>
          <div class="text-muted extra-small" style="font-size: 10px;">
            ${d.banco} | Alias: ${d.alias}
          </div>
        </td>
      `;
      // Evento al hacer clic en una fila para seleccionar destinatario.
      tr.addEventListener("click", () => seleccionarDestinatario(d));
      tablaBody.appendChild(tr);
    });
  }

  // 4. Lógica: de Selección y Transición de pantallas
  function seleccionarDestinatario(dest) {
    destinatarioSeleccionado = dest;

    // Rellenar ficha visual
    txtNombre.textContent = dest.nombre;
    txtBanco.textContent = dest.banco;
    txtCbu.textContent = dest.cbu;
    txtAlias.textContent = dest.alias;

    // Cambiar de vista con clases de Bootstrap
    seccionDestinatarios.classList.add("d-none");
    seccionFormularioEnvio.classList.remove("d-none");
    if (contenedorAlertas) contenedorAlertas.innerHTML = ""; // Limpiar alertas anteriores.
  }

  // Botón para echarse para atrás y cambiar de persona
  btnCambiarDestinatario.addEventListener("click", () => {
    seccionFormularioEnvio.classList.add("d-none");
    seccionDestinatarios.classList.remove("d-none");
    destinatarioSeleccionado = null;
    inputMonto.value = "";
  });

  // Evento del Buscador
  buscador.addEventListener("input", (e) =>
    cargarTablaDestinatarios(e.target.value),
  );

  // Inicializar vistas
  actualizarPantallaYSaldos();
  cargarTablaDestinatarios();

  // 5. Procesar Envío de Dinero
  if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
      const montoAEnviar = parseFloat(inputMonto.value);

      if (isNaN(montoAEnviar) || montoAEnviar <= 0) {
        mostrarMensajePantalla(
          "Por favor, ingrese un monto válido y mayor a cero.",
          "warning",
        );
        return;
      }

      if (montoAEnviar > saldoActual) {
        mostrarMensajePantalla(
          "Fondos insuficientes. No posees el saldo necesario para esta operación.",
          "danger",
        );
        return;
      }

      // Descontar saldo
      saldoActual -= montoAEnviar;
      actualizarPantallaYSaldos();
      inputMonto.value = "";

      //Guardar en historial con nombre y apellido del destinatario
      const historial = localStorage.getItem("historial-transacciones")
        ? JSON.parse(localStorage.getItem("historial-transacciones"))
        : [];
      historial.push({
        tipo: "Transferencia",
        detalle: `Destinatario: ${destinatarioSeleccionado.nombre}`, // Guardamos el nombre y apellido
        monto: montoAEnviar,
        fecha: new Date().toLocaleString("es-CL"),
      });
      localStorage.setItem(
        "historial-transacciones",
        JSON.stringify(historial),
      );

      mostrarMensajePantalla(
        `¡Envío exitoso! Transferiste $${montoAEnviar.toLocaleString("es-CL")} a ${destinatarioSeleccionado.nombre}.`,
        "success",
      );

      setTimeout(() => {
        window.location.href = "../menu/menu.html";
      }, 1500);
    });
  }
});
