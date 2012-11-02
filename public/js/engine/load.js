/*
Name: Load Assets
Version: 1
Desc: Controls all file loading mechanisms and draws the loading screen while waiting.

It should be noted that extra pre-caution should be taken to make sure that this file
is compatible with the framework's compiler. Extra variables will be injected during
compiling to circumvent XMLHTTP requests or completely remove certain loaders.
*/

var cp = cp || {};

(function (cp) {
    var _loopHold, // temporary dump location to hold the cp.core.loop while its temporarily replaced to show the load screen
    _loadProgress, // Shows the current load progress text
    _loadPercent, // Total percent of loaded assets

    //COMPILER_LOADING = null, // IMPORTANT: This variable is set to true by the compiler automatically, DO NOT CHANGE
    COMPILER_IMG = null, // Compiler script will replace null with a JSON string
    COMPILER_AUDIO = null, // Compiler script will replace null with a JSON string

    _htmlHead = document.getElementsByTagName('HEAD'),
    _fileCount = 0,
    _fileTotal = 0,
    _getFiles = function() {
        // Double check var objects is present with an array of file names to
        // load, or perform an emergency exit.
        if (typeof cp.load.loadFiles !== 'object') {
            console.error('Failure to load. No elements have been loaded into the engine. Please include an array of objects in cp.load.objects([\'example1\', \'example2\']) with corresponding files in js/objects');
            return false;
        }

        // Update total asset count
        cp.load.assetTotal = cp.load.loadFiles.length;

        // Store the total number of objects to loop through
        _fileTotal = cp.load.loadFiles.length;

        // Create all files
        _fileCreate();
    },
    _fileCreate = function() {
        // Setup script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = cp.load.fileUrl + cp.load.loadFiles[_fileCount] + '.js';

        // Declare onload rules
        script.onload = function() {
            // Increment counters here since the previous object is fully loaded
            _fileCount += 1;
            cp.load.assetCount += 1;

            // Test for completion and exit if so
            if (_fileCount >= _fileTotal) {
                return true;
            }

            // Refer back to this method upon completion
            _fileCreate();
        };

        // Insert new document
        _htmlHead[0].appendChild(script);
    },

    // Creates an XML HTTP request and fires a callback
    _createXmlHttp = function(url, callback) {
        // Prep XML HTTP request
        var loadXmlHttp = new XMLHttpRequest();
        loadXmlHttp.open('GET', url, true);
        loadXmlHttp.send();

        // When request is fully loaded
        loadXmlHttp.onreadystatechange = function() {
            if (loadXmlHttp.readyState === 4 && loadXmlHttp.status === 200) {
                callback(JSON.parse(loadXmlHttp.responseText));
            }
        };
    },

    _getImgs = function() {
        var callback = function(response) {
            // Prep data
            var images = response;

            // Increment number of game items
            cp.load.assetTotal += images.length;

            // Loop through all items
            // http://www.mennovanslooten.nl/blog/post/62
            var img; // container for creating new images in a loop
            for (var i = images.length; i--;) {
                img = new Image();
                img.src = cp.load.imgUrl + images[i];

                img.onload = (function(val) {
                    // returning a function forces the load into another scope
                    return function() {
                        cp.load.assetCount++;
                    }
                })(i);
            }
        };

        if (COMPILER_IMG === null) {
            _createXmlHttp('include/image-files.php', callback);
        } else {
            callback(COMPILER_IMG);
        }
    },

    // TODO: Add a url to retrieve audio
    _getAudio = function() {
        var callback = function(response) {
            // Unstringify data
            var sounds = response;

            cp.load.assetTotal += sounds.length;

            // Loop through all items
            for ( var s = sounds.length; s--; ) {
                // Create sound file from proper location
                var sound = new Audio(cp.audio.url + sounds[s] + cp.audio.type);

                // returning a function forces the load into another scope
                sound.addEventListener('canplaythrough', (function(val) {
                    cp.load.assetCount++;
                })(s));
            }
        };

        if (COMPILER_AUDIO === null) {
            _createXmlHttp('include/sound-files.php', callback);
        } else {
            callback(COMPILER_AUDIO);
        }

    };

    cp.load = {
        assetCount: 0, // Total number of successfully loaded assets
        assetTotal: 0, // Total number of assets to load
        loadFiles: null, // An array of file names to load, only loads files out of js->objects
        fileUrl: 'js/objects/', // Setup and information for loading file assets
        imgUrl: 'images/', // Default image loading location

        init: function() {
            if (!COMPILER_AUDIO || !COMPILER_IMG) {
                // Begin loading files
                _getFiles();
            }

            // Begin loading images (should fire draw when image files are added to total
            _getImgs();

            _getAudio();

            // temporarily replace loop
            _loopHold = cp.core.loop;
            cp.core.loop = this.loop;
        },

        // Logic for drawing and displaying loading screen
        // Must refer to cp.load to prevent reference errors since scope changes to cp.core temporarily
        loop: function() {
            // Create loading numbers string
            _loadProgress = cp.load.assetCount + ' / ' + cp.load.assetTotal;

            // Create loading bar information
            _loadPercent = (cp.load.assetCount / cp.load.assetTotal).toFixed(2);

            // Count loaded objects
            if (cp.load.assetCount === cp.load.assetTotal) {
                // turn off the animation and run the game
                cp.load.callback();

                // Check to see if debugging is active
                cp.debug.init();

                // Repair original loop
                cp.core.loop = _loopHold;
            }

            if (cp.load.assetCount > 0) {
                // Background
                cp.ctx.fillStyle = '#000';
                cp.ctx.fillRect(0, 0, cp.core.canvasWidth, cp.core.canvasHeight);

                // Loading text
                cp.ctx.fillStyle = '#fff';
                cp.ctx.font = '40px arial';
                cp.ctx.textAlign = 'center';
                cp.ctx.fillText('Loading...', cp.core.canvasWidth / 2, cp.core.canvasHeight / 2 - 50);

                // Asset count text
                cp.ctx.font = '20px arial';
                cp.ctx.fillText(_loadProgress, cp.core.canvasWidth / 2, cp.core.canvasHeight / 2 + 50);

                // Start loading bar background
                // TODO: These should not be generated every single time in the loop, make these _private variables
                var offset = 100,
                barX = offset / 2, // Note: might break due to self reference
                barY = cp.core.canvasHeight / 2 - 20,
                barWidth = cp.core.canvasWidth - offset,
                barHeight = 40;

                cp.ctx.fillStyle = '#fff';
                cp.ctx.fillRect(barX, barY, barWidth, barHeight);

                // Loading bar overlay (progress bar)
                offset = 5;
                barX = barX + offset;
                barY = barY + offset;
                barWidth = (barWidth - (offset * 2)) * _loadPercent;
                barHeight = barHeight - (offset * 2);

                cp.ctx.fillStyle = '#00aaff';
                cp.ctx.fillRect(barX, barY, barWidth, barHeight);
            }
        }
    };
}(cp));