import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const EPSILON = 0.1;
const U = 2.54;
const HU = U / 2;
const QU = U / 4;

var scale = 100;
var aspectRatio = window.innerWidth / window.innerHeight;

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(scale * aspectRatio / -2, scale * aspectRatio / 2, scale / -2, scale / 2, 0, scale * 10);
var renderer = new THREE.WebGLRenderer({antialias: true});
var controls = new OrbitControls(camera, renderer.domElement);

var origin = new THREE.Vector3(-93.98 / 2, -2 / 2, -127 / 2);

camera.position.set(origin.x - scale, origin.y - scale, origin.z - scale);
camera.lookAt(origin);
controls.target.set(origin.x, origin.y, origin.z);
controls.update();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xFFFFFF);

document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
var edgeMaterial = new THREE.LineBasicMaterial({color: "black", linewidth: 1});
var edges = new THREE.EdgesGeometry(geometry);

function createBox(x, y, z, width, height, length) {
    var mesh = new THREE.Mesh(geometry, material);
    var wireframe = new THREE.LineSegments(edges, edgeMaterial);

    mesh.position.set(x - (width / 2), y - (height / 2), z - (length / 2));
    mesh.scale.set(width - EPSILON, height - EPSILON, length - EPSILON);

    mesh.add(wireframe);

    scene.add(mesh);
}

function createIc(xU, y, zU, widthU, lengthU) {
    createBox((-xU * U) - HU + QU, y - 4, (-zU * U) + HU, ((widthU + 1) * U) - HU, 4, (lengthU - 0.5) * U);

    for (var i = 0; i < widthU; i++) {
        createBox((-(xU + i) * U) - U + QU, y - 4, (-(zU + lengthU - 1) * U), HU, 2, U / 4);
    }

    for (var i = 0; i < widthU; i++) {
        createBox((-(xU + i) * U) - U + QU, y - 4, (-(zU + lengthU - 1.5) * U) + ((lengthU - 0.73) * U), HU, 2, U / 4);
    }
}

// Main board
createBox(0, 0, 0, 93.98, 2, 127);


createIc(0, 2, 3, 20, 6);   // 65C22
createIc(0, 2, 11, 20, 6);  // 65C02
createIc(4, 2, 19, 16, 6);  // AS6C1008
createIc(21, 2, 19, 7, 3);  // 74LS04
createIc(29, 2, 19, 7, 3);  // 74LS08
createIc(29, 2, 24, 7, 3);  // 74LS21

requestAnimationFrame(function render() {
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
});