var SquareEvil = Square.extend({
    type: 'b',
    collide: function(object) {
        // Calls parent function
        this._super();
        
        this.color = '#007';
    }
});