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
