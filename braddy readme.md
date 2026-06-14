# bradyperron.com — Reconstruction

A static rebuild of [bradyperron.com](https://www.bradyperron.com/), the portfolio site for Brooklyn-based videographer/director **Brady Perron**. This project was reconstructed from an HTTrack mirror of the original Next.js site and reimplemented as vanilla HTML, CSS, and ES modules — no build step required.

This README is written for developers and AI agents (e.g. Anti Gravity) onboarding to the codebase. It explains architecture, the **endless scroll** behavior in both view modes, visual effects, and how every file connects.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Architecture overview](#architecture-overview)
3. [File structure](#file-structure)
4. [Application boot sequence](#application-boot-sequence)
5. [Endless scroll — Grid view (Three.js)](#endless-scroll--grid-view-threejs)
6. [Endless scroll — List view (DOM)](#endless-scroll--list-view-dom)
7. [Visual effects reference](#visual-effects-reference)
8. [Data layer](#data-layer)
9. [UI layers & modals](#ui-layers--modals)
10. [CSS & typography](#css--typography)
11. [External dependencies](#external-dependencies)
12. [Original site vs this rebuild](#original-site-vs-this-rebuild)
13. [Extending the project](#extending-the-project)

---

## Quick start

This site uses **ES modules** and **Three.js import maps**. It must be served over HTTP — opening `index.html` directly via `file://` will not work.

```bash
# From the project root
npx serve .

# Then open http://localhost:3000
```

### Requirements

| Requirement | Notes |
|-------------|-------|
| Local HTTP server | Required for ES modules |
| Internet connection | Three.js + GSAP load from CDN; Mux video previews stream remotely |
| `brady/` folder | Local Sanity CDN images mirrored by HTTrack |

---

## Architecture overview

The app is a **single-page application** with no framework. State lives in a small object in `app.js`; rendering is split between:

- **WebGL (Three.js)** — the default “grid” home view
- **DOM overlays** — list view, about panel, project detail modal
- **GSAP** — loader, chrome reveal, about word animation

```
┌─────────────────────────────────────────────────────────────┐
│  index.html                                                  │
│  ├── #loader          (boot screen)                         │
│  └── #app                                                   │
│       ├── #canvas-wrap     → scene.js (Three.js)            │
│       ├── #list-view       → app.js (DOM list scroll)       │
│       ├── .chrome          → site-name + list/about buttons │
│       ├── #about-modal     → slide-up bio panel             │
│       └── #project-modal   → full project detail            │
├─────────────────────────────────────────────────────────────┤
│  js/data.js    → projects[] + settings (static CMS data)    │
│  js/scene.js   → GridScene class (3D + endless scroll)      │
│  js/app.js     → orchestration, list view, modals, loader   │
│  css/style.css → layout, typography, transitions            │
└─────────────────────────────────────────────────────────────┘
```

### View modes

| Mode | Trigger | What renders |
|------|---------|--------------|
| `grid` | Default after loader | Three.js canvas — stacked 3D project cards |
| `list` | Click **list** button | DOM title list centered on screen; canvas hidden |

Both modes share the same **active project index** and stay in sync when scrolling.

---

## File structure

```
.
├── index.html              Entry point, DOM shell, CDN scripts
├── css/
│   └── style.css           All styles (loader, chrome, list, modals)
├── js/
│   ├── data.js             17 projects + site settings (exported)
│   ├── scene.js            GridScene — Three.js 3D grid + scroll
│   └── app.js              Boot, list view, modals, event wiring
└── brady/                  HTTrack mirror (reference + local images)
    └── cdn.sanity.io/      Mirrored project/portrait images
```

---

## Application boot sequence

Boot order is defined in `app.js` bottom-to-top call chain:

```
initAbout()  →  bindEvents()  →  runLoader()
                                      │
                                      ▼
                              Progress bar 0→100%
                              GSAP: title slides up
                                      │
                                      ▼
                              finishLoader()
                              - Hide #loader
                              - Show #app
                              - initScene()      ← Three.js starts
                              - initListView()   ← Build title buttons
                              - revealChrome()   ← Fade in nav
```

### Loader (`runLoader` / `finishLoader`)

- Simulates asset loading with a random increment progress bar (`#loader-bar`).
- When progress hits 100%, GSAP animates `.loader-title` from `translateY(100%)` → `0%` with `power3.out` easing.
- After 900ms, the loader fades out and the main app initializes.

The Three.js scene is **not** created until the loader completes, so WebGL and texture loading don't compete with the intro animation.

---

## Endless scroll — Grid view (Three.js)

**File:** `js/scene.js` — `GridScene` class

The grid view does not use traditional page scroll. Instead, it implements an **infinite, wrapping project carousel** driven by the mouse wheel. There is no start or end — scrolling past the last project wraps back to the first.

### Core state variables

| Variable | Purpose |
|----------|---------|
| `scroll` | Current float position (smoothly interpolated) |
| `targetScroll` | Where scroll is heading after wheel input |
| `index` | Rounded active project index (0 … n−1) |
| `targetIndex` | Snapped index derived from `targetScroll` |

### How wheel input works

```js
// scene.js — scrollBy()
this.targetScroll += delta * 0.35;   // delta = +1 or -1 from wheel
this.targetIndex = round(targetScroll) % n;
```

- `wheel` listener on `window` with `{ passive: false }` so `preventDefault()` blocks native page scroll.
- Only active when `viewMode === 'grid'`.

### Smooth interpolation (the “inertia” feel)

Every animation frame in `_animate()`:

```js
this.scroll += (this.targetScroll - this.scroll) * 0.08;
```

The `0.08` factor is **easing/damping** — lower = slower, floatier transitions between projects. This is what makes the scroll feel cinematic rather than snapping instantly.

### Circular layout math

`_layoutCards()` computes each card's position relative to the current scroll position:

```js
const rel = ((i - this.scroll + n * 4) % n) - Math.floor(n / 2);
```

- `rel` = distance from center (−8 … +8 for 17 projects)
- Cards near `rel ≈ 0` are **center/active**
- Cards with large `|rel|` are pushed back in Z and scaled down

Per-card transforms:

| Property | Formula | Effect |
|----------|---------|--------|
| `position.x` | `offset.x + rel * 0.35` | Horizontal spread |
| `position.y` | `offset.y + rel * -0.2` | Vertical drift |
| `position.z` | `offset.z - dist * 0.6` | Depth stacking |
| `rotation.y` | `offset.ry + rel * 0.04` | Slight Y rotation |
| `scale` | `1` if center, else `max(0.72, 1 - dist * 0.12)` | Focus on center card |

### Static scatter offsets

Each card also gets a base offset from the `OFFSETS` array (5 preset poses) cycled by `i % 5`:

```js
{ x, y, z, rx, ry, rz }  // position + rotation
```

This creates the **overlapping collage** look from the original site — cards are never perfectly aligned.

### Floating “bob” effect

After layout, each frame adds a sine wave to Y:

```js
const bob = Math.sin(t * 0.8 + card.userData.projectIndex * 1.3) * 0.04;
card.position.y += bob;
```

- `t` = elapsed time from `THREE.Clock`
- Each card has a phase offset (`projectIndex * 1.3`) so they don't move in unison
- Amplitude `0.04` world units — subtle idle motion

### Video textures (center-card autoplay)

Projects with `media.type === 'video'` get a hidden `<video>` element and a `THREE.VideoTexture`.

In `_updateVideos()`:

- If `|rel| < 0.6` (near center) → play video, swap material map to `VideoTexture`
- Otherwise → pause video (saves bandwidth)

Poster image loads first via `TextureLoader`; video texture replaces it when active.

### Click to open project

`Raycaster` + normalized pointer coords on `pointerdown`:

```js
this.raycaster.setFromCamera(this.pointer, this.camera);
const hits = this.raycaster.intersectObjects(this.cards);
```

Hit card → `onSelect(project)` → `openProject()` in `app.js`.

### Index change callback

When `index` changes after rounding `scroll`, `onIndexChange(i)` fires — used to keep list view in sync if both modes were toggled.

---

## Endless scroll — List view (DOM)

**File:** `js/app.js` — `initListView()`, `layoutListItems()`, `setViewMode()`

List view mirrors the grid's endless behavior using **DOM buttons** instead of WebGL.

### Doubled project array

```js
const doubled = [...projects, ...projects];  // 34 items for 17 projects
```

Duplicating the list creates seamless visual continuity — as you scroll, titles above and below the center never “run out.”

### Vertical positioning

Each `.list-item` is `position: absolute; left: 50%; top: 50%` and positioned via transform:

```js
const anchor = state.activeIndex + projects.length;  // center anchor in doubled array
const y = center + (i - anchor) * gap;
item.style.transform = `translate(-50%, calc(-50% + ${y - center}px))`;
```

- `gap` = 52px mobile / 72px desktop
- Only items near the anchor cluster around viewport center

### Active / dim states

```js
item.classList.toggle('active', dist === 0);   // letter-spacing expands
item.classList.toggle('dim', dist > 2);        // opacity 0.35
```

CSS for active item:

```css
.list-item.active {
  letter-spacing: 0.12em;
}
.list-item {
  transition: letter-spacing 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), ...;
}
```

This matches the original site's typographic focus effect on the centered title.

### List wheel handler

When list mode is active, `#list-view` gets its own wheel handler:

```js
const next = (state.activeIndex + dir + n) % n;  // wraps 0↔n-1
scene?.setIndex(next);
updateListActive(next);
```

Scrolling updates **both** the DOM list and the hidden Three.js scene index so toggling back to grid lands on the same project.

---

## Visual effects reference

| Effect | Location | Implementation |
|--------|----------|----------------|
| Loader progress bar | `app.js` | Random width increments, CSS `transition` |
| Title slide-up | `app.js` | GSAP `fromTo` y: 100%→0%, `power3.out` |
| Loader fade-out | `app.js` | GSAP opacity → 0 |
| Chrome fade-in | `app.js` | GSAP stagger on `.site-name`, `.nav-btn` |
| 3D card stack | `scene.js` | Three.js planes + OFFSETS + rel layout |
| Scroll inertia | `scene.js` | Lerp `scroll` toward `targetScroll` × 0.08 |
| Idle float bob | `scene.js` | `sin(time + index)` on Y axis |
| Video autoplay | `scene.js` | VideoTexture when card near center |
| List letter-spacing | `style.css` | `.active` class, 450ms cubic-bezier |
| List dimming | `style.css` | `.dim` → opacity 0.35 |
| About slide-up | `style.css` | `transform: translateY(100%)` → `.open` → 0 |
| About word reveal | `app.js` | GSAP stagger on each word span, y: 110%→0% |
| About portrait | `style.css` | `object-fit: cover`, `-inset-[5%]` overflow |
| Project modal | `style.css` | Full-screen overlay, sticky close header |
| Nav hover | `style.css` | `opacity: 0.6` on `.nav-btn:hover` |
| Link arrow nudge | `style.css` | `translate(0.25em, -0.25em)` on hover |

### Easing curves used

| Curve | Used for |
|-------|----------|
| `power3.out` | Loader title, about word reveal |
| `cubic-bezier(0.22, 0.61, 0.36, 1)` | List item letter-spacing / font-size |
| Linear lerp × 0.08 | Grid scroll inertia |

---

## Data layer

**File:** `js/data.js`

### `settings` object

Site-wide content for the about panel:

```js
{
  siteTitle, longDescription, instagram, email, role, portrait
}
```

### `projects` array

17 portfolio entries. Each project:

```js
{
  slug: 'harlaut-apparel',           // URL-safe ID
  title: 'Harlaut Apparel Winter Campaign',
  client: 'Harlaut Apparel',
  year: '2024',
  type: 'Commercial' | null,
  videoUrl: 'https://...' | null,  // YouTube/Vimeo full link
  description: '...',              // optional
  media: {
    type: 'image' | 'video',
    url: '...',                    // image path (local mirror)
    posterUrl: '...',              // Mux thumbnail (video)
    previewUrl: '...',             // Mux 720p mp4 (video)
    width, height
  },
  gallery: ['path1', 'path2']     // additional stills
}
```

### Image paths

Local images point into the HTTrack mirror:

```
brady/cdn.sanity.io/images/qrv69xlg/production/<hash>-<WxH>.jpg
```

Video previews use **Mux CDN** URLs extracted from the original site's Sanity CMS payload (requires internet).

---

## UI layers & modals

Z-index stacking (bottom → top):

| z-index | Element | Behavior |
|---------|---------|----------|
| 1 | `#canvas-wrap` | Three.js canvas, full viewport |
| 10 | `#list-view` | Title list overlay |
| 20 | `.chrome` | Fixed bottom nav (pointer-events trick) |
| 30 | `#about-modal` | Slide-up from bottom |
| 40 | `#project-modal` | Full-screen project detail |
| 100 | `#loader` | Boot screen (removed after load) |

### About modal

- Default: `transform: translateY(100%)` (off-screen below)
- `.open` class: `translateY(0)` with 600ms cubic-bezier transition
- Bio text split into `.about-word` spans for staggered GSAP reveal
- Portrait, Instagram, email populated from `settings`

### Project modal

Opened by clicking a grid card or list item.

Media priority:

1. If `videoUrl` exists → YouTube/Vimeo iframe embed (autoplay)
2. Else if `media.type === 'video'` → native `<video>` with Mux preview
3. Else → static `<img>` from local mirror

Gallery renders below metadata as a responsive CSS grid.

### Keyboard

`Escape` closes project modal first, then about modal.

---

## CSS & typography

**File:** `css/style.css`

- **Font:** [Fraunces](https://fonts.google.com/specimen/Fraunces) weight 100 (soft serif) — matches original site's thin editorial feel
- **Palette:** white background, black text, rgba black for muted UI
- **Chrome:** frosted `backdrop-filter: blur(12px)` on site name
- **Responsive:** `clamp()` for type sizes; 768px breakpoint for about grid

### Pointer-events pattern

`.chrome` has `pointer-events: none` so clicks pass through to the canvas, but children `.site-name`, `.chrome-nav`, `.nav-btn` have `pointer-events: auto`.

---

## External dependencies

Loaded from CDN in `index.html`:

| Library | Version | Purpose |
|---------|---------|---------|
| [Three.js](https://threejs.org/) | 0.170.0 | WebGL 3D grid |
| [GSAP](https://gsap.com/) | 3.12.5 | Loader + about animations |
| Google Fonts | — | Fraunces |

Import map resolves `three` for ES module imports in `scene.js`.

---

## Original site vs this rebuild

| Feature | Original (bradyperron.com) | This rebuild |
|---------|---------------------------|--------------|
| Framework | Next.js + React Three Fiber | Vanilla JS + Three.js |
| CMS | Sanity.io (live) | Static `data.js` |
| Video | Mux streaming | Same Mux URLs |
| Grid shader | Motion trail / bloom post-processing | Not implemented |
| Grid scroll | R3F custom path animation | Wheel + lerp scroll index |
| List view | React + GSAP | DOM + CSS transitions |
| About | Word reveal animation | GSAP word reveal (same idea) |
| Project pages | `/slug` routes | Modal overlay |
| Offline | Requires server | Local images; videos need network |

The original site's trail/bloom idle effect (visible when cards settle) is the main visual gap. Everything else — collage layout, endless scroll, list typography, about panel — is closely matched.

---

## Extending the project

### Add a new project

1. Add an entry to `projects[]` in `js/data.js`
2. Place image assets in `brady/cdn.sanity.io/images/...` or update paths
3. For video previews, use Mux `posterUrl` + `previewUrl` format

### Tune scroll feel

In `scene.js`:

```js
this.targetScroll += delta * 0.35;  // scroll sensitivity
this.scroll += (this.targetScroll - this.scroll) * 0.08;  // inertia
```

### Tune list spacing

In `app.js` → `layoutListItems()`:

```js
const gap = window.innerWidth < 768 ? 52 : 72;
```

### Add URL routing

Currently there are no routes. To add `/slug` support, listen to `popstate` and call `openProject(projects.find(p => p.slug === slug))` — or integrate a minimal router.

---

## HTTrack mirror (`brady/`)

The `brady/` folder is the raw HTTrack download of the original site. It contains:

- Broken offline Next.js bundles (not used by this rebuild)
- **Usable mirrored images** under `brady/cdn.sanity.io/`
- Reference HTML with embedded Sanity JSON (used to extract project data)

The reconstruction intentionally does **not** serve the HTTrack `index.html` — it cannot run offline because the original is a client-rendered Next.js app.

---

## License & attribution

Portfolio content (images, videos, copy) belongs to **Brady Perron**. This reconstruction is for educational/portfolio study purposes. Original site: [bradyperron.com](https://www.bradyperron.com/).
