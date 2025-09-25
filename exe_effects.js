// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez: desplegables dobles, flechas giratorias, cerrados al cargar
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
        var hasTimeLines = false;
        $("."+k+"-fx").each(function(i){
            var c = this.className;
            if (c.indexOf(" "+k+"-accordion")!=-1) $exeFX.accordion.init(this,i);
            else if (c.indexOf(" "+k+"-tabs")!=-1) $exeFX.tabs.init(this,i);
            else if (c.indexOf(" "+k+"-paginated")!=-1) $exeFX.paginated.init(this,i);
            else if (c.indexOf(" "+k+"-carousel")!=-1) $exeFX.carousel.init(this,i);
            else if (c.indexOf(" "+k+"-timeline")!=-1 && document.body.className.indexOf("exe-epub3")!=0) {
                $exeFX.timeline.init(this,i);
                hasTimeLines = true;
            }
        });
        if (hasTimeLines) {
            setTimeout(function(){$.timeliner({});},500);
        }
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
        $("iframe",block).each(function(){
            var e = $(this);
            if (this.src && !e.hasClass("exeFXcheckedIframe")){
                e.addClass("exeFXcheckedIframe");
                this.src = this.src;
            }
        });
    },

    removeXMLNS : function(t) {
        if (document.body.className.indexOf("exe-epub3")==0) {
            t = t.replace(/h2 xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,"h2");
        }
        return t;
    },

    rftTitles : function(t) {
        var div = $("<div></div>").html(t);
        $("h2",div).each(function() {
            var title = $(this);
            $.each(this.attributes, function(i, item) {
                if (item.name.toLowerCase()!="title") title.removeAttr(item.name);
            });
        });
        t = div.html();
        t = $exeFX.removeXMLNS(t);

        var s = t.split('<'+$exeFX.h2+' title="');
        var n ="";
        if (s.length<2) return t;
        for (var i=0;i<s.length;i++) {
          n += s[i];
          if (i<(s.length-1))n += '<'+$exeFX.h2+'><span title="';
          n = n.replace("</"+$exeFX.h2+">","</span></"+$exeFX.h2+">");
        }
        return n;
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
                var thisContent = $(this).next(".fx-accordion-content");
                var arrow = $(this).find(".fx-arrow");

                if(thisContent.hasClass("open")){
                    thisContent.slideUp(300).removeClass("open");
                    $(this).removeClass("active");
                    arrow.css("transform","rotate(0deg)");
                } else {
                    // Cierra todos los demás
                    $(".fx-accordion-content",parent).slideUp(300).removeClass("open");
                    $(".fx-accordion-title",parent).removeClass("active").find(".fx-arrow").css("transform","rotate(0deg)");

                    thisContent.slideDown(300).addClass("open");
                    $(this).addClass("active");
                    arrow.css("transform","rotate(90deg)");
                }
            });
        },
        rft : function(e,i){
            var html = $exeFX.rftTitles(e.html());
            html = html.replace(/<h2>/g,'<h2 class="fx-accordion-title"><span class="fx-arrow">▶</span> ');
            html = html.replace(/<\/h2>/g,'</h2><div class="fx-accordion-content"></div>');

            e.html('<div id="'+$exeFX.baseClass+'-accordion-'+i+'" class="fx-accordion-section">'+html+'</div>');

            $(".fx-accordion-content",e).hide(); // Cerrado al cargar
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
            $(".fx-tabs li",g).removeClass("fx-current fx-C2");
            $("#"+id+"-link").addClass("fx-current fx-C2");
            $(".fx-tab-content",g).removeClass("fx-current");
            $("#"+id).addClass("fx-current");
            $exeFX.iframesCheck($("#"+id));
        },
        rft : function(e,i){
            var html = $exeFX.rftTitles(e.html());
            html = html.replace(/<h2/g,'<div class="fx-tab-content fx-C2"><h2 class="sr-av"');
            html = html.replace(/<\/h2>/g,'</h2></div>');
            e.attr("id",$exeFX.baseClass+"-tabs-"+i).html(html);

            var ul = '<ul class="fx-tabs">';
            $(".fx-tab-content",e).each(function(y){
                var h2 = $("h2",this).eq(0);
                var t = h2.text() || (y+1);
                var id = $exeFX.baseClass+"-tab-"+i+"-"+y;
                $(this).attr("id",id);
                var c = (y==0)?' class="fx-current fx-C2"':'';
                if(y==0) $(this).addClass("fx-current");
                ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" class="exeFXTabLink'+i+'">'+t+'</a></li>';
            });
            ul += '</ul>';
            e.prepend(ul);

            $(".fx-tabs a",e).click(function(ev){
                ev.preventDefault();
                var target = $(this).attr("href").substring(1);
                $exeFX.tabs.show(e.attr("id"),target);
            });
        },
        init : function(e,i){
            $exeFX.tabs.rft($(e),i);
        }
    },

    // ===== Placeholder para otras funcionalidades =====
    paginated : { init:function(){} },
    carousel : { init:function(){} },
    timeline : { init:function(){} }
};

// Inicializa cuando el documento esté listo
$(document).ready(function(){
    $exeFX.init();
});
