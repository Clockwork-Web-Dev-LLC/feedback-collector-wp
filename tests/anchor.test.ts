import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import {
  type Anchor,
  createAnchor,
  escapeCssIdentifier,
  isRenderable,
  isStableId,
  OVERLAY_HOST_ID,
  pinPoint,
  resolveAnchor,
} from '../src/overlay/anchor';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mount(html: string): void {
  document.body.innerHTML = html;
}

function q(selector: string): Element {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`fixture missing: ${selector}`);
  return el;
}

/** happy-dom performs no layout, so tests stub the box explicitly. */
function stubRect(el: Element, left: number, top: number, width: number, height: number): void {
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: (): DOMRect => new DOMRect(left, top, width, height),
  });
}

type ScrollKey = 'scrollX' | 'scrollY';
const savedScroll = new Map<ScrollKey, PropertyDescriptor | undefined>();

function stubScroll(x: number, y: number): void {
  const values: Record<ScrollKey, number> = { scrollX: x, scrollY: y };
  for (const key of ['scrollX', 'scrollY'] as const) {
    if (!savedScroll.has(key)) savedScroll.set(key, Object.getOwnPropertyDescriptor(window, key));
    Object.defineProperty(window, key, { configurable: true, value: values[key] });
  }
}

function restoreScroll(): void {
  for (const [key, descriptor] of savedScroll) {
    if (descriptor) Object.defineProperty(window, key, descriptor);
    else Reflect.deleteProperty(window, key);
  }
  savedScroll.clear();
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  restoreScroll();
});

// ---------------------------------------------------------------------------
// isStableId
// ---------------------------------------------------------------------------

describe('isStableId', () => {
  it('accepts human-authored ids', () => {
    const human = [
      'main-nav',
      'contact-form',
      'hero',
      'section-2',
      'step3',
      'h1-title',
      'site_footer',
      'section1',
      'heading2',
      'feature10',
      'testimonial3',
    ];
    for (const id of human) {
      expect({ id, stable: isStableId(id) }).toEqual({ id, stable: true });
    }
  });

  it('rejects generated ids across known patterns', () => {
    const generated = [
      '',
      'item-123456', // 5+ consecutive digits
      'a3f9c2e1', // hex hash
      'card-a3f9c2', // hex hash segment
      'elementor-element-1a2b3c4', // Elementor 7-char hex suffix
      'x7k2p9qz', // long non-hex alphanumeric soup
      'ember123',
      'react-select-2-input',
      '__next',
      'radix-:r3:',
      'headlessui-menu-button-1',
      'mui-1',
      'yui_3_5_1',
      'ext-gen12',
      ':r1:',
      '«r2»',
      '550e8400-e29b-41d4-a716-446655440000', // uuid
      '1hero', // leading digit
      'has space',
    ];
    for (const id of generated) {
      expect({ id, stable: isStableId(id) }).toEqual({ id, stable: false });
    }
  });
});

// ---------------------------------------------------------------------------
// Selector generation
// ---------------------------------------------------------------------------

