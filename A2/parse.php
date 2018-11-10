<a href="index.php"> RETURN </a>
<?php

  require 'world_data_parser.php';

  $wdp = new WorldDataParser();
  $csv = $wdp -> parseCSV('world_data.csv');

  echo '<pre>'; print_r($csv); echo '</pre>';
?>
