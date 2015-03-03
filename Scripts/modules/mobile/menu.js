define(['jquery', 'kendo', 'loadThen', 'modules/repairOrders', 'modules/menu'],
function ($, kendo, loadThen, ro, menu) {
    var init = function () {
        //define  vm for menu
        //debugger
        //var viewModel = kendo.observable({
        //    items: menu.menuItems,
        //    onClick: function (e) {
        //        //get target
        //        var target = $(e.target);

        //        var span;
        //        if (target.prop('tagName') == 'A') {
        //            span = target.find('span');
        //        } else if (target.prop('tagName') == 'I') {
        //            span = target.parent().find('span');
        //        } else {
        //            span = target;
        //        }

        //        //set menu item as active
        //        $('.route-top').removeClass('active');
        //        span.parent().parent().addClass('active');

        //        //navigate
        //        var id = span.data('id');
        //        var text = span.text();

        //        // update the browser's URL / hash route
        //        router.navigate(text, false);


        //        //refresh content
        //        window.app.navigate('views/mobile/' + id + '.html')

        //        //    .then(function () {
        //        //    if (id == 'reconmonitor') ro.init();
        //        //}, function () {
        //        //    // error
        //        //});

        //    }
        //});

        ////bind vm to the content
        //kendo.bind($('#menuListView'), viewModel);

        //// Define a router with a basic routes
        //var router = new kendo.Router();
        //// start the router to handle the routes
        //router.start();

        $('#menuListView').kendoMobileListView({
            template: "<a href='/vies/mobile/#:url#.html'><i class='#:icon#'></i> #:name#</a>",
            dataSource: kendo.data.DataSource.create({ data: menu.items })
        });
    };

    return {
        init: init
    };
});



