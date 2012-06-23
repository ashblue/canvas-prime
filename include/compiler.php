<?php
/*
Name: Compresses JavaScript and compiles the rest of the apps components
Version: .01
Desc: Assembles and strips unecessary content to output a packaged version of the current site build.

TODO: Only works with the existing structure, should also compile and
compress additional files / folders.
*/


include 'functions.php'; // Retrive all functions
include 'lib/jsminplus.php'; // Load in the JSMin+ library to compress JavaScript files when they're ready

$compiled_engine = ''; // Storage location for the newly assembled engine

// Get all of the major JavaScript file chunks
$depen_files = get_files('../js/depen', '.js');
$engine_files = get_files('../js/engine', '.js');
$object_files = get_files('../js/objects', '.js');
$setup_file = get_files('../js', '.js');

// Assemble dependences

// Assemble the engine file
foreach ($engine_files as $index=>$file):
    // Get the file contents
    $content = file_get_contents('../js/engine/' . $file, true);

    // Remove "var cp = cp || {};" from the start of every file except the first
    if ($compiled_engine !== ''):
        $content = str_replace('var cp = cp || {};', '', $content);
    endif;

    // Append content to body
    $compiled_engine .= $content;
endforeach;



// Force the compiler page to return a file instead of a page
//header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//header("Content-type: text/plain;\n");
//header("Content-Transfer-Encoding: binary");
//header("Content-Disposition: attachment; filename=\"engine-output.js\";\n\n");
?>