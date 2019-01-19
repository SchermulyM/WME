let canvas;
let myMap;
let data;
let scene;
let camera;
let renderer;

const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
let meshes;

$(() => {
    canvas = $("#canvas-map")[0];
    initMappa();
    initThree();
    myMap.onChange(() => {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        for (const d of data ? data : []) {
            const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
            const mesh = new THREE.Mesh(geometry, material);
            const pos = myMap.latLngToPixel(d.gps_lat, d.gps_long);
            const vector = new THREE.Vector3();
            vector.set((pos.x / canvas.width) * 2 - 1, -(pos.y / canvas.height) * 2 + 1, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const newPos = camera.position.clone().add(dir.multiplyScalar(distance));
            mesh.position.set(newPos.x, newPos.y, newPos.z);
            scene.add(mesh);
        }
    });
    updateData();
    animationLoop();
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
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({alpha: true, canvas: canvas});
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