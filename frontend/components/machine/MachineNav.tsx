"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CODE_READOUT_RECT,
  CODE_READOUT_RECT_NARROW,
  ITEM_TRANSITION_COLOR,
  KEYPAD_BUTTONS,
  KEYPAD_BUTTONS_NARROW,
  MACHINE_ITEMS,
  MACHINE_NARROW_BREAKPOINT,
  MENU_ITEMS,
  VEND_ANIMATION_MS,
  findItem,
  getItemHitZone,
  rectToStyle,
  type MachineItem,
} from "./machine-items";
import VendReveal from "./VendReveal";
import { useVendTransition } from "@/lib/vend-transition-context";

type Letter = "A" | "B" | "C";
type VendPhase = "idle" | "coiling" | "falling" | "rising" | "holding" | "returning";

const HIGHLIGHT_MS = 500;
const READOUT_CLEAR_MS = 1200;

function toggleClass(id: string, className: string, add: boolean) {
  document.getElementById(id)?.classList.toggle(className, add);
}

// Mirrors the art's own rearrangement at the same breakpoint (see
// _vending-machine.scss) — the invisible hit-zones and readout need to
// match the art's new button positions/sizes exactly, not just be nudged
// with a CSS transform, since the buttons also grow (33% of the row's
// width -> 50%) and not just move. useSyncExternalStore (rather than
// useEffect+useState) is the correct tool for syncing from an external
// browser API like matchMedia — same pattern as cookie-consent-context.tsx.
function subscribeToNarrowBreakpoint(onChange: () => void) {
  const mql = window.matchMedia(MACHINE_NARROW_BREAKPOINT);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getIsNarrow() {
  return window.matchMedia(MACHINE_NARROW_BREAKPOINT).matches;
}

// The server can't know the client's viewport, so it always renders the
// wide/default layout; this corrects to the real value on the client's
// first paint if needed.
function getIsNarrowServerSnapshot() {
  return false;
}

/**
 * The accessible interactive layer for the vending machine: real HTML
 * controls absolutely-positioned over the presentational SVG art (see
 * VendingMachineArt), covering all three navigation modes — click an item
 * directly, pick it from the on-screen menu, or enter its letter+number
 * code on the keypad.
 */
export default function MachineNav() {
  const router = useRouter();
  const { start: startPageTransition } = useVendTransition();
  const [pendingLetter, setPendingLetter] = useState<Letter | null>(null);
  const [readout, setReadout] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [vendPhase, setVendPhase] = useState<VendPhase>("idle");
  const [vendingItem, setVendingItem] = useState<MachineItem | null>(null);
  const vendPhaseRef = useRef<VendPhase>("idle");
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vendTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isNarrow = useSyncExternalStore(
    subscribeToNarrowBreakpoint,
    getIsNarrow,
    getIsNarrowServerSnapshot
  );

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (readoutTimer.current) clearTimeout(readoutTimer.current);
      vendTimers.current.forEach(clearTimeout);
    };
  }, []);

  function setPhase(next: VendPhase) {
    vendPhaseRef.current = next;
    setVendPhase(next);
  }

  function scheduleVend(fn: () => void, ms: number) {
    vendTimers.current.push(setTimeout(fn, ms));
  }

  function resetVend() {
    vendTimers.current.forEach(clearTimeout);
    vendTimers.current = [];
    setPhase("idle");
    setVendingItem(null);
  }

  // Coil rotates, item falls off the shelf, squirrel arms rise holding it,
  // then either navigate (real pages) or lower it back into its slot
  // (decorative items). Durations come from VEND_ANIMATION_MS in
  // machine-items.ts — the matching animation-durations in
  // _vending-machine.scss must stay equal to these, since this sequencing
  // is driven by setTimeout, not by CSS animationend events.
  function runVendSequence(item: MachineItem) {
    setVendingItem(item);
    setAnnouncement(
      item.href ? `${item.code}, ${item.label}` : `${item.code}, ${item.label} — not linked yet`
    );
    setPhase("coiling");
    toggleClass(item.spiralId, "vend-spiral--coiling", true);

    scheduleVend(() => {
      toggleClass(item.spiralId, "vend-spiral--coiling", false);
      toggleClass(item.graphicId, "vend-item--falling", true);
      if (item.textId) toggleClass(item.textId, "vend-item--falling", true);
      setPhase("falling");
    }, VEND_ANIMATION_MS.coiling);

    scheduleVend(() => {
      toggleClass(item.graphicId, "vend-item--falling", false);
      if (item.textId) toggleClass(item.textId, "vend-item--falling", false);
      setPhase("rising");
    }, VEND_ANIMATION_MS.coiling + VEND_ANIMATION_MS.falling);

    scheduleVend(() => {
      setPhase("holding");
    }, VEND_ANIMATION_MS.coiling + VEND_ANIMATION_MS.falling + VEND_ANIMATION_MS.rising);

    scheduleVend(() => {
      if (item.href) {
        // Start the color-swatch page transition and navigate in the same
        // tick — the overlay (rendered in the root layout, so it survives
        // this navigation) covers the screen while the destination page
        // mounts underneath it, then fades to reveal it. resetVend() can
        // clear this component's own vend state immediately since the
        // squirrel/item reveal is about to be hidden behind the overlay
        // anyway.
        const color = ITEM_TRANSITION_COLOR[item.id];
        if (color) startPageTransition(color);
        router.push(item.href);
        resetVend();
      } else {
        setPhase("returning");
        scheduleVend(resetVend, VEND_ANIMATION_MS.returning);
      }
    }, VEND_ANIMATION_MS.coiling + VEND_ANIMATION_MS.falling + VEND_ANIMATION_MS.rising + VEND_ANIMATION_MS.holding);
  }

  function activate(item: MachineItem) {
    if (vendPhaseRef.current !== "idle") return; // ignore input mid-animation

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      if (item.href) {
        router.push(item.href);
        return;
      }
      // Decorative item: no destination — just acknowledge the press.
      setAnnouncement(`${item.code}, ${item.label} — not linked yet`);
      setHighlightedId(item.id);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
      return;
    }

    runVendSequence(item);
  }

  // Real items are real <Link>s (so ctrl/cmd-click, middle-click, and
  // "open in new tab" keep working) — only a plain primary click is
  // intercepted to run the vend animation before navigating.
  function handleLinkActivate(event: React.MouseEvent, item: MachineItem) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    activate(item);
  }

  function pressLetter(letter: Letter) {
    if (vendPhaseRef.current !== "idle") return;
    setPendingLetter(letter);
    setReadout(letter);
    setAnnouncement(letter);
    if (readoutTimer.current) clearTimeout(readoutTimer.current);
  }

  function pressNumber(number: "1" | "2" | "3") {
    if (vendPhaseRef.current !== "idle") return;
    if (!pendingLetter) return;
    const code = `${pendingLetter}${number}`;
    const item = findItem(code);
    setReadout(code);
    setPendingLetter(null);
    if (item) {
      setAnnouncement(
        item.href ? `${code}, ${item.label}` : `${code}, ${item.label} — not linked yet`
      );
      activate(item);
    }
    if (readoutTimer.current) clearTimeout(readoutTimer.current);
    readoutTimer.current = setTimeout(() => setReadout(""), READOUT_CLEAR_MS);
  }

  return (
    <nav aria-label="Vend an item" className="machine-nav">
      {/* Mode 1: click an item directly */}
      {MACHINE_ITEMS.map((row, rowIndex) =>
        row.map((item, colIndex) => {
          const style = rectToStyle(getItemHitZone(rowIndex, colIndex));
          const className = `machine-nav__item${
            highlightedId === item.id ? " machine-nav__item--pressed" : ""
          }`;
          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              style={style}
              className={className}
              aria-label={`${item.code} — ${item.label}`}
              onClick={(event) => handleLinkActivate(event, item)}
            >
              <span className="visually-hidden">{item.label}</span>
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              style={style}
              className={className}
              aria-label={`${item.code} — ${item.label}`}
              onClick={() => activate(item)}
            >
              <span className="visually-hidden">{item.label}</span>
            </button>
          );
        })
      )}
      {/* Mode 2: keypad code entry */}
      {(isNarrow ? KEYPAD_BUTTONS_NARROW : KEYPAD_BUTTONS).map(({ key, rect }) => (
        <button
          key={key}
          type="button"
          style={rectToStyle(rect)}
          className={`machine-nav__key machine-nav__key--${key}${
            pendingLetter === key ? " machine-nav__key--active" : ""
          }`}
          aria-label={`Keypad ${key}`}
          onClick={() =>
            key === "A" || key === "B" || key === "C"
              ? pressLetter(key)
              : pressNumber(key)
          }
        >
          <span className="visually-hidden">{key}</span>
        </button>
      ))}
      <div
        style={rectToStyle(isNarrow ? CODE_READOUT_RECT_NARROW : CODE_READOUT_RECT)}
        className="machine-nav__readout"
        aria-hidden="true"
      >
        {readout}
      </div>
      <span role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </span>
      {vendingItem &&
        (vendPhase === "rising" || vendPhase === "holding" || vendPhase === "returning") &&
        typeof document !== "undefined" &&
        createPortal(
          // Portaled to <body> — .vending-machine has its own z-index and
          // establishes a stacking context, so a descendant here (even a
          // position:fixed one) can never out-rank the footer's z-index no
          // matter how high its own z-index goes. Rendering at the body
          // level puts it in the same stacking context as the footer, where
          // z-index actually applies.
          <div className="vend-reveal-viewport">
            <VendReveal
              key={vendingItem.id}
              itemId={vendingItem.id}
              className={vendPhase === "returning" ? "vend-reveal--returning" : "vend-reveal--rising"}
            />
          </div>,
          document.body
        )}
    </nav>
  );
}
