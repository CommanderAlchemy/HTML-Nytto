/*
 *  Author: Artur Olech M10P2603
 *
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
            if ('localStorage' in window && ['localStorage'] !== null) {
                var token = localStorage.getItem("icu-token");
                console.log("Token:" + token);
                if (token === null) {
                    console.log("Token missing, rederict to login!");
                    window.location.replace("login.html");
                }
                else {
                    loadPage("html/start.html",'<span class="ui-start-icon nav-ui-thumbnail"></span><h1 class="ui-li-headline">Startsida</h1>');
                }
            }
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
			console.log("NY SIDA: " + page);
            // Dont load a href link from the closebutton in menu.
            if (page != '#closeleft') {
                loadPage(page, title);
            }
        });

        // Close left panel when clicking on menu item
        $("#nav-panel").on("click", "li", function () {
            $("#nav-panel").panel("close");
        });


        /*
            Right Panel
         */
        $("#nav-right").on("click", "a", function (e) {
            e.preventDefault();
            var page = $(this).attr("href");
            var title = $(this).html();
			console.log(page);
            // Dont load a href link from the closebutton in menu.
            if (page != '#closeright') {
			
				/*
					These two lines is for parents app only. No effect on teachers app right now but when
					teachers right menu is updated, watch for trouble.
				*/
                localStorage.setItem("studentName", $(this).find('h1').text());
				localStorage.setItem("studentId", $(this).find('input').val());
                
				
				loadPage(page, title);
            }
        });

        // Close right panel when clicking on menu item
        $("#panel-right").on("click", "li", function () {
            $("#panel-right").panel("close");
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
        // Listen on swipes on framework and open left/right panel depending on swype direction.
        // Two panels won't open at the same time.
        $("#framework").on("swipeleft swiperight", function (e) {
            console.log("swype");
            if ($.mobile.activePage.jqmData("panel") !== "open") {
                if (e.type === "swipeleft") {
                    $("#panel-right").panel("open");
                } else if (e.type === "swiperight") {
                    $("#nav-panel").panel("open");
                }
            } else {
                $("#nav-panel").panel("close");
                $("#panel-right").panel("close");
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
