/*
Name: Math processing
Version: 1
Desc: Contains a library of pre-built math equations, very
useful for generating random numbers and simplifying other
complex logic.
*/

var cp = cp || {};

(function (cp) {
    cp.math = {
        // Random should only be run in the init for best practice
        random: function(max, min) {
            if (!min) min = 1;
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        // Returns a random positive or negative number
        randomPosNeg: function() {
            return Math.random() < 0.5 ? -1 : 1;
        },

        // Number converter
        // val = the number you wish to convert such as 5 (5 milliseconds)
        // base = the number to divide it by 1000 (conversion to a second)
        // round = how many numbers should it round up the returned result?
        // multiply = boolean that allows you to convert a number down instead of up
        // TODO: Round this way is slow, use Math.floor instead
        convert: function(val, base, round, multiply) {
            // Convert a number up
            if (multiply) {
                var total = val * base;
            // Convert down
            } else {
                var total = val / base;
            }

            return Math.round(total * Math.pow(10, round)) / Math.pow(10, round);
        },

        angleBetweenPoints: function (start, end) {
            return Math.atan2(-(end.y - start.y), end.x - start.x);
        },

        /**
         * Convert radians to degree
         * @link http://stackoverflow.com/questions/135909/is-there-a-built-in-method-for-converting-radians-to-degrees
         * @param {number} rad Radians to convert
         * @returns {number} 0 to 360 degrees
         */
        radiansToDegrees: function (rad) {
            return rad * (180 / Math.PI);
        },

        /**
         * Convert degrees to radians
         * @param {number} degrees 0 to 360 degrees
         * @returns {number} Numerical value of radians
         */
        degreesToRadian: function (degrees) {
            return degrees * (Math.PI / 180);
        },

        movePointAtAngle: function (point, angle, distance) {
            return {
                x: point.x - (Math.sin(angle * Math.PI / 180) * distance),
                y: point.y + (Math.cos(angle * Math.PI / 180) * distance)
            };
        }
    };
}(cp));