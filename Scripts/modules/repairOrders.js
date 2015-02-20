define(['jquery', 'kendo', 'services/ordersSrv', 'modules/config', 'helpers/generalHelper', 'helpers/ordersHelper', 'helpers/pagingHelper'],
    function ($, kendo, srv, config, util, orderUtil) {

        var maxRecordCount = 300;
        var recordCount = 0; //Variable that represents total orders count 

        var buttonsCount = 6;
        var pageSizeConst = 6;

        function Filter() {
            this.locationId = null,
            this.departmentId = null,
            this.phaseId = null,
            this.dateFrom = null,
            this.dateTo = null,
            this.vin = '',
            this.roNo = '',
            this.stockNo = '',
            this.repairStatus = null,
            this.freeText = '',
            this.orderNum = '';
        }

        function Pager() {
            this.pageNumber = 0,
            this.pageSize = 6,
            this.skip = 0;
        }

        var filter = new Filter();
        var pager = new Pager();

        var init = function() {
            console.log('ro init')
            require(['modules/users'], function(user) {

                var ddl;

                function setDefaultLocation() {
                    var location = viewModel.get('location.value') || '';
                    filter.locationId = location != '' ? location : viewModel.get('location.source._data[1].locationId') || '';
                }

                function initSearch() {
                    var customPopup = $('#customPopup');
                    var menuTemplate = kendo.template($('#menuTemplate').html());

                    customPopup.html(menuTemplate({}));
                    kendo.bind($('#reconmonitor-view'), viewModel);

                    ddl = $('#ddl').kendoComboBox({
                        dataTextField: 'text',
                        dataValueField: 'value',
                        dataSource: [{ text: 'test', value: 0 }],
                        suggest: true,
                        open: function(e) {
                            e.preventDefault();

                            if ($('.k-datepicker').length == 0)
                                $('.dateInput').kendoDatePicker();

                            customPopup
                                .css("top", e.sender.wrapper.position().top + e.sender.wrapper.height())
                                .css("left", e.sender.wrapper.position().left)
                                //viewModel.popup.set("hidden", false);
                                .show("fast", function() {
                                    $(document).one("click", function(e) {
                                        if (!$(e.target).closest("#customPopup").length) {
                                            if (customPopup.is(":visible")) {
                                                customPopup.hide("fast");
                                            }
                                        }
                                    });
                                });
                        },
                        change: function(e) {
                            ////var cmb = this;
                            // selectedIndex of -1 indicates custom value
                            ////if (cmb.selectedIndex < 0 && !viewModel.allowCustomValues) {
                            ////    cmb.value(null); // or set to the first item in combobox
                            ////}
                        }
                    }).data("kendoComboBox");
                }

                function refreshData() {
                    setDefaultLocation();
                    srv.getOrders(pager, filter, function (ds) {
                        recordCount = ds.total();

                        var repairOrders = viewModel.prepareROitems(ds.data());

                        var pagingButtons = [];

                        if(recordCount)
                            pagingButtons = (buttonsCount > 1 ? pagingHelper.stylyzePageButtons(pagingHelper.getPageLinks(pagingHelper.getPagesCount(recordCount, pageSizeConst), 0), 1) : []);

                        viewModel.paging.nextPageDisabled = false;
                        viewModel.paging.prevPageDisabled = true;

                        if (!pagingButtons) {
                            pagingButtons = [];
                            viewModel.paging.set('arrowButtonsVisible', false);
                        } else {
                            viewModel.paging.set('arrowButtonsVisible', true);
                        }

                        viewModel.set('orders', repairOrders);
                        viewModel.get('paging').set('pagingButtons', pagingButtons);

                        viewModel.set('showRecordsCountWarning', recordCount >= maxRecordCount || recordCount == 0);

                        if (recordCount == 0)
                            viewModel.set('errorMessageText', 'No records matching criteria');
                        else
                            viewModel.set('errorMessageText', 'Showing only top 300. Please use the filter for more accurate sampling');


                        kendo.bind($('#reconmonitor-view'), viewModel); // Vizualize and bind it!
                    });
                }

                var viewModel = kendo.observable({
                    //search popup
                    searchName: '',
                    searchCorrect: true,
                    errorMessageText: 'Showing only top 300. Please use the filter for more accurate sampling',
                    //hidden: false,
                    datesHidden: true,
                    closeSearch: function(e) {
                        //viewModel.popup.set('hidden', true);
                        var el = $(e.target).parents(':eq(2)');
                        el.hide();
                    },
                    dates: {
                        source: new kendo.data.DataSource({
                            data:
                            [{ id: 1, text: 'Any Date' }, { id: 2, text: 'Last 3 weeks' }, { id: 3, text: 'Custom' }]
                        }),
                        onChanged: function(e) {
                            var selected = this.get('dates.value');
                            viewModel.set('datesHidden', selected == 3 ? false : true);
                        },
                        value: ''
                    },
                    location: {
                        source: new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: config.server.url + 'locations'
                                }
                            }
                        }),
                        value: ''
                    },
                    repairStatus: {
                        source:
                        [
                            { text: "In Progress - All", id: "0" },
                            { text: "In Progress - On Hold", id: "1" },
                            { text: "In Progress - QA Ready", id: "2" },
                            { text: "Completed - QA Ready", id: "3" },
                            { text: "Completed - Not Billed", id: "4" },
                            { text: "Completed - On Site", id: "5" },
                            { text: "Completed - All", id: "6" },
                            { text: "(All)", id: "7" }
                        ],
                        value: ''
                    },
                    saveSearch: function() {
                        //get search name
                        var val = $.trim(this.get('searchName'));
                        //is null then throw validation error
                        if (val == '') this.set('searchCorrect', false);
                        //is exist
                        //save if ok
                        //throw validation error if not
                    },
                    startSearch: function(e) {
                        debugger;
                        //collect data
                        // as a new search is started we need to clear the old one
                        filter = new Filter();
                        //get free text, if specified
                        filter.freeText = ddl.value() || '';

                        refreshData();
                    },
                    //end search popup
                    type: {
                        source: new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: config.server.url + 'types'
                                }
                            }
                        }),
                        value: ''
                    },
                    showRecordsCountWarning: true,
                    orderDepartments: [],
                    orders: {},
                    departments: [],
                    selectedDepartment: null,
                    phases: [],
                    selectedPhase: null,
                    currentOrder: null,
                    isVendor: user.checkIsVendor(),
                    editDescDialog: {
                        title: '',
                        content: '',
                        id: ''
                    },

                    change: function(e) {

                        // Here we'll do some AJAX to store data, on condition


                    },

                    onDescriptionClicked: function(e) { // Hiding or showing the black box with order Description text
                        e.data.set('orderDescriptionTextDisplay', e.data.get('orderDescriptionTextDisplay') ? false : true);
                    },

                    dropMenuClicked: function(e) {

                        if (e.data.get('menuVisible')) {
                            e.data.set('menuVisible', false);
                            this.hideAllMenus();
                        } else {
                            this.hideAllMenus();
                            e.data.set('menuVisible', true);
                        }

                        return false;
                    },
                    departmentMenuClicked: function(e) {

                        if (this.isVendor) {
                            srv.getDepartmentsByOrderId(e.data.get('orderId'), function(data) {

                                if (data && data.length) {
                                    viewModel.set('orderDepartments', data);

                                    if (e.data.get('departmentMenuVisible')) {
                                        e.data.set('departmentMenuVisible', false);
                                        viewModel.hideAllMenus();
                                    } else {
                                        viewModel.hideAllMenus();

                                        e.data.set('departmentMenuVisible', true);
                                    }
                                    viewModel.set('currentOrder', e.data);
                                }
                            });
                        }

                        return false;

                    },
                    hideAllMenus: function() {
                        for (var i = 0; i < this.orders.length; i++) {
                            this.orders[i].set('menuVisible', false);
                            this.orders[i].set('departmentMenuVisible', false);
                        }

                        this.set('currentOrder', null);
                    },

                    displayRO: function(e) {

                        $('#busyindicator').activity();

                        var id = e.data.orderId;

                        require(['modules/order'], function(order) {
                            $('.main').loadThen('views/reconmonitordetails.html').then(function() {
                                order.init(id);
                            }, function() {
                                // error
                            });
                        });
                        return false;
                    },
                    getOrderById: function(id) {
                        var result;

                        for (var i = 0; i < this.orders.length; i++) {
                            if (this.orders[i].get('orderId') == id)
                                result = this.orders[i];
                        }

                        return result;
                    },
                    descriptionBulbClicked: function(e) {

                        if (e.data.get('orderDescription').length > 30) {
                            this.addNotes(e);
                        }

                        return false;
                    },
                    addNotes: function(e) {

                        if (e.data.get('orderDescription') != '') {
                            this.editDescDialog.set('content', e.data.get('orderDescription'));
                        }

                        this.editDescDialog.set('title', e.data.orderNo);
                        this.editDescDialog.set('id', e.data.orderId);

                        this.editDescDialog.set('editingDisabled', !this.isVendor);

                        $('#editOrderNotesModal').modal('show');

                        $('#editOrderNotesModal').on('hide.bs.modal', function(e) {
                            viewModel.saveNotes();
                        })

                    },

                    saveNotes: function(e) {

                        if (viewModel.isVendor) {
                            var order = this.getOrderById(this.editDescDialog.get('id'));

                            var notes = $.trim(this.editDescDialog.get('content'));

                            if (notes != '' && notes != null) {

                                order.set('orderDescriptionMini', util.minimizeText(notes, 30));
                                order.set('orderDescription', notes);
                                order.set('orderDescriptionDisplay', true);
                                order.set('orderDescriptionTextDisplay', true);

                                order.set('notesMenuText', 'Edit notes');

                            } else {
                                order.set('orderDescription', null);
                                order.set('orderDescriptionMini', null);
                                order.set('orderDescriptionDisplay', false);
                                order.set('orderDescriptionTextDisplay', false);

                                order.set('notesMenuText', 'Add notes');
                            }

                            this.storeRo(order);
                        }
                    },

                    changePriority: function(e) {

                        var entity = e.data;

                        var directionClassName = '';
                        var colorName = '';
                        var priority = 0;

                        if ($(e.target).hasClass('text-red')) {
                            directionClassName = "up";
                            colorName = "red";
                            priority = 1;
                        } else if ($(e.target).hasClass('text-green')) {
                            directionClassName = "down";
                            colorName = "green";
                            priority = -1;
                        } else if ($(e.target).hasClass('text-orange')) {
                            colorName = "none";
                            priority = 0;
                        }


                        entity.set('priority', priority);

                        entity.set('direction', orderUtil.getDirectionFromPriority(priority));
                        entity.set('priorityColor', colorName);

                        this.storeRo(entity);

                    },
                    changeFlag: function(e) {

                        var entity = e.data;
                        var colorName = e.target.className.charAt(0).toUpperCase() + e.target.className.slice(1);

                        entity.set('flagName', colorName);
                        entity.set('flagObj', this.generateFlagObject(colorName));
                        entity.set('flagID', this.getFlagIdByName(colorName));

                        this.storeRo(entity);

                    },
                    changeDepartment: function(e) {
                        if (this.currentOrder) {

                            this.currentOrder.set('departmentId', e.data.id);
                            this.currentOrder.set('departmentName', e.data.text);

                            this.storeRo(this.currentOrder);
                        }
                    },
                    generateFlagObject: function(color) {
                        var fo = { isWhite: false, isRed: false, isOrange: false, isGreen: false, isBlue: false, isPurple: false };
                        fo['is' + color] = true;

                        return fo;
                    },
                    getFlagIdByName: function(name) {
                        switch (name) {
                        case 'White':
                            return 0;
                        case 'Red':
                            return 1;
                        case 'Orange':
                            return 2;
                        case 'Yellow':
                            return 3;
                        case 'Green':
                            return 4;
                        case 'Blue':
                            return 5;
                        case 'Purple':
                            return 6;
                        }
                    },
                    prepareROitems: function(data) {

                        for (var i = 0; i < data.length; i++) {

                            data[i].set('flagObj', this.generateFlagObject(data[i].flagName));


                            data[i].set('dateMarker', data[i].daysInProcessText + ' ' + data[i].daysInProcessVal);

                            data[i].set('orderDescriptionDisplay', data[i].orderDescription ? true : false);
                            data[i].set('orderDescriptionTextDisplay', data[i].orderDescription ? true : false);
                            data[i].set('orderDescriptionMini', util.minimizeText(data[i].orderDescription, 30));
                            data[i].set('notesMenuText', data[i].orderDescription ? 'Edit notes' : 'Add notes');

                            data[i].set('completedColor', orderUtil.getColorFromCompleted(+data[i].completed));
                            var priority = +data[i].priority;
                            data[i].set('priorityColor', orderUtil.getColorFromPriority(priority));

                            data[i].set('direction', orderUtil.getDirectionFromPriority(priority));

                            data[i].set('orderDateF', data[i].orderDate ? util.formatDate(data[i].orderDate) : '');
                            data[i].set('targetDateF', data[i].targetDate ? util.formatDate(data[i].targetDate) : '');

                            data[i].set('orderAmount', data[i].orderAmount > 0 ? '$' + data[i].orderAmount : '$0');

                            data[i].set('departmentName', data[i].departmentName);

                            // Danyl, please take a look
                            data[i].set('departmentArrowVisible', (this.isVendor && !!data[i].locationId));

                            data[i].set('menuVisible', false);
                        }

                        return data;
                    },
                    storeRo: function(data) {
                        srv.saveOrder(data);
                    },
                    onPhaseClicked: function(e) {
                        debugger;
                        //save location only as it's needed to find phases and refresh the filter obj
                        // the refreshing is required because this search will replace parametariazed/saved search, if selected 
                        filter = new Filter();
                        filter.phaseId = $(e.target).find('input').val(); // || e.sender.value();
                        this.set("selectedPhase", filter.phaseId);
                        refreshData();
                    },
                    onDepartmentClicked: function(e) {
                        debugger;
                        //e.data.id
                        //save location only as it's needed to find phases and refresh the filter obj
                        // the refreshing is required because this search will replace parametariazed/saved search 
                        filter = new Filter();
                        filter.departmentId = $(e.target).find('input').val(); // || e.sender.value();
                        this.set("selectedDepartment", filter.departmentId);
                        refreshData();
                    },
                    isDepartmentSelected: function(e) {
                        return this.get("selectedDepartment") == e.departmentID;
                    },
                    isPhaseSelected: function (e) {
                        return this.get("selectedPhase") == e.phaseID;
                    },
                    paging: {
                        onPageButtonClicked: function(e) {
                            var pageNumber = e.data.number;
                            pager.pageNumber = pageNumber <= 0 ? 0 : pageNumber - 1;

                            this.set('prevPageDisabled', false);
                            this.set('nextPageDisabled', false);

                            if (pager.pageNumber == 0)
                                this.set('prevPageDisabled', true);
                            else if (pager.pageNumber == pagingHelper.getPagesCount(recordCount, pageSizeConst) - 1)
                                this.set('nextPageDisabled', true);

                            srv.getOrders(pager, filter, function(ds) {
                                recordCount = ds.total();
                                viewModel.set('orders', viewModel.prepareROitems(ds.data()));
                                viewModel.get('paging').set('pagingButtons', pagingHelper.stylyzePageButtons(pagingHelper.getPageLinks(pagingHelper.getPagesCount(recordCount, pageSizeConst), pager.pageNumber), pager.pageNumber + 1));
                                kendo.bind($('#reconmonitor-view'), viewModel);
                            });
                        },

                        nextArrowPageButtonClicked: function(e) {
                            var button;
                            for (var i = 0; i < this.paging.pagingButtons.length; i++) {
                                if (this.paging.pagingButtons[i].get('number') == pager.pageNumber + 2) {
                                    button = this.paging.pagingButtons[i];
                                    break;
                                }
                            }

                            this.paging.onPageButtonClicked({ data: button });
                        },
                        prevArrowPageButtonClicked: function(e) {
                            var button;
                            for (var i = 0; i < this.paging.pagingButtons.length; i++) {
                                if (this.paging.pagingButtons[i].get('number') == pager.pageNumber) {
                                    button = this.paging.pagingButtons[i];
                                    break;
                                }
                            }

                            this.paging.onPageButtonClicked({ data: button });
                        },
                        pagingButtons: [],
                        prevPageDisabled: true,
                        nextPageDisabled: false,
                        arrowButtonsVisible: false
                    }
                });


                srv.getLocations(function (dsLocations) {

                    filter.locationId = dsLocations.data()[0].locationId;
                    var locationId = filter.locationId;
                    //setDefaultLocation();
                    srv.getOrders(pager, filter, function (ds) {
                        recordCount = ds.total();

                        var repairOrders = viewModel.prepareROitems(ds.data());

                        if (recordCount > pageSizeConst) {
                            var pagingButtons = (buttonsCount > 1 ? pagingHelper.stylyzePageButtons(pagingHelper.getPageLinks(pagingHelper.getPagesCount(recordCount, pageSizeConst), pager.pageNumber), pager.pageNumber + 1) : []);
                            viewModel.paging.set('pagingButtons', pagingButtons);
                            viewModel.paging.set('arrowButtonsVisible', true);
                        } else {
                            viewModel.paging.set('arrowButtonsVisible', false);
                        }


                        viewModel.set('orders', repairOrders);

                        viewModel.set('showRecordsCountWarning', recordCount >= maxRecordCount);

                        srv.getPhases(function (dsPhases) {
                            var data = dsPhases.data();
                            viewModel.set('phases', data);

                            srv.getDepartments(function (dsDepartments) {
                                data = dsDepartments.data();
                                viewModel.set('departments', data);

                                initSearch();

                                kendo.bind($('#reconmonitor-view'), viewModel);

                            }, locationId, pager.pageNumber, pager.pageSize);

                        }, locationId, pager.pageNumber, pager.pageSize);

                    });
                });


                // --- Page-level events---

                //Hidin the drop menus when clicked outside

                $('#page').on('click', function() {
                    viewModel.hideAllMenus();
                });

                /// ---  ---
            });

        };

        return {
            init: init
        };

    });


