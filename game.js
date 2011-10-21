/*------------
 Running The Game 
------------*/
// You can overwrite any of the core in start() and init here before firing onload
window.onload = function() { var Game = new Core({ width:300, height:300 }); }

/*------------
 Entity Objects
------------*/
// example
var Background = Entity.extend({
        x: 0,
        y: 0,
        xAdd: 5,
        yAdd: 5,
        width: 20,
        height: 20,
        update: function() {
                if (this.x + this.width > canvas.width) { this.x = canvas.width - this.width; this.xAdd = this.xAdd * -1; }
                else if (this.x < 0) { this.x = 0; this.xAdd = this.xAdd * -1; }
                if (this.y + this.height > canvas.height) { this.y = canvas.height - this.height; this.yAdd = random(5) * -1; }
                else if (this.y < 0) { this.y = 0; this.yAdd = this.yAdd * -1; }
                
                this.x += this.xAdd;
                this.y += this.yAdd;
        },
        draw: function() {
                ctx.fillStyle = '#000';
                ctx.fillRect(this.x,this.y,this.width,this.height);
        }
});

//var Background = new Entity({x:20, y:100});
//Background.draw = function() {
//        ctx.fillStyle = '#000';
//        ctx.fillRect(this.x,this.y,canvas.width,canvas.height);
//};


/*------------
 Entity Spawning
------------*/
spawnEntity(Background, 200, 50);
spawnEntity(Background, 20, 20);

//var id1 = new Background();
//var id2 = new Background();
//id1.spawn();
//id2.spawn();