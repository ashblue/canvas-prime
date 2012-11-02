cp.template.Square = cp.template.Entity.extend({
    type: 'a',
    xAdd: 5,
    yAdd: 5,
    width: 50,
    height: 40,
    color: '#000',
    update: function() {
        if (this.x + this.width > cp.core.width) { this.x = cp.core.width - this.width; this.xAdd = this.xAdd * -1; }
        else if (this.x < 0) { this.x = 0; this.xAdd = this.xAdd * -1; }
        if (this.y + this.height > cp.core.height) { this.y = cp.core.height - this.height; this.yAdd = cp.math.random(5) * -1; }
        else if (this.y < 0) { this.y = 0; this.yAdd = this.yAdd * -1; }
        
        this.x += this.xAdd;
        this.y += this.yAdd;
    },
    collide: function(object) {
        this.xAdd = this.xAdd * -1;
        this.yAdd = this.yAdd * -1;
    },
    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x,this.y,this.width,this.height);
    }
});