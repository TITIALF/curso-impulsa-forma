// exe_effects.js - Versión corregida para desplegables
document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll("#siteNav .daddy");

    toggles.forEach((toggle) => {
        // Inicializar flechas y secciones
        const subMenu = toggle.nextElementSibling;
        if (subMenu && subMenu.tagName === "UL") {
            subMenu.style.display = "none";
            toggle.classList.add("collapsed");

            // Crear ícono de flecha
            const arrow = document.createElement("span");
            arrow.classList.add("arrow");
            arrow.innerHTML = "&#9654;"; // triángulo hacia la derecha
            toggle.prepend(arrow);

            // Manejar clic
            toggle.addEventListener("click", function (e) {
                e.preventDefault();
                if (subMenu.style.display === "none") {
                    subMenu.style.display = "block";
                    arrow.innerHTML = "&#9660;"; // triángulo hacia abajo
                } else {
                    subMenu.style.display = "none";
                    arrow.innerHTML = "&#9654;";
                }
            });

            // Hover opcional para cambio de color
            toggle.addEventListener("mouseenter", function () {
                toggle.style.backgroundColor = "#f0f0f0";
            });
            toggle.addEventListener("mouseleave", function () {
                toggle.style.backgroundColor = "";
            });
        }
    });
});
