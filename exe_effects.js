/*
 * exe_effects.js
 * JavaScript for eXeLearning's effects (accordion, tabs, etc.)
 * Created by Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */

var FX = FX || {};

FX.run = function() {
    FX.accordion();
    FX.tabs();
    FX.paginated();
    FX.carousel();
    FX.timeline();
};

FX.accordion = function() {
    // Accordion
    $(".exe-accordion").each(function(){
        var accordion = $(this);
        var accordionSections = accordion.find(".fx-accordion-section");
        var activeTitle = accordion.find(".fx-accordion-title.active");

        accordionSections.each(function(){
            var section = $(this);
            var title = section.find(".fx-accordion-title");
            var content = section.find(".fx-accordion-content");

            // Open the content if the title has the 'active' class (for iDevice content)
            if(title.hasClass("active")){
                content.show();
            }

            title.click(function(e){
                e.preventDefault();
                var isActive = title.hasClass("active");

                // Check if it's currently active (open)
                if(isActive){
                    // Close the section
                    content.slideUp(200);
                    title.removeClass("active");
                } else {
                    // Close all other open sections in the same accordion
                    accordionSections.each(function(){
                        var otherTitle = $(this).find(".fx-accordion-title");
                        var otherContent = $(this).find(".fx-accordion-content");
                        if(otherTitle.hasClass("active")){
                            otherContent.slideUp(200);
                            otherTitle.removeClass("active");
                        }
                    });

                    // Open the clicked section
                    content.slideDown(200);
                    title.addClass("active");
                }
            });
        });
    });
};

FX.tabs = function() {
    // Tabs
    $(".exe-tabs").each(function(){
        var tabs = $(this);
        var tabsList = tabs.find(".fx-tabs li");
        var tabsContent = tabs.find(".fx-tab-content");

        tabsList.find("a").click(function(e){
            e.preventDefault();
            var tabID = $(this).attr("href");

            // Remove current state from all tabs and content
            tabsList.removeClass("fx-current");
            tabsContent.removeClass("fx-current").hide();

            // Set current state to the clicked tab and content
            $(this).parent().addClass("fx-current");
            $(tabID).addClass("fx-current").show();
        });

        // Initialize: show the first tab content unless one is already set as current
        if(tabs.find(".fx-tabs li.fx-current").length === 0){
            tabsList.first().addClass("fx-current");
            tabsContent.first().addClass("fx-current").show();
        }
    });
};

FX.paginated = function() {
    // Paginated content
    $(".exe-paginated").each(function(){
        var paginated = $(this);
        var pagination = paginated.find(".fx-pagination li");
        var pageContent = paginated.find(".fx-page-content");
        var prevBtn = paginated.find(".fx-pagination .fx-prev a");
        var nextBtn = paginated.find(".fx-pagination .fx-next a");

        pagination.find("a").click(function(e){
            e.preventDefault();
            var pageID = $(this).attr("href");

            // Handle previous/next buttons
            if($(this).parent().hasClass("fx-prev")){
                var currentPageIndex = pagination.filter(".fx-current").index();
                if(currentPageIndex > 0){
                    pagination.removeClass("fx-current");
                    pagination.eq(currentPageIndex - 1).addClass("fx-current");
                    pageContent.removeClass("fx-current").hide();
                    pageContent.eq(currentPageIndex - 1).addClass("fx-current").show();
                }
            } else if($(this).parent().hasClass("fx-next")){
                var currentPageIndex = pagination.filter(".fx-current").index();
                if(currentPageIndex < pagination.length - 1){
                    pagination.removeClass("fx-current");
                    pagination.eq(currentPageIndex + 1).addClass("fx-current");
                    pageContent.removeClass("fx-current").hide();
                    pageContent.eq(currentPageIndex + 1).addClass("fx-current").show();
                }
            } else {
                // Handle direct page links
                pagination.removeClass("fx-current");
                $(this).parent().addClass("fx-current");
                pageContent.removeClass("fx-current").hide();
                $(pageID).addClass("fx-current").show();
            }

            // Update disable/enable state of prev/next buttons
            var currentIndex = pagination.filter(".fx-current").index();
            prevBtn.parent().removeClass("fx-disabled");
            nextBtn.parent().removeClass("fx-disabled");
            if(currentIndex === 0){
                prevBtn.parent().addClass("fx-disabled");
            }
            if(currentIndex === pagination.length - 1){
                nextBtn.parent().addClass("fx-disabled");
            }
        });

        // Initialize
        pageContent.first().addClass("fx-current").show();
        pagination.first().addClass("fx-current");
        prevBtn.parent().addClass("fx-disabled");
    });
};

