// Geometry lifted directly from frontend/design/Nutty Narrows Vending
// Machine.svg (viewBox "0 0 3816.9 2947.4") so the interactive HTML overlay
// in MachineNav.tsx can be positioned in lockstep with the static art in
// VendingMachineArt.tsx.
export const VIEWBOX_WIDTH = 3816.9;
export const VIEWBOX_HEIGHT = 2947.4;

export type Rect = { x: number; y: number; width: number; height: number };

export type MachineItem = {
  id: string;
  code: string; // e.g. "A1"
  label: string;
  /** Real route, or null for the decorative items that don't navigate anywhere. */
  href: string | null;
};

// Row order matches the shelves top-to-bottom; column order matches each
// shelf's labels left-to-right (A1/B1/C1, A2/B2/C2, A3/B3/C3).
export const MACHINE_ITEMS: MachineItem[][] = [
  [
    { id: "about", code: "A1", label: "About", href: "/about" },
    { id: "artists", code: "A2", label: "Artists", href: "/artists" },
    { id: "locations", code: "A3", label: "Locations", href: "/locations" },
  ],
  [
    { id: "contact", code: "B1", label: "Contact", href: "/contact" },
    { id: "nostalgia", code: "B2", label: "Nostalgia", href: null },
    { id: "trinkets", code: "B3", label: "Trinkets", href: null },
  ],
  [
    { id: "stickers", code: "C1", label: "Stickers", href: null },
    { id: "gifts", code: "C2", label: "Gifts", href: null },
    { id: "crafts", code: "C3", label: "Crafts", href: null },
  ],
];

// The four "real" pages also appear as a small in-scene menu (the
// Text_Navigation screen) — nav mode 2.
export const MENU_ITEMS = MACHINE_ITEMS.flat().filter((item) => item.href);

// Shelf rects (all share x/width; only y differs) — used as the row
// dividers for the item hit-zones. Each row's hit-zone runs from one
// shelf's y up to the row height above it, so the three zones tile exactly
// from the machine window's interior down to the bottom shelf.
const SHELF_X = 1278;
const SHELF_WIDTH = 802.6;
const SHELF_Y = [785.8, 1092.8, 1393.9]; // Top_Shelf, Middle_Shelf, Bottom_Shelf
const ROW_HEIGHT = SHELF_Y[1] - SHELF_Y[0]; // 307

export function getItemHitZone(row: number, col: number): Rect {
  const colWidth = SHELF_WIDTH / 3;
  return {
    x: SHELF_X + col * colWidth,
    y: SHELF_Y[row] - ROW_HEIGHT,
    width: colWidth,
    height: ROW_HEIGHT,
  };
}

// Keypad button rects (from the Buttons group's *_Button rects).
export const KEYPAD_BUTTONS: { key: "A" | "B" | "C" | "1" | "2" | "3"; rect: Rect }[] = [
  { key: "A", rect: { x: 2252.2, y: 658.4, width: 51.2, height: 51 } },
  { key: "B", rect: { x: 2312.5, y: 658.4, width: 51.2, height: 51 } },
  { key: "C", rect: { x: 2372.8, y: 658.4, width: 51.2, height: 51 } },
  { key: "1", rect: { x: 2252.2, y: 719.4, width: 51.2, height: 51 } },
  { key: "2", rect: { x: 2312.5, y: 719.4, width: 51.2, height: 51 } },
  { key: "3", rect: { x: 2372.8, y: 719.4, width: 51.2, height: 51 } },
];

// The keypad's own little readout (the "Screen" rect, distinct from the
// Text_Navigation menu screen) — shows the code as it's typed.
export const CODE_READOUT_RECT: Rect = { x: 2252.4, y: 787.1, width: 171.5, height: 34.3 };

// The Text_Navigation screen's background — divided into four equal bands,
// one per menu link, top to bottom (About/Artists/Locations/Contact).
export const MENU_SCREEN_RECT: Rect = { x: 2239.6, y: 842.7, width: 195.1, height: 235.6 };

export function getMenuHitZone(index: number): Rect {
  const bandHeight = MENU_SCREEN_RECT.height / MENU_ITEMS.length;
  return {
    x: MENU_SCREEN_RECT.x,
    y: MENU_SCREEN_RECT.y + index * bandHeight,
    width: MENU_SCREEN_RECT.width,
    height: bandHeight,
  };
}

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
    left: `${(rect.x / VIEWBOX_WIDTH) * 100}%`,
    top: `${(rect.y / VIEWBOX_HEIGHT) * 100}%`,
    width: `${(rect.width / VIEWBOX_WIDTH) * 100}%`,
    height: `${(rect.height / VIEWBOX_HEIGHT) * 100}%`,
  };
}
