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
- should set all function references for debug tagging to false, to completely nerf them
*/

var cp = cp || {};

(function(cp, window) {
    var debugInfo = [
        {
            title: 'FPS',
            color: '#0084FF',
            graph: true,
            cacheDOM: {}
        },
        {
            title: 'Entity',
            color: '#00A220'
        },
        {
            title: 'Collisions',
            color: '#A568C4',
            measurement: 'ms',
            cacheDOM: {}
        },
        {
            title: 'Draw',
            color: '#A568C4',
            measurement: 'ms',
            cacheDOM: {}
        },
        {
            title: 'Update',
            color: '#A568C4',
            measurement: 'ms',
            cacheDOM: {}
        },
        {
            title: 'Other',
            color: '#A568C4',
            measurement: 'ms',
            cacheDOM: {}
        },
        {
            title: 'Total',
            color: '#E06835',
            measurement: 'ms',
            graph: true,
            cacheDOM: {}
        }
    ];
    
    // Initial HTML generation
    var html = function() {
        // Main body of debug div
        var el = genEl('aside', { id: 'debug' });
        
        // Create nav
        var nav = genEl('nav', { id: 'debug-nav' });
        el.appendChild(nav);
        
        // Logic for clicking a nav
        var navClick = function(e) {
            // Destroy all active states
            var elDump = el.getElementsByClassName('active');
            for (var i = elDump.length; i--;) {
                elDump[i].classList.remove('active');
            }

            // Add correct active states
            this.classList.add('active');
            document.getElementById(this.dataset.id).classList.add('active');
            
            e.preventDefault();
        };
        
        // Stats nav element
        var navStats = genEl('a', { className: 'nav-item active', innerHTML: 'Stats', href: '#' });
        navStats.dataset.id = 'debug-stats';
        navStats.addEventListener('click', navClick);
        nav.appendChild(navStats);
        
        // Graph nav element
        var navGraph = genEl('a', { className: 'nav-item', innerHTML: 'Graphs', href: '#' });
        navGraph.dataset.id = 'debug-graph';
        navGraph.addEventListener('click', navClick);
        nav.appendChild(navGraph);
        
        // Create stats section
        var stats = genEl('div', { id: 'debug-stats', className: 'debug-container active' });
        el.appendChild(stats);
        
        var statsInfo = genEl('span', { className: 'info' });
        stats.appendChild(statsInfo);
        
        var statsText = genEl('p', { className: 'info-text', innerHTML: 'Stats are generated from a snapshot taken every one second. The formula for output is as follows: Average (Min - Max) measurement.' });
        statsInfo.appendChild(statsText);
        
        var statsList = document.createElement('ul');
        statsList.className = 'debug-list';
        stats.appendChild(statsList);
        genStats(statsList);
        
        // Create graph section
        var graph = genEl('div', { id: 'debug-graph', className: 'debug-container' });
        el.appendChild(graph);
        
        var graphInfo = genEl('span', { className: 'info' });
        graph.appendChild(graphInfo);
        
        var graphText = genEl('p', { className: 'info-text', innerHTML: 'Graph data is updated once every second. Only displays the last 20 seconds of capture data. <strong>Data Type (total) (Min - Max)</strong>' });
        graphInfo.appendChild(graphText);
        
        genGraph(graph);
        
        document.body.appendChild(el);
    };
    
    var genEl = function(create, data) {
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
    
    var genStats = function(attachEls) {        
        for (var stat = 0; stat < debugInfo.length; stat++) {
            var el = genEl('li', {
                id: 'stat-' + debugInfo[stat].title.toLowerCase(),
                className: 'stat'
            });
            el.style.color = debugInfo[stat].color;
            
            // name
            var name = genEl('span', { className: 'stat-name', innerHTML: debugInfo[stat].title + ': ' });
            el.appendChild(name);
            
            // total
            var total = genEl('span', { className: 'stat-total', innerHTML: '0' });
            el.appendChild(total);
            
            // range
            var range = genEl('span', { className: 'stat-range', innerHTML: ' (0 - 0)' });
            if (debugInfo[stat].measurement !== undefined)
                range.innerHTML += ' ' + debugInfo[stat].measurement;
            el.appendChild(range);
            
            // Cache DOM info for quick access later
            debugInfo[stat].cacheDOM.value = total;
            debubInfo[stat].cacheDOM.range = range;
            
            attachEls.appendChild(el);
        }
    };
    
    var genGraph = function(attachEls) {
        for (var stat = 0; stat < debugInfo.length; stat++) {
            // Exit early if no graph
            if (debugInfo[stat].graph === undefined)
                continue;
            
            if (debugInfo[stat].measurement) {
                var measurement = debugInfo[stat].measurement;
            } else {
                measurement = '';
            }
            
            // Container
            var el = genEl('div', {
                id: 'stat-' + debugInfo[stat].title.toLowerCase(),
                className: 'graph',
                innerHTML: '<h3 class="graph-title">' + debugInfo[stat].title + ' 0 <span class="graph-range">(0 - 0)</span> ' + measurement + '</h3><div class="graph-data"></div>'
            });
            
            attachEls.appendChild(el);
        }
    };
    
    cp.debug = {
        active: false,
        init: function() {
            // If debugging is not active kill all active functions to prevent unnecessary lag
            if (this.active === false) {
                this.start = this.end = this.recordStart = this.recordEnd = function() {
                    return; // TODO: Find an easier way to destroy the function by setting false maybe
                };
            } else {
                html();
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
            for (var i = 0; i < debugInfo.length; i++) {
                debugInfo[i]
            }
            
            //// Clear existing list
            //var el = document.getElementById('debug');
            //if (el) el.parentNode.removeChild(el);
            //
            //// Create base for list
            //var el = document.createElement('div');
            //var list = document.createElement('ul');
            //list.id = 'debug';
            //
            //// Append FPS
            //var li = document.createElement('li');
            //li.innerHTML = 'FPS: ' + this.fps.count;
            //list.appendChild(li);
            //
            //// Append entity count
            //var li = document.createElement('li');
            //li.innerHTML = 'Entity#: ' + cp.core.storage.length;
            //list.appendChild(li);
            //
            //// Loop through the results and attach them to the list
            //for ( obj = this.results.length; obj--; ) {
            //    var li = document.createElement('li');
            //    li.innerHTML = this.results[obj].name + ': ' + this.results[obj].val + ' ms';
            //    list.appendChild(li);
            //}
            //
            //// Inject assembled object
            //document.body.appendChild(list);
        }
    };
}(cp, window));