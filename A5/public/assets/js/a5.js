let canvas;
let myMap;
let data;
let scene;
let camera;
let renderer;

const material = new THREE.MeshLambertMaterial({ color: 0xff0000, side: 2, shading: THREE.FlatShading });
let light;
let meshes = [];

$(() => {
    canvas = $("#canvas-map")[0];
    initMappa();
    initThree();
    myMap.onChange(repositionMeshes);
    updateData(() => {
        generateMeshes();
    });
    animationLoop();
    $("#radio-group li").change(generateMeshes);
    $("#check-adjust-value-range").change(generateMeshes);
});

function generateMeshes() {
    meshes.length = 0;
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(50, 50, 50);
    scene.add(light);

    const selectedAttribute = getSelectedAttribute();
    const values = data.map(country => country[selectedAttribute]);
    const maximumValue = Math.max.apply(null, values);
    const minimumValue = Math.min.apply(null, values);
    const valueRange = maximumValue - minimumValue;

    for (const country of data) {
        let value = country[selectedAttribute];
        if ($("#check-adjust-value-range").is(":checked")) {
            value -= minimumValue;
            value /= valueRange;
            value *= 100;
        }
        const geometry = new THREE.BoxGeometry(10, value, 10);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshes.push([country, mesh, selectedAttribute]);
    }

    repositionMeshes();
}

function repositionMeshes() {
    for ([country, mesh, value] of meshes ? meshes : []) {
        // repositioning mostly taken from https://mappa.js.org/docs/examples-three-js.html
        const pos = myMap.latLngToPixel(country.gps_lat, country.gps_long);
        const vector = new THREE.Vector3();
        vector.set((pos.x / canvas.width) * 2 - 1, -(pos.y / canvas.height) * 2 + 1, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const newPos = camera.position.clone().add(dir.multiplyScalar(distance));
        mesh.position.set(newPos.x, newPos.y, newPos.z);
    }
}

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
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({alpha: true, canvas: canvas});
    camera.position.y = 10;
    camera.position.z = 300;
    scene.add(camera);
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

function animationLoop() {
    requestAnimationFrame(animationLoop);
    renderer.render(scene, camera);
}

function getSelectedAttribute() {
    return $("#radio-group input:checked")[0].value;
}