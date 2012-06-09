<?php
/*
Name: Image Listing
Version: .01
Desc: Allows JavaScript to request all of the file names present in the images folder.

Note: Needs cleanup and combining with other include files
*/
$audio = get_images('../audio');
echo list_items($audio);

function get_images($dir) {
	// Get image data
	$audio = scandir($dir);
	
	// Cycle through images and create an array of valid images
	$data = array();
	foreach($audio as $aud):
		// Verify the file has an mp3 and ogg
		if (strpos($aud, '.ogg') || strpos($aud,'.mp3')):
			// Remove the extension
			$aud = str_replace('.ogg','',$aud);
			$aud = str_replace('.mp3','',$aud);
			
			array_push($data, $aud);
		endif;
	endforeach;
	
	// Remove duplicates
	$data = array_unique($data, SORT_REGULAR);

	return $data;
}

function list_items($array) {
	$json = json_encode(array_values($array));
	return $json;
}
?>