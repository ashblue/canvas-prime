<?php
/*
Name: Sound File Retrieval
Version: 1
Desc: Allows JavaScript to request all of the sound files present in the sound folder.
*/

// Retrive all functions
include 'functions.php';

// Get sounds
$file_type = '.ogg';
$sounds = get_files('../audio', $file_type);

// Remove .ogg file type from each array item
foreach($sounds as $key => $sound):
	$sounds[$key] = str_replace($file_type, '', $sound);
endforeach;

// Output JSON data for XMLHTTP request
output_json($sounds);
?>