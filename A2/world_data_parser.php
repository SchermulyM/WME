<?php

class WorldDataParser
{
    function parseCsv($path)
    {
        $csv = array_map("str_getcsv", file($path));
        $output = array();

        foreach ($csv as $row) {
            $temp = array_map("trim", $row);
            array_push($output, $temp);
        }

        return $output;
    }

    function saveXML($csv_array)
    {
        try {
            $xml = new DOMDocument();
            $root = $xml->createElement("Countries");
            $xml->appendChild($root);

            $head = $csv_array[0];
            $body = array_slice($csv_array, 1);

            foreach ($body as $row) {
                $row_tag = $xml->createElement("Country");
                $root->appendChild($row_tag);

                $col_index = -1;
                foreach ($row as $col) {
                    $col_index++;
                    $tag_name = $head[$col_index];
                    $tag_name = str_replace(" ", "_", $tag_name);
                    $col_tag = $xml->createElement($tag_name);
                    $row_tag->appendChild($col_tag);
                    $col_tag->nodeValue = $col;
                }
            }
            $xml->save("world_data.xml");
            return true;
        } catch (Exception $exception) {
            return false;
        }
    }

    function printXML($xml_file_path, $xslt_stylesheet_path) {
        
    }
}