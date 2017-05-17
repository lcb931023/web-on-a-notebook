Web on a Notebook
========

Experiment with rendering DOM elements inside WebGL.

1. [x] Use it as texture in a THREE.js scene

2. Find a cool use case for it

3. Add effect on it
  - notebook effect
  - glitch
  - ???

4. Clean up the rendering to reusable functions, "renderer"
  - [x] create functions to convert dom into dataURL for rendering, then texture
  - [x] make the "renderer" work with width / height passed in
  - [ ] make the renderer responsive



## What you **can't** do with your fancy dom

No reference to network resources
    - No external CSS File
    - No external Image URL

- All Images have to be converted to data URL
- CSS background image with data URL is not supported for unknown reason
- Some CSS units will be different between these two "rendering"
- Any animation won't work
- System-installed fonts work. However, external font files would have to be encoded in dataURL

## Future

If we add a bundler (e.g. Webpack) that handles transforming the external assets to Base64 URL, this could then be worked into a nice lil renderer
