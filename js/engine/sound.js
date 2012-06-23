/*
Name: Sound Library
Version: 1
Desc: A series of controls for creating music, sound effect, and anything audio
related for a game.

Note: That in iOS you can only fire one sound at a time,
there is no workaround for this other than prioritizing sounds.
*/

var cp = cp || {};

(function(cp) {
    // Searches for audio file support and sets it as necessary
    // Source: http://diveintohtml5.com/everything.html
    var _detect = function() {
        // Create a dummy audio placeholder
        var test = new Audio();

        // Check for ogg support
        if (test.canPlayType('audio/ogg; codecs="vorbis"')) {
            cp.audio.type = '.ogg';
        // Check for mp3 support
        } else if (test.canPlayType('audio/mpeg;')) {
            cp.audio.type = '.mp3';
        } else {
            console.error('This browser does not support .mp3 or .ogg, failed to setup game.');
        }
    };

    cp.audio = {
        url: 'audio/',
        init: function() {
            _detect();
        },

        // Creates a new sound object
        Sound: Asset.extend({
            // name - String of the base audio file name
            init: function(name) {
                this.el = new Audio(cp.audio.url + name + cp.audio.type);
            },

            // Get or return the current track's total play timelocation
            playTime: function(set) {
                if (set !== undefined && set === int)
                    this.el.currentTime = set;
                else
                    return this.el.currenttime;
            },

            // level - Number of 0 to 1
            volume: function(level) {
                this.el.volume = level;
            },

            play: function() {
                this.el.play();
            },

            stop: function() {
                this.el.pause();
            }
        }),

        // Handeling of game's music
        music: {
            /* playlist - an array of track names to load into the player
             * settings - JSON object that overrides defaults
             * - loop (bool): Restart the playlist after playing all tracks
             * - repeat (bool): Replay the same track after ending
             * - autoplay (bool); Automatically plays the next track
            */
            init: function(playlist, settings) {
                var self = this;

                this.loop = this.repeat = false;
                this.autoplay = true;
                this.count = 0; // Inital track start location and delay between tracks
                this.setDelay(2);

                // Override settings
                if (typeof settings === 'object') {
                    cp.core.quickSet(settings, this);
                }

                // Return an error if the playlist is not an array
                // Note: Current mode of detection is not bullet proof
                if (!(playlist instanceof Array)) {
                    return console.error('Playlist passed to cp.audio.music must be an array');
                } else {
                    // Cache the playlist
                    this.playlist = playlist;
                }

                // Load the first track
                this.setTrack();

                // Attach the event to play the next track
                this.el.addEventListener('ended', function() {
                    if (self.autoplay === false) return;

                    var callback = function() {
                        if (self.repeat) {
                            self.play();
                        } else {
                            self.next();
                        }
                    };

                    window.setTimeout(callback, self.delay);
                });
            },

            setDelay: function(seconds) {
                this.delay = cp.math.convert(seconds, 1000, 0, true);
            },

            setTrack: function() {
                if (this.el) {
                    this.el.src = cp.audio.url + this.playlist[this.count] + cp.audio.type;

                // Create audio track for the first time
                } else {
                    this.el = new Audio(cp.audio.url + this.playlist[this.count] + cp.audio.type);
                }
            },

            // Return the name of the current track
            getTrack: function() {
                var src = this.el.src;

                // Strip off the file type
                src = src.replace(cp.audio.type, '');

                // Return just the name and nothing else of the url
                var explode = src.split('/');
                return explode.pop();
            },

            // Fade effect
            /*
             end (int) = 0 to 1 volume lv
             duration (int) = Time in seconds for the fade to span over ex. 1.25
             stop (function) = Extra logic to execute upon completion
            */
            fade: function(volumeEnd, duration, stop) {
                var self = this;

                var volumeStart = this.el.volume;
                var volumeDifference = (volumeEnd - volumeStart).toFixed(1);

                var timer = new cp.timer(duration);

                var callback = function() {
                    if (!timer.expire()) {
                        // Find the percentage of the time passed
                        var timePast = (timer.past() / duration).toFixed(2);

                        // Multiply time passed by the difference to get a volume
                        var volume = Math.round(((volumeDifference * timePast) + volumeStart) * 1000) / 1000;

                        if (volume < 0)
                            self.el.volume = 0;
                        else if (volume > 1)
                            self.el.volume = 1;
                        else
                            self.el.volume = volume;
                    } else {
                        self.el.volume = volumeEnd;

                        if (stop !== undefined)
                            stop();

                        clearInterval(this.fading);
                    }
                }

                this.fading = window.setInterval(callback, 20);
            },

            /* Controls */
            // Play currently location or pass an optional index for the playlist array
            play: function(index) {
                // No index, play as normal
                if (index === undefined) {
                    this.el.play();

                // Otherwise load and play the new index
                } else {
                    this.count = index;
                    this.setTrack();
                    this.el.play();
                }
            },

            playRandom: function() {
                var index = cp.math.random(this.playlist.length, 0);
                this.play(index);
            },

            restart: function() {
                this.el.currentTime = 0;
                this.play();
            },

            stop: function() {
                this.el.pause();
                this.el.currentTime = 0;
            },

            pause: function() {
                this.el.pause();
            },

            // Play next track
            next: function() {
                 this.count++;

                // Verify the next counter doesn't exceed the array length
                if (this.count >= this.playlist.length) {
                    if (this.loop) {
                        this.count = 0;
                    // Exit early nothing to play
                    } else {
                        return;
                    }
                }

                // Load up the new src and play
                this.stop();
                this.play(this.count);
            },

            // Play previous track
            previous: function() {
                this.count--;

                // Verify the prev counter doesn't exceed the array length
                if (this.count < 0) {
                    if (this.loop) {
                        this.count = this.playlist.length - 1;
                    // Exit early, nothing to play
                    } else {
                        return;
                    }
                }

                // Load up the new src and play
                this.stop();
                this.play(this.count);
            },

            // Set volume 0 to 1
            volume: function(num) {
                this.el.volume = num;
            },

            // Add a new track to the end of the playlist
            // add (string) = Name of the file without the file type
            add: function(name) {
                this.playlist.push(name);
            },

            // Removes a track by array index
            remove: function(index) {
                this.playlist.splice(index, 1);
            }
        }
    };
}(cp));