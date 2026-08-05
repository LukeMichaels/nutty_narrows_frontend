// Geometry lifted directly from frontend/design/Nutty Narrows Vending
// Machine v2.svg (combined canvas "0 0 2560 1440") so the interactive HTML
// overlay in MachineNav.tsx can be positioned in lockstep with the static
// art in VendingMachineArt.tsx.
//
// The machine art's own <svg> is cropped to just its bounding box within
// that combined illustration (queried via getBBox() on the "Machine_Wrap"/
// "Vending_Machine"/"Machine" groups — all identical, confirming no
// transform sits between them: x=540.5, y=-452, width=1491.1,
// height=1663.2) so it can scale independently of the backdrop — every
// rect constant below is expressed in that same absolute coordinate space,
// and rectToStyle() re-bases them by subtracting the machine's min-x/min-y
// before dividing by its own (not the full scene's) width/height.
export const MACHINE_VIEWBOX_MIN_X = 540.5;
export const MACHINE_VIEWBOX_MIN_Y = -452;
export const VIEWBOX_WIDTH = 1491.1;
export const VIEWBOX_HEIGHT = 1663.2;

export type Rect = { x: number; y: number; width: number; height: number };

export type MachineItem = {
  id: string;
  code: string; // e.g. "A1"
  label: string;
  /** Real route, or null for the decorative items that don't navigate anywhere. */
  href: string | null;
  /** Element ids inside VendingMachineArt.tsx, for the vend animation to target directly. */
  graphicId: string;
  spiralId: string;
  textId: string | null;
};

// Row order matches the shelves top-to-bottom; column order matches each
// shelf's labels left-to-right (A1/B1/C1, A2/B2/C2, A3/B3/C3). graphicId/
// spiralId/textId mirror the (slightly irregular — some are inherited typos
// from the original artwork, e.g. "sprial") ids actually used in
// VendingMachineArt.tsx.
export const MACHINE_ITEMS: MachineItem[][] = [
  [
    { id: "about", code: "A1", label: "About", href: "/about", graphicId: "about_graphic", spiralId: "about_spiral", textId: "about_text" },
    { id: "artists", code: "A2", label: "Artists", href: "/artists", graphicId: "artists_graphic", spiralId: "artists_spiral", textId: "artists_text" },
    { id: "locations", code: "A3", label: "Locations", href: "/locations", graphicId: "locations_graphic", spiralId: "locations_sprial", textId: "locations_text" },
  ],
  [
    { id: "contact", code: "B1", label: "Contact", href: "/contact", graphicId: "contact_graphic", spiralId: "contact_spiral", textId: "contact_text" },
    { id: "nostalgia", code: "B2", label: "Nostalgia", href: null, graphicId: "furb", spiralId: "furb_spiral", textId: null },
    { id: "trinkets", code: "B3", label: "Trinkets", href: null, graphicId: "sticky_hand", spiralId: "sticky_hand_Spiral", textId: null },
  ],
  [
    { id: "stickers", code: "C1", label: "Stickers", href: null, graphicId: "smiley", spiralId: "smiley_spiral", textId: null },
    { id: "gifts", code: "C2", label: "Gifts", href: null, graphicId: "Troll", spiralId: "troll_spiral", textId: null },
    { id: "crafts", code: "C3", label: "Crafts", href: null, graphicId: "balloon_dog", spiralId: "balloon_dog_spiral", textId: null },
  ],
];

// The four "real" pages also appear as a small in-scene menu (the
// Text_Navigation screen) — nav mode 2.
export const MENU_ITEMS = MACHINE_ITEMS.flat().filter((item) => item.href);

// Each real page's own landing background color (the $color-* SCSS
// variables in assets/sass/pages/_{about,artists,contact,locations}.scss,
// duplicated here as plain hex since MachineNav needs them in JS for the
// vend-transition overlay — see lib/vend-transition-context.tsx). Keep
// these in sync if a page's background color ever changes.
export const ITEM_TRANSITION_COLOR: Record<string, string> = {
  about: "#d2863a",
  artists: "#f47884",
  contact: "#abf4f5",
  locations: "#f5f5bf",
};

// Shelf rects (all share x/width; only y differs) — each is the *label*
// bar ("A1 - ABOUT" etc.) that sits directly below its row's item graphic.
// Hit-zones tile from just below the previous row's label down through the
// row's own label, so each zone covers its item plus the label beneath it
// (not the label of the row above).
const SHELF_X = 648.8;
const SHELF_WIDTH = 802.6;
const SHELF_Y = [31.9, 338.9, 639.9]; // Top_Shelf, Middle_Shelf, Bottom_Shelf
const SHELF_HEIGHT = 37.4;
const ROW_HEIGHT = SHELF_Y[1] - SHELF_Y[0]; // 307

