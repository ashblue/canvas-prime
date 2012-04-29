/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with cp.imgCount and cp.imgLoaded
*/

var cp = cp || {};

cp.load = {
    load: true,
    loadCount: 0,
    loadTotal: 0,
    // Logic for drawing and displaying loading screen
    loadUpdate: function() {
        // Create loading numbers string
        this.loadStatus = this.loadCount + ' / ' + this.loadTotal;
        this.loadPer = (this.loadCount / this.loadTotal).toFixed(2);
        
        // Create loading bar information
        this.ctx.font = 'italic 400 12px/2 Unknown Font, sans-serif';
        
        // Count loaded objects
        if (this.imgResp && // double check images have arrived
        this.loadCount == this.loadTotal) { 
            this.load = false;
        }
    },
    loadDraw: function() {
        // Background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);        
        
        // Loading text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.width / 2, this.height / 2 - 50);
        
        // Asset count text
        this.ctx.font = '20px arial';
        this.ctx.fillText(this.loadStatus, this.width / 2, this.height / 2 + 50);
        
        // Start loading bar background
        this.ctx.fillStyle = '#fff';
        var barOff = 100;
        var barX = barOff / 2;
        var barY = this.height / 2 - 20;
        var barWidth = this.width - barOff;
        var barHeight = 40;
        this.ctx.fillRect(barX, barY, barWidth, barHeight);        
        
        // Loading bar front
        this.ctx.fillStyle = '#00aaff';
        barOff = 5;
        barX = barX + barOff;
        barY = barY + barOff;
        barWidth = (barWidth - (barOff * 2)) * this.loadPer;
        barHeight = barHeight - (barOff * 2);
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
    },
    // Setup objects
    objects: new Array(), // Engine should contain array item file names for loading
    objectsUrl: 'js/objects/',
    objectsCount: 0,
    loadAssets: function() {
        // Load images
        this.loadImgs();
        
        // Set number of images
        this.loadCount += this.objects.length;
        
        // Setup script
        var scriptJS = document.createElement('script');
        scriptJS.type = 'text/javascript';
        scriptJS.src = this.objectsUrl + this.objects[this.objectsCount] + '.js';

        scriptJS.onload = this.loadAssetsNext;

        // Begin insertion
        var headerJS = document.getElementsByTagName('HEAD');
        headerJS[0].appendChild(scriptJS);
    },
    loadAssetsNext: function() {
        // Increment object counter
        Game.objectsCount++;
        Game.loadTotal++;
        // Test to see if you should call another item
        // If else fires all objects have been loaded, therefore create run.js
        if ((Game.objectsCount) < Game.objects.length) {
            // Setup script
            var scriptJS = document.createElement('script');
            scriptJS.type = 'text/javascript';
            scriptJS.src = Game.objectsUrl + Game.objects[Game.objectsCount] + '.js';
            
            // Declare callback to fire after script has fully loaded
            scriptJS.onload = Game.loadAssetsNext;
        
            // Begin insertion
            var headerJS = document.getElementsByTagName('HEAD');
            headerJS[0].appendChild(scriptJS);
        }
        else {
            // Setup script
            var scriptJSRun = document.createElement('script');
            scriptJSRun.type = 'text/javascript';
            scriptJSRun.src = 'js/run.js';

            // Begin insertion
            var headerJS = document.getElementsByTagName('HEAD');
            headerJS[0].appendChild(scriptJSRun);
            
            // Clear out the loading screen
            //Game.loadImgs();
            //Game.load = false;
        }
        
        
    },
    
    loadXmlHttp: new XMLHttpRequest(),
    pathImg: 'images/',
    imgResp: false,
    loadImgs: function() {
        var self = this;
        
        // Prep XML HTTP request
        this.loadXmlHttp.open('GET', 'images.php',true);
        this.loadXmlHttp.send();
        
        // When request is complete
        this.loadXmlHttp.onreadystatechange = function() {
            if (self.loadXmlHttp.readyState==4 && self.loadXmlHttp.status==200) {
                // Prep data
                var images = JSON.parse(self.loadXmlHttp.responseText);        
                
                // Increment number of game items
                self.loadCount += images.length;
                
                // Tell the sytem that images have given a response
                self.imgResp = true;
                
                // Loop through all items
                // http://www.mennovanslooten.nl/blog/post/62
                for (var i = 0; i < images.length; i++ ) {
                    var img = new Image();
                    var imgName = images[i];
                    img.src = self.pathImg + images[i];
                    
                    img.onload = (function(val) {
                        // returning a function forces the load into another scope
                        return function() {
                            Game.loadTotal++;
                        }
                    })(i);
                }
            }
        }
    }
};