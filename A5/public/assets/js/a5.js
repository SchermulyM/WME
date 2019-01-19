let canvas;
let myMap;
let data;
let scene;
let camera;
let renderer;

let material;
let meshes;

$(() => {
    canvas = $("#canvas-map")[0];
    initMappa();
    initThree();
    myMap.onChange(() => {
        console.log("map changed");
    });
    updateData();
});

function initMappa() {
    const key = "pk.eyJ1IjoicmljYXJkb2xhbmduZXIiLCJhIjoiY2pxano2enh2MG1qazN4bm5lajIzeDl3eiJ9.wK0MtuxLgJxDcGUksKMeKg";
    const options = {
        lat: 0,
        lng: 0,
        zoom: 4,
        style: "mapbox://styles/mapbox/traffic-night-v2",
        pitch: 50
    };
    const mappa = new Mappa("MapboxGL", key);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
}

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({alpha: true, canvas: canvas});
    renderer.setSize(canvas.width, canvas.height);
}

function updateData(callback) {
    $.ajax({
        url: "/items",
        success: d => {
            data = [];
            for (const key in d) {
                if (d.hasOwnProperty(key)) {
                    data.push(d[key]);
                }
            }
            if (callback) callback();
        }
    });
}