define(['jquery', 'bootstrap', 'kendo', 'loadThen', 'modules/status', 'modules/mobile/menu', 'modules/users'],
function ($, bootstrap, kendo, loadThen, status, menu, user) {

    var content = $('body #page');

    function initLoginPage() {
        window.app.navigate('views/mobile/login.html', 'slide');
        setTimeout(function () {
            user.showlogin(initHomePage);
        }, 1000);
    }

    function initHomePage() {
        alert('init home page');
        window.app.navigate('views/mobile/home.html', 'slide');
    }

    function initMenu() {
        $("#menu").kendoMenu({
            direction: "left"
        });
        menu = $("#menu").data("kendoMenu");
        flag = false;

        window.openMenu = function() {
            var item = $("#Item1");
            if (flag)
                menu.close(item);
            else
                menu.open(item);
            flag = !flag;
        };
    }

    var app = {
        pages: {
            home: initHomePage,
            login: initLoginPage,
        },
        start: function () {
//            if (user.checkAuthenticated() || true) {
//                this.pages.home();
//            } else {
//                this.pages.login();
//            }
        }
    };

    var homeAfterShow = function () {
        alert('home after show');
        status.init();
        menu.init();
        user.showlogout(initLoginPage);
    };

    $.extend(window, {
        mobileApp: {
            init: function(){
                menu.init();
            },
            status: status,
            menu: menu,
            user: user
        },
        home: {
            afterShow: homeAfterShow
        }
    });

    return {
        init: function () {
            initMenu();
            alert(kendo.mobileOs);
            if (kendo.mobileOs) {
                document.addEventListener('deviceready', function () {
                    alert("deviceready");
                    var kendoApp = new kendo.mobile.Application(document.body, {
                        skin:"flat",
                        layout: "main-layout",
                        transition: "slide"
                    });
                    window.app = kendoApp;
                    app.start();
                    navigator.splashscreen.hide();
                }, false);
                alert("kendo.mobileOs = " + kendo.mobileOs );
            } else {
                var kendoApp = new kendo.mobile.Application(document.body, {
                    layout: "main-layout",
                    transition: "slide" });
                window.app = kendoApp;
//                app.start();
            }
        }
    };
});



