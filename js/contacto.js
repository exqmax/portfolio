/* ===============================
✔  Botón no visible hasta que todo esté OK
✔ Validación en tiempo real
✔ reCAPTCHA obligatorio
✔ Antispam básico
✔ Textarea auto-expandible
✔ Mensajes inline (profesional)
✔ Protección básica contra inyección (cliente)
✔ Listo para SMTP con PHP
    =============================== */

window.addEventListener("load", () => {

    /* ===============================
       REFERENCIAS A ELEMENTOS
    =============================== */
    const form = document.getElementById("form-contacto");

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const empresa = document.getElementById("empresa");

    const contador = document.getElementById("contador");
    const resultado = document.getElementById("resultado");
    const btnEnviar = document.getElementById("btn-enviar");

    const inicioTiempo = Date.now(); // Anti-spam por envío rápido


    /* ===============================
       TEXTAREA DINÁMICO + CONTADOR
    =============================== */
    mensaje.addEventListener("input", () => {
        mensaje.style.height = "auto";
        mensaje.style.height = mensaje.scrollHeight + "px";
        contador.textContent = `${mensaje.value.length} caracteres`;

        verificarFormulario(); // cada vez que escribe, revalidamos
    });


    /* ===============================
       FUNCIONES DE UTILIDAD
    =============================== */

    // Limpia mensajes de error
    function limpiarErrores() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
        resultado.textContent = "";
    }

    // Validación de email
    function emailValido(mail) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    }

    // Sanitiza texto (protección básica cliente)
    function limpiarTexto(texto) {
        return texto.replace(/[<>]/g, "");
    }


    /* ===============================
       VALIDACIÓN GENERAL DEL FORM
       (habilita o no el botón)
    =============================== */
    function verificarFormulario() {

        const captchaOK = typeof grecaptcha !== "undefined" &&
                          grecaptcha.getResponse().length > 0;

        const valido =
            nombre.value.trim().length >= 3 &&
            emailValido(email.value) &&
            mensaje.value.trim().length >= 10 &&
            captchaOK;

        if (valido) {
            btnEnviar.disabled = false;
            btnEnviar.style.display = "inline-block";
        } else {
            btnEnviar.disabled = true;
            btnEnviar.style.display = "none";
        }
    }

    // Escuchamos cambios en inputs
    nombre.addEventListener("input", verificarFormulario);
    email.addEventListener("input", verificarFormulario);
    mensaje.addEventListener("input", verificarFormulario);


    /* ===============================
       ENVÍO DEL FORMULARIO
    =============================== */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        limpiarErrores();

        let valido = true;

        /* --- Validaciones finales --- */

        if (nombre.value.trim().length < 3) {
            document.getElementById("error-nombre").textContent = "Nombre inválido";
            valido = false;
        }

        if (!emailValido(email.value)) {
            document.getElementById("error-email").textContent = "Email inválido";
            valido = false;
        }

        if (mensaje.value.trim().length < 10) {
            document.getElementById("error-mensaje").textContent = "Mensaje muy corto";
            valido = false;
        }

        // Anti-spam por velocidad
        if (Date.now() - inicioTiempo < 3000) {
            resultado.textContent = "Envío sospechoso (muy rápido)";
            valido = false;
        }

        // Captcha obligatorio
        if (grecaptcha.getResponse().length === 0) {
            resultado.textContent = "Confirmá que no sos un robot";
            valido = false;
        }

        if (!valido) return;


        /* ===============================
           ENVÍO SEGURO AL BACKEND
        =============================== */
        try {
            const response = await fetch("enviar.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: limpiarTexto(nombre.value),
                    email: limpiarTexto(email.value),
                    mensaje: limpiarTexto(mensaje.value),
                    empresa: limpiarTexto(empresa.value),
                    captcha: grecaptcha.getResponse()
                })
            });

            const data = await response.json();

            if (data.ok) {
                resultado.style.color = "green";
                resultado.textContent = "Mensaje enviado correctamente ✔";

                form.reset();
                grecaptcha.reset();
                btnEnviar.style.display = "none";
                btnEnviar.disabled = true;
            } else {
                resultado.style.color = "crimson";
                resultado.textContent = data.error || "Error al enviar";
            }

        } catch (err) {
            resultado.style.color = "crimson";
            resultado.textContent = "Error de conexión";
        }
    });

});