// Array con los ids de las secciones en el orden real que aparecen en el HTML.
let paginas = ["inicio", "proyectos", "sobre", "tecnologias", "contacto"];

// Índice de la página actualmente visible.
let paginaActual = 0;

// -------------------------------------------------------------
// Cambia la página con animación suave
// -------------------------------------------------------------
function cambiarPagina(id) {
    // Selecciona todos los elementos que representan páginas (todas las .page)
    const pages = document.querySelectorAll('.page');
    // Busca el índice del id recibido dentro del array paginas.
    // Ej: si id === "proyectos", index será 1 (según el array).
    const index = paginas.indexOf(id);
    if (index === -1) return; // protección

    // Actualiza la variable global que indica la página actual.
    paginaActual = index;
    // Recorre todas las páginas y las posiciona horizontalmente usando translateX.
    // Para la página con i === index -> translateX(0%)
    // Para la página siguiente -> translateX(100%) (o -100% si i < index)
    pages.forEach((pg, i) => {
        pg.style.transform = `translateX(${(i - index) * 100}%)`;
    });

    // Si existe la función global actualizarFlechas (viene de flechas.js),
    // la llamamos para que actualice el estado/visibilidad de las flechas.
    if (typeof window.actualizarFlechas === "function") {
        window.actualizarFlechas(paginaActual, paginas.length);
    }
}

// -------------------------------------------------------------
// NAV SUPERIOR – sincroniza con el sistema de páginas
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

    // 1) Posicionar la página inicial sin transición
    cambiarPagina("inicio");

    // 2) Activar las transiciones en el siguiente ciclo de renderizado
    requestAnimationFrame(() => {
        document.body.classList.add("ready");
    });

    // -------------------------------------------------------------
    // NAV SUPERIOR – desktop (páginas) / mobile (scroll)
    // -------------------------------------------------------------
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", e => {
            const id = link.getAttribute("href").replace("#", "");
            const esMobile = window.matchMedia("(max-width: 768px)").matches;

            e.preventDefault();

            if (esMobile) {
                // 📱 Mobile → scroll natural
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                // 🖥 Desktop → sistema de páginas
                cambiarPagina(id);
            }
        });
    });

});

// -------------------------------------------------------------
// Control de las flechas laterales (derecha)
// -------------------------------------------------------------
const flechaDer = document.getElementById("flecha-der");
if (flechaDer) {
    flechaDer.addEventListener("click", () => {
        // Si no estamos en la última página, incrementamos el índice y navegamos
        if (paginaActual < paginas.length - 1) {
            paginaActual++;
            cambiarPagina(paginas[paginaActual]);
        }
    });
}
// -------------------------------------------------------------
// Control de las flechas laterales (izquierda)
// -------------------------------------------------------------
const flechaIzq = document.getElementById("flecha-izq");
if (flechaIzq) {
    // Si no estamos en la primera página, decrementamos el índice y navegamos
    flechaIzq.addEventListener("click", () => {
        if (paginaActual > 0) {
            paginaActual--;
            cambiarPagina(paginas[paginaActual]);
        }
    });
}

// -------------------------------------------------------------
// Inicialización al cargar el DOM
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    // 1) Posicionar la página inicial sin transición
    cambiarPagina("inicio");

    // 2) Activar las transiciones en el siguiente ciclo de renderizado
    requestAnimationFrame(() => {
        document.body.classList.add("ready");
    });
});
