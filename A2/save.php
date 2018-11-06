<?php

  require 'world_data_parser.php';

  $wdp = new WorldDataParser();
  $csv = $wdp -> parseCSV('world_data.csv');

  echo '<pre>'; print_r($wdp -> saveXML($csv)); echo '</pre>';
?>
