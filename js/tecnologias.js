const tecnologias = ["HTML", "CSS", "JavaScript", "Linux", "Zabbix", "MySQL"];

window.addEventListener("load", function () {
    let box = document.getElementById("lista-tech");
    if (box) box.innerHTML = tecnologias.join(" • ");
});