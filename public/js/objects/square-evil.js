cp.template.SquareEvil = cp.template.Square.extend({
    type: 'b',
    collide: function(object) {        
        // Calls parent function and pass along variable to replace the previous
        this._super(object);
        
        
        this.color = '#007';
    }
});