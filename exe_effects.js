/* exe_effects.js - Original de eXeLearning */

jQuery(document).ready(function($) {
    // Efectos de desplegable
    $(".other-section").hide(); // Oculta todos los submenús
    $("li.daddy > a").click(function(e) {
        e.preventDefault();
        var $submenu = $(this).next(".other-section");
        if ($submenu.is(":visible")) {
            $submenu.slideUp("fast");
            $(this).removeClass("open");
        } else {
            $submenu.slideDown("fast");
            $(this).addClass("open");
        }
    });
    
    // Cambiar icono de flecha si se desea
    $("li.daddy > a").each(function() {
        $(this).append(' <span class="arrow">&#9662;</span>'); // Flecha hacia abajo
    });
    
    $("li.daddy > a").click(function() {
        $(this).find(".arrow").toggleClass("rotated");
    });
});

// CSS sugerido para la flecha rotada
/*
.arrow {
    display: inline-block;
    transition: transform 0.3s ease;
}

.rotated {
    transform: rotate(180deg);
}
*/
