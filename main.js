function domToTexture(el, w, h) {
  var domTexture = (new THREE.TextureLoader()).load(domToSVGDataURI(el, w, h));
  return domTexture;
}

// hardcoded: size of the image
var WIDTH = 1400;
var HEIGHT = 907;

// TODO work out how to deal with width and height
var domTexture = domToTexture(document.querySelector('.fancy-dom'), WIDTH, HEIGHT);
console.log(domTexture);

var t_noise = (new THREE.TextureLoader()).load('noise256.png');

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, -500, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var vertShader = document.getElementById('vertex-shader').textContent;

var fragShader = document.querySelector('.norm').textContent;

// var fragShader = document.querySelector('.psychedelic-mercury').textContent;
// var fragShader = document.querySelector('.rgb-shift').textContent;
// var fragShader = document.querySelector('.notebook-drawings').textContent; // NOTE doesn't look good 
// var fragShader = document.querySelector('.rain').textContent;


var uniforms = {
  iGlobalTime: { type: 'f', value: 1.0 },
  iResolution: { type: 'v2', value: new THREE.Vector2(WIDTH, HEIGHT) },
  iMouse: { type: 'v2', value: new THREE.Vector2(WIDTH/2, HEIGHT/2) },
  t_noise: { type: 't', value: t_noise },
  domTexture: { type: 't', value: domTexture }
};
var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertShader,
  fragmentShader: fragShader
});

var geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT);
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

document.onmousemove = function(e){
  uniforms.iMouse.value.x = e.pageX
  uniforms.iMouse.value.y = e.pageY
}

// NOTE render loop
function render() {
  requestAnimationFrame(render);
  uniforms.iGlobalTime.value += 0.016;
  renderer.render(scene, camera);
}
render();

function changeShader() {
  var hash = location.hash.substr(1); // remove #
  if (!hash) return;
  var shaderEl = document.querySelector('.' + hash);
  if (!shaderEl) {
    console.warn("Can't find shader code with hash being " + location.hash);
    return;
  }
  fragShader = shaderEl.textContent;
  plane.material.fragmentShader = fragShader;
  plane.material.needsUpdate = true;
};
window.onhashchange = changeShader;

changeShader();
