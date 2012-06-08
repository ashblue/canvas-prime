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
    url: 'assets/audio', // Url to access audio elements
    
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
    
    el: {
        // Element storage location for audio element
        store: '',
        create: function() {
            // http://stackoverflow.com/questions/10535124/javascript-create-audio-element-cross-browser-issue
        }
    },
    
    music: function() {
        
    },
    
    mute: function() {
        
    }
};