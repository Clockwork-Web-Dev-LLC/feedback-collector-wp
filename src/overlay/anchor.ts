/**
 * Element-anchoring engine for the Feedback Collector overlay.
 *
 * createAnchor() captures a serializable description of a clicked element;
 * resolveAnchor() re-finds it later with a strict fallback chain
 * (id -> selector -> xpath -> text). Resolution never guesses: an ambiguous or
 * missing match returns { el: null, strategy: 'none' } so the UI can show the
 * item as "orphaned".
 *
 * Everything here is pure (no import-time side effects, no dependencies) and
 * reads the window/document from the element itself so it works for
 * documents other than the global one.
 */

export interface Anchor {
  id: string | null;
  selector: string;
  xpath: string;
  text: string | null;
  tag: string;
  offsetX: number;
  offsetY: number;
  docX: number;
  docY: number;
}

export type Strategy = 'id' | 'selector' | 'xpath' | 'text';
export type Resolution = { el: Element; strategy: Strategy } | { el: null; strategy: 'none' };

export const OVERLAY_HOST_ID = 'fbc-root';

const MAX_TEXT_LENGTH = 120;

// ---------------------------------------------------------------------------
// Stable-id heuristics
// ---------------------------------------------------------------------------

const GENERATED_PREFIXES: readonly string[] = [
  'ember',
  'react-',
  '__next',
  'radix-',
  'headlessui-',
  'mui-',
  'yui_',
  'ext-gen',
];

const UUID_PATTERN = /[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i;
// React useId() output: ":r1:", ":R2d3:", and React 19's "«r1»".
const REACT_USE_ID_PATTERN = /^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;

function isHashLikeSegment(segment: string): boolean {
  const hasLetter = /[a-z]/i.test(segment);
  const hasDigit = /[0-9]/.test(segment);
  if (!hasLetter || !hasDigit) return false;
  if (segment.length >= 6 && /^[0-9a-f]+$/i.test(segment)) return true;
  // Long non-hex alphanumeric soup (e.g. "x7k2p9qz") is also generated. Require
  // 2+ letter/digit transitions so "section10" / "feature12" stay human.
  return segment.length >= 8 && /^[0-9a-z]+$/i.test(segment) && letterDigitTransitions(segment) >= 2;
}

function letterDigitTransitions(segment: string): number {
  let transitions = 0;
  for (let i = 1; i < segment.length; i++) {
    const prevIsDigit = /[0-9]/.test(segment.charAt(i - 1));
    const currIsDigit = /[0-9]/.test(segment.charAt(i));
    if (prevIsDigit !== currIsDigit) transitions++;
  }
  return transitions;
}

/** True when an id looks hand-authored and therefore safe to persist. */
export function isStableId(id: string): boolean {
  if (id.trim() === '' || /\s/.test(id)) return false;
  if (/^[0-9]/.test(id)) return false;
  if (/[0-9]{5,}/.test(id)) return false;
  if (UUID_PATTERN.test(id)) return false;
  if (REACT_USE_ID_PATTERN.test(id)) return false;
  const lower = id.toLowerCase();
  if (GENERATED_PREFIXES.some((prefix) => lower.startsWith(prefix))) return false;
  return !id.split(/[-_:.]/).some(isHashLikeSegment);
}

// ---------------------------------------------------------------------------
// Small DOM helpers
// ---------------------------------------------------------------------------

interface CssNamespace {
  escape?: (value: string) => string;
}

/**
 * CSSOM `CSS.escape` algorithm, used when the runtime does not provide one.
 * Exported so the fallback itself is testable.
 */
export function escapeCssIdentifier(value: string): string {
  let result = '';
  const length = value.length;
  const firstCode = value.charCodeAt(0);
  for (let i = 0; i < length; i++) {
    const code = value.charCodeAt(i);
    const char = value.charAt(i);
    if (code === 0x0000) {
      result += '�';
    } else if (
      (code >= 0x0001 && code <= 0x001f) ||
      code === 0x007f ||
      (i === 0 && code >= 0x0030 && code <= 0x0039) ||
      (i === 1 && code >= 0x0030 && code <= 0x0039 && firstCode === 0x002d)
    ) {
      result += `\\${code.toString(16)} `;
    } else if (i === 0 && length === 1 && code === 0x002d) {
      result += `\\${char}`;
    } else if (
      code >= 0x0080 ||
      code === 0x002d ||
      code === 0x005f ||
      (code >= 0x0030 && code <= 0x0039) ||
      (code >= 0x0041 && code <= 0x005a) ||
      (code >= 0x0061 && code <= 0x007a)
    ) {
      result += char;
    } else {
      result += `\\${char}`;
    }
  }
  return result;
}

function cssEscape(value: string, view: Window | null): string {
  const viewCss = view ? (view as unknown as { CSS?: CssNamespace }).CSS : undefined;
  const globalCss = (globalThis as { CSS?: CssNamespace }).CSS;
  const native = viewCss?.escape ?? globalCss?.escape;
  return native ? native(value) : escapeCssIdentifier(value);
}

function escapeAttributeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function lowerTag(el: Element): string {
  return el.localName.toLowerCase();
}

function viewOf(el: Element): Window | null {
  return el.ownerDocument.defaultView;
}

function scrollOf(view: Window | null): { x: number; y: number } {
  if (!view) return { x: 0, y: 0 };
  const x = Number.isFinite(view.scrollX) ? view.scrollX : 0;
  const y = Number.isFinite(view.scrollY) ? view.scrollY : 0;
  return { x, y };
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0, value));
}

