/*
Name: Animation Sheets and Controls
Version: .01
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with Game.imgCount and Game.imgLoaded
*/
var animSheet = Class.extend({
    // relative url to image sheet
    url: 'img/',
    
    // In order for images to be properly load they must be called from entity.load,
    // which must be fired IMMEDIATELY after the script is loaded and BEFORE the next script is loaded.
    // Or something like that.
    setup: function(file,width,height) {
        this.imgLoad(file);
        this.img
    },
    
    
    imgLoad: function(file) {
        // In order to count loaded images for an object before proceeding, a listener needs
        // to be listening for the image count
        Game.imgCount += 1;
        
        this.img = new image;
        img.src = this.url + file;
        img.onload = function() {
            // Each object will wait for the .imageLoaded to be complete to fire the next object
            Game.imgLoaded += 1;
        }
    },
    
    // Break up the image into several different pieces based upon width and height parameters
    imgSlice: function() {
        
    }
    
});