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
*/

var cp = cp || {};

cp.debug = {
    active: false,
    init: function() {
        // If debugging is not active kill all active functions to prevent unnecessary lag
        if (this.active === false) {
            this.start = this.end = this.recordStart = this.recordEnd = function() {
                return;
            };
        }
    },
    
    // Millisecond starting value for Date.now()
    base: Date.now(),
    
    // Total time passed
    past: 0,
    
    // Create a storage container for start and end time
    records: {},
    
    // Storage of all results from processed data
    results: [],
    
    // FPS info storage
    fps: {
        count: 0    
    },
    
    // Creates a light weight time recording loop by calculating differnce
    // Speed variable is equal to the number of frames you want to capture and process time at
    // 60 is roughly equal to 1 second
    start: function() {
        this.past = Date.now() - this.base;
        
        // test if 1 second has passed
        if (this.past > 1000) {
            // Calculate results
            this.gather();
            
            // Count another second
            this.base = Date.now();
            
            // Clear fps
            this.fps.count = 0;
        }
        
        // Increment fps since 1 frame has passed
        this.fps.count++;
        
        this.recordStart('total');
    },
    
    end: function() {
        this.recordEnd('total');
    },
    
    // Takes a snapshot of the current item
    recordStart: function(name) {
        // Make sure the object exists, or create it.
        if (this.records[name] === undefined) {
            this.records[name] = {
                id: name
            }
        }
        
        // Begin recording
        this.records[name].start = Date.now();
    },
    
    // Takes a snapshot of the current item and stores the result
    recordEnd: function(name) {
        // End recording
        this.records[name].end = Date.now();
        
        // Increment the difference between recordings
        this.records[name].total += this.records[name].end - this.records[name].start;
    },
    
    // Creates all of the debug data from the gathered records
    gather: function() {
        // Clear records
        this.results = [];
        
        // Loop through all records and store their results with a tag
        for (var num in this.records) {
            // Convert the total time to seconds
            var time = cp.math.convert(this.records[num].total, 1000, 2);
            
            var tag = this.records[num].id;
            this.results.push({
                name: tag,
                val: time });
            
            // Clear total from records
            this.records[num].total = 0;
        }
                
        // Display the resuls
        this.display();
    },
    
    // Creates a DOM element and injects it onto the user's screen.
    // This should be fixed up in the near future with some CSS and better DOM targeting
    // to prevent excessive DOM calls.
    display: function() {
        // Clear existing list
        var el = document.getElementById('debug');
        if (el) el.parentNode.removeChild(el);
        
        // Create base for list
        var el = document.createElement('div');
        var list = document.createElement('ul');
        list.id = 'debug';
        
        // Append FPS
        var li = document.createElement('li');
        li.innerHTML = 'FPS: ' + this.fps.count;
        list.appendChild(li);
        
        // Append entity count
        var li = document.createElement('li');
        li.innerHTML = 'Entity#: ' + cp.core.storage.length;
        list.appendChild(li);
        
        // Loop through the results and attach them to the list
        for ( obj = this.results.length; obj--; ) {
            var li = document.createElement('li');
            li.innerHTML = this.results[obj].name + ': ' + this.results[obj].val + ' ms';
            list.appendChild(li);
        }
        
        // Inject assembled object
        document.body.appendChild(list);
    }
};