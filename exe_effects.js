// Effects Plugin for eXeLearning (CORREGIDO COMPLETO)
// Por Ignacio Gros / Alfonso Sánchez: ambos desplegables cerrados al inicio, flechas giratorias
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)

$exeFX = {
    baseClass : "exe",
    h2 : "h2",
    isOldBrowser : false,

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

    checkIE : function(){
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
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
        return t.replace(/h2 xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,"h2");
    },

    noFX : function(e) { e.attr("class","").css("padding","1em"); },
    iframesCheck : function(block){
        $("iframe",block).each(function(){
            var e = $(this);
            if (this.src && !e.hasClass("exeFXcheckedIframe")){
                e.addClass("exeFXcheckedIframe");
                this.src = this.src;
            }
        });
    },

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
            html = html.replace(/<\/h2>/g,'</h2><div class="fx-accordion-content" style="display:none;"></div>'); // Cerrado al cargar

            e.html('<div id="'+$exeFX.baseClass+'-accordion-'+i+'" class="fx-accordion-section">'+html+'</div>');
            $exeFX.accordion.enable(e);
        },
        init : function(x,i){
            var e = $(x);
            var a = $("h2",e);
            if (a.length>0) $exeFX.accordion.rft(e,i);
            else $exeFX.noFX(e);
        }
    },

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
        init : function(e,i){ $exeFX.tabs.rft($(e),i); }
    },

    paginated : { init:function(){} },
    carousel : { init:function(){} },
    timeline : { init:function(){} }
};

$(document).ready(function(){ $exeFX.init(); });
