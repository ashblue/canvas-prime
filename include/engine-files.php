<?php
/*
Name: JavaScript Engine File Retriveal
Version: 1
Desc: Outputs all of the JavaScript files in js -> engine, so the engine can be
properly created without manual HTML coding.
*/

// Retrive all functions
include 'functions.php';

// Display files
$files = get_files('js/engine','.js');

// Output the files
output_files($files, '<script type="text/javascript" src="js/engine/', '"></script>');
?>