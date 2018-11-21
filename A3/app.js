// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
var express = require('express');
var app = express();
var sys = require('util');
var path = require('path');
var bodyParser = require('body-parser');
var Converter = require("csvtojson").Converter;

//register body-parser to handle json from res / req
app.use(bodyParser.json());

//register public dir to serve static files (html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// END DO NOT CHANGE!


/**************************************************************************
 ****************************** csv2json *********************************
 **************************************************************************/

/*  need file system API to write files.
    normally this would go to the top, but it says "DO NOT CHANGE!" soooo ... */
const fs = require("fs");

let csvData = {};

/** read csv into json obj, which is stored globally */
async function readCsv(path) {
    csvData = await new Converter().fromFile(path);
}

/** write it to file, optional but why not ¯\_(ツ)_/¯ */
async function writeJson(path) {
    fs.writeFile(path, JSON.stringify(csvData, null, 4), error => {
        if (error) {
            console.log("couln't write file, it raised:", error)
        } else {
            console.log("wrote world_data.json");
        }
    });
}

/*  execute async functions sequentially, but need an async context to do so
    this is an immediately invoked async lambda function expression, conjured with some ascii soup as is tradition */
(async () => {
    await readCsv("world_data.csv");
    await writeJson("world_data.json");
})();


/**************************************************************************
 ********************** handle HTTP METHODS ***********************
 **************************************************************************/


// DO NOT CHANGE!
// bind server to port
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});