/*
Name: Animation Sheets and Controls
Version: 1
Desc: Allows users to create new animation sheets and control them.

Notes: To pre-load images, the script relies on the init

To-Do: Add logic for objects loading with cp.imgCount and cp.imgLoaded
*/

var cp = cp || {};

cp.debug = {
    fpsTimeLast: new Date(),
        // Frome http://glacialflame.com/2010/07/measuring-fps-with-canvas/
    fpsStart: function() {
        this.fpsTime = new Date();
        this.fpsDif = Math.ceil((this.fpsTime.getTime() - this.fpsTimeLast.getTime()));
        
        if (this.fpsDif >= 1000) {
            this.fps = this.fpsCount;
            this.fpsCount = 0.0;
            this.fpsTimeLast = this.fpsTime;
        }
    },
    fpsEnd: function() {
        this.fpsCount++;
    }
};