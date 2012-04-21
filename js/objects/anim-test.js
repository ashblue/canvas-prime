var animTest = Entity.extend({
    width: 129,
    height: 68,
    
    // Must be a negative 1 to be detected easily, decreases logic
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
        var animRun = new Anim(animSheet, 100, [1, 2, 1, 2, 1, 2], {
            repeat: true
        });
        this.animSet = animRun;
    },
    
    update: function() {
        this.animNew();

        this.x += 5;
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
        this.imgCrop();
    },
    
    // Shrinks and fixes up an animation sheet then draws it
    imgCrop: function() {
        if (this.animCur.id != -1) {
            // dump image x and y data fur current frame
            var img = this.animSet.get();
            
            // Draw the image
            Game.ctx.drawImage(
                this.animSet.sheet.img, // img
                img.x, // crop x location
                img.y, // crop y location
                this.animSet.sheet.animWidth, // width of crop window
                this.animSet.sheet.animHeight, // height of crop window
                this.x, // canvas x location
                this.y,// canvas y location
                this.width, // canvas width
                this.height // canvas height
            );
        }
    }
});