/**
 * True if the element is the overlay host or lives anywhere beneath it,
 * including inside the host's shadow root.
 */
function isInsideOverlay(el: Element): boolean {
  let node: Element | null = el;
  while (node) {
    if (node.id === OVERLAY_HOST_ID) return true;
    if (node.parentElement) {
      node = node.parentElement;
    } else {
      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }
  }
  return false;
}

function normalizeText(raw: string | null): string | null {
  if (raw === null) return null;
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed === '') return null;
  // Truncate by code point so a surrogate pair is never split.
  const codePoints = Array.from(collapsed);
  return codePoints.length > MAX_TEXT_LENGTH ? codePoints.slice(0, MAX_TEXT_LENGTH).join('') : collapsed;
}

// ---------------------------------------------------------------------------
// Selector generation
// ---------------------------------------------------------------------------

// `fl-node-content` is a shared inner-wrapper class, not a node id.
const BEAVER_BUILDER_NODE_CLASS = /^fl-node-(?!content$)[a-z0-9]+$/i;
const ELEMENTOR_DATA_ID = /^[a-z0-9]+$/i;

function nthOfType(el: Element): number {
  let index = 1;
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.localName === el.localName && sibling.namespaceURI === el.namespaceURI) index++;
    sibling = sibling.previousElementSibling;
  }
  return index;
}

/** Selector for an id, or null if the id is unstable or not unique in the document. */
function uniqueStableIdSelector(el: Element, doc: Document): string | null {
  if (!el.id || !isStableId(el.id)) return null;
  const selector = `#${cssEscape(el.id, doc.defaultView)}`;
  const matches = doc.querySelectorAll(selector);
  return matches.length === 1 && matches[0] === el ? selector : null;
}

/** One selector segment for a node that is not anchored by an id. */
function segmentFor(el: Element, doc: Document): string {
  if (el === doc.documentElement) return 'html';
  const tag = el.localName;
  const dataId = el.getAttribute('data-id');
  if (dataId !== null && el.classList.contains('elementor-element') && ELEMENTOR_DATA_ID.test(dataId)) {
    return `${tag}[data-id="${escapeAttributeValue(dataId)}"]`;
  }
  const flNode = Array.from(el.classList).find((cls) => BEAVER_BUILDER_NODE_CLASS.test(cls));
  if (flNode !== undefined) {
    return `${tag}.${cssEscape(flNode, doc.defaultView)}`;
  }
  return `${tag}:nth-of-type(${nthOfType(el)})`;
}

function selectsOnly(selector: string, el: Element, doc: Document): boolean {
  const matches = doc.querySelectorAll(selector);
  return matches.length === 1 && matches[0] === el;
}

function buildSelector(el: Element, doc: Document): string {
  const segments: string[] = [];
  let node: Element | null = el;
  while (node) {
    const idSelector = uniqueStableIdSelector(node, doc);
    if (idSelector !== null) {
      segments.unshift(idSelector);
      return segments.join(' > ');
    }
    segments.unshift(segmentFor(node, doc));
    const candidate = segments.join(' > ');
    if (selectsOnly(candidate, el, doc)) return candidate;
    node = node.parentElement;
  }
  // Reached past <html>: the full path is the most specific selector we can build.
  return segments.join(' > ');
}

