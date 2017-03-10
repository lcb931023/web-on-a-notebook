var uniforms = [
  {
    name: 'iResolution',
    type: 'vec2' // NOTE Does not support iResolution.z (pixel aspect ratio)
  },
  {
    name: 'iGlobalTime',
    type: 'float'
  },
  {
    name: 'iTimeDelta',
    type: 'float'
  },
  {
    name: 'iFrame',
    type: 'int'
  },
  {
    name: 'iFrameRate',
    type: 'float'
  },
  {
    name: 'iMouse',
    type: 'vec2' // NOTE Does not support iMouse.zw (starting drag position)
  },
  {
    name: 'iDate',
    type: 'vec4' // NOTE Year, month, day, time in seconds in .xyzw
  },
  // NOTE Does not support: iChannelTime[i], iChannelResolution[i], iSampleRate
  // NOTE iChannels are supported in separate function...
];

// TODO support iChannel{i} conversion

var names = [{
  shadertoy: 'texture',
  webgl: 'texture2D'
}];

function convert(input) {
  var output = input;
  // Add every uniform
  // function name conversion
  // change mainImage function
  // change fragColor and fragCoord to the gl_ names
  return output;
}
