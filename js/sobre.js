// =======================================================
// SOBRE.JS
// Sección "Sobre"
// - Desktop: libro animado con videos + doble página
// - Mobile: swipe simple (una página)
// Las lógicas están completamente separadas
// =======================================================


// -------------------------------------------------------
// FLAG GLOBAL
// Evita que la animación se inicie más de una vez
// -------------------------------------------------------
let sobreIniciado = false;

// -------------------------------------------------------
// FUNCIÓN PRINCIPAL
// Detecta mobile / desktop y deriva la lógica
// -------------------------------------------------------
function iniciarSobre() {

    if (sobreIniciado) return;
    sobreIniciado = true;

    const esMobile = window.matchMedia("(max-width: 768px)").matches;

    // Contenedor común
    const sobrePages = document.querySelector("#sobre .sobre-pages");
    if (sobrePages) {
        sobrePages.style.display = "flex";
        sobrePages.style.opacity = "1";
    }

    if (esMobile) {
        iniciarSobreMobile();
    } else {
        iniciarSobreDesktop();
    }
}

// =======================================================
// ====================== MOBILE =========================
// Una página por vez + swipe
// =======================================================
function iniciarSobreMobile() {

    const book = document.querySelector("#sobre .sobre-book");
    const indicador = document.getElementById("sobreIndicador");
    const hojas = Array.from(
        document.querySelectorAll("#sobre .sobre-page")
    );

    if (!book || !hojas.length) {
        console.warn("Mobile: no se encontraron páginas");
        return;
    }

    // -----------------------------------------
    // LIMPIEZA TOTAL DE ESTADOS DESKTOP
    // -----------------------------------------
    hojas.forEach(h => {
        h.style.display = "";
        h.style.opacity = "";
        h.style.transform = "";
        h.style.filter = "";

        h.classList.remove("page-appear", "page-disappear");
    });

    let pageIndex = 0;
    let startX = 0;

    // -----------------------------------------
    // MUESTRA SOLO UNA PÁGINA
    // -----------------------------------------
    function mostrarHoja(i) {

        hojas.forEach((h, idx) => {

            if (idx === i) {
                h.style.display = "block";

                // animación de texto
                const textos = h.querySelectorAll(".sobre-text");
                textos.forEach(t => {
                    t.classList.remove("page-disappear");
                    t.classList.add("page-appear");
                });

            } else {
                h.style.display = "none";
            }
        });

        if (indicador) {
            indicador.textContent = `${i + 1} / ${hojas.length}`;
        }
    }

    // -----------------------------------------
    // SWIPE
    // -----------------------------------------
    book.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    book.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) < 60) return;

        // 👉 siguiente
        if (deltaX < 0 && pageIndex < hojas.length - 1) {
            pageIndex++;
        }

        // 👈 anterior
        if (deltaX > 0 && pageIndex > 0) {
            pageIndex--;
        }

        mostrarHoja(pageIndex);
    });

    // INIT
    mostrarHoja(pageIndex);
}


// =======================================================
// ===================== DESKTOP =========================
// Libro con videos + doble página
// =======================================================
function iniciarSobreDesktop() {

    // ---------------- DOM ----------------
    const vA = document.getElementById("sobreVideoA");
    const vB = document.getElementById("sobreVideoB");

    const btnPrev = document.getElementById("sobrePrev");
    const btnNext = document.getElementById("sobreNext");

    const magicText = document.getElementById("sobreMagicText");
    const indicador = document.getElementById("sobreIndicador");

    const dobles = Array.from(
        document.querySelectorAll("#sobre .sobre-double")
    );

    // ---------------- ESTADO ----------------
    let pageIndex = 0;
    let showingA = true;


    // ---------------------------------------------------
    // Oculta todas las dobles páginas
    // ---------------------------------------------------
    function ocultarDobles() {
        dobles.forEach(d => {
            d.style.display = "none";
            d.style.opacity = 0;
        });
    }


    // ---------------------------------------------------
    // Muestra una doble página
    // ---------------------------------------------------
    function mostrarDoble(i) {

        ocultarDobles();

        const d = dobles[i];
        if (!d) return;

        d.style.display = "flex";
        setTimeout(() => d.style.opacity = 1, 30);

        // Reactiva animación de aparición de texto
        d.querySelectorAll(".sobre-text").forEach(t => {
            t.classList.remove("text-fade-out", "page-appear");
            void t.offsetWidth;
            t.classList.add("page-appear");
        });

        // Indicador
        if (indicador) {
            indicador.textContent = `${i + 1} / ${dobles.length}`;
        }

        actualizarBotonesDesktop();
    }


    // ---------------------------------------------------
    // Controla visibilidad de botones PREV / NEXT
    // ---------------------------------------------------
    function actualizarBotonesDesktop() {

        // PREV
        if (pageIndex === 0) {
            btnPrev.style.opacity = "0";
            btnPrev.style.pointerEvents = "none";
        } else {
            btnPrev.style.opacity = "1";
            btnPrev.style.pointerEvents = "auto";
        }

        // NEXT
        if (pageIndex === dobles.length - 1) {
            btnNext.style.opacity = "0";
            btnNext.style.pointerEvents = "none";
        } else {
            btnNext.style.opacity = "1";
            btnNext.style.pointerEvents = "auto";
        }
    }


    // ---------------------------------------------------
    // Desaparece el texto suavemente
    // ---------------------------------------------------
    // Hace desaparecer suavemente el texto actual
    // usando la animación inversa
    // ---------------------------------------------------
    function ocultarTextoActual() {
        document
            .querySelectorAll("#sobre .sobre-double .sobre-text")
            .forEach(txt => {
                txt.classList.remove("page-appear");
                txt.classList.remove("page-disappear"); // reset por seguridad
                void txt.offsetWidth;                   // fuerza reflow
                txt.classList.add("page-disappear");
            });
    }

    // ---------------------------------------------------
    // Reproduce video de transición
    // ---------------------------------------------------
    function reproducirTransicion(video, nuevaPagina) {

        // 1) Fade out del texto
        ocultarTextoActual();

        // 2) Pequeño delay para que se perciba
        setTimeout(() => {

            const visible = showingA ? vA : vB;
            const hidden  = showingA ? vB : vA;

            hidden.src = video;
            hidden.currentTime = 0;

            hidden.oncanplay = () => {

                hidden.play();
                visible.style.opacity = 0;
                hidden.style.opacity = 1;

                showingA = !showingA;

                hidden.onended = () => {
                    pageIndex = nuevaPagina;
                    mostrarDoble(pageIndex);
                };
            };

        }, 300);
    }


    // ---------------------------------------------------
    // EVENTOS BOTONES
    // ---------------------------------------------------
    btnNext.onclick = () => {
        if (pageIndex < dobles.length - 1) {
            reproducirTransicion("videos/righttpage.mp4", pageIndex + 1);
        }
    };

    btnPrev.onclick = () => {
        if (pageIndex > 0) {
            reproducirTransicion("videos/leftpage.mp4", pageIndex - 1);
        }
    };


    // ---------------------------------------------------
    // INICIO DEL LIBRO
    // ---------------------------------------------------
    ocultarDobles();

    vA.src = "videos/openbook.mp4";
    vA.play();

    vA.onended = () => {
        mostrarDoble(0);
        if (magicText) magicText.classList.add("fade-in");
    };
}


// =======================================================
// OBSERVER – Inicia la sección al entrar en pantalla
// =======================================================
const seccionSobre = document.getElementById("sobre");

const observerSobre = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) iniciarSobre();
    });
}, { threshold: 0.4 });

observerSobre.observe(seccionSobre);