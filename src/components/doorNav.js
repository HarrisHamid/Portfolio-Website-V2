/** Fired by `goToDoor` so every door gate knows which door a nav link is heading to. */
export const VISIT_EVENT = "door:visit";

/**
 * Scroll to the door in front of `section` (centered, where the gate engages) instead of
 * jumping past it to the section itself. Returns false if that section has no door.
 */
export function goToDoor(section) {
  const el = document.querySelector(`[data-door-for="${section}"]`);
  if (!el) return false;
  window.dispatchEvent(new CustomEvent(VISIT_EVENT, { detail: section }));
  el.scrollIntoView({ block: "center" });
  history.pushState(null, "", `#${section}`);
  return true;
}
