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

var vertShader = document.getElementById('vertex-shader').innerHTML;
var fragShader = document.getElementById('fragment-shader').innerHTML;

var material = new THREE.ShaderMaterial({
  uniforms: {
    domTexture: {type: 't', value: svgTexture}
  },
  vertexShader: vertShader,
  fragmentShader: fragShader
});

var geometry = new THREE.PlaneGeometry(2, 2);
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

// NOTE render loop

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
