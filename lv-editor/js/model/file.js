define(
    ['controller/modal'],
    function (modal) {
        var fileActions = {
            newLevel: function (e) {
                e.preventDefault();
                modal.show('modal-new-level');
            }
        };

        return fileActions;
    }
);