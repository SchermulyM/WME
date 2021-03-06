<!DOCTYPE html>
<html lang="de">
<head>
  <?php include("templates/head.php"); ?>
</head>

<body>
  <?php include("templates/navbar.php"); ?>
  <div id="content">
    <?php
      include("templates/content.php");
      include("templates/showhide.php");

      require 'world_data_parser.php';
      $wdp = new WorldDataParser();
      $csv = $wdp -> parseCSV('world_data.csv');
      echo '<pre>';
      print_r($wdp -> printXML("world_data.xml", "world_data.xsl"));
      echo '</pre>';

      include("templates/footer.php");
    ?>
  </div>
</body>
</html>
