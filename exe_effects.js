// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez para restaurar 2 desplegables y animación de flechas
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)

$exeFX = {
    baseClass: "exe",
    h2: "h2",
    isOldBrowser: false,

    // ===== Inicialización principal =====
    init: function () {
        var ie = $exeFX.checkIE();
        if ((!isNaN(parseFloat(ie)) && isFinite(ie)) && ie < 9) {
            $exeFX.isOldBrowser = true;
            $exeFX.h2 = "H2";
        }

        var k = $exeFX.baseClass;
        var hasTimeLines = false;

        $("." + k + "-fx").each(function (i) {
            var c = this.className;
            if (c.indexOf(" " + k + "-accordion") != -1) $exeFX.accordion.init(this, i);
            else if (c.indexOf(" " + k + "-tabs") != -1) $exeFX.tabs.init(this, i);
            else if (c.indexOf(" " + k + "-paginated") != -1) $exeFX.paginated.init(this, i);
            else if (c.indexOf(" " + k + "-carousel") != -1) $exeFX.carousel.init(this, i);
            else if (c.indexOf(" " + k + "-timeline") != -1 && document.body.className.indexOf("exe-epub3") != 0) {
                $exeFX.timeline.init(this, i);
                hasTimeLines = true;
            }
        });

        if (hasTimeLines) setTimeout(function () { $.timeliner({}); }, 500);
    },

    // ===== Utilidades =====
    iframesCheck: function (block) {
        $("iframe", block).each(function () {
            if (this.src && typeof (this.src) == "string") {
                var e = $(this);
                var c = "exeFXcheckedIframe";
                if (!e.hasClass(c)) {
                    e.addClass(c);
                    this.src = this.src;
                }
            }
        });
    },

    checkIE: function () {
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },

    noFX: function (e) {
        e.attr("class", "").css("padding", "1em");
    },

    // ===== Accordion =====
    accordion: {
        enable: function (e) {
            $(".fx-accordion-title", e).each(function () {
                var $title = $(this);
                // Agregar flecha si no existe
                if ($title.find(".fx-arrow").length == 0) {
                    $title.append('<span class="fx-arrow">▶</span>');
                    $title.css("cursor", "pointer");
                    $title.css("display", "flex");
                    $title.css("align-items", "center");
                    $title.find(".fx-arrow").css({
                        "margin-left": "10px",
                        "transition": "transform 0.3s ease"
                    });
                }
            });

            $(".fx-accordion-title", e).click(function (ev) {
                ev.preventDefault();
                var parent = $(this).parent();
                var $arrow = $(this).find(".fx-arrow");

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $('.fx-accordion-content', parent).slideUp(300).removeClass('open');
                    $arrow.css("transform", "rotate(0deg)");
                } else {
                    // Cerrar todos los demás
                    $('.fx-accordion-title', parent).removeClass('active');
                    $('.fx-accordion-content', parent).slideUp(300).removeClass('open');
                    $('.fx-arrow', parent).css("transform", "rotate(0deg)");

                    // Abrir este
                    $(this).addClass('active');
                    $(this).next('.fx-accordion-content').slideDown(300).addClass('open');
                    $arrow.css("transform", "rotate(90deg)");
                }
            });
        },

        rft: function (e, i) {
            var html = "";
            var h = e.html();
            var p = h.split('<h2>');
            if (p.length == h.split('</h2>').length) {
                for (var x = 1; x < p.length; x++) {
                    html += '<h2>' + p[x];
                }
            }
            html = html.replace(/<h2>/g, '<h2 class="fx-accordion-title">');
            html = html.replace(/<\/h2>/g, '</h2><div class="fx-accordion-content"></div>');

            e.html('<div id="' + $exeFX.baseClass + '-accordion-' + i + '">\n<div class="fx-accordion-section">\n' + html + '\n</div>\n</div>\n');

            $("h2", e).each(function (y) {
                var id = $exeFX.baseClass + "-accordion-" + i + "-" + y;
                this.id = id;
                $(this).wrap('<div></div>'); // contenedor padre
            });

            $exeFX.accordion.enable(e);

            // Abrir ambos desplegables al cargar
            $(".fx-accordion-title", e).each(function () {
                $(this).click(); // simula clic para abrir y girar flecha
            });
        },

        init: function (x, i) {
            var e = $(x);
            var a = $("h2", e);
            if (a.length > 0) $exeFX.accordion.rft(e, i);
            else $exeFX.noFX(e);
        }
    },

    // ===== Tabs =====
    tabs: {
        show: function (gID, id) {
            var g = $("#" + gID);
            $(".fx-tabs li", g).removeClass("fx-current").removeClass("fx-C2");
            $("#" + id + "-link").addClass("fx-current fx-C2");
            $(".fx-tab-content", g).removeClass("fx-current");
            $("#" + id).addClass("fx-current");
            $exeFX.iframesCheck($("#" + id));
        },

        rft: function (e, i) {
            var html = "";
            var k = $exeFX.baseClass;
            var gID = k + "-tabs-" + i;
            var h = e.html();
            var p = h.split('<h2>');
            if (p.length == h.split('</h2>').length) {
                for (var x = 1; x < p.length; x++) html += '<h2>' + p[x];
            }
            html = html.replace(/<h2/g, '<div class="fx-tab-content fx-C2">\n<h2 class="sr-av"');
            html += '</div>';
            e.attr("id", gID).html(html);

            var ul = '<ul class="fx-tabs">\n';
            $(".fx-tab-content", e).each(function (y) {
                var h2 = $("H2", this).eq(0);
                var t = y + 1;
                if (h2.length > 0) t = h2.text();
                var id = k + "-tab-" + i + "-" + y;
                var c = (y == 0) ? ' class="fx-current fx-C2"' : '';
                ul += '<li' + c + ' id="' + id + '-link"><a href="#' + id + '" class="exeFXTabLink' + gID + '">' + t + '</a></li>\n';
            });
            ul += '</ul>\n';
            e.prepend(ul);

            $(".exeFXTabLink" + gID).click(function (ev) {
                ev.preventDefault();
                var id = $(this).attr("href").substr(1);
                $exeFX.tabs.show(gID, id);
            });
        },

        init: function (x, i) {
            $exeFX.tabs.rft($(x), i);
        }
    }
};

// ===== Inicialización automática =====
$(document).ready(function () {
    $exeFX.init();
});
