// Load in dependencies
var _fs = require('fs');
var _express = require('express');
var _jsp = require('uglify-js').parser;
var _pro = require('uglify-js').uglify;

/** @type {string} Folder to build from */
var _jsRoot = 'js/';

/** @type {array} Order to load and compile items */
var _jsBuildOrder = [
    _jsRoot + 'depen',
    _jsRoot + 'engine'
];

/** @type {string} Root location for the compiler dump */
var _buildRoot = 'build';

/** @type {array} Select data to copy and clone from the user's existing data */
var _cloneData = [
    'audio',
    'images',
    'style'
];

/**
 * @todo Create a separate string module
 * @todo Craete a separate file module
 */
var _private = {
    /**
     * Combines JavaScript files and returns a string
     * @param {array} folders An array of folder strings
     */
    getCombinedJS: function (folders) {
        var self = this;

        var fileContents, filteredContents, compiledJS = '';
        folders.forEach(function (folder) {
            // Retrieve all files
            fileContents = _fs.readdirSync(folder);
            filteredContents = [];

            // Verify file data is what you requested
            fileContents.forEach(function (value) {
                if (self.getString(value, '.js')) {
                    filteredContents.push(value);
                }
            });

            // Assemble the data
            filteredContents.forEach(function (value) {
                compiledJS += _fs.readFileSync(folder + '/' + value);
            });
        });

        return compiledJS;
    },

    /**
     * Test to discover if the needle(s) are present inside
     * a string.
     * @param {string} haystack String you want to search
     * @param {string} needle Item you're looking for in the haystack
     * @returns {boolean} True upon discovery, false upon failure.
     */
    getString: function (haystack, needle) {
        var result = false;

        if (Array.isArray(needle)) {
            needle.forEach(function (value) {
                if (haystack.indexOf(value) !== 1) {
                    result = true;
                }
            });
        } else if (typeof needle === 'string') {
            return haystack.indexOf(needle) !== -1;
        }

        return result;
    },

    setNewFile: function (name, contents) {
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
        var self = this;

        // Retrieve all files
        var fileContents = _fs.readdirSync(folder),
            filteredContents = [];

        // Verify file data is what you requested
        fileContents.forEach(function (value) {
            if (self.getString(value, type)) {
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
     * Replace string between two points
     * @param {string} haystack A bunch of text to search through
     * @param {string} start String to start the replace process
     * @param {string} end String to end the replace process
     * @param {string} replace String that replaces the found string
     * @returns {string} A new string with the replaced content
     * @todo Make sure it removes all instances of the strings in the haystack
     */
    setStringBetween: function (haystack, start, end, replace) {
        var indexStart = haystack.indexOf(start);
        var indexEnd = haystack.indexOf(end, indexStart);

        return (haystack.substring(0, indexStart) + replace + haystack.substring(indexEnd + end.length));
    },

    /**
     * Gets a string between two points inside a string
     * @todo Make sure it returns all instances of the strings in the haystack
     */
    getStringBetween: function (haystack, start, end) {
        var indexStart = haystack.indexOf(start) + start.length;
        var indexEnd = haystack.indexOf(end, indexStart);

        return haystack.substring(indexStart, indexEnd);
    },

    /**
     * Sets a folder and recursively delets contents if they pre-exist
     * @todo Crashes if no folder exists, need to be fixed, currently using workaround
     */
    //setFolder: function (loc) {
    //    // Create the folder
    //    _fs.mkdir(loc);
    //
    //    // Check folder for contents
    //    this.setRecursiveDelete(loc);
    //
    //    // Create the folder
    //    _fs.mkdir(loc);
    //
    //    return;
    //},

    /**
     * Recursively deletes all data
     * @param {string} loc Location to begin the recursive delete, starts from the
     * root
     * @todo Currently leaves behind old folders, should not be the case
     */
    setRecursiveDelete: function (loc) {
        try {
            var contents = _fs.readdirSync(loc);
            contents.forEach(function(file) {
                if (_fs.statSync(loc + '/' + file).isDirectory()) {
                    _private.setRecursiveDelete(loc + '/' + file);
                } else {
                    _fs.unlinkSync(loc + '/' + file);
                }
                // Contents found, recursively delete all content

            });
        } catch (e) {

        }
    },

    /**
     * Recursively copies a folder to a specific destination
     * @param {array} folder An array of strings represting folders. All paths should
     * be relative to the root
     * @param {string} dest Write location for copied data and folders, should be
     * relative to the root
     * @returns {undefined}
     */
    setRecursiveCopy: function (folders, dest) {
        var readData, readDataItem;
        folders.forEach(function (loc) {
            _fs.mkdir(dest + '/' + loc);
            readData = _fs.readdirSync(loc);
            readData.forEach(function (item) {
                console.log(loc, item);
                if (_fs.statSync(loc + '/' + item).isDirectory()) {
                    _private.setRecursiveCopy([loc + '/' + item], dest);
                } else {
                    readDataItem = _fs.readFileSync(loc + '/' + item);
                    _fs.writeFileSync(dest + '/'+ loc + '/' + item, readDataItem);
                }
            });
        });

        return;
    }
};

/**
 * @todo Might as well turn the compiler and server's string based methods into a node module for ease of use
 * @todo Method that returns compiled JS only
 * @todo Method that returns entire zip file
 * @todo Ability to assemble the zip file by running 'node cp-compile' in the command line
 */
var compiler = {
    /**
     * @todo Break into multiple methods
     * @todo Needs private variable usage to make editing data easier
     * @todo Should zip everything, current just builds a folder
     */
    init: function () {
        // Compile JavaScript engine
        var jsOutput = _private.getCombinedJS(_jsBuildOrder);

        // Get JSON string for images and replace COMPILER_IMG's null value with it
        var imgJSON = _private.getJSON('images', ['.jpg', '.png', '.gif']);
        jsOutput = jsOutput.replace('COMPILER_IMG = null', 'COMPILER_IMG = ' + imgJSON);

        // Get JSON string for audio and replace COMPILER_AUDIO's null value with it
        var audioJSON = _private.getJSON('audio', '.ogg', '.ogg');
        jsOutput = jsOutput.replace('COMPILER_AUDIO = null', 'COMPILER_AUDIO = ' + audioJSON);

        // Turn cp.load.loadFiles = []; into an array for loading files
        // Use the userFiles array to add in all the files needed
        var userJS = _fs.readFileSync('js/setup.js', 'utf8');
        var userFiles = userJS;
        userFiles = _private.getStringBetween(userFiles, 'cp.load.loadFiles = ', ';');
        userFiles = userFiles.replace(/'/g, '"');
        userFiles = JSON.parse(userFiles);
        userFiles.forEach(function (val, i) {
            jsOutput += _fs.readFileSync('js/objects/' + val + '.js', 'utf8');
        });

        // Get setup.js and find cp.load.loadFiles. Comment it out, then put in jsOutput
        jsOutput += _private.setStringBetween(userJS, 'cp.load.loadFiles = ', ';', '');

        // Uglify jsOutput, options https://github.com/mishoo/UglifyJS
        var ast = _jsp.parse(jsOutput);
        ast = _pro.ast_mangle(ast);
        ast = _pro.ast_squeeze(ast);
        jsOutput = _pro.gen_code(ast);

        // Get a copy of index.html and replace the proper contents in var htmlOutput
        var indexFile = _private.setStringBetween(_fs.readFileSync('index.html', 'utf8'), '<!-- COMPILER_REPLACE -->', '<!-- END_COMPILER_REPLACE -->', '<script type="text/javascript" src="js/all.js"></script>');

        // Put everything into a build folder and delete if it already exists
        _fs.mkdir('build');
        _private.setRecursiveDelete('build');
        //_fs.mkdir('build');

        // recursively copy folders and files from a private array
        _private.setRecursiveCopy(_cloneData, 'build');

        // Add in the newly created files
        _private.setNewFile('build/index.html', indexFile);
        _fs.mkdir('build/js');
        _private.setNewFile('build/js/all.js', jsOutput);
    }
};

compiler.init();