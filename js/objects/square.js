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