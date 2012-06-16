/*
 * A quick demo of sound usage.
*/

cp.template.SoundTest = cp.template.Entity.extend({   
    init: function() {
        // Create a playlist and run it
        //cp.audio.music.init(['crash', 'nuclear-launch', 'ride-warning'], { 'loop': true });
        //cp.audio.music.play();
        
        this.sound = new cp.audio.Sound('ride-warning');
    },
    
    update: function() {
        if (this.test === undefined) {
            this.sound.play();
            this.test = 'string';
        } 
    }
});