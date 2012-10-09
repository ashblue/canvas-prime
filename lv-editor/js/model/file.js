define(
    function () {
        var MODAL = document.getElementById('modal');

        var MODAL_NEW_LV = document.getElementById('modal-new-level');

        var _private = {
            toggleEl: function (el) {
                el.classList.toggle('hide');
                return this;
            }
        };

        var fileActions = {
            newLevel: function (e) {
                e.preventDefault();

                _private
                    .toggleEl(MODAL)
                    .toggleEl(MODAL_NEW_LV);
            }
        };

        return fileActions;
    }
);