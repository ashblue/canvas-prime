define(
    function () {
        var SELF = null;

        var _private = {
            support: function () {
                try {
                    storage.save('test', 'asdf');
                    storage.remove('test');
                    return true;
                } catch (e) {
                    return false;
                }
            }
        };

        var storage = {
            init: function () {
                if (SELF !== null) {
                    return SELF;
                }

                SELF = this;

                if (!_private.support()) {
                    alert('Local storage is broken or disabled, please enable it to continue.');
                }

                return this;
            },

            // Saves the passed parameter with a key or tag reference
            save: function (key, value) {
                // Set local storage data internally
                sessionStorage.setItem(key, value);
            },

            // Gets select data, should be using build to retrieve
            get: function (key) {
                var result = sessionStorage.getItem(key);

                return result;
            },

            // Removes the passed paramater
            remove: function (key) {
                // Set local data
                sessionStorage.removeItem(key);
            }
        };

        return storage.init();
    }
);