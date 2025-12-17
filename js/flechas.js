window.actualizarFlechas = function (paginaActual, totalPaginas) {
    const izq = document.getElementById("flecha-izq");
    const der = document.getElementById("flecha-der");

    if (!izq || !der) return;

    // Izquierda: deshabilitada solo en la primera página
    if (paginaActual === 0) {
        izq.classList.add("deshabilitada");
    } else {
        izq.classList.remove("deshabilitada");
    }

    // Derecha: deshabilitada solo en la última página
    if (paginaActual === totalPaginas - 1) {
        der.classList.add("deshabilitada");
    } else {
        der.classList.remove("deshabilitada");
    }
};