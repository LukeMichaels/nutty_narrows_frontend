"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CODE_READOUT_RECT,
  KEYPAD_BUTTONS,
  MACHINE_ITEMS,
  MENU_ITEMS,
  findItem,
  getItemHitZone,
  getMenuHitZone,
  rectToStyle,
  type MachineItem,
} from "./machine-items";

type Letter = "A" | "B" | "C";

const HIGHLIGHT_MS = 500;
const READOUT_CLEAR_MS = 1200;

/**
 * The accessible interactive layer for the vending machine: real HTML
 * controls absolutely-positioned over the presentational SVG art (see
 * VendingMachineArt), covering all three navigation modes — click an item
 * directly, pick it from the on-screen menu, or enter its letter+number
 * code on the keypad.
 */
export default function MachineNav() {
  const router = useRouter();
  const [pendingLetter, setPendingLetter] = useState<Letter | null>(null);
  const [readout, setReadout] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (readoutTimer.current) clearTimeout(readoutTimer.current);
    };
  }, []);

  function activate(item: MachineItem) {
    if (item.href) {
      router.push(item.href);
      return;
    }
    // Decorative item: no destination yet — just acknowledge the press.
    // The real "vends anyway" animation is a follow-up pass (Phase 3b).
    setAnnouncement(`${item.code}, ${item.label} — not linked yet`);
    setHighlightedId(item.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
  }

  function pressLetter(letter: Letter) {
    setPendingLetter(letter);
    setReadout(letter);
    setAnnouncement(letter);
    if (readoutTimer.current) clearTimeout(readoutTimer.current);
  }

  function pressNumber(number: "1" | "2" | "3") {
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

      {/* Mode 2: pick from the on-screen menu (the art already draws the
          visible "About/Artists/Locations/Contact" screen text — this is
          just the transparent, focusable hit area on top of it) */}
      {MENU_ITEMS.map((item, index) => (
        <Link
          key={item.id}
          href={item.href!}
          style={rectToStyle(getMenuHitZone(index))}
          className="machine-nav__menu-link"
        >
          <span className="visually-hidden">{item.label}</span>
        </Link>
      ))}

      {/* Mode 3: keypad code entry */}
      {KEYPAD_BUTTONS.map(({ key, rect }) => (
        <button
          key={key}
          type="button"
          style={rectToStyle(rect)}
          className={`machine-nav__key${
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
        style={rectToStyle(CODE_READOUT_RECT)}
        className="machine-nav__readout"
        aria-hidden="true"
      >
        {readout}
      </div>
      <span role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </span>
    </nav>
  );
}
