// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// CORRECCIONES por Alfonso Sánchez para restaurar desplegables y normalizar HTML
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
        var f = $("."+k+"-fx");
        var hasTimeLines = false;
        $("."+k+"-fx").each(function(i){
            var c = this.className;
            if (c.indexOf(" "+k+"-accordion")!=-1) $exeFX.accordion.init(this,i);
            else if (c.indexOf(" "+k+"-collapsible")!=-1) $exeFX.collapsible.init(this,i);
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
            var attributes = $.map(this.attributes, function(item) {
                return item.name;
            });
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

    // ===== Accordion (primer desplegable) =====
    accordion : {
        closeBlock : function(aID){
            var k = $exeFX.baseClass;
            $('.fx-accordion-title',"#"+aID).removeClass('active');
            $('.fx-accordion-content',"#"+aID).slideUp(300).removeClass('open');
        },
        enable : function(e){
            $(".fx-accordion-title",e).click(function(ev){
                ev.preventDefault();
                var parent = $(this).parent();
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.fx-accordion-content',parent).slideUp(300).removeClass('open');
                } else {
                    $('.fx-accordion-title',parent).removeClass('active');
                    $('.fx-accordion-content',parent).slideUp(300).removeClass('open');
                    $(this).addClass('active');
                    $(this).next('.fx-accordion-content').slideDown(300).addClass('open');
                }
            });
        },
        rft : function(e,i){
            var html = "";
            var h = e.html();
            h = $exeFX.rftTitles(h);
            var p = h.split('<'+$exeFX.h2+'>');
            if (p.length==h.split('</'+$exeFX.h2+'>').length) {
                for (var x=1; x<p.length; x++) {
                    html += '<'+$exeFX.h2+'>'+p[x];
                }
            }

            var k = $exeFX.baseClass;
            if ($exeFX.isOldBrowser) {
                html = html.replace(/<H2>/g, '<h2 class="fx-accordion-title">');
                html = html.replace(/<\/H2>/g, '</h2><div class="fx-accordion-content">');
            } else {
                html = html.replace(/<h2>/g, '<h2 class="fx-accordion-title">');
                html = html.replace(/<\/h2>/g, '</h2><div class="fx-accordion-content">');
            }

            html = html + '</div>'; // cierre único de último div

            if (html=="") { $exeFX.noFX(e); return; }

            e.html('<div id="'+k+'-accordion-'+i+'">\n<div class="fx-accordion-section">\n'+html+'\n</div>\n</div>\n');

            var h2 = $("h2",e);
            $(".fx-accordion-content",e).each(function(y){
                var id = k+"-accordion-"+i+"-"+y;
                this.id = id;
                h2.eq(y).wrap('<a class="fx-accordion-title fx-accordion-title-'+y+' fx-C1" href="#'+id+'" id="'+id.replace(/-/g,"_")+'-trigger"></a>');
            });
            $exeFX.accordion.enable(e);
        },
        init : function(x,i){
            var e = $(x);
            var a = $("h2",e);
            if (a.length>0) $exeFX.accordion.rft(e,i);
            else $exeFX.noFX(e);
        }
    },

    // ===== Collapsible (segundo desplegable) =====
    collapsible : {
        enable : function(e){
            $(".fx-collapsible-title",e).click(function(ev){
                ev.preventDefault();
                $(this).toggleClass('active');
                $(this).next('.fx-collapsible-content').slideToggle(300).toggleClass('open');
            });
        },
        rft : function(e,i){
            var html = "";
            var h = e.html();
            h = $exeFX.rftTitles(h);
            var p = h.split('<'+$exeFX.h2+'>');
            if (p.length==h.split('</'+$exeFX.h2+'>').length) {
                for (var x=1; x<p.length; x++) {
                    html += '<'+$exeFX.h2+'>'+p[x];
                }
            }

            if ($exeFX.isOldBrowser) {
                html = html.replace(/<H2>/g, '<h2 class="fx-collapsible-title">');
                html = html.replace(/<\/H2>/g, '</h2><div class="fx-collapsible-content">');
            } else {
                html = html.replace(/<h2>/g, '<h2 class="fx-collapsible-title">');
                html = html.replace(/<\/h2>/g, '</h2><div class="fx-collapsible-content">');
            }

            html = html + '</div>';

            if (html=="") { $exeFX.noFX(e); return; }

            e.html('<div id="exe-collapsible-'+i+'">\n<div class="fx-collapsible-section">\n'+html+'\n</div>\n</div>\n');

            var h2 = $("h2",e);
            $(".fx-collapsible-content",e).each(function(y){
                var id = "exe-collapsible-"+i+"-"+y;
                this.id = id;
                h2.eq(y).wrap('<a class="fx-collapsible-title fx-collapsible-title-'+y+' fx-C1" href="#'+id+'" id="'+id.replace(/-/g,"_")+'-trigger"></a>');
            });
            $exeFX.collapsible.enable(e);
        },
        init : function(x,i){
            var e = $(x);
            var a = $("h2",e);
            if (a.length>0) $exeFX.collapsible.rft(e,i);
            else $exeFX.noFX(e);
        }
    },

    // ===== Tabs =====
    // (… aquí sigue igual lo que ya tienes: tabs, paginated, carousel, timeline …)
};
