define(['jquery', 'kendo', 'loadThen', 'modules/repairOrders'],
function ($, kendo, loadThen, ro) {
    var menuItems = [
        { name: 'Service Requests', url: 'servicerequests', icon: 'icon-paperplane' },
        { name: 'Recon Monitor', url: 'reconmonitor', icon: 'icon-target' },
        { name: 'Estimates', url: 'estimates', icon: 'icon-clipboard' },
        { name: 'Invoices', url: 'invoices', icon: 'icon-creditcard' },
        { name: 'Dashboard', url: 'dashboard', icon: 'icon-tools' },
        { name: 'Reports', url: 'reports', icon: 'icon-archive' },
        { name: 'Notifications', url: 'notifications', icon: 'icon-bell' }
    ];

   var init = function () {
       //define  vm for menu

        var viewModel = kendo.observable({
            items: menuItems,
            onClick: function (e) {
                //get target
                var target = $(e.target);

                var span;
                if (target.prop('tagName') == 'A') {
                    span = target.find('span');
                } else if (target.prop('tagName') == 'I') {
                    span = target.parent().find('span');
                } else {
                    span = target;
                }

                //set menu item as active
                $('.route-top').removeClass('active');
                span.parent().parent().addClass('active');

                //navigate
                var id = span.data('id');
                var text = span.text();

                // update the browser's URL / hash route
                router.navigate(text, false);

                
                //refresh content
                $('.main').loadThen('views/' + id + '.html').then(function () {
                    if (id == 'reconmonitor') ro.init();
                }, function () {
                    // error
                });

            }
        });

        //bind vm to the content
        kendo.bind($('#menu > ul'), viewModel);

       // Define a router with a basic routes
        var router = new kendo.Router();
       // start the router to handle the routes
        router.start();
   };

    return {
        init: init,
        items: menuItems
    };
});



