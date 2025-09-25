// Effects Plugin for eXeLearning (REVISADO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez para restaurar los desplegables
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
            else if (c.indexOf(" "+k+"-paginated")!=-1) $exeFX.paginated.init(this,i);
            else if (c.indexOf(" "+k+"-carousel")!=-1) $exeFX.carousel.init(this,i);
            else if (c.indexOf(" "+k+"-timeline")!=-1 && document.body.className.indexOf("exe-epub3")!=0) {
                $exeFX.timeline.init(this,i);
            }
        });
    },

    // ===== Utilidades =====
    hex2rgb : function(h,a){
        var hex = parseInt(h.substring(1), 16);
        var r = (hex & 0xff0000) >> 16;
        var g = (hex & 0x00ff00) >> 8;
        var b = hex & 0x0000ff;
        var c = "rgb";
        if (a) c += "a";
        c += "("+r+","+g+","+b+"";
        if (a) c+= ","+a;
        c += ")";
        return c;
    },

    iframesCheck : function(block){
        var iframes = $("iframe",block);
        iframes.each(function(){
            if (this.src && typeof(this.src)=="string"){
                var e = $(this);
                var c = "exeFXcheckedIframe";
                if (!e.hasClass(c)){
                    e.addClass(c);
                    this.src = this.src; // reload once
                }
            }
        });
    },

    checkIE : function(){
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },

    noFX : function(e) {
        e.attr("class","").css("padding","1em");
    },

    removeXMLNS : function(t) {
        if (document.body.className.indexOf("exe-epub3")==0) {
            var xmlnsString = 'h2 xmlns="http://www.w3.org/1999/xhtml"';
            var xmlnsStringExp = new RegExp(xmlnsString, 'g');
            t = t.replace(xmlnsStringExp, 'h2');
        }
        return t;
    },

    rftTitles : function(t) {
        var div = $("<div></div>");
        div.html(t);
        $("h2",div).each(function() {
            var attributes = $.map(this.attributes, function(item) { return item.name; });
            var title = $(this);
            $.each(attributes, function(i, item) {
                if (item.toLowerCase()!="title") title.removeAttr(item);
            });
        });
        t = div.html();
        t = $exeFX.removeXMLNS(t);

        var s = t.split('<'+$exeFX.h2+' title="');
        var n ="";
        if (s.length<2) return t;
        for (var i=0;i<s.length;i++) {
          n += s[i];
          if (i<(s.length-1)) n += '<'+$exeFX.h2+'><span title="';
          n = n.replace("</"+$exeFX.h2+">","</span></"+$exeFX.h2+">");
        }
        return n;
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
                    $(this).find(".fx-arrow").removeClass("rotated");
                } else {
                    // Solo se cierra el mismo bloque
                    $('.fx-accordion-title',parent).removeClass('active');
                    $('.fx-accordion-content',parent).slideUp(300).removeClass('open');
                    $('.fx-arrow',parent).removeClass("rotated");

                    $(this).addClass('active');
                    $(this).next('.fx-accordion-content').slideDown(300).addClass('open');
                    $(this).find(".fx-arrow").addClass("rotated");
                }
            });
        },
        rft : function(e,i){
            var html = e.html();
            html = $exeFX.rftTitles(html);

            // Reemplazo h2 por títulos de acordeón
            html = html.replace(/<h2>/g, '<h2 class="fx-accordion-title"><span class="fx-arrow">&#9656;</span> ');
            html = html.replace(/<\/h2>/g, '</h2><div class="fx-accordion-content" style="display:none"></div>');

            e.html('<div id="exe-accordion-'+i+'">'+html+'</div>');

            // Inicializar acordeón
            $exeFX.accordion.enable(e);
        },
        init : function(x,i){
            var e = $(x);
            var a = $("h2",e);
            if (a.length>0) $exeFX.accordion.rft(e,i);
            else $exeFX.noFX(e);
        }
    },

    // ===== Tabs =====
    tabs : {
        show : function(gID,id){
            var g = $("#"+gID);
            $(".fx-tabs li",g).removeClass("fx-current").removeClass("fx-C2");
            $("#"+id+"-link").addClass("fx-current fx-C2");
            $(".fx-tab-content",g).removeClass("fx-current");
            var block = $("#"+id);
            block.addClass("fx-current");
            $exeFX.iframesCheck(block);
        },
        init : function(e,i){ /* mantener como estaba */ }
    },

    // ===== Placeholder para otros efectos =====
    paginated : { init:function(){}, carousel:{init:function(){}} , timeline:{init:function(){}} 
};

// Inicializar al cargar
$(document).ready(function(){
    $exeFX.init();
});
