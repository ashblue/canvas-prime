/*
 --- Info ---
Name: Canvas Prime
Version: Alpha 0.21
Repository: https://github.com/ashblue/canvas-prime

--- Credits ---
Author: Ashton Blue
URL: http://blueashes.com
Twitter: http://twitter.com/#!/ashbluewd
*/


/*---------
 Core game logic
---------*/
var Key = new Keyboard(); // Actives keyboard object usage
var Graveyard = []; // Kept global for easier dumping of dead objects for removal. Needs to be part of the engine at some point.
var Engine = Class.extend({
    /* ----- Default Values -----*/
    canvas: document.getElementById("canvas"),
    width: 500,
    height: 500,
    
    id: 0,
    storage: new Array(),
    typeA: new Array(), // Friendly storage
    typeB: new Array(), // Enemy storage
    
    fpsTimeLast: new Date(),
    
    /* ----- Loading -----*/
    load: true,
    loadCur: 0,
    loadInit: function() {
        this.loadCount = this.objects.length;
    },
    loadLogic: function() {
        if (this.loadCur === this.loadCount) this.load = false;
        console.log(this.loadCur + ' ' + this.loadCount);
    },
    loadDraw: function() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    objects: new Array(), // Engine should contain array item file names for loading
    objectsUrl: 'js/objects/',
    objectsLoader: function(array) {
        // For each object it sets the path, then calls the inject
        for (var key in array) {
            var url = String(this.objectsUrl + array[key] + '.js');
            this.objectsInject(url, this.objectsCallback(this.loadCur));
        }
    },
    // http://stackoverflow.com/questions/310583/loading-javascript-dependencies-on-demand
    // Would be nice if this pumped out a custom error message on fail so users knew how to fix it    
    objectsInject: function(scriptPath, callback) {
        var scriptNode = document.createElement('SCRIPT');
        scriptNode.type = 'text/javascript';
        scriptNode.src = scriptPath;
    
        var headNode = document.getElementsByTagName('HEAD');
        if (headNode[0] != null)
            headNode[0].appendChild(scriptNode);
    
        if (callback != null)    
        {
            scriptNode.onreadystagechange = callback;            
            scriptNode.onload = callback;
        }
        this.loadCur++;
    },
    objectsCallback: function(stepUp) {

    },
    
    /* ----- Utilities -----*/
    // Frome http://glacialflame.com/2010/07/measuring-fps-with-canvas/
    fpsStart: function() {
        this.fpsTime = new Date();
        this.fpsDif = Math.ceil((this.fpsTime.getTime() - this.fpsTimeLast.getTime()));
        
        if (this.fpsDif >= 1000) {
            this.fps = this.fpsCount;
            this.fpsCount = 0.0;
            this.fpsTimeLast = this.fpsTime;
        }
    },
    fpsEnd: function() {
        this.fpsCount++;
    },
    // Try changing window to eval() to attach a variable to it
    spawnEntity: function(name, x, y) {
        // window[] allows you to process its contents and treat it as a variable
        // eval() will process its contents before the variable can grab it
        window['id' + this.id] = eval(new name);
        this.storage.push(window['id' + this.id].spawn(x, y)); // Pushes your new variable into an array and runs its spawn function
        window['id' + this.id].id = this.id;
        
        // Push into type storage for quicker collision detection
        switch (window['id' + this.id].type) {
            case 'a':
                this.typeA.push(window['id' + this.id]);
                break;
            case 'b':
                this.typeB.push(window['id' + this.id]);
                break;
            default:
                break;
        }
        
        this.id += 1; // Increment the id so the next shape is a unique variable
    },
    // Returns objects from the storage array for manipulation
    storageGet: function(name, array) {
        // Loop through all objects and retrieve them by var:name
        // If array = true
            // Return an array
            // Return a single object
        
        //for (var i in storage) {
        //    storage[i].draw();
        //}
    },
    // Random should only be run in the init for best practice
    random: function(max, min) {
        if (!min) min = 1;
        return Math.floor(Math.random() * (max - min) + min);
    },
    randomPosNeg: function() {
        return Math.random() < 0.5 ? -1 : 1;
    },
    overlap: function(x1,y1,width1,height1,x2,y2,width2,height2) {
        // Test if they overlap
        if ( x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + width2 && y1 + height1 > y2 )
            return true;
        else
            return false;
    },
    kill: function(object) {
        // Run extra kill logic for object
        object.kill();
        
        // Remove from type storage
        switch (object.type) {
            case 'a':
                for (var i in this.typeA) {
                    if(this.typeA[i] == object)
                        this.typeA.splice(i,1);
                }
                break;
            case 'b':
                for (var i in this.typeB) {
                    if(this.typeB[i] == object)
                        this.typeB.splice(i,1);
                }
                break;
            default:
                break;
        }
        
        // Remove from main storage
        for (var i in this.storage) {
            if(this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
        // Clean out of browser's memory permanently
        delete window['id' + object.id];
    },
    
    /* ----- Engine Setup -----*/
    setup: function() {
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.screen();
            Key.setup();
            
            // Loading stuff
            this.loadInit();
            this.objectsLoader(this.objects);
            
            this.init();
        }
        else {
            this.setupFail();
        }
    },
    setupFail: function() {
        // Place your response/logic here for users that can't load Canvas
        alert('Canvas has failed to load in your browser. Please download/run Google Chrome, then re-visit this URL.');
    },
    screen: function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    init: function() {
        // Place your additional setup logic here
    },
    
    /* ----- Animation control -----*/
    draw: function() {
        this.fpsStart();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // When loading objects run the loading screen, else run the game
        // WARNING: While the loader is setup correctly for animation, JS is loaded too fast to tell if the loader
        // screen is actually working. Really not testable until images are also loaded in.
        // PRODUCTION: Remove load to its own draw in the future for performance increase
        if (this.load) {
            this.loadLogic();
            this.loadDraw();
        }
        else {
            // Loop through every object in storage
            for (var i in this.storage) {
                
                this.storage[i].update(); // Run update functions before drawing anything to prevent screen pops for recently spawned items
                this.storage[i].draw(); // Keeping this before collision test prevents crash on Game.kill(object)
                
                if (this.storage[i].type === 'a') {
                    for (var j in this.typeB) {
                        if (this.overlap(this.storage[i].x, this.storage[i].y, this.storage[i].width, this.storage[i].height, this.typeB[j].x, this.typeB[j].y, this.typeB[j].width, this.typeB[j].height)) {
                            this.storage[i].collide(this.typeB[j]);
                            this.typeB[j].collide(this.storage[i]);
                        }
                    }
                }
            }
            
            // Clear keyboard input
            Key.monitor();
            
            // Clean out killed items
            if (Graveyard) {
                for (var obj in Graveyard) {
                    this.kill(Graveyard[obj]);
                }
                Graveyard = [];
            }
            
            
        }
        this.fpsEnd();
    }
});


/*-----------
 Entity Pallete
-----------*/
var Entity = Class.extend({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // Collision detection type
    // friendly = a, enemy = b, passive = 0 (yes, its a zero and not the letter o)
    type: 0,
    hp: 1,
    
    init: function() {
        // place extra setup code initiated before spawning here
    },
    update: function() {
        // place code before each draw sequence here
    },
    collide: function(object) {
        // What happens when elements collide?
    },
    draw: function() {
        // Logic for drawing the object
    },
    spawn: function(x,y) {
        if (x) this.x = x;
        if (y) this.y = y; 
        this.init();
        return this;
    },
    kill: function() {
        Graveyard.push(this);
    }
});