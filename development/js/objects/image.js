/*
 *A quick demo of working with animation sheets and what you can do
*/

cp.template.Image = cp.template.Entity.extend({
    width: 10,
    height: 10,
    x: 150,
    y: 150,
    
    init: function() {
        // Create and set an animation sheet (image, frame width, frame height)
        var animSheet = new cp.animate.sheet('100.jpg', 400, 100);
        
        // Not used, but multiple animations can be created like this
        this.animStand = new cp.animate.cycle(animSheet, 1, [0]);
        
        // Set the current animation, can also be changed in the update
        this.animSet = this.animStand;
    }
});