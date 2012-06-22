/*
Name: Loading Logic
Version: 1
Desc: Controls all file loading mechanisms and draws the loading screen while waiting.
*/

var cp = cp || {};

(function (cp) {
    var _loopHold, // temporary dump location to hold the cp.core.loop while its temporarily replaced to show the load screen
    _loadProgress, // Shows the current load progress text
    _loadPercent, // Total percent of loaded assets

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

    _getImgs = function() {
        // Prep XML HTTP request
        var loadXmlHttp = new XMLHttpRequest();
        loadXmlHttp.open('GET', 'include/image-files.php',true);
        loadXmlHttp.send();

        // When request is complete
        loadXmlHttp.onreadystatechange = function() {
            if (loadXmlHttp.readyState === 4 && loadXmlHttp.status === 200) {
                // Prep data
                var images = JSON.parse(loadXmlHttp.responseText);

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
            }
        }
    },

    // TODO: Add a url to retrieve audio
    _getAudio = function() {
        // Prep XML http request
        var loadXmlHttp = new XMLHttpRequest();
        loadXmlHttp.open('GET', 'include/sound-files.php', true);
        loadXmlHttp.send();

        // Request complete logic
        loadXmlHttp.onreadystatechange = function() {
            if (loadXmlHttp.readyState === 4 && loadXmlHttp.status === 200) {
                // Unstringify data
                var sounds = JSON.parse(loadXmlHttp.responseText);

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
            }
        };
    };

    cp.load = {
        assetCount: 0, // Total number of successfully loaded assets
        assetTotal: null, // Total number of assets to load
        loadFiles: null, // An array of file names to load, only loads files out of js->objects
        fileUrl: 'js/objects/', // Setup and information for loading file assets
        imgUrl: 'images/', // Default image loading location

        init: function() {
            // Begin loading files
            _getFiles();

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