(function ($) {
    var _loadThen = $.fn.loadThen;
    $.fn.loadThen = function (url, params) {
        if (typeof url !== "string" && _loadThen) {
            return _loadThen.apply(this, arguments);
        }

        if (this.length <= 0) {
            return jQuery.Deferred().resolveWith(this, ['']);
        }

        var selector, type, response,
            self = this,
            off = url.indexOf(" ");

        if (off >= 0) {
            selector = jQuery.trim(url.slice(off));
            url = url.slice(0, off);
        }

        if (params && typeof params === "object") {
            type = "POST";
        }

        return jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params
        }).then(function (responseText) {
            self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
            return self;
        });
    };
}(jQuery));