/*
Name: Core functions for the engine
Version: 1
Desc: Contains basic information for the engine such as initialization, loops
*/

var cp = cp || {};

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
    
    overlap: function(x1,y1,width1,height1,x2,y2,width2,height2) {
        // Test if they overlap
        if ( x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + width2 && y1 + height1 > y2 )
            return true;
        else
            return false;
    },
    
    /* ----- Engine Setup -----*/
    setup: function() {
        if (this.canvas.getContext) {
            cp.ctx = this.canvas.getContext('2d');
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
        // Note: Remove load to its own draw in the future for performance increase
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
            if (cp.game.graveyard) {
                for (var obj in cp.game.graveyard) {
                    this.kill(cp.game.graveyard[obj]);
                }
                cp.game.graveyard = [];
            }
            
            
        }
        this.fpsEnd();
    }
});