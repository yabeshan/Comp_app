define([],
function () {

    //private
    function formatDate(dateStr) {
        var result = '', date;

        if (dateStr) {
            date = dateStr.indexOf('T') != -1 ? new Date(dateStr.split('T')[0])
                                              : new Date(dateStr);

            result = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear();
        }

        return result;
    }

    function minimizeText(str, count) {
        if (str && str.length > count)
            return str.substring(0, count) + '...';
        else
            return str;
    }

    var localStorageObjectHelper = {
        set: function(key, value) {
            if (!key || !value) {
                return;
            }

            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        },
        get: function(key) {
            var value = localStorage.getItem(key);

            if (!value) {
                return;
            }

            // assume it is an object that has been stringified
            if (value[0] === "{") {
                value = JSON.parse(value);
            }

            return value;
        }
    };


    //public
    return {
        formatDate: function (dateStr) {
            return formatDate(dateStr);
        },
        minimizeText: function (str, count) {
            return minimizeText(str, count);
        },
        lSHelper: localStorageObjectHelper
    };
});



