// Load in dependencies
var _fs = require('fs');
var _strings = require('./helpers/strings.js').strings;
var _files = require('./helpers/files.js').files;
var _jsp = require('uglify-js').parser;
var _pro = require('uglify-js').uglify;

var SELF = null;

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
 * @todo Might as well turn the compiler and server's string based methods into a node module for ease of use
 * @todo Method that returns compiled JS only
 * @todo Method that puts everying in a zip file
 * @todo Ability to assemble the zip file by running 'node cp-compile' in the command line
 * @todo Still needs cleanup, as private vars should probably replace files strings where possible
 */
var compiler = {
    init: function () {
        if (SELF !== null) {
            return this;
        }

        SELF = this;
    },

    createJS: function () {
        // Compile JavaScript engine
        var jsOutput = _files.getCombinedFiles(_jsBuildOrder, ['js']);

        // Get JSON string for images and replace COMPILER_IMG's null value with it
        var imgJSON = _files.getJSON('images', ['.jpg', '.png', '.gif']);
        jsOutput = jsOutput.replace('COMPILER_IMG = null', 'COMPILER_IMG = ' + imgJSON);

        // Get JSON string for audio and replace COMPILER_AUDIO's null value with it
        var audioJSON = _files.getJSON('audio', '.ogg', '.ogg');
        jsOutput = jsOutput.replace('COMPILER_AUDIO = null', 'COMPILER_AUDIO = ' + audioJSON);

        // Turn cp.load.loadFiles = []; into an array for loading files
        // Use the userFiles array to add in all the files needed
        var userJS = _fs.readFileSync('js/setup.js', 'utf8');
        var userFiles = userJS;
        userFiles = _strings.getStringBetween(userFiles, 'cp.load.loadFiles = ', ';');
        userFiles = userFiles.replace(/'/g, '"');
        userFiles = JSON.parse(userFiles);
        userFiles.forEach(function (val, i) {
            jsOutput += _fs.readFileSync('js/objects/' + val + '.js', 'utf8');
        });

        // Get setup.js and find cp.load.loadFiles. Comment it out, then put in jsOutput
        jsOutput += _strings.setStringBetween(userJS, 'cp.load.loadFiles = ', ';', '');

        // Uglify jsOutput, options https://github.com/mishoo/UglifyJS
        var ast = _jsp.parse(jsOutput);
        ast = _pro.ast_mangle(ast);
        ast = _pro.ast_squeeze(ast);
        jsOutput = _pro.gen_code(ast);

        return jsOutput;
    },

    /**
     * @todo Really needs to use private vars for the compiler names
     */
    createIndex: function () {
        return _strings.setStringBetween(_fs.readFileSync('index.html', 'utf8'), '<!-- COMPILER_REPLACE -->', '<!-- END_COMPILER_REPLACE -->', '<script type="text/javascript" src="js/all.js"></script>');
    },

    outputBuild: function () {
        // Put everything into a build folder and delete if it already exists
        _fs.mkdir('build');
        _files.recursiveDelete('build');
        //_fs.mkdir('build');

        // recursively copy folders and files from a private array
        _files.recursiveCopy(_cloneData, 'build');

        // Add in the newly created files
        _files.setFile('build/index.html', this.createIndex());
        _fs.mkdir('build/js');
        _files.setFile('build/js/all.js', this.createJS());
    }
};

// Sets up the command line ability to bake
process.argv.forEach(function (val) {
    if (val === 'build') {
        compiler.outputBuild();
        console.info('SUCCESS. See the "build" folder for your baked files.');
    }
});

exports.compiler = compiler;