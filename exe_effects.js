// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez para restaurar desplegables y normalizar HTML
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)

$exeFX = {
    baseClass: "exe",
    h2: "h2",
    isOldBrowser: false,

    init: function () {
        var ie = $exeFX.checkIE();
        if ((!isNaN(parseFloat(ie)) && isFinite(ie)) && ie < 9) {
            $exeFX.isOldBrowser = true;
            $exeFX.h2 = "H2";
        }
        var k = $exeFX.baseClass;
        var f = $("." + k + "-fx");
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
        if (hasTimeLines) {
            setTimeout(function () { $.timeliner({}); }, 500);
        }
    },

    checkIE: function () {
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },

    noFX: function (e) {
        e.attr("class", "").css("padding", "1em");
    },

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

    // ===== Accordion =====
    accordion: {
        closeAll: function (parent) {
            $('.fx-accordion-title', parent).removeClass('active');
            $('.fx-accordion-content', parent).slideUp(0).removeClass('open');
            $('.fx-arrow', parent).removeClass('rotated');
        },

        toggle: function (title) {
            var parent = title.closest('.fx-accordion-section');
            var content = title.next('.fx-accordion-content');
            var arrow = title.find('.fx-arrow');

            if (content.hasClass('open')) {
                content.slideUp(300).removeClass('open');
                title.removeClass('active');
                arrow.removeClass('rotated');
            } else {
                $exeFX.accordion.closeAll(title.closest('.exe-fx'));
                content.slideDown(300).addClass('open');
                title.addClass('active');
                arrow.addClass('rotated');
            }
        },

        enable: function (e) {
            $(".fx-accordion-title", e).click(function (ev) {
                ev.preventDefault();
                $exeFX.accordion.toggle($(this));
            });
        },

        rft: function (e, i) {
            var html = "";
            var h = e.html();
            h = $exeFX.rftTitles(h);

            var p = h.split('<' + $exeFX.h2 + '>');
            if (p.length == h.split('</' + $exeFX.h2 + '>').length) {
                for (var x = 1; x < p.length; x++) {
                    html += '<' + $exeFX.h2 + '>' + p[x];
                }
            }

            if ($exeFX.isOldBrowser) {
                html = html.replace(/<H2>/g, '<h2 class="fx-accordion-title">');
            } else {
                html = html.replace(/<h2>/g, '<h2 class="fx-accordion-title">');
            }

            html = html.replace(/<\/h2>/g, ' <span class="fx-arrow">&#9662;</span></h2><div class="fx-accordion-content"></div>');

            if (html == "") { $exeFX.noFX(e); return; }

            e.html('<div id="' + $exeFX.baseClass + '-accordion-' + i + '" class="exe-fx">\n<div class="fx-accordion-section">\n' + html + '\n</div>\n</div>\n');

            var sections = $(".fx-accordion-section", e);
            sections.each(function (index) {
                var titles = $(".fx-accordion-title", this);
                titles.each(function (y) {
                    var content = $(this).next(".fx-accordion-content");
                    var originalContent = $(this).nextAll().not(".fx-accordion-title").detach();
                    content.append(originalContent);
                });
            });

            $exeFX.accordion.enable(e);
        },

        init: function (x, i) {
            var e = $(x);
            var a = $("h2", e);
            if (a.length > 0) $exeFX.accordion.rft(e, i);
            else $exeFX.noFX(e);
        }
    },

    rftTitles: function (t) {
        var div = $("<div></div>");
        div.html(t);
        $("h2", div).each(function () {
            var attributes = $.map(this.attributes, function (item) {
                return item.name;
            });
            var title = $(this);
            $.each(attributes, function (i, item) {
                if (item.toLowerCase() != "title") title.removeAttr(item);
            });
        });
        t = div.html();
        return t;
    }
};

$(document).ready(function () {
    $exeFX.init();
});
