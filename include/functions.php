<?php
/*
Name: Function Library
Version: .01
Desc: Contains all functions for engine assembly and creation so various functions can be re-usedn
*/

/*
 * Retrieves files from a specified directory and filters them. Used to retrieve images, audio, or anything else you can imagine.
 * $dir (string) - Directory to retrieve files from, relative to the page its called from
 * $filter (string / array of strings)
 * return - Array of retrieved files.
*/
function get_files($dir, $filter) {
    // Get file data
    $files = scandir($dir);
    
    // Cycle through images and create an array of valid images
    $data = array();
    foreach ($files as $file):
        if (string_compare($file, $filter)):
            array_push($data, $file);
        endif;
    endforeach;

    return $data;
}

/*
 * Outputs an array of strings with a beginning and end.
 * $files (array) - An array of file names.
 * $start_string (string) - Appended to the beginning of each array item.
 * $end_string (string) - Appended to the end of each array item.
*/
function output_files($files, $start_string, $end_string) {
    // Output each file
    foreach ($files as $file) {
        //echo $file;
        echo $start_string . $file . $end_string;
    }
}

/*
 * Outputs a string of JSON data
 * $json_data (array) - Set of JSON data in an array
 */
function output_json($json_data) {
    echo json_encode($json_data);
}

/*
 * Takes a string and compares it against a filter or an array of filters.
 * $haystack (string) - String to test.
 * $needles (string / array of strings) - String(s) to search for inside $haystack
 * return (boolean) - Whether of not the needle was discovered in the haystack
 */
function string_compare($haystack, $needles) {
    $type = gettype($needles);
    
    // Basic string so test as normal
    if ($type === 'string'):
       return strpos($haystack, $needles);
       
    // An array, execute a loop and return if true is matched for anything
    elseif ($type === 'array'):
        foreach ($needles as $needle):
            if (strpos($haystack, $needle)):
                return true;
            endif;
        endforeach;
    endif;
}

?>