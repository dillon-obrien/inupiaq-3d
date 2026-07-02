# Iñupiat Ilitqusiat — an interactive tribute

*The values that make us who we are.*

An interactive WebGL piece built with [Three.js](https://threejs.org/) in honour
of the Iñupiat of Arctic Alaska. A portrait of an Iñupiaq hunter is sampled
pixel-by-pixel and rendered as a cloud of instanced particles, coloured like the
aurora (*kiuġuyat*) and drifting over a dark Arctic sky. Move the pointer and the
figure scatters like wind over the tundra; the particles then settle back into
the picture. Over the top, the piece cycles slowly through the **Iñupiat
Ilitqusiat** — the cultural values articulated by Iñupiaq elders (originally in
Kotzebue, Alaska): respect for elders, sharing, cooperation, respect for nature,
humility, and more.

The value names and short glosses are respectful paraphrases of the commonly
published Iñupiat Ilitqusiat; the Iñupiaq words used in the interface
(*Paġlagivsi* — welcome, *Quyanaq* — thank you, *kiuġuyat* — the northern lights)
are drawn from public language resources. This is an homage, not an official
publication of any community.

The particle engine is based on the tutorial
[Interactive Particles with Three.js](https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/)
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
- A custom aurora colour-grade and ambient "curtain" drift in the vertex/fragment
  shaders ([`src/shaders/`](src/shaders/))
- A lightweight typographic overlay that opens with an Iñupiaq greeting and
  rotates through the values ([`src/scripts/ui/Overlay.js`](src/scripts/ui/Overlay.js)),
  with a CSS Arctic sky + drifting aurora ([`static/css/demo1.css`](static/css/demo1.css))
- GSAP for the show/hide tweens
- webpack + Babel for bundling
- glslify for shader imports

## License

MIT
