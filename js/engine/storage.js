/*
Name: Local Storage API Access
Version: 1
Desc: Allows you to save, update, and change local storage data
on the fly.

Reference: https://developer.mozilla.org/en/DOM/Storage

Example usage:
- Save
  cp.storage.save('name', 'Joe');

- Remove
  cp.storage.remove('name');

- Get
  cp.storage.get('name');

TODO: Might want to consider providing some kind of system crash error in-case
the user has local storage disabled for some stupid reason.

TODO: Add a cached version of storage as JSON if its faster to access, example:
    storage: {},
    build: function() {
        // Reset current storage
        this.storage = {};

        // Start loop
        for (var i = sessionStorage.length; i--;){
            // Get the storage key
            var key = sessionStorage.key(i);

            // Get the result
            var result = this.get(key);

            // Dump gathered data into JSON object
            this.storage[key] = result;
        }
    }

*/

var cp = cp || {};

(function(cp) {
    var _support = function() {
        try {
            cp.storage.save('test', 'asdf');
            cp.storage.remove('test');
            return true;
        } catch(e) {
            return false;
        }
    };

    cp.storage = {
        init: function() {
            if (! _support) {
                return alert('Local storage is broken or disabled, please enable it to continue.');
            }
        },

        // Saves the passed parameter with a key or tag reference
        save: function(key, value) {
            // Set local storage data internally
            sessionStorage.setItem(key, value);
        },

        // Gets select data, should be using build to retrieve
        get: function(key) {
            var result = sessionStorage.getItem(key);

            return result;
        },

        // Removes the passed paramater
        remove: function(key) {
            // Set local data
            sessionStorage.removeItem(key);
        }
    };
}(cp));