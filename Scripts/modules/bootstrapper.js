define(['jquery', 'bootstrap', 'kendo', 'loadThen', 'modules/status', 'modules/menu', 'modules/users'],
function ($, bootstrap, kendo, loadThen, status, menu, user) {

    var content = $('body #page');

    function initLoginPage() {
        $.get('views/login.html', function(data) {
            content.html(data);
            user.showlogin(initHomePage);
        });
    }

    function initHomePage() {
        $.get('views/home.html', function(data) {
            content.html(data);
            status.init();
            menu.init();
            user.showlogout(initLoginPage);
        });
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

    return {
        init: function () {
            //alert();
            app.start();
        }
    };
});