describe('createAnchor selector generation', () => {
  it('anchors on a stable id and resolves via the id strategy', () => {
    mount('<nav id="main-nav"><a href="/">Home</a></nav>');
    const anchor = createAnchor(q('#main-nav'), 0, 0);
    expect(anchor.id).toBe('main-nav');
    expect(anchor.selector).toBe('#main-nav');
    expect(anchor.tag).toBe('nav');
    expect(resolveAnchor(anchor)).toEqual({ el: q('#main-nav'), strategy: 'id' });
  });

  it('roots the selector at a stable-id ancestor', () => {
    // A second p:nth-of-type(2) elsewhere forces the climb up to the id ancestor.
    mount('<section id="contact-form"><p>a</p><p>b</p></section><div><p>c</p><p>d</p></div>');
    const target = q('#contact-form > p:nth-of-type(2)');
    const anchor = createAnchor(target, 0, 0);
    expect(anchor.id).toBeNull();
    expect(anchor.selector).toBe('#contact-form > p:nth-of-type(2)');
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'selector' });
  });

  it('drops generated ids from both the anchor id and the selector', () => {
    mount('<div><span id="react-aria-9">x</span></div><div><span id="a3f9c2e1">y</span></div>');
    const target = q('#a3f9c2e1');
    const anchor = createAnchor(target, 0, 0);
    expect(anchor.id).toBeNull();
    expect(anchor.selector).not.toContain('#');
    expect(anchor.selector).not.toContain('a3f9c2e1');
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'selector' });
  });

  it('ignores a stable-looking id that is duplicated in the document', () => {
    mount('<div id="hero"><b>one</b></div><div id="hero"><b>two</b></div>');
    const second = document.querySelectorAll('div')[1];
    if (!second) throw new Error('fixture missing');
    const anchor = createAnchor(second, 0, 0);
    expect(anchor.id).toBeNull();
    expect(anchor.selector).not.toContain('#hero');
    expect(resolveAnchor(anchor).el).toBe(second);
  });

  it('prefers Elementor data-id over positional segments', () => {
    mount(
      '<div class="elementor-section elementor-element elementor-element-7f3a9b1" data-id="7f3a9b1">' +
        '<div><h2 class="elementor-heading-title">Hi</h2></div></div>',
    );
    const section = q('[data-id="7f3a9b1"]');
    const anchor = createAnchor(section, 0, 0);
    expect(anchor.selector).toBe('div[data-id="7f3a9b1"]');
    expect(resolveAnchor(anchor)).toEqual({ el: section, strategy: 'selector' });
  });

  it('ignores data-id on non-Elementor elements', () => {
    mount('<div><span data-id="slide1">a</span></div><div><span>b</span></div>');
    const anchor = createAnchor(q('[data-id="slide1"]'), 0, 0);
    expect(anchor.selector).not.toContain('data-id');
  });

  it('uses the Beaver Builder fl-node class and no other classes', () => {
    mount('<div class="fl-row fl-node-5c8d2e1a9b3f4 text-lg p-4"><p>x</p></div><div class="fl-row"><p>y</p></div>');
    const row = q('.fl-node-5c8d2e1a9b3f4');
    const anchor = createAnchor(row, 0, 0);
    expect(anchor.selector).toBe('div.fl-node-5c8d2e1a9b3f4');
    expect(anchor.selector).not.toContain('fl-row');
    expect(anchor.selector).not.toContain('text-lg');
    expect(resolveAnchor(anchor)).toEqual({ el: row, strategy: 'selector' });
  });

  it('does not treat the shared fl-node-content wrapper class as a node id', () => {
    mount(
      '<div class="fl-module fl-node-ab12cd34"><div class="fl-node-content"><p>a</p></div></div>' +
        '<div class="fl-module fl-node-ef56gh78"><div class="fl-node-content"><p>b</p></div></div>',
    );
    const wrapper = q('.fl-node-ef56gh78 > .fl-node-content');
    const anchor = createAnchor(wrapper, 0, 0);
    expect(anchor.selector).toBe('div.fl-node-ef56gh78 > div:nth-of-type(1)');
    expect(anchor.selector).not.toContain('fl-node-content');
    expect(resolveAnchor(anchor)).toEqual({ el: wrapper, strategy: 'selector' });
  });

  it('distinguishes same-tag siblings with nth-of-type', () => {
    mount('<ul><li>One</li><li>Two</li><li>Three</li></ul><ul><li>Four</li></ul>');
    const lis = document.querySelectorAll('li');
    const target = lis[1];
    if (!target) throw new Error('fixture missing');
    const anchor = createAnchor(target, 0, 0);
    expect(anchor.selector).toContain('li:nth-of-type(2)');
    expect(document.querySelectorAll(anchor.selector).length).toBe(1);
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'selector' });
  });

  it('builds absolute xpaths in the documented format', () => {
    mount('<div></div><div><section><a>1</a><a>2</a></section></div>');
    const target = document.querySelectorAll('a')[1];
    if (!target) throw new Error('fixture missing');
    expect(createAnchor(target, 0, 0).xpath).toBe('/html/body/div[2]/section[1]/a[2]');
  });

  it('round-trips a variety of elements', () => {
    mount(
      '<header id="site-header"><h1>Title</h1></header>' +
        '<main><article><p>A</p><p>B <em>em</em></p></article>' +
        '<div class="elementor-element" data-id="abc1234"><button>Go</button></div>' +
        '<svg><circle r="1"></circle></svg></main>',
    );
    for (const sel of ['h1', 'article > p:nth-of-type(2)', 'em', 'button', 'circle', 'main']) {
      const el = q(sel);
      const resolution = resolveAnchor(createAnchor(el, 0, 0));
      expect({ sel, same: resolution.el === el }).toEqual({ sel, same: true });
    }
  });

  it('escapes ids that need CSS escaping (native path) and the fallback escaper matches CSSOM', () => {
    mount('<div id="a.b"><i>x</i></div><div><i>y</i></div>');
    const anchor = createAnchor(q('i'), 0, 0);
    expect(anchor.selector).toBe('#a\\.b > i:nth-of-type(1)');
    expect(resolveAnchor(anchor)).toEqual({ el: q('i'), strategy: 'selector' });
    expect(escapeCssIdentifier('a.b')).toBe('a\\.b');
    expect(escapeCssIdentifier('-1x')).toBe('-\\31 x');
    expect(escapeCssIdentifier('-')).toBe('\\-');
    expect(escapeCssIdentifier('hero_1-é')).toBe('hero_1-é');
  });
});

