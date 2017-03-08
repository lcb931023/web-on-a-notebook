function domToSVGDataURI(el, w, h) {
  var NS = 'http://www.w3.org/2000/svg';
  // wrap the dom element in svg
  var foreign = document.createElementNS(NS, 'foreignObject');
  foreign.setAttribute('width', w);
  foreign.setAttribute('height', h);
  foreign.appendChild(el);
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.appendChild(foreign);
  // serialize the svg into string
  var svgData = (new XMLSerializer()).serializeToString(svg);
  // convert that to data URI
  var dataURI = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData);
  return dataURI;
}

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
// var fragShader = document.querySelector('.psychedelic-mercury').textContent;
var fragShader = document.querySelector('.rgb-shift').textContent;
// var fragShader = document.querySelector('.notebook-drawings').textContent;
// var fragShader = document.querySelector('.rain').textContent;
var uniforms = {
  u_time: { type: 'f', value: 1.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2(WIDTH, HEIGHT) },
  u_mouse: { type: 'v2', value: new THREE.Vector2(WIDTH/2, HEIGHT/2) },
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
  uniforms.u_mouse.value.x = e.pageX
  uniforms.u_mouse.value.y = e.pageY
}

// NOTE render loop
function render() {
  requestAnimationFrame(render);
  uniforms.u_time.value += 0.016;
  renderer.render(scene, camera);
}
render();
