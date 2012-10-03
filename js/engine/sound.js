/*
Name: Sound Library
Version: 1
Desc: A series of controls for creating music, sound effect, and anything audio
related for a game.
*/

var cp = cp || {};

(function(cp) {
    /** @type {boolean} Debug toggler */
    var _debug = false;

    /** @type {string} File type */
    var _fileType = null;

    /** @type {array} Holds JSON objects of all the sound items */
    var _storage = [];

    /** @type {string} Sound file location */
    var _fileLocation = 'audio/';

    var _private = {
        /**
         * Detects the audio format
         */
        detect: function () {
            // Create a dummy audio placeholder
            var test = new Audio();

            // Check for ogg support
            if (test.canPlayType('audio/ogg; codecs="vorbis"')) {
                return '.ogg';
            // Check for mp3 support
            } else if (test.canPlayType('audio/mpeg;')) {
                return '.mp3';
            } else {
                return console.error('This browser does not support .mp3 or .ogg, failed to setup game.');
            }
        }
    };

    /**
     * @todo cp.load needs to pass in the cached audio files
     */
    cp.audio = {
        url: 'audio/',

        init: function() {
            _fileType = _private.detect();

            return this;
        },

        /**
         * @example
         * // Create a sound with 5 channels
         * cp.audio.newSound('mySound', 5);
         *
         * @example
         * // Create a sound with 1 channel
         * cp.audio.newSound('mySound');
         */
        newSound: function (fileName, channelNum, volume) {
            // Create the desired number of audio channels
            var audioChannels = [], audioFile;
            for (var i = channelNum || 1; i--;) {
                audioFile = new Audio(_fileLocation + fileName + _fileType);
                audioFile.volume = volume || 1;

                audioChannels.push(audioFile);
            }

            // Dump the audio channel data with a tag reference
            _storage.push({
                name: fileName,
                channels: audioChannels,
                cursor: 0
            });

            if (_debug === true) {
                console.log(_storage);
            }

            return this;
        },

        /**
         * @example
         */
        play: function (fileName) {
            // Get the tagged play item
            for (var i = _storage.length; i--;) {
                if (_storage[i].name === fileName) {
                    var audioFile = _storage[i];

                    // Play audio file
                    if (_debug === true) {
                        console.log(audioFile.cursor);
                    }
                    audioFile.channels[audioFile.cursor].play();

                    // Increment audio file cursor
                    audioFile.cursor += 1;
                    if (audioFile.cursor >= audioFile.channels.length) {
                        audioFile.cursor = 0;
                    }

                    // Force return to exit the loop
                    return this;
                }
            }

            return this;
        }
    };
}(cp));