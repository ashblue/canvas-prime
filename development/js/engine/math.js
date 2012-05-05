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
    },
    
    // Number converter
    // val = the number you wish to convert such as 5 (5 milliseconds)
    // base = the number to divide it by 1000 (conversion to a second)
    // round = how many numbers should it round up the returned result?
    convert: function(val, base, round) {
        return (val / base).toFixed(round);
    }
};