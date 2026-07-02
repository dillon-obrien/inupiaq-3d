/**
 * Overlay
 *
 * Drives the typographic layer of the tribute: an opening Iñupiaq greeting,
 * then a slow rotation through the Iñupiat Ilitqusiat — the values articulated
 * by Iñupiaq elders (originally in Kotzebue, Alaska) that define the Iñupiat
 * way of life. The glosses below are short, respectful paraphrases of their
 * commonly published meanings.
 *
 * The values are synced to the images: each frame surfaces the values that
 * belong to it, so the words and the picture tell the same story.
 */

const V = {
	elders:     { name: 'Respect for Elders', gloss: 'We honour those who carry the knowledge of generations.' },
	sharing:    { name: 'Sharing', gloss: 'What the land gives, we share with the whole community.' },
	cooperation:{ name: 'Cooperation', gloss: 'We work together; survival on the ice is never a solo act.' },
	nature:     { name: 'Respect for Nature', gloss: 'The land, the sea, and the animals are relatives, not resources.' },
	humility:   { name: 'Humility', gloss: 'We carry our skills quietly and let our actions speak.' },
	children:   { name: 'Love for Children', gloss: 'Our children are the future we are always working toward.' },
	hardWork:   { name: 'Hard Work', gloss: 'Steady effort feeds the family and strengthens the community.' },
	humor:      { name: 'Humor', gloss: 'Laughter keeps us warm through the longest nights.' },
	hunter:     { name: "Hunter's Success", gloss: 'A good hunter provides, and shares the catch with all.' },
	familyTree: { name: 'Knowledge of Family Tree', gloss: 'We know who we are by knowing where we come from.' },
	conflict:   { name: 'Avoidance of Conflict', gloss: 'We keep the peace so the community stays whole.' },
	tribe:      { name: 'Responsibility to Tribe', gloss: 'Each of us answers to all of the others.' },
	spirit:     { name: 'Spirituality', gloss: 'We live with respect for the spirit in all things.' },
	family:     { name: 'Family & Kinship', gloss: 'Kinship binds us across generations and villages.' },
	language:   { name: 'Knowledge of Language', gloss: 'Iñupiaq carries the worldview of our people.' },
	compassion: { name: 'Compassion', gloss: 'We care for one another, especially in hardship.' },
};

// One frame per image — caption + the values that belong to it. Keep aligned
// with `samples` in src/scripts/webgl/WebGLView.js. Aġviq (the bowhead whale),
// umiaq (the open skin boat) and qajaq (kayak) are well-documented Iñupiaq terms.
const FRAMES = [
	{
		// the family
		caption: 'An Iñupiat family — Noatak, Alaska, c. 1929',
		values: [V.family, V.children, V.familyTree, V.language],
	},
	{
		// the lone hunter in his qajaq
		caption: 'A hunter in his qajaq — Noatak, Alaska, c. 1929',
		values: [V.hunter, V.hardWork, V.humility, V.spirit],
	},
	{
		// the umiaq crews working as one on the hunt
		caption: 'Umiaq crews on the whale hunt — Bering Strait, c. 1906',
		values: [V.cooperation, V.tribe, V.conflict, V.elders],
	},
	{
		// aġviq, the whale, shared with the whole village at the feast
		caption: 'Aġviq, the bowhead — the whale that feeds the village',
		values: [V.sharing, V.nature, V.compassion, V.humor],
	},
];

const INTRO_HOLD = 2600;   // how long the greeting lingers
const INTRO_FADE = 1200;   // greeting fade-out duration
const VALUE_HOLD = 5200;   // how long each value stays on screen
const VALUE_FADE = 900;    // per-value cross-fade duration
const CAPTION_FADE = 500;  // caption cross-fade duration

export default class Overlay {

	constructor() {
		this.intro = document.getElementById('intro');
		this.head = document.getElementById('head');
		this.foot = document.getElementById('foot');
		this.valueText = document.getElementById('value-text');
		this.valueGloss = document.getElementById('value-gloss');
		this.caption = document.getElementById('caption');

		this.imageIndex = 0;   // which frame (image) is showing
		this.valueIndex = 0;   // position within that frame's value set
		this.started = false;  // has the value rotation begun?
		this.rotationTimer = null;
		this.timers = [];

		// respect users who prefer reduced motion: skip the intro choreography
		this.reducedMotion = window.matchMedia
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	start() {
		if (!this.valueText) return;

		if (this.reducedMotion) {
			this._reveal(this.head);
			this._reveal(this.foot);
			this._beginRotation();
			return;
		}

		// greeting in
		this._after(60, () => this.intro && this.intro.classList.add('is-visible'));
		// greeting out
		this._after(INTRO_HOLD, () => this.intro && this.intro.classList.remove('is-visible'));
		// reveal the rest and begin the rotation
		this._after(INTRO_HOLD + INTRO_FADE, () => {
			if (this.intro) this.intro.style.display = 'none';
			this._reveal(this.head);
			this._reveal(this.foot);
			this._beginRotation();
		});
	}

	/**
	 * Switch to a frame: cross-fade its caption and, once the rotation is
	 * running, cross-fade the values over to that frame's set. Safe to call
	 * before start() — it just records the frame for when the rotation begins.
	 */
	setImage(index) {
		if (index == null || index < 0 || index >= FRAMES.length) return;
		this.imageIndex = index;
		this._setCaption(FRAMES[index].caption);

		if (!this.started) return;

		// fade the current value out, then restart the rotation on the new set
		this.valueText.classList.remove('is-visible');
		this.valueGloss.classList.remove('is-visible');
		this._after(VALUE_FADE, () => this._beginRotation());
	}

	// ---------------------------------------------------------------------------

	_beginRotation() {
		this.started = true;
		this._clearRotation();
		this.valueIndex = 0;
		this._showValue();
		this.rotationTimer = setInterval(() => this._advance(), VALUE_HOLD);
	}

	_advance() {
		// fade current out, swap text, fade next value in (within this frame)
		this.valueText.classList.remove('is-visible');
		this.valueGloss.classList.remove('is-visible');

		this._after(VALUE_FADE, () => {
			const values = this._currentValues();
			this.valueIndex = (this.valueIndex + 1) % values.length;
			this._showValue();
		});
	}

	_showValue() {
		const value = this._currentValues()[this.valueIndex];
		if (!value) return;
		this.valueText.textContent = value.name;
		this.valueGloss.textContent = value.gloss;
		// next frame so the transition plays
		requestAnimationFrame(() => {
			this.valueText.classList.add('is-visible');
			this.valueGloss.classList.add('is-visible');
		});
	}

	_currentValues() {
		return (FRAMES[this.imageIndex] || FRAMES[0]).values;
	}

	_setCaption(text) {
		if (!this.caption) return;

		// not on screen yet: set text, the footer reveal shows it
		if (!this.caption.classList.contains('is-visible')) {
			this.caption.textContent = text;
			this.caption.classList.add('is-visible');
			return;
		}

		this.caption.classList.remove('is-visible');
		this._after(CAPTION_FADE, () => {
			this.caption.textContent = text;
			this.caption.classList.add('is-visible');
		});
	}

	_reveal(el) {
		if (el) el.classList.add('is-visible');
	}

	_after(ms, fn) {
		this.timers.push(setTimeout(fn, ms));
	}

	_clearRotation() {
		if (this.rotationTimer) {
			clearInterval(this.rotationTimer);
			this.rotationTimer = null;
		}
	}

	destroy() {
		this._clearRotation();
		this.timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
		this.timers = [];
	}
}
