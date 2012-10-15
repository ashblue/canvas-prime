define(
    ['controller/modal'],
    function (modal) {
        var fileActions = {
            newLevel: function (e) {
                e.preventDefault();
                modal.show('modal-new-level');
            },


            saveLevel: function (e) {
                e.preventDefault();
            },

            saveLevelAs: function (e) {
                e.preventDefault();
                modal.show('modal-save');
            }
        };

        return fileActions;
    }
);