<?php
/*
Name: Image Listing
Version: .01
Desc: Allows JavaScript to request all of the file names present in the images folder.
*/
$audio = get_images('../audio');
echo list_items($audio);

function get_images($dir) {
	// Get image data
	$audio = scandir($dir);
	
	// Cycle through images and create an array of valid images
	$data = array();
	foreach($audio as $aud) {
		if (strpos($aud, '.ogg') || strpos($aud,'.mp3')):
			array_push($data, $aud);
		endif;
	}

	return $data;
}

function list_items($array) {
	$json = json_encode($array);
	return $json;
}
?>