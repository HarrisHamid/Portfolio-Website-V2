/**
 * icons.js — custom line icons to replace emojis
 * Icons: calendar, pin, gradcap, building, rocket
 * All icons use stroke="currentColor", so they inherit the text color
 * (teal on your job card, orange on your education card) automatically.
 */

const ICON_PATHS = {
  // 🗓️ 🗒️ 📅 📆
  calendar: `
    <rect x="3" y="5" width="18" height="16" rx="3"/>
    <path d="M3 10h18"/>
    <path d="M8 3v4M16 3v4"/>
    <circle cx="8" cy="14.5" r=".6" fill="currentColor"/>
    <circle cx="12" cy="14.5" r=".6" fill="currentColor"/>
    <circle cx="16" cy="14.5" r=".6" fill="currentColor"/>
    <circle cx="8" cy="18" r=".6" fill="currentColor"/>
    <circle cx="12" cy="18" r=".6" fill="currentColor"/>`,

  // 📍
  pin: `
    <path d="M12 21.5s7-6.1 7-11.8a7 7 0 0 0-14 0c0 5.7 7 11.8 7 11.8z"/>
    <circle cx="12" cy="9.5" r="2.6"/>`,

  // 🎓
  gradcap: `
    <path d="M2 9l10-5 10 5-10 5L2 9z"/>
    <path d="M6 11.6V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.4"/>
    <path d="M22 9v6"/>`,

  // 🏢
  building: `
    <rect x="5" y="3" width="14" height="18" rx="1.5"/>
    <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/>
    <path d="M10 21v-3h4v3"/>
    <path d="M3 21h18"/>`,

  // 🚀
  rocket: `
    <path d="M12 2c3 2.5 4.5 6 4.5 10v4h-9v-4c0-4 1.5-7.5 4.5-10z"/>
    <circle cx="12" cy="9.5" r="1.6"/>
    <path d="M7.5 13.5l-3 3V19l3-1.5"/>
    <path d="M16.5 13.5l3 3V19l-3-1.5"/>
    <path d="M10 19.5c0 1 .9 2.5 2 2.5s2-1.5 2-2.5"/>`,
};

// emoji -> icon name
const EMOJI_MAP = {
  "\u{1F5D3}": "calendar", // 🗓
  "\u{1F5D2}": "calendar", // 🗒
  "\u{1F4C5}": "calendar", // 📅
  "\u{1F4C6}": "calendar", // 📆
  "\u{1F4CD}": "pin",      // 📍
  "\u{1F393}": "gradcap",  // 🎓
  "\u{1F3E2}": "building", // 🏢
  "\u{1F680}": "rocket",   // 🚀
};

const EMOJI_REGEX = /[\u{1F5D3}\u{1F5D2}\u{1F4C5}\u{1F4C6}\u{1F4CD}\u{1F393}\u{1F3E2}\u{1F680}]\uFE0F?/gu;

/** Returns an SVG string for the given icon name. */
export function icon(name, { size = "1.1em", strokeWidth = 1.75, className = "" } = {}) {
  const body = ICON_PATHS[name];
  if (!body) return "";
  return `<svg class="icon icon-${name} ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;flex-shrink:0">${body}</svg>`;
}

/** Returns a real DOM element instead of a string. */
export function iconEl(name, opts) {
  const t = document.createElement("template");
  t.innerHTML = icon(name, opts).trim();
  return t.content.firstChild;
}

/**
 * Walks the DOM and swaps any known emoji for its custom icon.
 * Call once after your content renders (and again after dynamic updates).
 */
export function replaceEmojis(root = document.body, opts = {}) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement && ["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement.tagName)) continue;
    EMOJI_REGEX.lastIndex = 0;
    if (EMOJI_REGEX.test(node.nodeValue)) targets.push(node);
  }

  for (const textNode of targets) {
    const frag = document.createDocumentFragment();
    const text = textNode.nodeValue;
    let last = 0;
    EMOJI_REGEX.lastIndex = 0;
    let m;
    while ((m = EMOJI_REGEX.exec(text))) {
      if (m.index > last) frag.append(text.slice(last, m.index));
      const name = EMOJI_MAP[m[0].replace("\uFE0F", "")];
      frag.append(iconEl(name, opts));
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.append(text.slice(last));
    textNode.replaceWith(frag);
  }
}

/** Optional: <span data-icon="rocket"></span> support. */
export function mountDataIcons(root = document, opts = {}) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, opts);
  });
}

/* ---------------- Usage ----------------

  import { replaceEmojis, mountDataIcons, icon } from "./icons.js";

  // Option A: auto-swap every emoji already in your markup
  replaceEmojis();

  // Option B: explicit, e.g. in a template string / React dangerouslySetInnerHTML
  `${icon("pin")} Bedford, MA`

  // Option C: in HTML
  <span data-icon="gradcap"></span> Education   then call mountDataIcons()

  Tweak size per call: icon("rocket", { size: "1.3em", strokeWidth: 2 })

  React version (if you're on React/Next):
    export const Icon = ({ name, ...o }) =>
      <span dangerouslySetInnerHTML={{ __html: icon(name, o) }} />;
---------------------------------------- */
