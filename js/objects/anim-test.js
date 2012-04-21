var animTest = Entity.extend({
    width: 129,
    height: 68,
    animCur: {
        id: -1
    },
    animSet: {
        id: -1
    },
    x: -129,
    
    init: function() {
        // Create and set an animation sheet
        var animSheet = new AnimSheet('character.png', 129, 68);
        var animRun = new Anim(animSheet, 1000, [0, 1, 2], true);
        this.animSet = animRun;
    },
    
    update: function() {
        this.animNew();

        
        
    },
    
    // check if set animation has changed
    animNew: function() {
        if (this.animSet.id != this.animCur.id) {
            // clear any running intervals to be sure
            clearInterval(this.animCur.animRun);
            
            // Start new interval
            this.animSet.run();
            this.animCur = this.animSet;
        }        
    },
    
    interval: function() {
        var self = this;
        return requestInterval(function() {self.animSet.cycle();}, self.animSet.speed);
    },
    
    draw: function() {
        // dump image x and y data
        var img = this.animSet.get();
        
        // Draw the image
        console.log(img);
        Game.ctx.drawImage(
            this.animSet.sheet.img, // img
            img.x, // crop x location
            img.y, // crop y location
             // width of crop window
             // height of crop window
        );
    }
});