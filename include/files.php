<?php
/*
Name: JavaScript File Retriveal
Version: .01
Desc: Outputs all of the JavaScript files in js -> engine so the engine can be
properly created without manual HTML coding.
*/

// Retrive all functions
include 'functions.php';

// Display files
$files = get_files('js/engine','.js');
echo list_files($files);
?>