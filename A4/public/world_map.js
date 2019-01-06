
var mymap = L.map('mapid').setView([20, 0], 2);

var points = [
    ["ZANZIBAR",-6.13, 39.31],
    ["TOKYO",35.68, 139.76],
    ["AUCKLAND",-36.85, 174.78],
    ["BANGKOK",13.75, 100.48],
    ["DELHI",29.01, 77.38],
    ["SINGAPORE",1.36, 103.75],
    ["BRASILIA",-15.67, -47.43],
    ["RIO DE JANEIRO",-22.9, -43.24],
    ["TORONTO",43.64, -79.4],
    ["EASTER ISLAND",-27.11, -109.36],
    ["SEATTLE",47.61, -122.33],
    ["LONDON",51.5072, -0.1275]
    ];


// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(mymap);

var CartoDB_VoyagerNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

// var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 1,
// 	maxZoom: 16,
// 	ext: 'jpg'
// });

//Stamen_Watercolor.addTo(mymap)

CartoDB_VoyagerNoLabels.addTo(mymap)

L.marker([51.5, -0.09]).addTo(mymap)
	.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

var popup = L.popup();

// function onMapClick(e) {
// 	popup
// 		.setLatLng(e.latlng)
// 		.setContent("You clicked the map at " + e.latlng.toString())
// 		.openOn(mymap);
// }
//
// mymap.on('click', onMapClick);
