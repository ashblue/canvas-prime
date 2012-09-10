/*
Name: Debugging Controls
Version: 1.1
Desc: Allows you to display the current fps, total draw time, total update time,
collision processing time, system lag, total enties, total frame time, and more.

To-Do:
- Click debug area to pull up a graph of fps with a range
*/

var cp = cp || {};

(function (cp) {
    var _records = {
        fps: {
            title: 'FPS',
            color: '#0084FF',
            graph: true,
            min: 100,
            max: 0,
            result: 0
        },
        entity: {
            title: 'Entity#',
            color: '#00A220'
        },
        draw: {
            title: 'Draw',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        update: {
            title: 'Update',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        collisions: {
            title: 'Collisions',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        other: {
            title: 'Other',
            color: '#A568C4',
            measurement: 'ms',
            total: 0
        },
        total: {
            title: 'Total',
            color: '#E06835',
            measurement: 'ms',
            graph: true,
            min: 100,
            max: 0,
            total: 0
        }
    },

    _generateHTML = function() {
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

        document.body.appendChild(el);

        // Generate Graph
        var graph = _genEl('div', { id: 'debug-graph', className: 'debug-container' });
        graph.addEventListener('click', sectionClick);
        el.appendChild(graph);

        _generateGraphs(graph);
    },

    _genEl = function(create, data) {
        // return if no element is present
        if (typeof create !== 'string') {
            return console.error('First paramter must be a string to create an HTML element.');
        }

        // Create element
        var el = document.createElement(create);

        // Loop through and set all passed data
        for (var i in data) {
            el[i] = data[i];
        }

        return el;
    },

    _genStats = function(attachEls) {
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

            if (_records[name].measurement !== undefined)
                el.appendChild(_genEl('small', {
                    innerHTML: _records[name].measurement }));


            // Cache DOM info for quick access later
            _records[name].dom = total;

            attachEls.appendChild(el);
        }
    },

    _generateGraphs = function(attachEls) {
        for (var name in _records) {
            // Exit early if no graph
            if (_records[name].graph !== true)
                continue;

            if (_records[name].measurement) {
                var measurement = _records[name].measurement;
            } else {
                var measurement = '';
            }

            // Container
            var el = _genEl('div', {
                className: 'graph',
                innerHTML: '<h3 style="color: ' + _records[name].color + '" class="graph-title">' + _records[name].title + ' <span id="value-' + name + '">0</span> <span class="graph-range">(<span id="min-' + name + '">0</span> - <span id="max-' + name + '">0</span>)</span> <small>' + measurement + '</small></h3><div id="graph-' + name + '" class="graph-data"></div>'
            });

            attachEls.appendChild(el);

            // Save DOM data for easy access later
            _records[name].domGraph = {
                value: document.getElementById('value-' + name),
                min: document.getElementById('min-' + name),
                max: document.getElementById('max-' + name),
                graph: document.getElementById('graph-' + name)
            };
        }
    };

    cp.debug = {
        active: false,
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
                // Millisecond starting value for Date.now()
                this.base = Date.now();
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
            // Loop through all records and store their results with a tag
            for (var name in _records) {
                // Process time information if necessary
                if (typeof _records[name].total === 'number') {
                    var time = _records[name].total;

                    _records[name].result = time;

                    // Clear total from records
                    _records[name].total = 0;
                }

                // Output other data
                if (name === 'total') {
                    var otherTotal = _records['total'].result - _records['draw'].result + _records['update'].result + _records['collisions'].result;
                    _records['other'].dom.innerHTML = otherTotal;
                }

                // Inject value
                _records[name].dom.innerHTML = _records[name].result;

                // Append graph data if present
                // TODO: Delete overflowing graph items
                if (_records[name].domGraph !== undefined) {
                    // Set total value
                    _records[name].domGraph.value.innerHTML = _records[name].result;

                    // Set max
                    if (_records[name].result > _records[name].max) {
                        _records[name].max = _records[name].domGraph.max.innerHTML = _records[name].result;
                    }

                    // Set min
                    if (_records[name].result < _records[name].min) {
                        _records[name].min = _records[name].domGraph.min.innerHTML = _records[name].result;
                    }

                    // Delete excess graph data
                    if (_records[name].domGraph.graph.childNodes.length >= 75) {
                        _records[name].domGraph.graph.removeChild(_records[name].domGraph.graph.firstChild);
                    }

                    // Append data to graph
                    var graphLine = _genEl('span', {
                        className: 'graph-line'
                    });
                    graphLine.style.backgroundColor = _records[name].color;

                    var height = Math.round(_records[name].result / 2);
                    graphLine.style.height = height + 'px';
                    graphLine.style.marginTop = 50 - height + 'px';

                    _records[name].domGraph.graph.appendChild(graphLine);
                }
            }
        }
    };
}(cp));