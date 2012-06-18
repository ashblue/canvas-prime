/*
Name: Debugging Controls
Version: 1.1
Desc: Allows you to display the current fps, total draw time, total update time,
collision processing time, system lag, total enties, total frame time, and more.

To-Do:
- Click debug area to pull up a graph of fps with a range
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
        other: {
            title: 'Other',
            color: '#A568C4',
            measurement: 'ms'
        },
        total: {
            title: 'Total',
            color: '#E06835',
            measurement: 'ms'
        }
    };
    
    var _generateHTML = function() {
        // Main body of debug div
        var el = _genEl('aside', { id: 'debug' });
        
        // Setup click listener for sections
        var sectionClick = function(e) {
            // Destroy all active states
            el.getElementsByClassName('active')[0].classList.remove('active');

            // Add correct active states
            if (this.nextSibling) {
                this.nextSibling.classList.add('active');
            } else {
                this.previousSibling.classList.add('active');
            }
            
            e.preventDefault();
        };
        
        // Generate stats
        var stats = _genEl('div', { id: 'debug-stats', className: 'debug-container active' });
        stats.addEventListener('click', sectionClick);
        el.appendChild(stats);
        
        var statsList = document.createElement('ul');
        statsList.className = 'debug-list';
        stats.appendChild(statsList);
        
        _genStats(statsList);
        
        // Generate Graph
        var graph = _genEl('div', { id: 'debug-graph', className: 'debug-container' });
        graph.addEventListener('click', sectionClick);
        el.appendChild(graph);
        
        document.body.appendChild(el);
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
    
    var _genStats = function(attachEls) {        
        for (var name in _records) {
            var el = _genEl('li', {
                id: 'stat-' + _records[name].title.toLowerCase(),
                className: 'stat'
            });
            el.style.color = _records[name].color;
            
            // name
            var title = _genEl('span', { className: 'stat-name', innerHTML: _records[name].title + ': ' });
            el.appendChild(title);
                        
            // total
            var total = _genEl('span', { className: 'stat-total', innerHTML: '0' });
            el.appendChild(total);
            
                        
            // Cache DOM info for quick access later
            _records[name].dom = total;

            attachEls.appendChild(el);
        }
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
            } else {
                _generateHTML();
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
            if (_records[name].start !== undefined)
                _records[name].total += _records[name].end - _records[name].start;
        },
        
        // Creates all of the debug data from the gathered records
        gatherResults: function() {
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
                
                // Output other
                if (name === 'total') {
                    var otherTotal = Math.abs(_records['draw'].result + _records['update'].result + _records['collisions'].result - _records['total'].result);
                    _records['other'].dom.innerHTML = otherTotal + ' <small>' + _records['other'].measurement + '</small>';
                }
                
                // Inject value
                _records[name].dom.innerHTML = _records[name].result;
                
                // Append measurement
                if (_records[name].measurement !== undefined)
                    _records[name].dom.innerHTML += ' <small>' + _records[name].measurement + '</small>';
            }
        }
    };
}(cp, window));