define(['jquery', 'bootstrap', 'kendo', 'loadThen', 'modules/status', 'modules/mobile/menu', 'modules/users', 'modules/repairOrders'],
function ($, bootstrap, kendo, loadThen, status, menu, user, ro) {

    var content = $('body #page');

    function initLoginPage() {
        window.app.navigate('views/mobile/login.html', 'slide');
        setTimeout(function () {
            user.showlogin(initHomePage);
        }, 1000);
    }

    function initHomePage() {
        window.app.navigate('views/mobile/home.html', 'slide');
    }

    var app = {
        pages: {
            home: initHomePage,
            login: initLoginPage,
        },
        start: function () {
            if (user.checkAuthenticated()) {
                this.pages.home();
            } else {
                this.pages.login();
            }
        }
    };

    var homeAfterShow = function () {
        status.init();
        menu.init();
        user.showlogout(initLoginPage);
    };

    $.extend(window, {
        mobileApp: {
            init: function(){
                menu.init();
            },
            ro: ro,
            status: status,
            menu: menu,
            user: user
        },
        home: {
            afterShow: homeAfterShow
        },
        ro: ro
    });

    return {
        init: function () {
            var kendoApp = new kendo.mobile.Application(document.body, { layout: "main-layout" });
            //var kendoApp = new kendo.mobile.Application(document.body);
            window.app = kendoApp;
            app.start();
        },
    };
});



