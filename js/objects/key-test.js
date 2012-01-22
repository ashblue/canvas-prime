var KeyTest = Entity.extend({
    update: function() {
        //console.log('Key push:' + ' ' + Input.key.push);
        //if (Input.key.push == Key.input.space) {
        //    console.log('test');
        //}
        //console.log(Input.key.push);
        if (Key.push('space')) {
            console.log('did it');
        }
        
        //console.log('Key held:' + ' ' + Input.key.down);
    }
});