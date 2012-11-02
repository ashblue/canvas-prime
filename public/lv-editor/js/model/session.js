define(
    function () {
        var _storage = {
            name: null,
            tileSize: null,
            tileCountHoriz: null,
            tileCountVert: null
        };

        var session = {
            getValue: function (key) {
                return _storage[key];
            },

            setValue: function (key, data) {
                _storage[key] = data;
                return this;
            },

            reset: function () {
                _storate = {};
                return this;
            }
        };

        return session;
    }
);