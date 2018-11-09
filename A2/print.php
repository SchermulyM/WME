<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>FIXME</title>
    <meta name="description" content="FIXME">
    <meta name="author" content="FIXME">
    <meta name="keywords" content="FIXME">

    <link href="html5reset.css" type="text/css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,500,500italic,700,700italic'
          rel='stylesheet' type='text/css'>
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="style.css" type="text/css" rel="stylesheet">
</head>

<body>

<header id="sticky_header">
    <nav class="container clearfix" role="navigation">
        <a class="logo" href="/">world_data</a>
        <ul id="main_nav" class="clearfix">
            <li>
                <a href=""><i class="fa fa-list-ul"></i>A1 - Table</a>
            </li>
            <li>
                <a href="parse.php"><i class="fa fa-list-ul"></i>A2 - Parse</a>
            </li>
            <li>
                <a href="save.php"><i class="fa fa-list-ul"></i>A2 - Save</a>
            </li>
            <li>
                <a href="print.php"><i class="fa fa-list-ul"></i>A2 - Print</a>
            </li>
            <li>
                <a href=""><i class="fa fa-list-ul"></i>A3 - REST</a>
            </li>
            <li>
                <a href=""><i class="fa fa-list-ul"></i>A4 - Vis</a>
            </li>
        </ul>
        <a href="#" id="pull"><i class="fa fa-list-ul"></i></a>
    </nav>
</header>

<div class="container">
    <section>
        <h1>World Data Overview ... </h1>

        <?php
        require "world_data_parser.php";
        $parser = new WorldDataParser();
        $csv_array = $parser->parseCsv("world_data.csv");
        $parser->saveXML($csv_array);
        $table = $parser->printXML("world_data.xml", "world_data_template.xsl");
        echo $table;
        ?>

    </section>
</div>

<footer>
    <div class="container">
        <div>
            <p>
                Copyright &copy; 2018 WME Ueb<br>
                Course exercise of the lecture Web and Multimedia Engineering.
            </p>
        </div>
        <div class="right">
            <p>
                This solution has been created by:<br>
                FIXME
            </p>
        </div>
    </div>
</footer>

</body>
</html>

