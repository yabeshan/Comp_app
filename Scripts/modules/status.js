define(['jquery', 'activity'],
function ($, activity) {
    var init = function () {
       
        // doing the ajax setup
        $.ajaxSetup({
            beforeSend: function (xhr) {
                $('#busyindicator').activity();
                var accessToken = window.localStorage.getItem('access_token');
                if(accessToken != null)
                    xhr.setRequestHeader('Authorization', 'Basic ' + accessToken);
            },

            complete: function (e) {
                $('#busyindicator').activity(false);
            },  
            error: function (e) {

                $('#errorMessage').text('There was an error while doing server request.');
                $('#errorBlock').show();
                $('#errorBlock').delay(4000).fadeOut(1000);

            }
        });

    };

    return {
        init: init
    };
});