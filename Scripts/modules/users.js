define(['jquery', 'kendo', 'modules/config', 'helpers/generalHelper', 'binders'],
function ($, kendo, config, helpers) {

    var accessToken, refreshToken;

    var user = {
        username: localStorage.getItem('access_user'),
        application: {
          id: localStorage.getItem('app_id')
        },
        showlogin: function (callback) {
            var viewModel = kendo.observable({
                email: {
                    value: '',
                    hasError: false
                },
                password: {
                    value: '',
                    hasError: false
                },
                validator: {
                    isValid: true,
                    validate: function (field) {
                        var isError = $.trim(viewModel.get(field + '.value')) == '';
                        viewModel.set(field + '.hasError', isError);
                        viewModel.set('validator.isValid', !isError);
                    },
                },
                /*
                TODO: clarify if required to have validation on lost focus? then move the 1st line to inputs in markup and uncomment other lines of code bellow
                events: { blur: refresh, change: refresh, keypress: enter }
                refresh: function (e) {
                    var item = $(e.target);
                    console.log('refresh');
                    console.log(item);
                    this.validator.validate(item[0].id);

                    if (this.validator.isValid) {
                        item.next().focus();
                    }
                },
                enter: function (e) {
                    console.log('enter');
                    var ENTER = 13;
                    if (e.which === ENTER) {
                        this.get('refresh')(e);
                    }
                },*/
                login: function () {
                    var vm = this;
                    this.get('validator.validate')('email');
                    this.get('validator.validate')('password');

                    //vm.validator.validate('email');
                    //vm.validator.validate('password');
                    //validate('password');

                    if (vm.get('validator.isValid')) {
                        var email = vm.get('email.value'),
                            pwd = vm.get('password.value'),
                            token = btoa(email + ":" + pwd);

                        $.ajax({
                            type: "POST",
                            url: config.server.url + 'account',
                            dataType: 'json',
                            async: false,
                            data: '{}',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Basic ' + token); 
                            },
                            success: function (response) {
                                localStorage.setItem('access_token', token);
                                localStorage.setItem('access_user', email);
                                if (response) {
                                    localStorage.setItem('app_id', response.application);
                                    localStorage.setItem('isVendor', response.allowEdit);
                                }

                                if (callback) callback();
                            },
                            error: function (a) {
                                if (a.responseText.indexOf('User does not exist') > -1) {
                                    vm.set('email.hasError', true);
                                } else {
                                    vm.set('password.hasError', true);
                                }
                            }
                        });

                        //localStorage.setItem('access_token', token);
                        //localStorage.setItem('access_user', email);
                        //if (true) {
                        //    localStorage.setItem('app_id', 'response.application');
                        //    localStorage.setItem('isVendor', true);
                        //}

                        //if (callback) callback();
                    }
                }
            });

            kendo.bind($('.loginPage'), viewModel);
        },
        showlogout: function (callback) {
            //$(document).ready(function () {
            var viewModel = kendo.observable({
                username: localStorage.getItem('access_user'),
                logout: function() {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('access_user');
                    localStorage.removeItem('isVendor');
                    accessToken = window.localStorage.getItem('access_token');
                    refreshToken = window.localStorage.getItem('refresh_token');
                    callback();
                }
            });
            debugger
            kendo.bind($('.user-info'), viewModel);
        },
        checkAuthenticated: function () {
            accessToken = window.localStorage.getItem('access_token');
            if (accessToken == null) {
                return false;
            }
            else {
                //this.checkTokenValid(accessToken);
                return true;
            }
        },
        checkIsVendor: function () {
            debugger;
            var isVendor = localStorage.getItem('isVendor');
            return $.parseJSON(isVendor);
        },
        checkTokenValid: function (callback) {
            accessToken = window.localStorage.getItem('access_token');
            $.ajax({
                type: "POST",
                url: config.server.url + 'account',
                dataType: 'json',
                async: false,
                data: '{}',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + accessToken);
                },
                success: function () {
                    return true;
                },
                error: function (a) {
                    return false;
                }
            });

        }/*,
        _checkTokenValid: function (acctoken) {
            $.ajax({
                type: 'GET',
                url: 'http://domain.com/api/oauth/userinfo',
                data: {
                    access_token: acctoken
                },
                dataType: 'jsonp',
                success: function (data) {
                    console.log('success');
                    if (data.error) {
                        refreshToken = window.localStorage.getItem('refresh_token');
                        if (refreshToken == null) {
                            return false;
                        } else {
                            this.refreshToken(refreshToken);
                            return true;
                        }
                    } else {
                        return true;
                    }
                },
                error: function (a, b, c) {
                    console.log('error');
                    console.log(a, b, c);
                    refreshToken = window.localStorage.getItem('refresh_token');
                    if (refreshToken == null) {
                        return false;
                    } else {
                        this.refreshToken(refreshToken);
                        return true;
                    }
                }
            });

        },
        _refreshToken: function (rаToken) {

            $.ajax({
                type: 'GET',
                url: 'http://domain.com/api/oauth/token',
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: rаToken,
                    client_id: 'NTEzN2FjNzZlYzU4ZGM2'
                },
                dataType: 'jsonp',
                success: function (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        window.localStorage.setItem('access_token', data.access_token);
                        window.localStorage.setItem('refresh_token', data.refresh_token);
                        accessToken = window.localStorage.getItem('access_token');
                        rаToken = window.localStorage.getItem('refresh_token');
                    }
                },
                error: function (a, b, c) {
                    console.log(a, b, c);
                }
            });

        },
        _login: function (callback) {
            $.ajax({
                type: 'GET',
                url: 'http://domain.com/api/oauth/token',
                data: {
                    grant_type: 'password',
                    username: $('#Username').val(),
                    password: $('#Password').val(),
                    client_id: 'NTEzN2FjNzZlYzU4ZGM2'
                },
                dataType: 'jsonp',
                success: function (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        localStorage.setItem('access_token', data.access_token);
                        localStorage.setItem('refresh_token', data.refresh_token);
                        accessToken = localStorage.getItem('access_token');
                        refreshToken = localStorage.getItem('refresh_token');
                        callback();
                    }
                },
                error: function (a, b, c) {
                    console.log(a, b, c);
                }
            });
        },
        _logout: function (callback) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            accessToken = window.localStorage.getItem('access_token');
            refreshToken = window.localStorage.getItem('refresh_token');
            callback();
        }*/
    };

   
    return user;
});



