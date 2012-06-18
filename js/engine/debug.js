/*
Name: Debugging Controls
Version: 1.1
Desc: Allows you to display the current fps, total draw time, total update time,
collision processing time, system lag, total enties, total frame time, and more.

To-Do:
- Still needs a method to create collision boxes in the draw() sequence
- Needs to shave off the excess milliseconds when reporting response times
- Other for unaccounted time (inputs, lag, graveyard, ect)
- Init should take a string that gets processed for the features from debug
  that a user wants.
  
  
- Create html for inital setup and creation of the html
- Create better HTML updating
- Color injection
- Fix FPS issue
*/

var cp = cp || {};

(function(cp, window) {
    var _records = {
        fps: {
            title: 'FPS',
            color: '#0084FF'
        },
        entity: {
            title: 'Entity#',
            color: '#00A220'
        },
        draw: {
            title: 'Draw',
            color: '#A568C4',
            measurement: 'ms'
        },
        update: {
            title: 'Update',
            color: '#A568C4',
            measurement: 'ms'
        },
        collisions: {
            title: 'Collisions',
            color: '#A568C4',
            measurement: 'ms'
        },
        total: {
            title: 'Title',
            color: '#E06835',
            measurement: 'ms'
        }
    };
    
    var _generateHTML = function() {
        // Main body of debug div
        var el = genEl('aside', { id: 'debug' });
        
        // Generate stats
        var stats = genEl('div', { id: 'debug-stats', className: 'debug-container active' });
        el.appendChild(stats);
        
        var statsList = document.createElement('ul');
        statsList.className = 'debug-list';
        stats.appendChild(statsList);
    };
    
    var _genEl = function(create, data) {
        // return if no element is present
        if (typeof create !== 'string')
            return console.error('First paramter must be a string to create an HTML element.');
        
        // Create element    
        var el = document.createElement(create);
        
        // Loop through and set all passed data
        for (var i in data) {
            el[i] = data[i];
        }
        
        return el;
    };
    
    cp.debug = {
        active: false,
        // Millisecond starting value for Date.now()
        base: Date.now(),
        // Total time passed
        past: 0,
        
        init: function() {
            // If debugging is not active kill all active functions to prevent unnecessary lag
            if (this.active === false) {
                this.start = this.end = this.recordStart = this.recordEnd = function() {
                    return;
                };
            }
        },
        
        // Creates a light weight time recording loop by calculating differnce
        // Speed variable is equal to the number of frames you want to capture and process time at
        // 60 is roughly equal to 1 second
        start: function() {
            this.past = Date.now() - this.base;
            
            // test if 1 second has passed
            if (this.past > 1000) {
                _records.entity.result = cp.core.storage.length;
                
                // Calculate results
                this.gatherResults();
                
                // Count another second
                this.base = Date.now();
                
                // Clear fps
                _records.fps.result = 0;
            }
            
            // Increment fps since 1 frame has passed
            _records.fps.result++;
            
            this.recordStart('total');
        },
        
        end: function() {
            this.recordEnd('total');
        },
        
        // Takes a snapshot of the current item
        recordStart: function(name) {            
            // Begin recording
            _records[name].start = Date.now();
        },
        
        // Takes a snapshot of the current item and stores the result
        recordEnd: function(name) {
            // End recording
            _records[name].end = Date.now();
            
            // Increment the difference between recordings
            _records[name].total += _records[name].end - _records[name].start;
        },
        
        // Creates all of the debug data from the gathered records
        gatherResults: function() {
            // Clear existing list
            var el = document.getElementById('debug');
            if (el) el.parentNode.removeChild(el);
            
            // Create base for list
            var el = document.createElement('div');
            var list = document.createElement('ul');
            list.id = 'debug';
            
            // Loop through all records and store their results with a tag
            for (var name in _records) {
                // Process time information if necessary
                if (typeof _records[name].total === 'number') {
                    // Convert the total time to seconds
                    var time = cp.math.convert(_records[name].total, 1000, 2);
                    
                    _records[name].result = time;
                    
                    // Clear total from records
                    _records[name].total = 0;
                }
                
                var li = document.createElement('li');
                li.innerHTML = name + ': ' + _records[name].result;
                list.appendChild(li);
            }
                    
            // Display the resuls
            document.body.appendChild(list);
        }
    };
}(cp, window));