/**
 * @todo Should be moved into a collection with other menu categories
 */
define(
    [
        'controller/modal',
        'helpers/ajax'
    ],
    function (modal, ajax) {
        var SAVE_FILE_TREE = document.getElementById('save-as-file-locations');

        var _private = {
            populateSaveData: function () {

            }
        };

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
                ajax.getData('lv-editor/saves.json', function (e) {
                    console.log(e.target.response, this);
                });
                modal.show('modal-save');
            }
        };

        return fileActions;
    }
);