/** @type {string} Folder to build from */
var _jsRoot = 'js/';

/** @type {array} Order to load and compile items */
var _jsBuildOrder = [
    _jsRoot + 'depen',
    _jsRoot + 'engine'
];

var _fs = require('fs');

var _express = require('express');

var _jsp = require('uglify-js').parser;

var _pro = require('uglify-js').uglify;

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

        // Put everything into a build folder
        // recursively delete a build folder if it already exists or create a new one
        // recursively copy folders and files from a private array

        // Add in the newly created files
        _private.setNewFile('test.html', indexFile);
        _private.setNewFile('all.js', jsOutput);
    }
};

compiler.init();

//exports.jsFile = compiler.init();

// Compile dependencies
// Compile the engine
// Get JSON string for images and replace COMPILER_IMG's null value with it
// Get JSON string for audio and replace COMPILER_AUDIO's null value with it