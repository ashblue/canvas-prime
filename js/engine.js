/*
 --- Info ---
Name: Canvas Prime
Version: Alpha 0.21
Repository: https://github.com/ashblue/canvas-prime


--- Credits ---
Author: Ashton Blue
URL: http://blueashes.com
Twitter: http://twitter.com/#!/ashbluewd


--- To-Do ---
- Asset loading screen
-- Loads all images, sound files, and other junk with a pretty loading bar

- Timer creation / handeling

- In addition to collisions, checks needs to be integrated

- Add image handler
-- Image loader w/ imageQ
-- Flip function for object images
-- Image animation handler

- Controller support
-- Keyboard keys
-- Mouse position
-- Mouse click and move

- Sound support

- random doesn't work for some odd reason in entity objects at specific times (such as collisions)

- Include compiler that compresses and consolidates all JavaScript

- Create a debugging mode

- Creation of tower defendse level editor plugin
*/


/*---------
 Core game logic
---------*/
var Graveyard = []; // Kept global for easier dumping of dead objects for removal
var Engine = Class.extend({
    /* ----- Default Values -----*/
    canvas: document.getElementById("canvas"),
    width: 500,
    height: 500,
    
    id: 0,
    storage: new Array(),
    typeA: new Array(), // Friendly storage
    typeB: new Array(), // Enemy storage
    
    /* ----- Utilities -----*/
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
    storageGet: function(name, array) {
        // Loop through all objects and retrieve them by var:name
        // If array = true
            // Return an array
            // Return a single object
        
        //for (var i in storage) {
        //    storage[i].draw();
        //}
    },
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
        
        // Clean out killed items
        if (Graveyard) {
            for (var obj in Graveyard) {
                this.kill(Graveyard[obj]);
            }
            Graveyard = [];
        }
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