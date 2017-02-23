var svgData = (new XMLSerializer()).serializeToString(
  document.querySelector('#test-svg')
);
var dataURI = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData);
var img = new Image();
img.src = dataURI;
// document.body.appendChild(img);

var loader = new THREE.TextureLoader();
var svgTexture = loader.load(dataURI);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.PlaneGeometry(2, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: svgTexture
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// NOTE render loop

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
