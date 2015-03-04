(function () {
    requirejs.config({
        // The shim config allows us to configure dependencies for
        // scripts that do not call define() to register a module
        shim: {
            kendo: {
                deps: ['jquery']
            },
            binders: {
                deps: ['kendo']
            },
            activity: {
                deps: ['jquery']
            },
            loadThen: {
                deps: ['jquery']
            },
            bootstrap: {
                deps: ['jquery']
            }
        },
        paths: {
//            jquery: 'lib/jquery-2.1.1',
//            kendo: 'lib/kendo.mobile',

            jquery: 'lib/jquery.min',
            kendo: 'lib/kendo.all.min',

            binders: 'kendo/kendo.binders.class',
            modernizr: 'lib/modernizr-2.6.2',
            activity: 'plugins/jquery.activity-indicator-1.0.0',
            loadThen: 'plugins/loadThen',
            bootstrap: 'lib/bootstrap.min'
        },
        //disable Require JS caching
        urlArgs: "bust=" + (new Date()).getTime()
    });

    require(['modules/mobile/bootstrapper'],
       function (bootstrapperMobile) {
           bootstrapperMobile.init();
       });
})();