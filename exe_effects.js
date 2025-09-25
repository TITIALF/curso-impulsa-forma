// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez para restaurar ambos desplegables
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)

$exeFX = {
    baseClass : "exe",
    h2 : "h2",
    isOldBrowser : false,

    // ===== Inicialización principal =====
    init : function(){
        var ie = $exeFX.checkIE();
        if ((!isNaN(parseFloat(ie)) && isFinite(ie)) && ie<9) {
            $exeFX.isOldBrowser = true;
            $exeFX.h2 = "H2";
        }
        var k = $exeFX.baseClass;
        $("."+k+"-fx").each(function(i){
            var c = this.className;
            if (c.indexOf(" "+k+"-accordion")!=-1) $exeFX.accordion.init(this,i);
            else if (c.indexOf(" "+k+"-tabs")!=-1) $exeFX.tabs.init(this,i);
        });
    },

    // ===== Utilidades =====
    rftTitles : function(t) {
        var div = $("<div></div>");
        div.html(t);
        $("h2",div).each(function() {
            var attributes = $.map(this.attributes, function(item) { return item.name; });
            var title = $(this);
            $.each(attributes, function(i, item) { if (item.toLowerCase()!="title") title.removeAttr(item); });
        });
        return div.html();
    },

    noFX : function(e) {
        e.attr("class","").css("padding","1em");
    },

    checkIE : function(){
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },

    // ===== Accordion =====
    accordion : {
        enable : function(e){
            $(".fx-accordion-title",e).click(function(ev){
                ev.preventDefault();
                var parent = $(this).parent();
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $(this).next('.fx-accordion-content').slideUp(300).removeClass('open');
                } else {
                    $(this).removeClass('active');
                    $(this).next('.fx-accordion-content').slideUp(300).removeClass('open');
                    $(this).addClass('active');
                    $(this).next('.fx-accordion-content').slideDown(300).addClass('open');
                }
            });
        },
        rft : function(e,i){
            var html = "";
            var h = e.html();
            h = $exeFX.rftTitles(h);

            // Dividir por cada H2
            var sections = h.split(/<h2.*?<\/h2>/gi);
            var titles = h.match(/<h2.*?<\/h2>/gi) || [];

            for (var x=0;x<titles.length;x++){
                html += titles[x] + '<div class="fx-accordion-content">'+sections[x+1]+'</div>';
            }

            if(html==""){$exeFX.noFX(e);return;}

            e.html('<div id="'+$exeFX.baseClass+'-accordion-'+i+'" class="fx-accordion-section">'+html+'</div>');
            $exeFX.accordion.enable(e);

            // Inicialmente todos cerrados
            $(".fx-accordion-content",e).hide();
        },
        init : function(x,i){
            var e = $(x);
            var a = $("h2",e);
            if(a.length>0) $exeFX.accordion.rft(e,i);
            else $exeFX.noFX(e);
        }
    },

    // ===== Tabs =====
    tabs : { 
        init : function(e,i){} 
    }
};

$(document).ready(function(){ $exeFX.init(); });
