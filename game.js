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
    var Background = Entity.extend({
        xAdd: 5,
        yAdd: 5,
        width: 20,
        height: 20,
        update: function() {
            if (this.x + this.width > Game.width) { this.x = Game.width - this.width; this.xAdd = this.xAdd * -1; }
            else if (this.x < 0) { this.x = 0; this.xAdd = this.xAdd * -1; }
            if (this.y + this.height > Game.height) { this.y = Game.height - this.height; this.yAdd = Game.random(5) * -1; }
            else if (this.y < 0) { this.y = 0; this.yAdd = this.yAdd * -1; }
            
            this.x += this.xAdd;
            this.y += this.yAdd;
        },
        draw: function() {
            Game.ctx.fillStyle = '#000';
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    });
        
        
    /*------------
    Entity Spawning
    ------------*/
    Game.spawnEntity(Background, 200, 50);
    Game.spawnEntity(Background, 20, 20);
}