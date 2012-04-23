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
    
    /* ----- Entity -----*/
    // You may get all entities of a type, or filter them by a specific value
    entityGetVal: function(name,val) {
        // Setup stack for storage
        var stack = new Array;
        
        // Loop through objects and get matched value
        if (typeof val != 'undefined') { // Incase no val was passed
            for (var j in this.storage) {
                if (this.storage[j][(name)] == val) stack.push(this.storage[j]);
            }
        }
        else {
            for (var j in this.storage) {
                if (this.storage[j][(name)]) stack.push(this.storage[j]);
            }
        }
        
        // Return value or false
        if (stack.length > 0) {
            return stack;
        }
        else {
            return false;
        }
    },
    
    /* ----- Loading -----*/
    load: true,
    loadCount: 0,
    loadTotal: 0,
    // Logic for drawing and displaying loading screen
    loadUpdate: function() {
        // Create loading numbers string
        this.loadStatus = this.loadCount + ' / ' + this.loadTotal;
        this.loadPer = (this.loadCount / this.loadTotal).toFixed(2);
        
        // Create loading bar information
        this.ctx.font = 'italic 400 12px/2 Unknown Font, sans-serif';
        
        // Count loaded objects
        if (this.imgResp && // double check images have arrived
        this.loadCount == this.loadTotal) { 
            this.load = false;
        }
    },
    loadDraw: function() {
        // Background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);        
        
        // Loading text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.width / 2, this.height / 2 - 50);
        
        // Asset count text
        this.ctx.font = '20px arial';
        this.ctx.fillText(this.loadStatus, this.width / 2, this.height / 2 + 50);
        
        // Start loading bar background
        this.ctx.fillStyle = '#fff';
        var barOff = 100;
        var barX = barOff / 2;
        var barY = this.height / 2 - 20;
        var barWidth = this.width - barOff;
        var barHeight = 40;
        this.ctx.fillRect(barX, barY, barWidth, barHeight);        
        
        // Loading bar front
        this.ctx.fillStyle = '#00aaff';
        barOff = 5;
        barX = barX + barOff;
        barY = barY + barOff;
        barWidth = (barWidth - (barOff * 2)) * this.loadPer;
        barHeight = barHeight - (barOff * 2);
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
    },
    // Setup objects
    objects: new Array(), // Engine should contain array item file names for loading
    objectsUrl: 'js/objects/',
    objectsCount: 0,
    loadAssets: function() {
        // Load images
        this.loadImgs();
        
        // Set number of images
        this.loadCount += this.objects.length;
        
        // Setup script
        var scriptJS = document.createElement('script');
        scriptJS.type = 'text/javascript';
        scriptJS.src = this.objectsUrl + this.objects[this.objectsCount] + '.js';

        scriptJS.onload = this.loadAssetsNext;

        // Begin insertion
        var headerJS = document.getElementsByTagName('HEAD');
        headerJS[0].appendChild(scriptJS);
    },
    loadAssetsNext: function() {
        // Increment object counter
        Game.objectsCount++;
        Game.loadTotal++;
        // Test to see if you should call another item
        // If else fires all objects have been loaded, therefore create run.js
        if ((Game.objectsCount) < Game.objects.length) {
            // Setup script
            var scriptJS = document.createElement('script');
            scriptJS.type = 'text/javascript';
            scriptJS.src = Game.objectsUrl + Game.objects[Game.objectsCount] + '.js';
            
            // Declare callback to fire after script has fully loaded
            scriptJS.onload = Game.loadAssetsNext;
        
            // Begin insertion
            var headerJS = document.getElementsByTagName('HEAD');
            headerJS[0].appendChild(scriptJS);
        }
        else {
            // Setup script
            var scriptJSRun = document.createElement('script');
            scriptJSRun.type = 'text/javascript';
            scriptJSRun.src = 'js/run.js';

            // Begin insertion
            var headerJS = document.getElementsByTagName('HEAD');
            headerJS[0].appendChild(scriptJSRun);
            
            // Clear out the loading screen
            //Game.loadImgs();
            //Game.load = false;
        }
        
        
    },
    
    loadXmlHttp: new XMLHttpRequest(),
    pathImg: 'images/',
    imgResp: false,
    loadImgs: function() {
        var self = this;
        
        // Prep XML HTTP request
        this.loadXmlHttp.open('GET', 'images.php',true);
        this.loadXmlHttp.send();
        
        // When request is complete
        this.loadXmlHttp.onreadystatechange = function() {
            if (self.loadXmlHttp.readyState==4 && self.loadXmlHttp.status==200) {
                // Prep data
                var images = JSON.parse(self.loadXmlHttp.responseText);        
                
                // Increment number of game items
                self.loadCount += images.length;
                
                // Tell the sytem that images have given a response
                self.imgResp = true;
                
                // Loop through all items
                // http://www.mennovanslooten.nl/blog/post/62
                for (var i = 0; i < images.length; i++ ) {
                    var img = new Image();
                    var imgName = images[i];
                    img.src = self.pathImg + images[i];
                    
                    img.onload = (function(val) {
                        // returning a function forces the load into another scope
                        return function() {
                            Game.loadTotal++;
                        }
                    })(i);
                }
            }
        }
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
        window['id' + this.id] = (new name);
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
        
        // Remove from main storage
        for (var i in this.storage) {
            if (this.storage[i] == object)
                this.storage.splice(i,1);
        }
        
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
            
            this.animate(this);
            
            // Load everyting necessary
            this.loadAssets();
            
            // Run any extra logic added by user
            this.extraInit();
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
    extraInit: function() {
        // Place your additional setup logic here
    },
    animate: function() {
        requestAnimFrame( Game.animate );
        Game.draw();
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
            this.loadUpdate();
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
// Note: this can be moved into the class extension script by slightly modifying it
var Entity = Class.extend({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // Collision detection type
    // friendly = a, enemy = b, passive = 0 (yes, its a zero and not the letter o)
    type: 0,
    hp: 1,
    
    // placeholders to detect animation id change
    // Must be a -1 to be detected easily, decreases logic because there are no -1 ids ever
    animCur: {
        id: -1
    },
    animSet: {
        id: -1
    },

    update: function() {
        this.animNew();
        
        // place code before each draw sequence here
    },
    collide: function(object) {
        // What happens when elements collide?
    },
    draw: function() {
        // If an animation sheet has been set, it will fired here
        if (this.animCur.id != -1) {
            this.animSet.crop(this.x, this.y, this.width, this.height);
        }
    },
    spawn: function(x,y) {
        if (x) this.x = x;
        if (y) this.y = y;

        return this;
    },
    kill: function() {
        Graveyard.push(this);
    },
    
    // check if set animation has changed
    animNew: function() {
        if (this.animSet.id != this.animCur.id) {
            // clear any running intervals to be sure they don't also fire
            this.animCur.active = false;
            clearInterval(this.animCur.animRun);
            
            // Set animation to active
            this.animSet.active = true;
            
            // Start new interval
            this.animSet.run();
            this.animCur = this.animSet;
        }        
    },
    
    // Moves an item in storage, normally used to force an item to draw on top of others
    // Might be better to give each object a z-index and take that into account when re-ordering via order
    order: function(loc) {        
        // Get index of this
        var index = Game.storage.indexOf(this);
        
        // Delete old location
        Game.storage.splice(index, 1);
        
        // Flip the placement for injection by reversing the array placement
        inject = Game.storage.length - loc;
        
        // Inject new location
        Game.storage.splice(inject, 0, this);
    }
});