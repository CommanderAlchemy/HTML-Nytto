/*
 *  Author: Artur Olech M10P2603
 */

/**
 * Pagecreate event is run by JqueryMobile
 **/
$(document).one("pagecreate", "#index", function () {
    console.log("pagecreate index");
    initLocalStorage();
    initMenuListener();
    initAjaxLoadingListener();
    initSwipeListener();

    //Checks if localStorage is available.
    function initLocalStorage() {
        try {
            if ('localStorage' in window && ['localStorage'] !== null) {}
        } catch (e) {
            alert("localstorage not supported");
        }
    }

    //Initiates the menu listener.
    function initMenuListener() {
        /*
            Left Panel
         */
        // Prevent default behavior and use ajax to load pages.
        $("#nav").on("click", "a", function (e) {
            e.preventDefault();
            var page = $(this).attr("href");
            var title = $(this).html();
            // Dont load a href link from the closebutton in menu.
            if (page != '#closeleft') {
                loadPage(page, title);
            }
        });

        // Close left panel when clicking on menu item
        $("#nav-panel").on("click", "li", function () {
            $("#nav-panel").panel("close");
        });

    }

    //Shows loading information when ajax is used.
    function initAjaxLoadingListener() {
        // Ajax started
        $(document).ajaxStart(function () {
            // Show loading gif
            $.mobile.loading("show", {
                text: "loading...",
                textVisible: false
            });

            // Put info about ajax starting into console.
            console.log("Ajax: START");
        });

        // Ajax was successfull and completed.
        $(document).ajaxComplete(function () {
            // Hide the loading gif.
            $.mobile.loading("hide");
            console.log("Ajax: Complete");
        });

        // Something went wrong
        $(document).ajaxError(function (e, xhr, options, error) {
            // Show that an error occured to the user.
            $.mobile.loading("show", {
                text: "error...",
                textVisible: true
            });

            // Print error message in console.
            console.log("\n\nAjax: Error BEGIN \n>>>>>>>>>>>>>>>>>\n\n" + error + "\n");
            console.log(e);
            console.log(xhr);
            console.log(options);
            console.log("\n\n<<<<<<<<<<<<<<< \nAjax: Error END\n\n");

            // Wait 5seconds until the error message dissapears.
            window.setTimeout(function () {
                $.mobile.loading("hide");
            }, 5000);

        });
    }

    // Loads the swipe listener.
    function initSwipeListener() {
        // Listen on swipes on framework and open left panel depending on swype direction.
        $("#framework").on("swipeleft swiperight", function (e) {
            console.log("swype");
            if ($.mobile.activePage.jqmData("panel") !== "open") {
                if (e.type === "swiperight") {
                    $("#nav-panel").panel("open");
                } 
            } else {
                $("#nav-panel").panel("close");
            }
        });
    }

    //Loads a page (content) with ajax.
    function loadPage(page, title) {
        console.log(page + " " + title);
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        $.get(page, function (data) {
            $("#content", activePage).html(data).enhanceWithin();
            $("#titlepage").html(title);
        });
    }
});
