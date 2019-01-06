$(() => {
    const select = $("#chart-select");
    select.on("change", () => {
        console.log("test");
    });
    $.ajax({
        url: "/properties",
        success: (data) => {
            select.innHTML = "";
            for (const d of data) {
                select.append(`<option>${d}</option>`);
            }
            select.change();
        }
    });

    const mapObject = L.map('map-div').setView([20, 0], 2);
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    }).addTo(mapObject);

    $.ajax({
        url: "/items",
        success: (data) => {
            for (const country of data) {
                const marker = L.marker([country.gps_lat, country.gps_long]);
                marker.bindPopup(country.name);
                marker.addTo(mapObject);
            }
        }
    });

});