FX.carousel = function() {
    // Carousel
    $(".exe-carousel").each(function(){
        var carousel = $(this);
        var pagination = carousel.find(".fx-carousel-pagination li");
        var content = carousel.find(".fx-carousel-content");
        var prevBtn = carousel.find(".fx-carousel-prev-next .fx-carousel-prev a");
        var nextBtn = carousel.find(".fx-carousel-prev-next .fx-carousel-next a");

        // Click handler
        pagination.find("a").click(function(e){
            e.preventDefault();
            var isPrevNext = $(this).parent().hasClass("fx-carousel-prev-next");
            var goToIndex = -1;

            if($(this).parent().hasClass("fx-carousel-prev")){
                // Previous button
                var currentIndex = pagination.filter(".fx-current").index();
                goToIndex = currentIndex > 0 ? currentIndex - 1 : content.length - 1; // Loop to end
            } else if($(this).parent().hasClass("fx-carousel-next")){
                // Next button
                var currentIndex = pagination.filter(".fx-current").index();
                goToIndex = currentIndex < content.length - 1 ? currentIndex + 1 : 0; // Loop to beginning
            } else {
                // Direct pagination click
                var contentID = $(this).attr("href");
                goToIndex = $(contentID).index(".fx-carousel-content");
            }

            // Update current state
            if(goToIndex !== -1){
                pagination.removeClass("fx-current");
                pagination.eq(goToIndex).addClass("fx-current");
                content.removeClass("fx-current").hide();
                content.eq(goToIndex).addClass("fx-current").show();
            }
        });

        // Initialize
        content.first().addClass("fx-current").show();
        pagination.first().addClass("fx-current");
    });
};

FX.timeline = function() {
    // Timeline
    $(".fx-timeline-major h3 a").click(function(e){
        e.preventDefault();
        var link = $(this);
        var eventContent = link.closest("h3").next(".fx-timeline-event");

        if(link.hasClass("open")){
            eventContent.slideUp(200);
            link.removeClass("open");
        } else {
            eventContent.slideDown(200);
            link.addClass("open");
        }
    });

    // Expand all/Collapse all
    $(".fx-timeline-container a.fx-timeline-expand").click(function(e){
        e.preventDefault();
        var expandLink = $(this);
        var timelineContainer = expandLink.closest(".fx-timeline-container");
        var allEvents = timelineContainer.find(".fx-timeline-event");
        var allTitles = timelineContainer.find(".fx-timeline-major h3 a");

        if(expandLink.text().indexOf("Mostrar") !== -1 || expandLink.text().indexOf("Expand") !== -1){
            allEvents.slideDown(200);
            allTitles.addClass("open");
            expandLink.text(expandLink.text().replace("Mostrar todo", "Ocultar todo").replace("Expand all", "Collapse all"));
        } else {
            allEvents.slideUp(200);
            allTitles.removeClass("open");
            expandLink.text(expandLink.text().replace("Ocultar todo", "Mostrar todo").replace("Collapse all", "Expand all"));
        }
    });
};

// Check if jQuery is loaded before running effects
if(window.jQuery) {
    $(document).ready(function() {
        FX.run();
    });
}
