window.onload = function() {
    /*------------
    Running The Game 
    -----------*/
    // You can tweak your engine through the init hook and add your own custom utilities here
    var MyEngine = Engine.extend({
        width: 400,
        height: 400
    });
      
    // Create and activate your personal engine
    var Game = new MyEngine();
    Game.setup();
        
    // Animation must be kept seperate due to a DOM error caused by self-reference in your objects
    function animate() {
        requestAnimFrame( animate );
        Game.draw();
    }
    animate();
    

    /*------------
     Entity Objects
    ------------*/
    // example
    var Square = Entity.extend({
        type: 'a',
        xAdd: 5,
        yAdd: 5,
        width: 50,
        height: 40,
        color: '#000',
        update: function() {
            if (this.x + this.width > Game.width) { this.x = Game.width - this.width; this.xAdd = this.xAdd * -1; }
            else if (this.x < 0) { this.x = 0; this.xAdd = this.xAdd * -1; }
            if (this.y + this.height > Game.height) { this.y = Game.height - this.height; this.yAdd = Game.random(5) * -1; }
            else if (this.y < 0) { this.y = 0; this.yAdd = this.yAdd * -1; }
            
            this.x += this.xAdd;
            this.y += this.yAdd;
        },
        collide: function(object) {
            this.xAdd = this.xAdd * -1;
            this.yAdd = this.yAdd * -1;
        },
        draw: function() {
            Game.ctx.fillStyle = this.color;
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    });
    var SquareEvil = Square.extend({
        type: 'b',
        collide: function(object) {
            // Calls parent function
            this._super();
            
            this.color = '#007';
        }
    });
    
    // keyboard input testing
    var KeyTest = Entity.extend({
        update: function() {
            //console.log('Key push:' + ' ' + Input.key.push);
            //if (Input.key.push == Key.input.space) {
            //    console.log('test');
            //}
            //console.log(Input.key.push);
            if (Key.push('space')) {
                console.log('did it');
            }
            
            //console.log('Key held:' + ' ' + Input.key.down);
        }
    });
        
        
    /*------------
    Entity Spawning
    ------------*/
    Game.spawnEntity(Square, 200, 50);
    Game.spawnEntity(SquareEvil, 100, 100);
    Game.spawnEntity(SquareEvil, 150, 75);
    Game.spawnEntity(KeyTest, 0, 0);
}