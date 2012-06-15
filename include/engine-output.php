<?php
/*
Name: Engine Output from JS files
Version: .01
Desc: Assembles and strips unecessary content to create a straight text output for the engine.
*/

// Retrive all functions
include 'functions.php';

// Get all files
$files = get_files('../js/engine','.js');

// Strip out unnecessary data
$body = '';
$file_num = count($files);
foreach ($files as $index=>$file):
    // Get the contents
    $content = file_get_contents('../js/engine/' . $file, true);

    // Strip the object creation declaration
    $content = str_replace('var cp = cp || {};', '', $content);

    // Replace first instance of cp.
    $content = preg_replace('/cp./', '', $content, 1);

    // Indent every freikin line with 4 spaces
    $content_format = '';
    $lines = preg_split("/(\r?\n)/", $content);
    foreach($lines as $ind=>$line){
        // Insert break with line
        $content_format .= $line;

        // Exit on last item
        if ($ind + 1 === count($lines) && !($index + 1 === $file_num)):
            $content_format .= ',';
        elseif ($ind + 1 === count($lines) && $index + 1 === $file_num):
            $content_format .= '

';
        else:
            $content_format .= '
    ';
        endif;
    }

    // Append content to body
    $body .= $content_format;
endforeach;

header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Content-type: text/plain;\n");
header("Content-Transfer-Encoding: binary");
header("Content-Disposition: attachment; filename=\"engine-output.js\";\n\n");

// Echo the script
echo "header info here\n";

//$body = file_get_contents('../js/engine/test1.js', true);
echo "cp = {\n";
    echo $body . "\n";
echo "};\n";
?>
