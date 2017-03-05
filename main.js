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

// TODO work out how to deal with width and height
var domTexture = domToTexture(document.querySelector('.fancy-dom'), 512, 512);
console.log(domTexture);

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var vertShader = document.getElementById('vertex-shader').innerHTML;
var fragShader = document.getElementById('fragment-shader').innerHTML;

var material = new THREE.ShaderMaterial({
  uniforms: {
    domTexture: {type: 't', value: domTexture}
  },
  vertexShader: vertShader,
  fragmentShader: fragShader
});

var geometry = new THREE.PlaneGeometry(512, 512);
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// NOTE render loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
