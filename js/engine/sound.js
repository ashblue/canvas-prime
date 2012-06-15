/*
Name: Sound Library
Version: 1
Desc: A series of controls for creating music, sound effect, and anything audio
related for a game.

Note: That in iOS you can only fire one sound at a time,
there is no workaround for this other than prioritizing sounds.
*/

var cp = cp || {};

cp.audio = {
    url: 'audio/', // Url to access audio elements
    storage: [], // Keeps track of all audio elements
    init: function() {
        this.detect();
    },
    
    // Searches for audio file support and sets it as necessary
    // Source: http://diveintohtml5.com/everything.html
    detect: function() {
        // Create a dummy audio placeholder
        var test = new Audio();
        
        // Check for ogg support
        if (test.canPlayType('audio/ogg; codecs="vorbis"')) {
            this.type = '.ogg'; 
        // Check for mp3 support
        } else if (test.canPlayType('audio/mpeg;')) {
            this.type = '.mp3';
        }
    },
    
    // Toggles mute on or off
    mute: function() {
        
    },
    
    // Creates a new sound object
    Sound: Class.extend({
        init: function(name) {
            // this.el = '';
        }
        // location
        // volume
        // play
        // stop
        // pause
    }),
    
    // Handeling of game's music
    music: {
        random: false, // Randomly play a track when next is called
        loop: false, // When the last track is finished playing, immediately start up the first track
        repeat: false, // Replay the current track if it ends instead of advancing to the next
        count: 0, // Currently played audio track index
        
        // playlist - an array of track names to load into the player
        init: function(playlist) {
            // Return an error if the playlist is not an array
            if (typeof playlist !== array) {
                console.error('Playlist passed to cp.audio.music was not an array and equal to ' + playlist);
                return;
            } else {
                // Cache the playlist
                this.playlist = playlist;
            }
            
            // Load the first track
            this.el = new Audio(cp.audio.url + this.playlist[0] + cp.audio.type);
            
            // Attach the event to play the next track
        },
        
        // Return the name of the current track
        trackName: function() {
            var src = this.el.src;
            
            // Strip off the file type
            src.replace(cp.audio.type, '');
            
            // Return just the name and nothing else of the url
            var explode = src.split('/');
            return explode.pop();
        },
        
        // Fade effect
        /*
         begin (int) = 0 to 1 volume lv
         end (int) = 0 to 1 volume lv
         duration (int) = Time in seconds for the fade to span over ex. 1.25
         stop (bool) = Whether or not to stop the track after the fade, defaults to false
        */
        fade: function(begin, end, duration, stop) {
            
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
                this.el.src = cp.audio.url + this.playlist[index] + cp.audio.type;
            }
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
            // Verify the next counter doesn't exceed the array length
            
            // If so bump it up
            
            // Load up the new src and play
            this.play(this.count);
        },
        
        // Play previous track
        previous: function() {
            // Verify the prev counter doesn't exceed the array length
            
            // If so bump it up
            
            // Load up the new src and play
            this.play(this.count);
        },
        
        // Set volume 0 to 1
        volume: function(num) {
            this.el.volume = num;
        },
        
        // Add a new track to the array
        // add (string) = Name of the file without the file type
        add: function(name) {
            this.playlist.push(name);
        }
    }
};