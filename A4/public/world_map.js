
// var mymap = L.map('mapid').setView([20, 0], 2);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(mymap);


// var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 1,
// 	maxZoom: 16,
// 	ext: 'jpg'
// });

//Stamen_Watercolor.addTo(mymap)
//
// CartoDB_VoyagerNoLabels.addTo(mymap)

function mapmarker_evtlistener(country){
  console.log(country)
}

$(() => {

    const mapObject = L.map('mapid').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 1,
      	maxZoom: 19
    }).addTo(mapObject);

    $.ajax({
        url: "/items",
        success: (data) => {
            for (const country of data) {
                const marker = L.marker([country.gps_lat, country.gps_long], {id: country.name});
                marker.bindPopup(country.name);
                marker.on("mouseover", function(){marker.openPopup(); mapmarker_evtlistener(country.name)});
                marker.on("mouseout", function(){marker.closePopup(); mapmarker_evtlistener(country.name)});
                marker.addTo(mapObject);
            }
        }
    });

});

// function onMapClick(e) {
// 	popup
// 		.setLatLng(e.latlng)
// 		.setContent("You clicked the map at " + e.latlng.toString())
// 		.openOn(mymap);
// }
//
// mymap.on('click', onMapClick);
