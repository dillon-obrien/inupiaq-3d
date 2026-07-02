// base particle shader @author brunoimbrizi / http://brunoimbrizi.com
// aurora (kiuġuyat) colour grading added for the Iñupiat Ilitqusiat tribute

precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vPUv;
varying vec2 vUv;
varying float vTouch;

// Map a luminance value to the colours of the Arctic aurora: deep teal in the
// shadows, living green through the mid-tones, cyan and pale violet at the peaks.
vec3 aurora(float t) {
	vec3 shadow  = vec3(0.02, 0.09, 0.13);
	vec3 teal    = vec3(0.02, 0.35, 0.34);
	vec3 green   = vec3(0.05, 0.85, 0.55);
	vec3 cyan    = vec3(0.45, 0.98, 0.86);
	vec3 crest   = vec3(0.82, 0.86, 1.00);

	vec3 c = mix(shadow, teal, smoothstep(0.0, 0.30, t));
	c = mix(c, green, smoothstep(0.25, 0.58, t));
	c = mix(c, cyan,  smoothstep(0.55, 0.82, t));
	c = mix(c, crest, smoothstep(0.82, 1.00, t));
	return c;
}

void main() {
	vec2 uv = vUv;
	vec2 puv = vPUv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);

	// luminance (keeps the portrait's tonal structure)
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

	// aurora colour from luminance
	vec3 col = aurora(grey);

	// slow shimmer, like curtains of light drifting across the sky
	float shimmer = 0.85 + 0.15 * sin(uTime * 0.8 + puv.y * 14.0 + puv.x * 4.0);
	col *= shimmer;

	// interaction flares toward bright cyan-white
	col = mix(col, vec3(0.85, 1.0, 1.0), clamp(vTouch, 0.0, 1.0) * 0.85);

	// soft circular sprite
	float border = 0.3;
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
	float t = smoothstep(0.0, border, dist);

	gl_FragColor = vec4(col, t);
}
