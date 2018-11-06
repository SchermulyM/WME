<?php

require "world_data_parser.php";
$parser = new WorldDataParser();
$output_path = "world_data.csv";
$csv_array = $parser->parseCsv($output_path);
$success = $parser->saveXML($csv_array);

if ($success) {
    echo "successfully wrote $output_path";
} else {
    echo "failed to write $output_path";
}