// ---------------------------------------------------------------------------
// Resolution fallbacks
// ---------------------------------------------------------------------------

describe('resolveAnchor fallbacks', () => {
  it('survives a different-tag sibling inserted before the target (nth-of-type unaffected)', () => {
    mount('<div><p>Intro</p><p>Target text</p></div>');
    const target = q('div > p:nth-of-type(2)');
    const anchor = createAnchor(target, 0, 0);
    target.parentElement?.insertBefore(document.createElement('h3'), target.parentElement.firstChild);
    // Selector only counts <p>s, so it still resolves; xpath would too (it is per-tag indexed).
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'selector' });
  });

  it('keeps id/data-id anchors stable when a same-tag sibling is inserted before', () => {
    mount(
      '<div class="elementor-element" data-id="aa11bb2"><p>Keep me</p></div>' +
        '<div><p id="pricing">Price</p></div>',
    );
    const elementorP = q('[data-id="aa11bb2"] > p');
    const idP = q('#pricing');
    const elementorDiv = q('[data-id="aa11bb2"]');
    const a1 = createAnchor(elementorP, 0, 0);
    const a2 = createAnchor(idP, 0, 0);
    const a3 = createAnchor(elementorDiv, 0, 0);
    elementorP.before(document.createElement('p'));
    idP.before(document.createElement('p'));
    elementorDiv.before(document.createElement('div'));
    expect(resolveAnchor(a3)).toEqual({ el: elementorDiv, strategy: 'selector' });
    // The Elementor child selector is `div[data-id] > p:nth-of-type(1)`, which now
    // points at the inserted <p>. That is the documented positional caveat below.
    expect(a1.selector).toBe('div[data-id="aa11bb2"] > p:nth-of-type(1)');
    expect(resolveAnchor(a2)).toEqual({ el: idP, strategy: 'id' });
  });

  it('follows the original text when a same-tag sibling shifts a positional selector', () => {
    mount('<div><p>First</p><p>Second</p></div><div><p>Other</p></div>');
    const target = q('div > p:nth-of-type(2)');
    const anchor = createAnchor(target, 0, 0);
    const inserted = document.createElement('p');
    inserted.textContent = 'Inserted';
    target.parentElement?.insertBefore(inserted, target);
    // The selector now hits the inserted <p>, whose text differs, while exactly one
    // <p> still reads "Second" — the target moved, so the text match wins.
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'text' });
  });

  it('keeps a positional hit when the target text was edited and no other element carries the old text', () => {
    mount('<div><p>First</p><p>Second</p></div>');
    const target = q('div > p:nth-of-type(2)');
    const anchor = createAnchor(target, 0, 0);
    target.textContent = 'Second, reworded after feedback';
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'selector' });
  });

  it('falls back to xpath when the selector stops matching', () => {
    mount('<div><span>x</span></div>');
    const target = q('span');
    const anchor: Anchor = { ...createAnchor(target, 0, 0), selector: 'span.no-such-class' };
    expect(resolveAnchor(anchor)).toEqual({ el: target, strategy: 'xpath' });
  });

  it('falls back to unique text after the DOM is restructured', () => {
    mount('<div><div><button>Book a demo</button></div></div><button>Cancel</button>');
    const anchor = createAnchor(q('button'), 0, 0);
    document.body.innerHTML = '<section><aside><nav><button>Cancel</button></nav></aside>' +
      '<footer><button>  Book   a\n demo </button></footer></section>';
    const resolution = resolveAnchor(anchor);
    expect(resolution.strategy).toBe('text');
    expect(resolution.el?.textContent).toContain('Book');
  });

  it('returns none when text is ambiguous instead of guessing', () => {
    mount('<div><div><a>Read more</a></div></div>');
    const anchor = createAnchor(q('a'), 0, 0);
    document.body.innerHTML = '<p><a>Read more</a></p><p><a>Read more</a></p>';
    expect(resolveAnchor(anchor)).toEqual({ el: null, strategy: 'none' });
  });

  it('rejects candidates whose tag changed and falls through', () => {
    mount('<h2 id="hero">Welcome</h2>');
    const anchor = createAnchor(q('#hero'), 0, 0);
    document.body.innerHTML = '<div id="hero">Welcome</div><section><h2>Welcome</h2></section>';
    // id hits a <div> (wrong tag), selector "#hero" likewise, xpath /html/body/h2[1] misses,
    // text finds the single <h2>.
    const resolution = resolveAnchor(anchor);
    expect(resolution.strategy).toBe('text');
    expect(resolution.el?.localName).toBe('h2');
  });

  it('never returns an element inside the overlay host', () => {
    mount(`<p>Only on page</p><div id="${OVERLAY_HOST_ID}"><p id="contact-form">Leave feedback</p></div>`);
    const anchor = createAnchor(q('p'), 0, 0);
    // Rewrite the stored anchor so every strategy points into the overlay.
    const hostile: Anchor = {
      ...anchor,
      id: 'contact-form',
      selector: `#${OVERLAY_HOST_ID} > p`,
      xpath: '/html/body/div[1]/p[1]',
      text: 'Leave feedback',
    };
    expect(resolveAnchor(hostile)).toEqual({ el: null, strategy: 'none' });
  });

  it('does not count overlay elements toward text ambiguity', () => {
    mount(`<button>Submit</button><div id="${OVERLAY_HOST_ID}"><button>Submit</button></div>`);
    const anchor: Anchor = { ...createAnchor(q('button'), 0, 0), selector: 'nope', xpath: '/html/body/nope[1]' };
    expect(resolveAnchor(anchor)).toEqual({ el: q('body > button'), strategy: 'text' });
  });

  it('returns none for a removed element', () => {
    mount('<div><span id="badge">New</span></div>');
    const target = q('#badge');
    const anchor = createAnchor(target, 0, 0);
    target.remove();
    expect(resolveAnchor(anchor)).toEqual({ el: null, strategy: 'none' });
  });

  it('treats malformed stored selector and xpath as misses without throwing', () => {
    mount('<div><em>unique words</em></div>');
    const anchor: Anchor = { ...createAnchor(q('em'), 0, 0), selector: 'div >>> [', xpath: '//em[contains(.,"x")]' };
    expect(() => resolveAnchor(anchor)).not.toThrow();
    expect(resolveAnchor(anchor)).toEqual({ el: q('em'), strategy: 'text' });
  });

  it('resolves against an explicitly passed document', () => {
    const other = document.implementation.createHTMLDocument('other');
    other.body.innerHTML = '<main><h1>Other doc</h1></main>';
    const h1 = other.querySelector('h1');
    if (!h1) throw new Error('fixture missing');
    const anchor = createAnchor(h1, 0, 0);
    expect(resolveAnchor(anchor, other)).toEqual({ el: h1, strategy: 'selector' });
    expect(resolveAnchor(anchor).strategy).toBe('none');
  });
});

