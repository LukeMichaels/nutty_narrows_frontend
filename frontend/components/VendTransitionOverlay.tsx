"use client";

import { useVendTransition } from "@/lib/vend-transition-context";

/**
 * The full-screen color swatch that grows to cover the viewport when a
 * vend on a real item finishes, then fades to reveal the destination page
 * (already mounted underneath, in the same color) — see
 * lib/vend-transition-context.tsx for the phase timing this reflects, and
 * _vending-machine.scss for the animations themselves.
 */
export default function VendTransitionOverlay() {
  const { state } = useVendTransition();

  if (!state.active) return null;

  return (
    <div
      className={`vend-transition-overlay vend-transition-overlay--${state.phase}`}
      style={{ backgroundColor: state.color }}
      aria-hidden="true"
    />
  );
}
