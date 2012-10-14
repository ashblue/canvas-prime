/**
 * Handles the modal's click event, setup, and tear-down
 */
define(
    function () {
        var SELF = null;

        var MODAL = document.getElementById('modal');

        var MODAL_CONTENT = document.getElementById('modal-content');

        /** @type {object} Holds the currently shown content DOM element */
        var _currentContent = null;

        var _private = {
            setVerticalAlign: function () {
                // Get current height
                var height = parseInt(MODAL_CONTENT.clientHeight, 10);

                // Adjust margin as so
                MODAL_CONTENT.style.marginTop = -height / 2 + 'px';
            }
        };

        var _events = {
            hideModal: function (e) {
                if (e.target !== MODAL) {
                    return;
                }

                modal.hide();
            }
        };

        var modal = {
            init: function () {
                if (SELF !== null) {
                    return SELF;
                }

                SELF = this;

                this.bind();

                return this;
            },

            show: function (innerModalId) {
                // Make sure current content is hiddent first
                if (_currentContent) {
                    _currentContent.classList.add('hide');
                }

                // Show new content
                _currentContent = document.getElementById(innerModalId);
                _currentContent.classList.remove('hide');
                MODAL.classList.remove('hide');

                // Set proper height
                _private.setVerticalAlign();

                return this;
            },

            hide: function () {
                MODAL.classList.add('hide');
                return this;
            },

            toggle: function () {
                MODAL.classList.toggle('hide');
                return this;
            },

            bind: function () {
                MODAL.addEventListener('click', _events.hideModal);
                return this;
            }
        };

        return modal;
    }
);