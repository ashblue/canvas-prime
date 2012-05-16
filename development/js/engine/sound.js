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
    // Loader tests and returns a usable audio type at initialization (mp3, ogg
    // ect).
    // Example type: '.mp3'
    type: '',
    
    // Url to access audio elements
    url: 'assets/audio',
    
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