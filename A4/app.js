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
    csvData = await new Converter({checkType: true}).fromFile(path);
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

// routing reference https://expressjs.com/en/guide/routing.html

app.get("/items", (req, res) => {
    res.send(csvData);
});

app.get("/", (req, res) => {
     res.sendfile("public/index.html")
});

app.get("/vis", (req, res) => {
     res.sendfile("public/vis.html")
});

app.get("/items/:id", (req, res) => {
    const id = req.params["id"];
    const item = csvData.find(x => x.id === parseInt(id));
    if (item === undefined) {
        // https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express
        res.status(400).send(`No such id ${id} in database.`);
    }
    res.send(item);
});

app.get("/items/:id1/:id2", (req, res) => {
    const id1 = req.params["id1"];
    const id2 = req.params["id2"];
    const items = csvData.filter(x => parseInt(id1) <= x.id && x.id <= parseInt(id2));
    console.log(items);
    res.send(items);
});

app.get("/properties", (req, res) => {
    const first = csvData[0];
    const keys = Object.keys(first);
    res.send(keys);
});

app.get("/properties/:num", (req, res) => {
    const first = csvData[0];
    const keys = Object.keys(first);
    const numberOfProperty = req.params["num"];
    const property = keys[numberOfProperty];
    if (property === undefined) {
        // https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express
        res.status(400).send("No such property available.");
    } else {
        res.send(property);
    }
});

app.post("/items", (req, res) => {
    const newId = csvData.length === 0 ? 0 : Math.max.apply(null, csvData.map(x => x.id)) + 1;
    const newCountry = {
        id: newId,
        name: req.body.name.toString(),
        birth_rate_per_1000: parseFloat(req.body.birth_rate_per_1000),
        cell_phones_per_100: parseFloat(req.body.cell_phones_per_100)
    };
    console.log("generated new object:", newCountry);
    csvData.push(newCountry);
    res.status(200).send(`Added country ${newCountry.name} to list!`)
});

app.delete("/items", (req, res) => {
    if (csvData.length > 0) {
        const country = csvData.pop();
        res.status(200).send(`Deleted last country: ${country.name}`);
    } else {
        res.status(400).send("No country left to delete.");
    }
});

app.delete("/items/:id", (req, res) => {
    const id = req.params.id;
    const country = csvData.find(x => x.id === parseInt(id));
    if (country === undefined) {
        res.status(400).send(`No such id ${id} in database.`)
    } else {
        csvData = csvData.filter(x => x !== country);
        res.send(`Item ${id} deleted successfully.`);
    }
});


// DO NOT CHANGE!
// bind server to port
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
