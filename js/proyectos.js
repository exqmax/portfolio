const proyectos = [
    {
        titulo: "Inventario EXQMAX",
        tipo: "Fullstack",
        descripcion: "Aplicación de inventario de equipamiento.",
        tecnologias: ["HTML", "CSS", "JS", "NODE.js", "MySQL"],
        imagen: "img/proyecto1.png",
        url: "#"
    },
    {
        titulo: "PROYECTO 2",
        tipo: "Fullstack",
        descripcion: "Aplicación para compras y online.",
        tecnologias: ["HTML", "CSS", "REACT.js", "NODE.js", "MySQL"],
        imagen: "img/proyecto1.png",
        url: "#"
    },
    {
        titulo: "PROYECTO 3",
        tipo: "Fullstack",
        descripcion: "Aplicación de algo.",
        tecnologias: ["HTML", "CSS", "PHP", "LARAVEL", "FIREBASE"],
        imagen: "img/proyecto1.png",
        url: "#"
    },
    {
        titulo: "PROYECTO 4",
        tipo: "Fullstack",
        descripcion: "Aplicación que puedo utilizar Python.",
        tecnologias: ["HTML", "CSS", "PYTHON","DJANGO"],
        imagen: "img/proyecto1.png",
        url: "#"
    },
];

window.addEventListener("load", () => {
    const contenedor = document.getElementById("lista-proyectos");
    if (!contenedor) return;

    proyectos.forEach(p => {
        const card = document.createElement("div");
        card.className = "proyecto-card";

        card.innerHTML = `
            <div class="proyecto-img">
                <img src="${p.imagen}" alt="${p.titulo}">
                <span class="proyecto-badge">${p.tipo}</span>
            </div>

            <div class="proyecto-body">
                <h3>${p.titulo}</h3>
                <p>${p.descripcion}</p>

                <div class="proyecto-tech">
                    ${p.tecnologias.map(t => `<span>${t}</span>`).join("")}
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
});