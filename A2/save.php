<a href="index.php"> RETURN </a>
<?php

  require 'world_data_parser.php';

  $wdp = new WorldDataParser();
  $csv = $wdp -> parseCSV('world_data.csv');
  $success = $wdp -> saveXML($csv);
  echo "<p>";
  echo $success ? "Successfully wrote the file!" : "Failed to write the file :(";
  echo "</p>";
?>
