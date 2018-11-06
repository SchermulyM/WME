<?php

require "world_data_parser.php";
$parser = new WorldDataParser();
$data = $parser -> parseCsv("world_data.csv");
echo "<pre>";
print_r($data);
echo "</pre>";