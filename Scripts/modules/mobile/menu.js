define(['jquery', 'kendo', 'loadThen', 'modules/repairOrders', 'modules/menu'],
function ($, kendo, loadThen, ro, menu) {

    /************** PUBLICK *****************/

    window.openMenu = function() {
        var item = $("#menuList");
        if (menuOpenFlag)
            menu.close(item);
        else
            menu.open(item);
        menuOpenFlag = !menuOpenFlag;
    };

    window.showMenuBtn = function(){
        $(".menu-toggle-btn").css('visibility', 'hidden');
    };
    window.hideMenuBtn = function() {
        $(".menu-toggle-btn").css('visibility', 'visible');
    };

    /**************** PRIVATE ************/

    var menuOpenFlag = false,
        menuItems = [
        { name: 'Service Requests', url: 'service-requests-view', icon: 'icon-paperplane' },
        { name: 'Recon Monitor', url: 'recon-monitor-view', icon: 'icon-target' },
        { name: 'Estimates', url: 'estimates-view', icon: 'icon-clipboard' },
        { name: 'Invoices', url: 'invoices-view', icon: 'icon-creditcard' },
        { name: 'Dashboard', url: 'dashboard-view', icon: 'icon-tools' },
        { name: 'Reports', url: 'reports-view', icon: 'icon-archive' },
        { name: 'Notifications', url: 'notifications-view', icon: 'icon-bell' },
        { name: 'Logout', url: 'logout-view', icon: 'icon-logout' }
    ];

    var onSelectMenu = function(e) {
    };
    var onOpenMenu = function(e) {
        menuOpenFlag = true;
        $(".menu-toggle-btn").css('background-color', '#f00');
        $(".icon-list").css('color', '#fff', 'important');
    };
    window.onCloseMenu = function(e) {
        menuOpenFlag = false;
        $(".menu-toggle-btn").css('background-color', '#fff');
        $(".icon-list").css('color', '#000', 'important');
    };
    var onActivateMenu = function(e) {
    };
    var onDeactivateMenu = function(e) {
    };

    var init = function () {
        $("#menu").kendoMenu({
            select: onSelectMenu,
            open: onOpenMenu,
            close: window.onCloseMenu,
            activate: onActivateMenu,
            deactivate: onDeactivateMenu
        });
        menu = $("#menu").data("kendoMenu");

        $('#menuListView').kendoMobileListView({
            template: "<a href='#:url#' onclick='{window.onCloseMenu()}'><i class='#:icon#'></i> #:name#</a>",
            dataSource: kendo.data.DataSource.create({ data: menuItems })
        });
    };

    return {
        init: init,
        items: menuItems,
        stat: menuOpenFlag
    };
});