// ---------------------------------------------------------------------------
// XPath generation and resolution
// ---------------------------------------------------------------------------

/**
 * Absolute path like /html/body/div[2]/section[1]/a[1]. <html> and its direct
 * <head>/<body> children carry no index (there is only ever one); every other
 * step is indexed among same-tag siblings. Tags are lowercase localNames,
 * which also covers namespaced (SVG) elements.
 */
function buildXPath(el: Element, doc: Document): string {
  const steps: string[] = [];
  let node: Element | null = el;
  while (node) {
    const tag = lowerTag(node);
    const parent: Element | null = node.parentElement;
    const unindexed =
      node === doc.documentElement || (parent === doc.documentElement && (tag === 'head' || tag === 'body'));
    steps.unshift(unindexed ? tag : `${tag}[${nthOfType(node)}]`);
    node = parent;
  }
  return `/${steps.join('/')}`;
}

const XPATH_GRAMMAR = /^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i;
const XPATH_STEP = /^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;

/**
 * Walks an absolute path in the format buildXPath() emits. A hand-rolled walker
 * is used instead of document.evaluate because (a) happy-dom lacks evaluate,
 * and (b) evaluate would not match SVG steps by bare name in HTML documents.
 * Returns null for anything outside that grammar.
 */
function walkXPath(xpath: string, doc: Document): Element | null {
  if (!XPATH_GRAMMAR.test(xpath)) return null;
  const steps = xpath.slice(1).split('/');
  let current: Element | null = null;
  for (const step of steps) {
    const match = XPATH_STEP.exec(step);
    if (!match) return null;
    const tag = (match[1] ?? '').toLowerCase();
    const wanted = match[2] === undefined ? 1 : Number(match[2]);
    const children: Element[] = current ? Array.from(current.children) : doc.documentElement ? [doc.documentElement] : [];
    let seen = 0;
    let next: Element | null = null;
    for (const child of children) {
      if (lowerTag(child) !== tag) continue;
      seen++;
      if (seen === wanted) {
        next = child;
        break;
      }
    }
    if (!next) return null;
    current = next;
  }
  return current;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Capture an anchor for `el` at the given viewport click position.
 * Throws for programming errors: non-finite coordinates, disconnected
 * elements, overlay elements, or elements inside a shadow root (which no
 * document-level selector can reach; the caller should retarget to the host).
 */
export function createAnchor(el: Element, clientX: number, clientY: number): Anchor {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new RangeError(`createAnchor: click coordinates must be finite (got ${clientX}, ${clientY})`);
  }
  if (!el.isConnected) {
    throw new Error('createAnchor: element is not connected to a document');
  }
  if (isInsideOverlay(el)) {
    throw new Error(`createAnchor: refusing to anchor an element inside #${OVERLAY_HOST_ID}`);
  }
  const doc = el.ownerDocument;
  if (el.getRootNode() !== doc) {
    throw new Error('createAnchor: element is inside a shadow root; anchor its shadow host instead');
  }

  const rect = el.getBoundingClientRect();
  const scroll = scrollOf(doc.defaultView);
  const offsetX = rect.width > 0 ? clampRatio((clientX - rect.left) / rect.width) : 0.5;
  const offsetY = rect.height > 0 ? clampRatio((clientY - rect.top) / rect.height) : 0.5;

  return {
    id: uniqueStableIdSelector(el, doc) !== null ? el.id : null,
    selector: buildSelector(el, doc),
    xpath: buildXPath(el, doc),
    text: normalizeText(el.textContent),
    tag: lowerTag(el),
    offsetX,
    offsetY,
    docX: clientX + scroll.x,
    docY: clientY + scroll.y,
  };
}

function acceptable(candidate: Element | null, tag: string): candidate is Element {
  return candidate !== null && lowerTag(candidate) === tag && !isInsideOverlay(candidate);
}

function isSelectorSyntaxError(error: unknown): boolean {
  return error instanceof DOMException || (error instanceof Error && error.name === 'SyntaxError');
}

function resolveById(anchor: Anchor, doc: Document): Element | null {
  if (typeof anchor.id !== 'string' || anchor.id === '') return null;
  const el = doc.getElementById(anchor.id);
  if (!el) return null;
  // Duplicate ids make getElementById pick the first one silently; refuse instead.
  const sameId = doc.querySelectorAll(`#${cssEscape(anchor.id, doc.defaultView)}`);
  return sameId.length === 1 ? el : null;
}