export function getItemHitZone(row: number, col: number): Rect {
  const colWidth = SHELF_WIDTH / 3;
  return {
    x: SHELF_X + col * colWidth,
    y: SHELF_Y[row] - ROW_HEIGHT + SHELF_HEIGHT,
    width: colWidth,
    height: ROW_HEIGHT,
  };
}

// Keypad button rects (from the Buttons group's *_Button rects).
export const KEYPAD_BUTTONS: { key: "A" | "B" | "C" | "1" | "2" | "3"; rect: Rect }[] = [
  { key: "A", rect: { x: 1623, y: -95.5, width: 51.2, height: 51 } },
  { key: "B", rect: { x: 1683.3, y: -95.5, width: 51.2, height: 51 } },
  { key: "C", rect: { x: 1743.6, y: -95.5, width: 51.2, height: 51 } },
  { key: "1", rect: { x: 1623, y: -34.5, width: 51.2, height: 51 } },
  { key: "2", rect: { x: 1683.3, y: -34.5, width: 51.2, height: 51 } },
  { key: "3", rect: { x: 1743.6, y: -34.5, width: 51.2, height: 51 } },
];

// Below MACHINE_NARROW_BREAKPOINT (see MachineNav.tsx), the keypad becomes
// 2 columns (letters left, numbers right) instead of 3 — each button grows
// to take up half the row's width instead of a third (matching the same
// 1.5x scale-up applied to the art's own buttons in _vending-machine.scss,
// so the art and the invisible hit-zones stay in registration). The
// left/right column edges (1623 / 1794.8) match the original 3-column
// block's own left/right edges, so the overall footprint doesn't change —
// only the internal column count and gap do.
export const KEYPAD_BUTTONS_NARROW: { key: "A" | "B" | "C" | "1" | "2" | "3"; rect: Rect }[] = [
  { key: "A", rect: { x: 1623, y: -95.5, width: 76.8, height: 76.5 } },
  { key: "B", rect: { x: 1623, y: -9, width: 76.8, height: 76.5 } },
  { key: "C", rect: { x: 1623, y: 77.5, width: 76.8, height: 76.5 } },
  { key: "1", rect: { x: 1718, y: -95.5, width: 76.8, height: 76.5 } },
  { key: "2", rect: { x: 1718, y: -9, width: 76.8, height: 76.5 } },
  { key: "3", rect: { x: 1718, y: 77.5, width: 76.8, height: 76.5 } },
];

// The new Screen rect below the buttons — the keypad readout (the
// letter+number as it's typed) renders centered in this.
export const CODE_READOUT_RECT: Rect = { x: 1623.4, y: 32.6, width: 172.2, height: 71.3 };

// Screen position shifts down to sit below the taller 3-row narrow keypad
// (same x/width — the 2-column block's overall left/right span matches the
// original 3-column one, see KEYPAD_BUTTONS_NARROW above).
export const CODE_READOUT_RECT_NARROW: Rect = { x: 1623.4, y: 170.1, width: 172.2, height: 71.3 };

// Matches the @media (max-width: ...) breakpoint in _vending-machine.scss
// that rearranges the keypad art itself — keep these in sync.
export const MACHINE_NARROW_BREAKPOINT = "(max-width: 639px)";

// Vend animation phase durations (ms). Kept as one source of truth: the
// matching `animation-duration`s in _vending-machine.scss must equal these
// exactly, since MachineNav sequences phases with setTimeout using these
// same numbers.
export const VEND_ANIMATION_MS = {
  coiling: 400,
  falling: 350,
  rising: 450,
  holding: 300,
  returning: 350,
} as const;

export function findItem(code: string): MachineItem | undefined {
  return MACHINE_ITEMS.flat().find((item) => item.code === code);
}

export function rectToStyle(rect: Rect): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: `${((rect.x - MACHINE_VIEWBOX_MIN_X) / VIEWBOX_WIDTH) * 100}%`,
    top: `${((rect.y - MACHINE_VIEWBOX_MIN_Y) / VIEWBOX_HEIGHT) * 100}%`,
    width: `${(rect.width / VIEWBOX_WIDTH) * 100}%`,
    height: `${(rect.height / VIEWBOX_HEIGHT) * 100}%`,
  };
}
