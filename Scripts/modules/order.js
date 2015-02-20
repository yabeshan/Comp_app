define(['jquery', 'kendo', 'modules/config', 'modules/users', 'helpers/generalHelper', 'helpers/ordersHelper', 'services/ordersSrv'],
    function($, kendo, config, user, util, orderUtil, srv) {

        var descriptionTimer;
        var descriptionTimerDelay = 2000;

        var isUserVendor = user.checkIsVendor();

        var order = {
            init: function(id) {

                var orderViewModel = kendo.observable({
                    id: id,
                    no: '',
                    data: {},
                    back: function() {
                        require(['modules/repairOrders'], function(orders) {
                            $('.main').loadThen('views/reconmonitor.html').then(function() {
                                orders.init();
                            }, function() {
                                // error
                            });
                        });
                    },
                    priority: {
                        list:
                        [
                            { text: "Low", id: "-1" },
                            { text: "Normal", id: "0" },
                            { text: "High", id: "1" }
                        ],
                        value: '',
                        onChange: function() {
                            $.ajax({
                                type: "PUT",
                                url: config.server.url + 'orders',
                                dataType: 'json',
                                async: false,
                                data: {
                                    orderId: id,
                                    priority: 1,
                                    orderDescription: ''
                                },
                                success: function() {
                                    //console.log('+');
                                },
                                error: function(a) {
                                    //console.log('-');
                                }
                            });
                        },
                    },
                    hideAllMenus: function() {
                        orderViewModel.set('flagDropVisible', false);
                        orderViewModel.set('priorityDropVisible', false);
                    },
                    priorityIconClicked: function (e) {

                        if (e.data.get('priorityDropVisible')) {
                            e.data.set('priorityDropVisible', false);
                            this.hideAllMenus();
                        } else {
                            this.hideAllMenus();
                            e.data.set('priorityDropVisible', true);
                        }

                        return false;
                    },
                    priorityIconVisible: function (e) {
                        return !this.isVendor;
                    },
                    flagIconClicked: function (e) {


                        if (e.data.get('flagDropVisible')) {
                            e.data.set('flagDropVisible', false);
                            this.hideAllMenus();
                        } else {
                            this.hideAllMenus();
                            e.data.set('flagDropVisible', true);
                        }

                        return false;
                    },
                    changePriority: function (e) {

                        var entity = e.data.data;

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

                        this.storeRo({ pririty: priority, orderId: e.data.data.orderId});

                    },
                    changeFlag: function (e) {

                        var entity = e.data.data;
                        var colorName = e.target.className.charAt(0).toUpperCase() + e.target.className.slice(1);

                        entity.set('flagName', colorName);
                        entity.set('flagID', this.getFlagIdByName(colorName));

                        this.storeRo({ flagID: this.getFlagIdByName(colorName), orderId: e.data.data.orderId });

                    },
                    getFlagIdByName: function (name) {
                        switch (name) {
                            case 'White': return 0;
                            case 'Red': return 1;
                            case 'Orange': return 2;
                            case 'Yellow': return 3;
                            case 'Green': return 4;
                            case 'Blue': return 5;
                            case 'Purple': return 6;
                        }
                    },
                    storeRo: function(data) {
                        srv.saveOrder(data);
                    },
                    deliveredDateChanged: function (e) {
                        var entity = e.data.data;
                        entity.deliveredDateF.setDate(entity.deliveredDateF.getDate() + 1);

                        entity.set('deliveredDateF', util.formatDate(entity.deliveredDateF.toISOString()));

                        this.storeRo({deliveredDateF:entity.get('deliveredDateF'), orderId: e.data.data.orderId } );
                    },

                    targetDateChanged: function (e) {
                        var entity = e.data.data;
                        entity.targetDateF.setDate(entity.targetDateF.getDate() + 1);

                        entity.set('targetDateF', util.formatDate(entity.targetDateF.toISOString()));
                        this.storeRo({targetDateF: entity.get('targetDateF'), orderId: e.data.data.orderId } );
                    
                    },
                    startedDateChanged: function (e) {
                        var entity = e.data.data;
                        entity.orderDateF.setDate(entity.orderDateF.getDate() + 1);

                        entity.set('orderDateF', util.formatDate(entity.orderDateF.toISOString()));
                        this.storeRo({ orderDateF: entity.get('orderDateF'), orderId: e.data.data.orderId });
                    },
                    startDescriptionInterval: function(e) {

                        e.data.data.set('orderDescription', e.target.value);
                        clearTimeout(descriptionTimer);
                        
                        descriptionTimer = setTimeout(function () {
                            orderViewModel.storeRo({ orderDescription: e.data.data.orderDescription, orderId: e.data.data.orderId });
                        }, descriptionTimerDelay);
                    },
                    toolbar: {
                        visible: isUserVendor
                    },
                    phaseEnforcementData: {
                        visible: isUserVendor,
                        onChange: function (e) {
                            $.ajax({
                                type: "POST",
                                url: config.server.url + 'orders/' + id + '/actions/ChangePhaseEnforcement?phaseEnforcement=' + e.data.data.phaseEnforcement,
                                dataType: 'json',
                                async: false
                            });
                        }
                        
                    },

                    invoiceCompletedRoOnly: {
                        visible: isUserVendor,
                        onChange: function (e) {
                            $.ajax({
                                type: "POST",
                                url: config.server.url + 'orders/' + id + '/actions/changeInvoiceCompletedOnly?invoiceCompletedOrderOnly=' + e.data.data.invoiceCompletedOrderOnly,
                                dataType: 'json',
                                async: false
                            });
                        }

                    },

                    status: {
                        visible: isUserVendor,
                        onChange: function (e) {
                            // AJAX
                        }
                    },

                    reason: {
                        visible: isUserVendor,
                        onChange: function (e) {
                            // AJAX
                        }
                    },
                    panelText: 'More information',
                    expanded: false,
                    // collapsed is always !expanded, but we need to use it for markup and binding, because ! is invalid symbol for kendo
                    collapsed: true,
                    toggle: function() {
                        var expanded = this.get('expanded');
                        this.set('expanded', !expanded);
                        this.set('collapsed', expanded);
                        this.set('panelText', expanded == true ? 'More information' : 'Less information');
                    },
                    progress: {
                        value: '',
                        color: ''
                    },
                    targetDate: ''
                });

                //bind data to view model

                function bindToOrder(ds) {
                    // create a template using the above definition
                    var template = kendo.template($("#order-template").html());
                    var details = $('.order-info-details');
                    // populate the form

                    //var data = jQuery.extend({}, ds.view());

                    if ($.trim(ds.error) == '') {

                        orderViewModel.set('no', ds.order.orderNo);
                        orderViewModel.set('data', ds.order);
                        orderViewModel.set('priority.value', ds.order.priority);

                        orderViewModel.phaseEnforcementData.set('status', ds.order.phaseEnforcement ? 'on' : 'off');
                        orderViewModel.invoiceCompletedRoOnly.set('value', ds.order.invoiceCompletedRoOnly ? true : false);

                        orderViewModel.set('isVendor', isUserVendor);
                        orderViewModel.set('priorityDropVisible', false);
                        orderViewModel.set('flagDropVisible', false);
                        orderViewModel.set('flagName', ds.order.flagName);

                        var completed = Number(ds.order.completed).toFixed(0);
                        //orderViewModel.set('progress.value', completed + '%');
                        //orderViewModel.set('progress.color', orderUtil.getColorFromCompleted(completed));
                        ds.order['completedColor'] = orderUtil.getColorFromCompleted(completed);
                        ds.order['orderDescription'] = util.minimizeText(ds.order.orderDescription);
                        ds.order['targetDateF'] = util.formatDate(ds.order.targetDate);
                        ds.order['orderDateF'] = util.formatDate(ds.order.orderDate);
                        ds.order['deliveredDateF'] = ds.order.deliveredDate == null ? '' : util.formatDate(ds.order.deliveredDate);
                        ds.order['completedDateF'] = ds.order.completedDate == null ? '' : util.formatDate(ds.order.completedDate);
                        ds.order['isVendor'] = isUserVendor;
                        details.html(kendo.render(template, [ ds.order ]));
                        
                        //General UI processing
                        $('#page').on('click', function () {                        
                            orderViewModel.hideAllMenus();
                        });


                        $('.group-status-dropdown').click(function (e) { return false; });

                        if (isUserVendor) {
                            $('.dateInput').removeAttr('disabled');
                            $('.dateInput').kendoDatePicker();
                        }

                        // Cascade data-binding
                        srv.getStatuses(function (e) {
                            orderViewModel.status.set('list', e.data());

                            srv.getReasons(function (e) {

                                orderViewModel.reason.set('list', e.data());

                                kendo.bind($('#order'), orderViewModel);
                            });                        
                        });
                    }
                    else {
                        $('#errorBlock').show();
                        $('#errorMessage').text(data[0].error);
                        $('.orderInfo, .services, .filter').hide();
                    }

                }

                function bindToOrderServices(ds) {
                    var data = ds.data();
                    var view = ds.view();

                    if (data.length > 0) {

                        var sum = ds.aggregates().amount.sum;

                        var template = kendo.template($("#service-template").html());
                        var details = $('.service-data');

                        //collect ans set custom agregates for start/end dates and status 
                        for (var i = 0; i < view.length; i++) {
                            var group = view[i], statuses = [], startDates = [], finishDates = [];

                            for (var j = 0; j < group.items.length; j++) {
                                var item = group.items[j];

                                //set icon to service depending on calculated status
                                item.class = orderUtil.getClassFromStatus(item.orderServiceStatusName);

                                if (statuses.indexOf(item.orderServiceStatusName) == -1) {
                                    statuses.push(item.orderServiceStatusName);
                                }

                                var processDate = function(dateStr, array) {
                                    if (dateStr != null && dateStr.indexOf('1970') == -1) {
                                        _date = util.formatDate(dateStr);

                                        if (array.indexOf(_date) == -1) {
                                            array.push(_date);
                                        }

                                        return _date;
                                    }
                                    return '';
                                };


                                item.startDate = processDate(item.startDate, startDates);
                                item.finishDate = processDate(item.finishDate, finishDates);
                            }

                            //set status

                            var phaseStatus = orderUtil.getPhaseStatusByServiceStatuses(statuses);

                            function setStatus(name, color) {
                                group['status'] = name;
                                group['statusClass'] = color;
                            }

                            function setCompleted() {
                                setStatus('Completed', 'blue');
                            }

                            function setQueued() {
                                setStatus('Queued', 'orange');
                            }

                            function setInprogress() {
                                setStatus('In progress', 'green');
                            }

                            if (phaseStatus == 'Completed') setCompleted();
                            else if (phaseStatus == 'In Progress') setInprogress();
                            else if (phaseStatus == 'Queued') setQueued();

                            //end set status


                            //set dates
                            function sortDates(a, b) {
                                return a.getTime() - b.getTime();
                            }

                            group['startDate'] = startDates.length > 0 ? startDates.sort(sortDates)[0] : '';

                            var sorted = finishDates.sort(sortDates);
                            group['finishDate'] = finishDates.length > 0 ? sorted[sorted.length - 1] : '';
                            //end set date

                        }

                        view.textDisplayClass = isUserVendor ? 'hidden' : '';
                        view.controlDisplayClass = isUserVendor ? '' : 'hidden';

                        // populate the form
                        details.html(template({ groups: view, sum: sum }));

                        var servicesViewModel = kendo.observable({
                            getServiceById: function(id) {
                                var result;

                                for (var i = 0; i < ds.data().length; i++) {
                                    if (ds.data()[i].get('serviceId') == id) {
                                        result = ds.data()[i];
                                        break;
                                    }
                                }

                                return result;
                            },
                            getServicesByPhaseId: function(phaseId) {
                                var result = [];

                                for (var i = 0; i < ds.data().length; i++) {
                                    if (ds.data()[i].get('phaseID') == phaseId)
                                        result.push(ds.data()[i]);
                                }

                                return result;
                            },
                            toggle: function(e) {
                                var icon = $(e.target);
                                icon.parents(':eq(2)').find('.innerTable').toggle();
                                icon.toggleClass('icon-arrow-up5');
                                icon.toggleClass('icon-arrow-down5');
                            },
                            toggleRow: function(e) {
                                var el = $(e.target);

                                if (!el.attr('class') || el.attr('class').indexOf('k-') < 0) {

                                    var icon = el.parents('.serviceRow').find('.switchTable');
                                    this.toggle({ target: icon });

                                }
                                
                            },
                            onServiceStatusChanged: function(e) {

                                var serviceId = $(e.sender.element).attr('data-id');
                                var service = servicesViewModel.getServiceById(serviceId);

                                service.set('orderServiceStatusID', e.sender.value());
                                service.set('orderServiceStatusName', e.sender.text());


                                srv.changeServiceStatus(serviceId, e.sender.value());


                            },
                            onGroupStatusChanged: function(e) {
                                var phaseId = $(e.sender.element).attr('data-id');
                                // Here we go
                                var phaseServices = servicesViewModel.getServicesByPhaseId(phaseId);

                                for (var i = 0; i < phaseServices.length; i++) {
                                    phaseServices[i].set('orderServiceStatusID', e.sender.value());
                                    phaseServices[i].set('orderServiceStatusName', e.sender.text());
                                }

                                // Manipulate UI somehow ...
                                // Do the AJAX ..
                            },
                            onTeamChanged: function(e) {
                                var serviceId = $(e.sender.element).attr('data-id');
                                // Here we go

                                srv.changeServiceTeam(serviceId, e.sender.value());


                            },
                            onTechnicanChanged: function(e) {
                                var serviceId = $(e.sender.element).attr('data-id');
                                // Here we go

                                srv.changeServiceTechnician(serviceId, e.sender.value());

                            }


                        });

                        srv.getServiceStatuses(function(e) {

                            details.find('.group-status-dropdown').kendoDropDownList({
                                dataTextField: "orderServiceStatusName",
                                dataValueField: "orderServiceStatusID",
                                dataSource: e.data(),
                                change: servicesViewModel.onGroupStatusChanged,
                                click: function () {
                                    return false;
                                }
                            });

                            details.find('.service-status-dropdown').kendoDropDownList({
                                dataTextField: "orderServiceStatusName",
                                dataValueField: "orderServiceStatusID",
                                dataSource: e.data(),
                                change: servicesViewModel.onServiceStatusChanged
                            });

                        }, details.find('.service-status-dropdown').attr('data-id'));

                        srv.getTechnicians(function(e) {

                            details.find('.technician-dropdown').kendoDropDownList({
                                    dataTextField: "fullName",
                                    dataValueField: "employeeId",
                                dataSource: e.data(),
                                    change: servicesViewModel.onTechnicanChanged
                            });
                            }
                        , details.find('.technician-dropdown').attr('data-id'));

                        srv.getTeams(function(e) {

                            details.find('.team-dropdown').kendoDropDownList({
                                dataTextField: "teamName",
                                dataValueField: "teamId",
                                dataSource: e.data(),
                                change: servicesViewModel.onTeamChanged
                            });

                        });


                        //servicesViewModel.set('list', services);
                        //apply MVVM bindings
                        var div = $('.services');
                        //show the div
                        div.removeClass('hidden');
                        //bind
                        kendo.bind(div, servicesViewModel);
                    }
                };

                function bindToPercentageServices(ds) {
                    var data = ds.data();

                    if (data.length > 0) {
                        var sum = ds.aggregates().amount.sum;

                        var template = kendo.template($("#servicePercentage-template").html());
                        var div = $('.discounts');
                        //show the div
                        div.removeClass('hidden');
                        // populate the form
                        div.append(template({ items: data, sum: sum }));

                        var servicesViewModel = kendo.observable({
                            click: function (e) {
                                var icon = $(e.target);
                                icon.parent().find('.helpInfo').toggleClass('hidden');
                            }
                        });

                        //apply MVVM bindings
                        kendo.bind(div, servicesViewModel);
                    }

                };

                function bindToDocs(ds) {
                    if (ds.invoiceId != null || ds.estimationId != null) {
                        var template = kendo.template($("#doc-template").html());
                        $('.docs').removeClass('hidden');

                        ds.estimationDateF = ds.estimationDate != null ? util.formatDate(ds.estimationDate) : '';
                        ds.invoiceDateF = ds.invoiceDate != null ? util.formatDate(ds.invoiceDate) : '';

                        $('.docs').html(template({ order: ds }));
                    }
                    
                };

                //end bind data to view model


                // processing data and calling binding

                srv.fillOrder(id, bindToOrder, bindToOrderServices, bindToPercentageServices, bindToDocs);
                //srv.getOrderServices(id, bindToOrderServices);
                //srv.getOrderPercentageServices(id, bindToPercentageServices);

                // end processing data and calling binding

            }
        };

        return {
        init: function(id) {
            order.init(id);
        }

    };
});