// ---------------------------------------------------------------------------
// Geometry, text, guards
// ---------------------------------------------------------------------------

describe('createAnchor geometry and text', () => {
  it('computes offsets as ratios and clamps clicks outside the box', () => {
    mount('<div id="hero">x</div>');
    const el = q('#hero');
    stubRect(el, 100, 50, 200, 100);
    const inside = createAnchor(el, 150, 75);
    expect(inside.offsetX).toBeCloseTo(0.25);
    expect(inside.offsetY).toBeCloseTo(0.25);
    const outside = createAnchor(el, 1000, -40);
    expect(outside.offsetX).toBe(1);
    expect(outside.offsetY).toBe(0);
  });

  it('uses 0.5 offsets for a zero-size box', () => {
    mount('<div id="hero">x</div>');
    const anchor = createAnchor(q('#hero'), 10, 10);
    expect(anchor.offsetX).toBe(0.5);
    expect(anchor.offsetY).toBe(0.5);
  });

  it('adds window scroll to document coordinates', () => {
    mount('<div id="hero">x</div>');
    stubScroll(30, 400);
    const anchor = createAnchor(q('#hero'), 12, 20);
    expect(anchor.docX).toBe(42);
    expect(anchor.docY).toBe(420);
  });

  it('normalizes whitespace, truncates to 120 chars, and nulls empty text', () => {
    const long = 'word '.repeat(60);
    mount(`<p id="long">\n  ${long}\t</p><p id="spacey">  a \n\n  b  </p><p id="empty">  \n </p>`);
    const longText = createAnchor(q('#long'), 0, 0).text;
    expect(longText?.length).toBe(120);
    expect(longText).toBe(long.trim().slice(0, 120));
    expect(createAnchor(q('#spacey'), 0, 0).text).toBe('a b');
    expect(createAnchor(q('#empty'), 0, 0).text).toBeNull();
  });

  it('throws when asked to anchor the overlay, a detached node, or bad coordinates', () => {
    mount(`<div id="${OVERLAY_HOST_ID}"><button>Pin</button></div><p id="hero">x</p>`);
    expect(() => createAnchor(q(`#${OVERLAY_HOST_ID} button`), 0, 0)).toThrow(/fbc-root/);
    expect(() => createAnchor(q(`#${OVERLAY_HOST_ID}`), 0, 0)).toThrow(/fbc-root/);
    expect(() => createAnchor(document.createElement('div'), 0, 0)).toThrow(/not connected/);
    expect(() => createAnchor(q('#hero'), Number.NaN, 0)).toThrow(RangeError);
  });

  it('refuses elements inside the overlay shadow root and other shadow roots', () => {
    mount(`<div id="${OVERLAY_HOST_ID}"></div><div id="widget"></div>`);
    const overlayShadow = q(`#${OVERLAY_HOST_ID}`).attachShadow({ mode: 'open' });
    overlayShadow.innerHTML = '<button>Pin</button>';
    const widgetShadow = q('#widget').attachShadow({ mode: 'open' });
    widgetShadow.innerHTML = '<span>inner</span>';
    const pinButton = overlayShadow.querySelector('button');
    const inner = widgetShadow.querySelector('span');
    if (!pinButton || !inner) throw new Error('fixture missing');
    expect(() => createAnchor(pinButton, 0, 0)).toThrow(/fbc-root/);
    expect(() => createAnchor(inner, 0, 0)).toThrow(/shadow root/);
  });
});

