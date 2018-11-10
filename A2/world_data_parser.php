<?php

class WorldDataParser{

	// function parseCSV($csv_path) {
	// 	$filepath = $csv_path . DIRECTORY_SEPARATOR . 'world_data.csv';
	// 	$csv_array = array_map('str_getcsv', file($filepath));
	// 	return $csv_array
	// }

	function parseCSV($csv_path) {
		$csv_array = array_map('str_getcsv', file($csv_path));
		return $csv_array;
	}

	function saveXML($csv_array) {
		// go through first array and collect tags
		$xml_tags_array = array();
		foreach($csv_array[0] as $line) {
			$tag = str_replace(' ', '_', trim($line));
	    $xml_tags_array[] = $tag;
		}
		$xml = new DOMDocument("1.0", "UTF-8");
		$xml->preserveWhiteSpace = false;
		$xml->formatOutput = true;
		$xml_countries = $xml -> createElement('Countries');
		// go through remaining array in array, create xml from every entry.
		foreach($csv_array as $entry_nr => $entry){
			if($entry_nr) {
				$xml_country = $xml -> createElement("Country");
				foreach($entry as $index => $value){
					$value = trim($value);
					$xele = $xml -> createElement($xml_tags_array[$index]);
					$xele -> nodeValue = $value;
					$xml_country -> appendChild($xele);
				}
				$xml_countries -> appendChild($xml_country);
			}
		}
		$xml -> appendChild($xml_countries);
		$ret = $xml -> save('world_data.xml');
		return boolval($ret);
	}

	function printXML($xml_file, $xsl_file){
		$xslDoc = new DOMDocument("1.0", "UTF-8");
    $xslDoc->load($xsl_file);

    $xmlDoc = new DOMDocument("1.0", "UTF-8");
    $xmlDoc->load($xml_file);

    $proc = new XSLTProcessor();
    $proc->importStylesheet($xslDoc);
    $proc = $proc->transformToXML($xmlDoc);
		return $proc;
	}
}
