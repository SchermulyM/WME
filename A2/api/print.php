<?php
require "../world_data_parser.php";
$parser = new WorldDataParser();
$csv_array = $parser->parseCsv("../world_data.csv");
$parser->saveXML($csv_array);
$table = $parser->printXML("../world_data.xml", "../world_data_template.xsl");
echo $table;