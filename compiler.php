<?php
/*
Name: Compresses JavaScript and compiles the rest of the apps components
Version: 1
Desc: Assembles and strips unecessary content to output a packaged version of the current site build.

@todo Figure out a way to compile that includes potentially non-existent scripts.
@todo Figure out how to remove comments from JS before setup file is craweled for
load data.
*/

// Retrive all functions
include 'include/functions.php';

include('include/lib/package_zipper.php');

// Load in the JSMin+ library to compress JavaScript files when they're ready
// @todo When upgrading to node down the road, run uglify instead
include 'include/lib/jsminplus.php';

/**
 * Experimentally extended package zipping class to test out excluded files.
 * @todo Messed this up trying to fix a typo, needs to be properly fixed at some point.
 * @param string Test.
 * @param array $exclude Allows you to exclude a specific folders and files via
 * string.
 */
class Zip_Game extends Zip_Pack {
    public function clone_name($name, $destination = null, $exclude = array()) {
        // If there is a destination, set $loc to it, otherwise $loc is equal to the $name
        $loc = $destination ? $destination : $name;

        $catalog = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($name), RecursiveIteratorIterator::SELF_FIRST);

        // Look through all files retrieved
        foreach ($catalog as $item):
            if ($this->test_string($item, $exclude)) {
                continue;
            }

            $output = str_replace('\\', '/', $item);
            $output = str_replace('./', '', $output);

            if (is_file($output) === true):
                $this->zip->addFromString($output, file_get_contents($output));
            endif;
        endforeach;

        return $this;
    }

    public function test_string($string, $needles) {
        foreach ($needles as $needle):
            if (strpos($string, $needle)):
                return true;
            endif;
        endforeach;

        return false;
    }
};

class Compile_Game {
    /** @type string Safe line breaks for JS files. */
    const LINE_BREAK = "\n\n";

    /** @type string Location of dependencies */
    const FOLDER_DEPENDENCIES = 'js/depen';

    /** @type string Location of engine */
    const FOLDER_ENGINE = 'js/engine';

    /** @type string Location of object */
    const FOLDER_OBJECTS = 'js/objects';

    /** @type string Start of content removal in an HTML file. */
    const HTML_REMOVE_START = '<!-- COMPILER_REPLACE -->';

    /** @type string End of content removal in an HTML file. */
    const HTML_REMOVE_END = '<!-- END_COMPILER_REPLACE -->';

    const HTML_REMOVE_REPLACE = '<script type="text/javascript" src="js/game.js"></script>';

    function __construct() {
        // Assemble all of the dependencies, engine, and object files
        $depen_file = $this->assemble_files(self::FOLDER_DEPENDENCIES, '.js');
        $engine_file = $this->assemble_files(self::FOLDER_ENGINE, '.js', 'var cp = cp || {};');
        $setup_file = file_get_contents('js/setup.js', true);

        // Load specific object files in a specific order
        $object_file = $this->assembled_objects(self::FOLDER_OBJECTS, $setup_file);

        // Patch the assembled engine's loader script for XMLHTTP info w/ local references
        $engine_file = ' var cp = cp || {}; ' . $this->patch_XMLHTTP($engine_file);

        // Send over all the JavaScript file strings to be combined and compressed
        $js_files = array($depen_file, $engine_file, $object_file, $setup_file);
        $compiled_js = $this->combine_files($js_files);

        // Fix the index.php so its index.html and only refs 1 js file
        $index_html = $this->setup_index('index.php');

        // Output zip
        $zip = new Zip_Game();
        $zip
            ->clone_name('./', null, array('git', 'php', 'include', 'js'))
            ->set_file('js/game.js', $compiled_js)
            ->set_file('index.html', $index_html)
            ->get_zip('game');
    }

    /**
     * Combine and compile multiple files into a single string from a specific
     * directory. Preserves line breaks and other data.
     * @todo Remove ext.
     * @return string Assembled file data.
     */
    function assemble_files($dir, $ext, $remove_string = null) {
        // Dump file data here
        $compiled_data = '';

        // Get all the files
        $files = get_files($dir, $ext);

        foreach($files as $file):
            // Get the file contents
            $content = file_get_contents($dir . '/' . $file, true);

            // Append content to body and add a line break
            $compiled_data .= $content . self::LINE_BREAK;
        endforeach;

        // Remove a string if one was provided
        if (gettype($remove_string) === 'string') {
            $compiled_data = str_replace($remove_string, '', $compiled_data);
        }

        return $compiled_data;
    }

    function assembled_objects($dir, $setup_file) {
        // Get the setup file's load data with commas
        $replace_start = strpos($setup_file, 'cp.load.loadFiles = [') + strlen('cp.load.loadFiles = [');
        $replace_length = strpos($setup_file, '];', $replace_start) - $replace_start;
        $string_array = substr($setup_file, $replace_start, $replace_length);

        // Remove commas and single quotes
        $string_array = str_replace(',', '', $string_array);
        $string_array = str_replace('\'', '', $string_array);

        $files = explode(' ', $string_array);

        $compiled_data = '';
        foreach($files as $file):
            // Get the file contents
            $content = file_get_contents($dir . '/' . $file . '.js', true);

            // Append content to body and add a line break
            $compiled_data .= $content . self::LINE_BREAK;
        endforeach;

        return $compiled_data;
    }

    function combine_files($file_strings) {
        // Assemble all of the prepared JavaScript files into one string
        $compiled_js = '';
        foreach($file_strings as $string):
            $compiled_js .= $string;
        endforeach;

        // Run JSMinPlus compiled JavaScript
        return JSMinPlus::minify($compiled_js, 'game.js');
    }

    /**
     * Adjusts the XMLHTTP protocols to instead load locally. Uses various
     * JS Constants to do this. Note modifying this method will force you to adjust
     * your load script in "js/engine".
     * @param string $file A file in string format.
     * @return string Returns the patched file.
     */
    function patch_XMLHTTP($file) {
        // Get the files necessary to patch the loader for no XMLHTTP requests with compatible JS data
        $image_files = json_encode(get_files('images', array('.png', '.jpg', '.gif')));
        $sound_files = str_replace('.ogg', '', json_encode(get_files('audio', '.ogg')));

        // Replace necessary lines in the existing content
        $file = str_replace('COMPILER_LOADING = null', 'COMPILER_LOADING = true', $file); // Make the loader shut of XMLHTTP requests
        $file = str_replace('COMPILER_IMG = null', 'COMPILER_IMG = ' . $image_files, $file); // Declare images to load
        $file = str_replace('COMPILER_AUDIO = null', 'COMPILER_AUDIO = ' . $sound_files, $file); // Declare sound to load

        return $file;
    }

    // Hijack index.php contents and turn it into an HTML file with the proper references for new files
    function setup_index($index_file) {
        $html_file = file_get_contents($index_file, true);

        $remove_start = strpos($html_file, self::HTML_REMOVE_START);
        $remove_end = strpos($html_file, self::HTML_REMOVE_END) + strlen(self::HTML_REMOVE_END);
        $html_file = substr_replace($html_file, self::HTML_REMOVE_REPLACE, $remove_start, $remove_end - $remove_start);

        return $html_file;
    }

    function create_zip() {

    }
};

$compiler = new Compile_Game();
?>