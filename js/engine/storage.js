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
*/

var cp = cp || {};

(function(cp, window) {
    var support = function() {
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
            if (! this.support) {
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
}(cp, window));