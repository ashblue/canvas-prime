// Load in dependencies
var _fs = require('fs');
var _strings = require('./strings.js').strings;

var SELF = null;

/**
 * @todo Create a separate string module
 * @todo Craete a separate file module
 */
var files = {
    init: function () {
        if (SELF !== null) {
            return this;
        }

        SELF = this;

        return this;
    },

    /**
     * Combines JavaScript files and returns a string
     * @param {array} folders An array of folder strings to pull from
     * @param {array} filter An array of specific files to combine
     * @todo Why not take an array of file types so any kind of files can be combined?
     */
    getCombinedFiles: function (folders, filter) {
        var fileContents, filteredContents, compiledJS = '';
        folders.forEach(function (folder) {
            // Retrieve all files
            fileContents = _fs.readdirSync(folder);
            filteredContents = [];

            // Verify each file is what you requested
            fileContents.forEach(function (value) {
                filter.forEach(function (fileType) {
                    if (_strings.getString(value, '.' + fileType)) {
                        filteredContents.push(value);
                    }
                });
            });

            // Assemble the data
            filteredContents.forEach(function (value) {
                compiledJS += _fs.readFileSync(folder + '/' + value);
            });
        });

        return compiledJS;
    },

    /**
     * @todo Name is really not accurate, re-factor
     */
    setFile: function (name, contents) {
        try {
            _fs.unlinkSync(name);
            _fs.writeFileSync(name, contents);
        } catch (e) {
            _fs.writeFileSync(name, contents);
        }
    },

    /**
     * Turns file contents into JSON data
     */
    getJSON: function (folder, type, remove) {
        // Retrieve all files
        var fileContents = _fs.readdirSync(folder),
            filteredContents = [];

        // Verify file data is what you requested
        fileContents.forEach(function (value) {
            if (_strings.getString(value, type)) {
                if (remove !== undefined) {
                    filteredContents.push(value.replace(remove, ''));
                } else {
                    filteredContents.push(value);
                }
            }
        });

        // Send back remaining data as JSON
        return JSON.stringify(filteredContents);
    },

    /**
     * Recursively deletes all data
     * @param {string} loc Location to begin the recursive delete, starts from the
     * root
     * @todo Currently leaves behind old folders, should not be the case
     */
    recursiveDelete: function (loc) {
        try {
            var contents = _fs.readdirSync(loc);
            contents.forEach(function(file) {
                if (_fs.statSync(loc + '/' + file).isDirectory()) {
                    SELF.recursiveDelete(loc + '/' + file);
                } else {
                    _fs.unlinkSync(loc + '/' + file);
                }
                // Contents found, recursively delete all content

            });
        } catch (e) {}
    },

    /**
     * Recursively copies a folder to a specific destination
     * @param {array} folder An array of strings represting folders. All paths should
     * be relative to the root
     * @param {string} dest Write location for copied data and folders, should be
     * relative to the root
     * @returns {undefined}
     */
    recursiveCopy: function (folders, dest) {
        var readData, readDataItem;
        folders.forEach(function (loc) {
            _fs.mkdir(dest + '/' + loc);
            readData = _fs.readdirSync(loc);
            readData.forEach(function (item) {
                if (_fs.statSync(loc + '/' + item).isDirectory()) {
                    SELF.recursiveCopy([loc + '/' + item], dest);
                } else {
                    readDataItem = _fs.readFileSync(loc + '/' + item);
                    _fs.writeFileSync(dest + '/'+ loc + '/' + item, readDataItem);
                }
            });
        });

        return;
    }
};

exports.files = files.init();