/*
Name: Math processing
Version: 1
Desc: Contains a library of pre-built math equations, very
useful for generating random numbers and simplifying other
complex logic.
*/

var cp = cp || {};

cp.math = {
    // Random should only be run in the init for best practice
    random: function(max, min) {
        if (!min) min = 1;
        return Math.floor(Math.random() * (max - min) + min);
    },
    
    // Returns a random positive or negative number
    randomPosNeg: function() {
        return Math.random() < 0.5 ? -1 : 1;
    }
};