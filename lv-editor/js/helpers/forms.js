define(
    [
        'helpers/ajax'
    ],
    function (ajax) {
        var SELF = null;

        /** @type {array} Cached submit buttons */
        var BTNS = document.getElementsByClassName('ajax');

        var _private = {
            getParentElement: function (el, tagName) {
                var parentEl = el.parentNode;
                if (parentEl.localName === tagName) {
                    return parentEl;
                } else {
                    return _private.getParentElement(parentEl, tagName);
                }
            }
        };

        var _events = {
            ajaxSubmit: function (e) {
                e.preventDefault();

                // Get all of the form inputs
                var form = _private.getParentElement(this, 'form'),
                    inputs = form.getElementsByTagName('input'),
                    data = {},
                    name;

                // Loop through just text inputs and turn it into JSON
                for (var i = inputs.length; i--;) {
                    if (inputs[i].getAttribute('type') === 'text') {
                        name = inputs[i].getAttribute('name');
                        data[name] = inputs[i].value;
                    }
                }

                ajax.postData(data, this.dataset.location);
            },

            newLevel: function (e) {
                e.preventDefault();
            }
        };

        var menu = {
            init: function () {
                if (SELF !== null) {
                    return SELF;
                }

                SELF = this;

                this.bind();

                return this;
            },

            bind: function () {
                for (var i = BTNS.length; i--;) {
                    BTNS[i].addEventListener('click', _events.ajaxSubmit);
                }
            }
        };

        return menu.init();
    }
);