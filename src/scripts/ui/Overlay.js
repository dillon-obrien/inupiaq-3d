/**
 * Overlay
 *
 * Drives the typographic layer of the tribute: an opening Iñupiaq greeting,
 * then a slow rotation through the Iñupiat Ilitqusiat — the values articulated
 * by Iñupiaq elders (originally in Kotzebue, Alaska) that define the Iñupiat
 * way of life. The glosses below are short, respectful paraphrases of their
 * commonly published meanings.
 */

const VALUES = [
	{ name: 'Respect for Elders', gloss: 'We honour those who carry the knowledge of generations.' },
	{ name: 'Sharing', gloss: 'What the land gives, we share with the whole community.' },
	{ name: 'Cooperation', gloss: 'We work together; survival on the ice is never a solo act.' },
	{ name: 'Respect for Nature', gloss: 'The land, the sea, and the animals are relatives, not resources.' },
	{ name: 'Humility', gloss: 'We carry our skills quietly and let our actions speak.' },
	{ name: 'Love for Children', gloss: 'Our children are the future we are always working toward.' },
	{ name: 'Hard Work', gloss: 'Steady effort feeds the family and strengthens the community.' },
	{ name: 'Humor', gloss: 'Laughter keeps us warm through the longest nights.' },
	{ name: "Hunter's Success", gloss: 'A good hunter provides, and shares the catch with all.' },
	{ name: 'Knowledge of Family Tree', gloss: 'We know who we are by knowing where we come from.' },
	{ name: 'Avoidance of Conflict', gloss: 'We keep the peace so the community stays whole.' },
	{ name: 'Responsibility to Tribe', gloss: 'Each of us answers to all of the others.' },
	{ name: 'Spirituality', gloss: 'We live with respect for the spirit in all things.' },
	{ name: 'Family & Kinship', gloss: 'Kinship binds us across generations and villages.' },
	{ name: 'Knowledge of Language', gloss: 'Iñupiaq carries the worldview of our people.' },
	{ name: 'Compassion', gloss: 'We care for one another, especially in hardship.' },
];

const INTRO_HOLD = 2600;   // how long the greeting lingers
const INTRO_FADE = 1200;   // greeting fade-out duration
const VALUE_HOLD = 5200;   // how long each value stays on screen
const VALUE_FADE = 900;    // per-value cross-fade duration

export default class Overlay {

	constructor() {
		this.intro = document.getElementById('intro');
		this.head = document.getElementById('head');
		this.foot = document.getElementById('foot');
		this.valueText = document.getElementById('value-text');
		this.valueGloss = document.getElementById('value-gloss');

		this.index = 0;
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
			this._showValue(this.index);
			this._every(VALUE_HOLD, () => this._advance());
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
			this._showValue(this.index);
			this._every(VALUE_HOLD, () => this._advance());
		});
	}

	// ---------------------------------------------------------------------------

	_advance() {
		// fade current out, swap text, fade next in
		this.valueText.classList.remove('is-visible');
		this.valueGloss.classList.remove('is-visible');

		this._after(VALUE_FADE, () => {
			this.index = (this.index + 1) % VALUES.length;
			this._showValue(this.index);
		});
	}

	_showValue(i) {
		const value = VALUES[i];
		this.valueText.textContent = value.name;
		this.valueGloss.textContent = value.gloss;
		// next frame so the transition plays
		requestAnimationFrame(() => {
			this.valueText.classList.add('is-visible');
			this.valueGloss.classList.add('is-visible');
		});
	}

	_reveal(el) {
		if (el) el.classList.add('is-visible');
	}

	_after(ms, fn) {
		this.timers.push(setTimeout(fn, ms));
	}

	_every(ms, fn) {
		this.timers.push(setInterval(fn, ms));
	}

	destroy() {
		this.timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
		this.timers = [];
	}
}
