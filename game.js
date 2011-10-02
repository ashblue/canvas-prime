/*------------
 Running The Game 
------------*/
// You can overwrite any of the core in start() and init here before firing onload
window.onload = function() { var Game = new Core({ width:300, height:500 }); }


/*------------
 Entity Objects
------------*/
// example
var Background = new Entity({x:20, y:100});
Background.draw = function() {
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x,this.y,canvas.width,canvas.height);
};


/*------------
 Entity Spawning
------------*/
Background.spawn();