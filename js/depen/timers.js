/*
 --- Info ---
Name: Timers
Version: .2
Desc: Allows users to create a new timer object.

NOTE: Time is based upon computer relayed time. Should be more subjective
to the in game world's time for a more accurate experience. Issue is that may
cause performance degradation on the game unless very careful integrated.
*/
var Timer = Class.extend({
    // Duration is calculated in seconds (up to 2 dec. places)
    duration: 0,
    set: function(dur) {
        if (dur) this.duration = dur;
        this.start = new Date();
    },
    reset: function() {
        this.start = new Date();
    },
    expire: function() {
        // Translate to seconds
        var now = new Date();
        var cur = (now.getTime() - this.start.getTime());
        var cur = this.convert(cur);
        
        // Return true if expired
        if (cur > this.duration) return true;
        else return false;
    },
    convert: function(mil) {
        // Milliseconds to seconds with 2 dec. places
        var secs = (mil / 1000).toFixed(2);
        return secs;
    }
});