<?php
/*
Name: Image File Retrieval
Version: 1
Desc: Allows JavaScript to request all of the files in the images folder.
*/

// Retrive all functions
include 'functions.php';

// Get files
$image_types = array('.png', '.jpg', '.gif');
$images = get_files('../images', $image_types);

// Output JSON data for XMLHTTP request
output_json($images);
?>