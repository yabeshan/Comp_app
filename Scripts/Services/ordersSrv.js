define(['kendo', 'modules/config'],
function (kendo, config) {

    function getOrder(id, callback) {

        var dataSource = new kendo.data.DataSource({
        transport: {
            read: config.server.url + 'orders/' + id
        },
        schema: {
            model: {
                id: "orderId",
                fields: {
                    orderId: { type: "string" }
                }
            }
        }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function fillOrder(id, callbackToOrder, callbackToServices, callbackToPercentage, callbackToDocs) {
        $.ajax({
            type: "GET",
            url: config.server.url + 'orders/' + id,
            dataType: 'json',
            success: function (data) {
                callbackToOrder(data);
                groupOrderServices(data.services, callbackToServices);
                aggregateOrderPercentageServices(data.percentage, callbackToPercentage);
                callbackToDocs(data.order);
            }
        });
    }

    function getOrders(pager, filter, callback) {
        //debugger;
        var url = config.server.url + 'orders?page=' + pager.pageNumber + '&pageSize=' + pager.pageSize + '&skip=' + pager.skip;

        if (filter) {
            if (filter.locationId) url += '&locationId=' + filter.locationId;
            if (filter.freeText) url += '&freeText=' + filter.freeText;
            if (filter.departmentId) url += '&departmentId=' + filter.departmentId;
            if (filter.phaseId) url += '&phaseId=' + filter.phaseId;
        }

        var dataSource = new kendo.data.DataSource({
            serverPaging: true,
            pageSize: pager.pageSize,
            pageNumber: pager.page,
            transport: {
                read: url
            },
            schema: {
                data: "orders",
                total: "count",
                model: {
                    id: "orderId",
                    fields: {
                        orderId: { type: "string" },
                        orderNo: { type: "string" },
                        clientName: { type: "string" },
                        color: { type: "string" },
                        year: { type: "string" },
                        make: { type: "string" },
                        model: { type: "string" },
                        vin: { type: "string" },
                        stockNo: { type: "string" },
                        roNo: { type: "string" },
                        amount: { type: "string" },
                        orderDate: { type: "string" },
                        targetDate: { type: "string" },
                        phaseName: { type: "string" },
                        completed: { type: "string" },
                        daysInProcessText: { type: "string" },
                        daysInProcessVal: { type: "string" },
                        departmentID: { type: "string" },
                        departmentName: { type: "string" }
                    }
                }
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getOrderPercentageServices(id, callback) {

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'orders/' + id + '/services?isPercentage=true'
            },
            aggregate: [
                { field: "amount", aggregate: "sum" }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });

    }

    function aggregateOrderPercentageServices(data, callback) {

        var dataSource = new kendo.data.DataSource({
            data: data,
            aggregate: [
                { field: "amount", aggregate: "sum" }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });

    }
  
    function getOrderServices(id, callback) {

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'orders/' + id + '/services'
            },
            group: {
                field: "phaseID",
                aggregates: [
                    { field: "amount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "amount", aggregate: "sum" }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });

    }

    function groupOrderServices(data, callback) {

        var dataSource = new kendo.data.DataSource({
            data: data,
            group: {
                field: "phaseID",
                aggregates: [
                    { field: "amount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "amount", aggregate: "sum" }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });

    }


    function getStatuses(callback) {
        var dataSource = new kendo.data.DataSource({
            data: [
                { name: 'New', id: 0 },
                { name: 'On Hold', id: 1 },
                { name: 'Approved', id: 2 }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getReasons(callback) {
        var dataSource = new kendo.data.DataSource({
            data: [
                { name: 'None', id: 0 },
                { name: 'Reason 1', id: 1 },
                { name: 'Reason 2', id: 2 }
            ]
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getServiceStatuses(callback, id) {
        
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'ServiceStatuses?id=1' // To be replaced with correct url
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getTechnicians(callback, id) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'teams/' + $.trim(id) + '/employees'
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getTeams(callback) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'teams'
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getDepartments(callback, locationId, pageNumber, pageSize) {
        var url = config.server.url + 'departments?page=' + pageNumber + '&pageSize=' + pageSize;

        if (locationId)
            url += '&LocationId=' + locationId;

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: url
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getPhases(callback, locationId, pageNumber, pageSize) {

        var url = config.server.url + 'phases?page=' + pageNumber + '&pageSize=' + pageSize;

        if (locationId)
            url += '&LocationId=' + locationId;

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: url
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function getLocations(callback) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: config.server.url + 'locations'
            }
        });

        dataSource.fetch(function () {
            callback(this);
        });
    }

    function saveOrder(data) {
        var _data = {};
        _data.orderId = data.orderId;

        if (data.orderDescription) _data.orderDescription = data.orderDescription;
        if (data.priority) _data.priority = data.priority;
        if (data.targetDateF) _data.targetDate = data.targetDateF;
        if (data.completedDateF) _data.completedDate = data.completedDateF;
        if (data.deliveredDateF) _data.deliveredDate = data.deliveredDateF;
        if (data.orderDateF) _data.startedDate = data.orderDateF;
        if (data.flagID) _data.flagID = data.flagID;

        $.ajax({
            type: "PUT",
            url: config.server.url + 'orders',
            dataType: 'json',
            data: _data,
            success: function () {
                console.log('+');
            },
            error: function (a) {
                console.log('-');
            }
        });
    }

    function getDepartmentsByOrderId(orderId, callback) {
        $.ajax({
            type: "GET",
            url: config.server.url + 'orders/' + orderId + '/departments',
            dataType: 'json',
            success: function (data) {
                callback(data);
            },
            error: function (a) {
                console.log('-');
            }
        });
    }


    function changeServiceStatus(serviceId, statusId) {
        $.ajax({
            type: "GET",
            url: config.server.url + 'services/' + $.trim(serviceId) + '/actions/ChangeServiceStatus?statusId=' + statusId,
            dataType: 'json',
            success: function (data) {
                callback(data);
            },
            error: function (a) {
                console.log('-');
            }
        });
    }

    function changeServiceTeam (serviceId, teamId) {
        $.ajax({
            type: "GET",
            url: config.server.url + 'services/' + $.trim(serviceId) + '/actions/ChangeTeam?teamId=' + teamId,
            dataType: 'json',
            success: function (data) {
                callback(data);
            },
            error: function (a) {
                console.log('-');
            }
        });
    }

    function changeServiceTechnician(serviceId, employeeId) {
        $.ajax({
            type: "GET",
            url: config.server.url + 'services/' + $.trim(serviceId) + '/actions/ChangeEmployee?employeeId=' + employeeId,
            dataType: 'json',
            success: function (data) {
                callback(data);
            },
            error: function (a) {
                console.log('-');
            }
        });
    }

    //public
    return {
        getOrder: function(id, callback) {
            getOrder(id, callback);
        },
        fillOrder: function (id, callbackToOrder, callbackToServices, callbackToPercentage, callbackToDocs) {
            fillOrder(id, callbackToOrder, callbackToServices, callbackToPercentage, callbackToDocs);
        },
        getOrders: function (pager, filter, callback) {
            getOrders(pager, filter, callback);
        },
        getOrderServices: function (id, callback) {
            getOrderServices(id, callback);
        },
        getOrderPercentageServices: function (id, callback) {
            getOrderPercentageServices(id, callback);
        },
        getStatuses: function (callback) {
            getStatuses(callback);
        },
        getReasons: function (callback) {
            getReasons(callback);
        },
        getServiceStatuses: function (callback, id) {
            getServiceStatuses(callback, id);
        },
        getTechnicians: function (callback, id) {
            getTechnicians(callback, id);
        },
        getTeams: function (callback) {
            getTeams(callback);
        },
        getDepartments: function (callback, locationId, pageNumber, pageSize) {
            getDepartments(callback, locationId, pageNumber, pageSize);
        },
        getPhases: function (callback, locationId, pageNumber, pageSize) {
            getPhases(callback, locationId, pageNumber, pageSize);
        },
        saveOrder: function (data) {
            saveOrder(data);
        },
        getDepartmentsByOrderId: function (orderId, callback) {
            getDepartmentsByOrderId(orderId, callback);
        },
        changeServiceStatus: function (serviceId, statusId) {
            changeServiceStatus(serviceId, statusId);
        },
        changeServiceTeam: function (serviceId, teamId) {
            changeServiceTeam(serviceId, teamId);
        },
        changeServiceTechnician: function (serviceId, employeeId) {
            changeServiceTechnician(serviceId, employeeId);
        },
        getLocations: function (callback) {
            getLocations(callback);
        }
    };
});