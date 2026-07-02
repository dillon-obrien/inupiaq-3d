# Interactive Particles

An interactive WebGL particle system built with [Three.js](https://threejs.org/).
An image is sampled pixel-by-pixel and rendered as a cloud of instanced
particles that scatter and react to the pointer, then settle back into the
picture.

Based on the tutorial [Interactive Particles with Three.js](https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/)
by Bruno Imbrizi.

## Getting started

```bash
npm install
npm start
```

Then open the URL printed by webpack-dev-server (defaults to
`http://localhost:8080`). The dev server binds to `0.0.0.0`, so it is also
reachable from other devices on your network.

## Build

```bash
npm run build
```

The production bundle is emitted to `public/`.

## Controls

- **Move the pointer** over the image to disturb the particles.
- **Click** to replay the reveal animation (and to advance through samples
  when more than one is configured).
- **Press `g`** to toggle the GUI panel.

## Adding your own images

1. Drop a `.png` into `static/images/`.
2. Add its path to the `samples` array in
   [`src/scripts/webgl/WebGLView.js`](src/scripts/webgl/WebGLView.js).

Pixels darker than a brightness threshold are discarded, so images with a
dark/transparent background and a bright subject work best. Very large images
produce one particle per pixel and can be heavy — a few hundred pixels per
side is a good starting point.

## Tech

- Three.js (instanced buffer geometry + a custom GLSL shader)
- GSAP for the show/hide tweens
- webpack + Babel for bundling
- glslify for shader imports

## License

MIT