describe('isRenderable', () => {
  it('is true for a connected, visible element with a box', () => {
    mount('<div><span id="hero">x</span></div>');
    const el = q('#hero');
    stubRect(el, 0, 0, 10, 10);
    expect(isRenderable(el)).toBe(true);
  });

  it('is false under a display:none ancestor', () => {
    mount('<div style="display:none"><section><span id="hero">x</span></section></div>');
    const el = q('#hero');
    stubRect(el, 0, 0, 10, 10);
    expect(isRenderable(el)).toBe(false);
  });

  it('is false for visibility:hidden, own or inherited', () => {
    mount('<span id="own" style="visibility:hidden">x</span><div style="visibility:hidden"><b id="kid">y</b></div>');
    for (const sel of ['#own', '#kid']) {
      const el = q(sel);
      stubRect(el, 0, 0, 10, 10);
      expect({ sel, renderable: isRenderable(el) }).toEqual({ sel, renderable: false });
    }
  });

  it('is true when a child overrides an ancestor visibility:hidden', () => {
    mount('<div style="visibility:hidden"><b id="kid" style="visibility:visible">y</b></div>');
    const el = q('#kid');
    stubRect(el, 0, 0, 10, 10);
    expect(isRenderable(el)).toBe(true);
  });

  it('is false for a zero-size box but true when only one dimension is zero', () => {
    mount('<hr id="rule"><span id="hero">x</span>');
    expect(isRenderable(q('#hero'))).toBe(false); // happy-dom default: 0x0
    const rule = q('#rule');
    stubRect(rule, 0, 0, 300, 0);
    expect(isRenderable(rule)).toBe(true);
  });

  it('is false for a disconnected element', () => {
    const el = document.createElement('div');
    stubRect(el, 0, 0, 10, 10);
    expect(isRenderable(el)).toBe(false);
  });
});

describe('pinPoint', () => {
  it('returns document coordinates from rect, scroll, and offsets', () => {
    mount('<div id="hero">x</div>');
    const el = q('#hero');
    stubRect(el, 100, 50, 200, 80);
    stubScroll(10, 300);
    expect(pinPoint(el, { offsetX: 0.25, offsetY: 0.5 })).toEqual({ x: 160, y: 390 });
  });

  it('clamps out-of-range offsets and centers non-finite ones', () => {
    mount('<div id="hero">x</div>');
    const el = q('#hero');
    stubRect(el, 0, 0, 100, 100);
    expect(pinPoint(el, { offsetX: 2, offsetY: -1 })).toEqual({ x: 100, y: 0 });
    expect(pinPoint(el, { offsetX: Number.NaN, offsetY: Number.POSITIVE_INFINITY })).toEqual({ x: 50, y: 50 });
  });

  it('round-trips createAnchor offsets back to the click point', () => {
    mount('<div id="hero">x</div>');
    const el = q('#hero');
    stubRect(el, 40, 60, 120, 90);
    stubScroll(5, 700);
    const anchor = createAnchor(el, 70, 105);
    const point = pinPoint(el, anchor);
    expect(point.x).toBeCloseTo(anchor.docX);
    expect(point.y).toBeCloseTo(anchor.docY);
  });
});
