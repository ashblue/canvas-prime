<?php
/*
Name: Compresses JavaScript and compiles the rest of the apps components
Version: 1
Desc: Assembles and strips unecessary content to output a packaged version of the current site build.

TODO: Only works with the existing structure, should also compile and
compress additional files / folders.
*/

// Retrive all functions
include 'functions.php';

// Load in the JSMin+ library to compress JavaScript files when they're ready
// TODO: Replace with uglify shell script
include 'lib/jsminplus.php';

class Compile_Game {
    // Safe line breaks for JS files
    $LINE_BREAKS = "\n\n";

    // Start of content removal in an HTML file
    $HTML_REMOVE_START = '<!-- COMPILER_REPLACE -->';

    // End of content removal in an HTML file
    $HTML_REMOVE_END = '<!-- END_COMPILER_REPLACE -->';

    function __construct() {
        // Assemble all of the dependencies, engine, and object files

        // Patch the assembled engine's loader script for XMLHTTP info

        // Send over all the JavaScript file strings to be combined and compressed

        // Fix the index.php so its index.html and only refs 1 js file

        // Create the zip file by cloning the proper directory, deleting
        // all PHP, old JS, and replacing the index.php file
    }

    function _assemble_files($dir, $ext, $remove_string) {

    }

    function _combine_files($file_strings) {

    }

    function _patch_XMLHTTP() {

    }

    function _compress_js($js_code) {

    }

    function _setup_index() {

    }

    function _create_zip() {

    }
};

// Get all of the major JavaScript file chunks
$object_files = get_files('../js/objects', '.js');
$setup_file = get_files('../js', '.js');

// Safe line breaks for JS files
$line_break = "\n\n";

// Assemble dependences
$compiled_depen = '';
$depen_files = get_files('../js/depen', '.js');
foreach ($depen_files as $file):
    // Get the file contents
    $content = file_get_contents('../js/depen/' . $file, true);

    // Append content to body
    $compiled_depen .= $content . $line_break;
endforeach;

// Assemble the engine file
$compiled_engine = '';
$engine_files = get_files('../js/engine', '.js');
foreach ($engine_files as $file):
    // Get the file contents
    $content = file_get_contents('../js/engine/' . $file, true);

    // Remove "var cp = cp || {};" from the start of every file except the first
    if ($compiled_engine !== ''):
        $content = str_replace('var cp = cp || {};', '', $content);
    endif;

    // Append content to body
    $compiled_engine .= $content . $line_break;
endforeach;

// Get the files necessary to patch the loader for no XMLHTTP requests with compatible JS data
$image_files = json_encode(get_files('../images', array('.png', '.jpg', '.gif')));
$sound_files = str_replace('.ogg', '', json_encode(get_files('../audio', '.ogg')));

// Replace necessary lines in the existing content
$compiled_engine = str_replace('_COMPILER_LOADING = null', '_COMPILER_LOADING = true', $compiled_engine); // Make the loader shut of XMLHTTP requests
$compiled_engine = str_replace('_COMPILER_IMG = null', '_COMPILER_IMG = ' . $image_files, $compiled_engine); // Declare images to load
$compiled_engine = str_replace('_COMPILER_AUDIO = null', '_COMPILER_AUDIO = ' . $sound_files, $compiled_engine); // Declare sound to load

// Add the objects folder files
$compiled_objects = '';
$depen_files = get_files('../js/objects', '.js');
foreach ($depen_files as $file):
    // Get the file contents
    $content = file_get_contents('../js/objects/' . $file, true);

    // Append content to body
    $compiled_objects .= $content . $line_break;
endforeach;

// Get the setup file
$setup_file = file_get_contents('../js/setup.js', true);

// Assemble all of the prepared JavaScript files into one file called game.js
$compiled_js = $compiled_depen . $line_break . $compiled_engine . $line_break . $compiled_objects . $line_break . $setup_file;

// Run JSMinPlus compiled JavaScript
$miny_js = JSMinPlus::minify($compiled_js, 'game.js');

// Hijack index.php contents and turn it into an HTML file with the proper references for new files
$html_file = file_get_contents('../index.php', true);
$js_ref = '<script type="text/javascript" src="js/game.js"></script>';
$remove_start = strpos($html_file, '<!-- COMPILER_REPLACE -->');
$remove_end = strpos($html_file, '<!-- END_COMPILER_REPLACE -->') + strlen('<!-- END_COMPILER_REPLACE -->');
$html_file = substr_replace($html_file, $js_ref, $remove_start, $remove_end - $remove_start);

// Zip up and send back to the user the audio, images, js (with compiled code), style, and index.php


// Force the compiler page to return a file instead of a page
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Content-type: text/plain;\n");
header("Content-Transfer-Encoding: binary");
header("Content-Disposition: attachment; filename=\"engine-output.js\";\n\n");
echo $compiled_engine;
?>