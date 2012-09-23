Development Version
=============

Important: Currently the development version is in pre-alpha and is only stable on Google Chrome.

## Requirements

* NodeJS 8.0+
* Modern web browser (only runs on Chrome for now)

## Quick-Start Instructions

* Create the files you want to load and place them in js/objects
* Configure js/setup.js with your run logic and files to load
* From the root run "node server.js"


## Baking

When your game is ready you might not want to run it on a NodeJS server. Or you may just want to serve a static copy of the game, either way you can easily compile and compress your code by running the following command in your game's root directory.

    node compiler/controller.js build

You will find your baked files in a folder relative to the root called "build"