function domToTexture(el, w, h) {
  var domTexture = (new THREE.TextureLoader()).load(domToSVGDataURI(el, w, h));
  return domTexture;
}

function isWebGLSupported () {
  // Create canvas element. The canvas is not added to the
  // document itself, so it is never displayed in the
  // browser window.
  var canvas = document.createElement("canvas");
  // Get WebGLRenderingContext from canvas element.
  var gl = canvas.getContext("webgl")
    || canvas.getContext("experimental-webgl");

  if (gl && gl instanceof WebGLRenderingContext) {
    return true;
  } else {
    return false;
  }
}

// NOTE Don't do any of these fancy Shader shit if webgl is not supported
if (isWebGLSupported()) {

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
  
  var geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 32, 32);
  var plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  
  document.onmousemove = function(e){
    uniforms.iMouse.value.x = e.pageX
    uniforms.iMouse.value.y = e.pageY
  }
  var bDown = false;
  function downHandler(e) {
    e.preventDefault();
    bDown = true;
  }
  function upHandler(e) {
    e.preventDefault();
    bDown = false;
    uniforms.iMouse.value.x = WIDTH/2;
    uniforms.iMouse.value.y = HEIGHT/2;
    vertAnimation.update(0, uniforms.iGlobalTime.value);
  }
  renderer.domElement.addEventListener('touchstart', downHandler);
  renderer.domElement.addEventListener('mousedown', downHandler);
  renderer.domElement.addEventListener('touchend', upHandler);
  renderer.domElement.addEventListener('mouseup', upHandler);
  
  // NOTE set up vertex animation
  var vertAnimation	= new THREEx.VertexAnimation(geometry, function(origin, position, delta, now){
    // here you put your formula, something clever which fit your needs
    var speed	= 2 + Math.cos(0.2 * now*Math.PI*2)*2;
    var angle	= speed*now*Math.PI*2 + origin.y*10;
    var angle	= 5*now*Math.PI*2 + origin.y*15;
    // position.x	= origin.x + Math.cos(angle*0.4)*10.1;
    // position.y	= origin.y + Math.sin(angle*0.1)*40.4;
    
    // convert mouse info to THREE-space
    var mouseX = uniforms.iMouse.value.x - WIDTH/2;
    var mouseY = - (uniforms.iMouse.value.y - HEIGHT/2);
    position.x = mouseX * (1-Math.abs(origin.x - mouseX)*0.002) + origin.x + Math.cos(angle*0.4)*4.1;
    position.y = mouseY * (1-Math.abs(origin.y - mouseY)*0.002) + origin.y + Math.sin(angle*0.1)*4.4;
  });
  
  
  // NOTE render loop
  var then;
  function render(now) {
    requestAnimationFrame(render);
    then = then || now-1000/60
    var dt	= Math.min(200, now - then)
    then = now;

    dt /= 1000;
    uniforms.iGlobalTime.value = then/1000;
    if (bDown) vertAnimation.update(dt, uniforms.iGlobalTime.value);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
  
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

} else {
  alert("Your browser does not support WebGL. Rendering regular HTML.");
}
