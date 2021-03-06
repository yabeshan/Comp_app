﻿define(['jquery', 'kendo', 'loadThen', 'modules/repairOrders', 'modules/menu'],
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
        searchMenuOpenFlag = false,
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
        $(".menu-toggle-btn").css('background-color', '#ed1c24');
        $(".icon-list").css('color', '#fff', 'important');
    };
    window.onCloseMenu = function(e) {
        menuOpenFlag = false;
        $(".menu-toggle-btn").css('background-color', '#fff');
        $(".icon-list").css('color', '#454545', 'important');
    };
    var onActivateMenu = function(e) {
    };
    var onDeactivateMenu = function(e) {
    };

    window.searchPanelOpen = function () {
        var item = $("#searchMenuList");
        if (searchMenuOpenFlag)
            searchMenu.close(item);
        else
            searchMenu.open(item);
        searchMenuOpenFlag = !searchMenuOpenFlag;
    }
    var onOpenSearchMenu = function() {
        searchMenuOpenFlag = true;
        $("#search-menu-btn").css('color', '#ed1c24', 'important');
    };
    var onCloseSearchMenu = function() {
        searchMenuOpenFlag = false;
        $("#search-menu-btn").css('color', '#454545', 'important');
    };

    window.startSearchFromMenu = function() {
        var item = $("#searchMenuList");
        searchMenu.close(item);
    };
    window.cancelSearchFromMenu = function() {
        var item = $("#searchMenuList");
        searchMenu.close(item);
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
            click: function(e) {
                var item = $("#menuList");
                menu.close(item);

//                window.onCloseMenu();
            //        var data = e.button.data();
//        if (data && data.id) alert(data.id);
            },
//            e,#:url#   href='#:url#'   data-id='#:url#'
            template: "<a href='#:url#'><i class='#:icon#'></i> #:name#</a>",
            dataSource: kendo.data.DataSource.create({ data: menuItems })

        });
    };

    var searchInit = function() {
        $("#search-menu").kendoMenu({
            open: onOpenSearchMenu,
            close: onCloseSearchMenu
        });
        searchMenu = $("#search-menu").data("kendoMenu");
    }

    return {
        init: init,
        searchInit: searchInit,
        items: menuItems,
        stat: menuOpenFlag
    };
});



