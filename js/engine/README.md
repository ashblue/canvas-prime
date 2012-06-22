Engine Design Pattern
=============

To be properly rendered by the engine's parse, all files must follow the following design pattern. If you don't the sky might fall when you try and open the engine output file.

    /*
    Name: Title of sheet
    Version: 1 (all sheets should start at version 1 for inital release)
    Desc: Your description here.
    */

    // Name of the object, makes sure that it gets created properly
    var cp = cp || {};

    (function (cp) {
        // Private declaration
        var _name = 'blah',
        _nameFunction: function() {

        };

        // Main object
        cp.objectName = {
            exampleExtendableMethod: Class.extend({
                exampleVar: 'a',
                exampleFunction: function() {
                    // Code here
                }
            },
            nonExtendableMethod: {
                // Code here
            }
        };
    }(cp));