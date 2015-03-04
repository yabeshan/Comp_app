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

    var app = {
        pages: {
            home: initHomePage,
            login: initLoginPage,
        },
        start: function () {
            if (user.checkAuthenticated()) {
                window.app.navigate('recon-monitor-view', 'slide');
            } else {
                window.app.navigate('logout-view', 'slide');
            }
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
            menu.init();
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
                app.start();
            }
        }
    };
});



