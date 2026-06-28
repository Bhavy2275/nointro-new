/**
 * BradyShowcase — carousel tuning constants.
 *
 * All magic numbers that control feel and behaviour are centralised here so
 * they can be adjusted in one place without touching component logic.
 */

// ─── Video playback ──────────────────────────────────────────────────────────

/** Cards within this distance from centre will have their HLS stream loaded. */
export const CARD_LOAD_RADIUS = 6.0;

/** Cards within this distance from centre will actively play their video. */
export const CARD_PLAY_RADIUS = 4.5;

// ─── Scroll / interaction ────────────────────────────────────────────────────

/** Wheel-event delta → scroll-unit conversion factor. */
export const WHEEL_SENSITIVITY = 0.0004;

/** Seconds of idle time before the carousel starts auto-drifting. */
export const IDLE_THRESHOLD_MS = 1500;

/** Auto-drift speed (scroll units per animation frame at 60 fps). */
export const AUTO_DRIFT_SPEED = 0.0006;

/** Drag pixel displacement → scroll-unit conversion sensitivity (desktop). */
export const DRAG_SENSITIVITY_DESKTOP = 1.0;

/** Drag pixel displacement → scroll-unit conversion sensitivity (mobile). */
export const DRAG_SENSITIVITY_MOBILE = 1.5;

/** Minimum pointer displacement (px) before a drag gesture is recognised. */
export const DRAG_THRESHOLD_PX = 6;

// ─── Animation ───────────────────────────────────────────────────────────────

/** Lerp factor for scroll value smoothing (higher = snappier). */
export const SCROLL_LERP_FACTOR = 0.12;

/** Lerp factor for mesh position / rotation / scale (higher = snappier). */
export const MESH_LERP_FACTOR = 0.12;

/** Cards beyond this distance skip lerp and are positioned instantly (perf). */
export const MESH_INSTANT_THRESHOLD = 4;

/** Lerp factor for the card expand / collapse animation. */
export const CARD_EXPAND_LERP = 0.08;

/** How far off-screen (world units) non-expanded cards slide when one card expands. */
export const CARD_OFFSCREEN_X = 20;

// ─── Layout ──────────────────────────────────────────────────────────────────

/** Horizontal spread between cards (3-D units) on desktop. */
export const CARD_SPREAD_X_DESKTOP = 2.5;

/** Horizontal spread between cards (3-D units) on mobile. */
export const CARD_SPREAD_X_MOBILE = 1.6;

/** Vertical drift coefficient per position unit on desktop. */
export const CARD_DRIFT_Y_DESKTOP = -0.42;

/** Vertical drift coefficient per position unit on mobile. */
export const CARD_DRIFT_Y_MOBILE = -0.26;

/** Viewport width (Three.js units) below which mobile coefficients are used. */
export const MOBILE_VIEWPORT_BREAKPOINT = 8;

/** List-view vertical gap between items (px) on desktop. */
export const LIST_GAP_DESKTOP_PX = 72;

/** List-view vertical gap between items (px) on mobile. */
export const LIST_GAP_MOBILE_PX = 52;

/** CSS pixel width below which the mobile list-view gap is used. */
export const LIST_BREAKPOINT_PX = 768;

/** Distance threshold below which a list item is classed as `active` (fully focused). */
export const LIST_FOCUS_ACTIVE_THRESHOLD = 0.5;

/** Distance threshold below which a list item is classed as `near` (partially focused). */
export const LIST_FOCUS_NEAR_THRESHOLD = 1.5;

// ─── Card geometry ───────────────────────────────────────────────────────────

/** Long-side size (3-D units) for landscape cards (aspect >= 1). */
export const CARD_LONG_SIDE_LANDSCAPE = 4.8;

/** Long-side size (3-D units) for portrait cards (aspect < 1). */
export const CARD_LONG_SIDE_PORTRAIT = 4.0;

/** Scale-down factor per distance unit from centre. */
export const CARD_SCALE_FALLOFF = 0.12;

/** Minimum allowed card scale (prevents cards from shrinking to nothing). */
export const CARD_SCALE_MIN = 0.72;

/** Scale multiplier applied when a card is hovered. */
export const CARD_HOVER_SCALE = 1.08;

// ─── Per-card idle animation offsets ────────────────────────────────────────

/**
 * Five unique positional / rotational offsets cycled across all cards via
 * `index % OFFSETS.length`. Gives each card a slightly different resting pose
 * to break visual monotony when multiple cards are visible at once.
 */
export const CARD_OFFSETS = [
  { x:  0.10, y: -0.05, z:  0.00, rx:  0.02, ry: -0.04, rz:  0.03 },
  { x: -0.15, y:  0.08, z: -0.10, rx: -0.03, ry:  0.05, rz: -0.02 },
  { x:  0.05, y:  0.12, z:  0.10, rx:  0.04, ry: -0.02, rz:  0.01 },
  { x: -0.08, y: -0.10, z: -0.05, rx: -0.02, ry:  0.03, rz: -0.04 },
  { x:  0.12, y:  0.02, z:  0.05, rx:  0.01, ry: -0.03, rz:  0.02 },
] as const;
