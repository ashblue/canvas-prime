var strings = {
    /**
     * Test to discover if the needle(s) are present inside
     * a string.
     * @param {string} haystack String you want to search
     * @param {string} needle Item you're looking for in the haystack
     * @returns {boolean} True upon discovery, false upon failure.
     */
    getString: function (haystack, needle) {
        var result = false;

        if (Array.isArray(needle)) {
            needle.forEach(function (value) {
                if (haystack.indexOf(value) !== 1) {
                    result = true;
                }
            });
        } else if (typeof needle === 'string') {
            return haystack.indexOf(needle) !== -1;
        }

        return result;
    },

    /**
     * Replace string between two points
     * @param {string} haystack A bunch of text to search through
     * @param {string} start String to start the replace process
     * @param {string} end String to end the replace process
     * @param {string} replace String that replaces the found string
     * @returns {string} A new string with the replaced content
     * @todo Make sure it removes all instances of the strings in the haystack
     */
    setStringBetween: function (haystack, start, end, replace) {
        var indexStart = haystack.indexOf(start);
        var indexEnd = haystack.indexOf(end, indexStart);

        return (haystack.substring(0, indexStart) + replace + haystack.substring(indexEnd + end.length));
    },

    /**
     * Gets a string between two points inside a string
     * @todo Make sure it returns all instances of the strings in the haystack
     */
    getStringBetween: function (haystack, start, end) {
        var indexStart = haystack.indexOf(start) + start.length;
        var indexEnd = haystack.indexOf(end, indexStart);

        return haystack.substring(indexStart, indexEnd);
    }
};

exports.strings = strings;