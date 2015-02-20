kendo.data.binders.class = kendo.data.Binder.extend({
    init: function (target, bindings, options) {
        kendo.data.Binder.fn.init.call(this, target, bindings, options);

        // get list of class names from our complex binding path object
        this._lookups = [];
        for (var key in this.bindings.class.path) {
            this._lookups.push({
                key: key,
                path: this.bindings.class.path[key]
            });
        }
    },

    refresh: function () {
        var lookup,
        value;

        for (var i = 0; i < this._lookups.length; i++) {
            lookup = this._lookups[i];

            // set the binder's path to the one for this lookup,
            // because this is what .get() acts on.
            this.bindings.class.path = lookup.path;
            value = this.bindings.class.get();

            // add or remove CSS class based on if value is truthy
            if (value) {
                $(this.element).addClass(lookup.key);
            } else {
                $(this.element).removeClass(lookup.key);
            }
        }
    }
});