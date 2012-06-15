/*
Name: Timers
Version: 1.3
Desc: Allows users to create a new timer object. Calculated in seconds up to 2 decimal places.
Example usage: new cp.timer(3.25);
*/

var cp = cp || {};

cp.timer = Asset.extend({
    // Time is passed in seconds, not milliseconds
    init: function(time) {
        // Convert time and store it as milliseconds
        this.set(time);
        
        // Set the timer upon creation
        this.reset();
    },
    
    // Allows a user to force override the duration by bassing a number in seconds
    set: function(time) {
        // Convert time to milliseconds
        time = cp.math.convert(time, 1000, 0, true);
        
        // Force override duration
        return this.duration = time;
    },
    
    // Gets the total time passed and returns it in seconds
    past: function() {
        // Get the current time in milleseconds
        var time = this.compare();
        
        // Return time in seconds
        return cp.math.convert(time, 1000, 2);
    },
    
    // Returns the total time passed in milliseconds
    compare: function() {
        return Date.now() - this.start;
    },
    
    // Resets a timer to the current time
    reset: function() {
        return this.start = Date.now();
    },
    
    // Checks if a timer has expired
    expire: function() {
        // Check if duration has been passed
        if (this.compare() >= this.duration) {
            return true;
        } else {
            return false;
        }
    }
});