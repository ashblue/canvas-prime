<?php
/*
Name: Function Library
Version: .01
Desc: Contains all functions for engine assembly and creation so various functions can be
re-used
*/

function get_files($dir, $filter) {
    // Get file data
    $files = scandir($dir);
    
    // Cycle through images and create an array of valid images
    $data = array();
    foreach ($files as $file) {
        if ( strpos($file, $filter)):
            array_push($data, $file);
        endif;
    }

    return $data;
}

function list_files($files) {
    // Output each file
    foreach ($files as $file) {
        //echo $file;
        echo '<script type="text/javascript" src="js/engine/' . $file . '"></script>';
    }
}
?>