function resolveBySelector(anchor: Anchor, doc: Document): Element | null {
  if (typeof anchor.selector !== 'string' || anchor.selector.trim() === '') return null;
  let matches: NodeListOf<Element>;
  try {
    matches = doc.querySelectorAll(anchor.selector);
  } catch (error) {
    // A stored selector that no longer parses is a miss for this strategy, not a
    // fatal error: the remaining strategies still get their chance.
    if (isSelectorSyntaxError(error)) return null;
    throw error;
  }
  return matches.length === 1 ? (matches[0] ?? null) : null;
}

function resolveByXPath(anchor: Anchor, doc: Document): Element | null {
  if (typeof anchor.xpath !== 'string') return null;
  return walkXPath(anchor.xpath, doc);
}

function resolveByText(anchor: Anchor, doc: Document): Element | null {
  if (typeof anchor.text !== 'string' || anchor.text === '') return null;
  let found: Element | null = null;
  for (const candidate of Array.from(doc.getElementsByTagName('*'))) {
    if (lowerTag(candidate) !== anchor.tag || isInsideOverlay(candidate)) continue;
    if (normalizeText(candidate.textContent) !== anchor.text) continue;
    if (found) return null; // Ambiguous: never guess.
    found = candidate;
  }
  return found;
}

/** Re-find the anchored element. Never returns overlay elements; never guesses. */
export function resolveAnchor(anchor: Anchor, doc: Document = document): Resolution {
  if (typeof anchor.tag !== 'string' || anchor.tag === '') return { el: null, strategy: 'none' };
  const tag = anchor.tag.toLowerCase();

  const byId = resolveById(anchor, doc);
  if (acceptable(byId, tag)) return { el: byId, strategy: 'id' };

  // Selector and XPath are positional, so a same-tag sibling inserted before the
  // target shifts them onto the wrong element. When a positional hit's text no
  // longer matches but exactly one element still carries the original text, the
  // element moved; follow the text. If nothing else carries it, the target's own
  // copy was edited and the positional hit stands.
  let byText: Element | null | undefined;
  const textMatch = (): Element | null => {
    if (byText === undefined) byText = resolveByText({ ...anchor, tag }, doc);
    return acceptable(byText, tag) ? byText : null;
  };
  const drifted = (el: Element): Element | null => {
    if (anchor.text === null || normalizeText(el.textContent) === anchor.text) return null;
    const moved = textMatch();
    return moved && moved !== el ? moved : null;
  };

  const bySelector = resolveBySelector(anchor, doc);
  if (acceptable(bySelector, tag)) {
    const moved = drifted(bySelector);
    return moved ? { el: moved, strategy: 'text' } : { el: bySelector, strategy: 'selector' };
  }

  const byXPath = resolveByXPath(anchor, doc);
  if (acceptable(byXPath, tag)) {
    const moved = drifted(byXPath);
    return moved ? { el: moved, strategy: 'text' } : { el: byXPath, strategy: 'xpath' };
  }

  const text = textMatch();
  if (text) return { el: text, strategy: 'text' };

  return { el: null, strategy: 'none' };
}

/**
 * Cheap visibility check: connected, no display:none on the element or any
 * ancestor, not visibility:hidden/collapse (visibility inherits, so the
 * element's own computed value is authoritative), and a non-empty box.
 */
export function isRenderable(el: Element): boolean {
  if (!el.isConnected) return false;
  const view = viewOf(el);
  if (!view) return false; // Documents without a window (DOMParser etc.) are never rendered.

  const own = view.getComputedStyle(el);
  if (own.visibility === 'hidden' || own.visibility === 'collapse') return false;

  let node: Element | null = el;
  while (node) {
    if (view.getComputedStyle(node).display === 'none') return false;
    node = node.parentElement;
  }

  const rect = el.getBoundingClientRect();
  return !(rect.width === 0 && rect.height === 0);
}

/** Document coordinates for a pin at the anchor's relative offset within `el`. */
export function pinPoint(el: Element, anchor: Pick<Anchor, 'offsetX' | 'offsetY'>): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  const scroll = scrollOf(viewOf(el));
  return {
    x: rect.left + scroll.x + clampRatio(anchor.offsetX) * rect.width,
    y: rect.top + scroll.y + clampRatio(anchor.offsetY) * rect.height,
  };
}
