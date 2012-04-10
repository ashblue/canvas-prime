/*
Name: Animation Sheets and Controls
Version: .01
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init
*/
var animSheet = Class.extend({
    // relative url to image sheet
    url: '',
    
    // In order for images to be properly load they must be called from entity.load,
    // which must be fired IMMEDIATELY after the script is loaded and BEFORE the next script is loaded.
    // Or something like that.
    setup: function(file,width,height) {
        this.imgLoad(file);
        this.img
    },
    
    imgLoad: function(file) {
        this.img = new image;
        // Image isn't actually loaded, but it starts loading, we need a fix that
        // makes the JavaScript wait until the images are FULLY loaded, then proceeds
        img.src = this.url + file;
    },
    
    // Break up the image into several different pieces based upon width and height parameters
    imgSlice: function() {
        
    }
    
});