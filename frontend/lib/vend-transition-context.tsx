"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type VendTransitionPhase = "covering" | "holding" | "fading";

type VendTransitionState = {
  active: boolean;
  color: string;
  phase: VendTransitionPhase;
};

// Durations for the three-phase page transition triggered when a vend
// finishes on a real item: a color swatch (matching the destination page's
// own background) grows to fill the screen, holds just long enough for the
// new page to have mounted underneath it (router.push fires at the same
// moment as "covering" starts), then fades to reveal it — see
// VendTransitionOverlay.tsx and the matching animation-durations in
// _vending-machine.scss, which must stay equal to these since this
// sequencing is driven by setTimeout, not by CSS animationend events.
const COVER_MS = 380;
const HOLD_MS = 250;
const FADE_MS = 380;

const IDLE_STATE: VendTransitionState = {
  active: false,
  color: "",
  phase: "covering",
};

type VendTransitionContextValue = {
  state: VendTransitionState;
  start: (color: string) => void;
};

const VendTransitionContext = createContext<VendTransitionContextValue | null>(
  null
);

/**
 * Lives in the root layout (outside {children}) so it survives the
 * navigation a vend triggers — MachineNav itself unmounts with the
 * homepage the moment router.push fires, but this overlay needs to keep
 * animating (and stay mounted) across that route change.
 */
export function VendTransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VendTransitionState>(IDLE_STATE);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = useCallback((color: string) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setState({ active: true, color, phase: "covering" });
    timers.current.push(
      setTimeout(
        () => setState((s) => ({ ...s, phase: "holding" })),
        COVER_MS
      )
    );
    timers.current.push(
      setTimeout(
        () => setState((s) => ({ ...s, phase: "fading" })),
        COVER_MS + HOLD_MS
      )
    );
    timers.current.push(
      setTimeout(() => setState(IDLE_STATE), COVER_MS + HOLD_MS + FADE_MS)
    );
  }, []);

  return (
    <VendTransitionContext.Provider value={{ state, start }}>
      {children}
    </VendTransitionContext.Provider>
  );
}

export function useVendTransition() {
  const context = useContext(VendTransitionContext);
  if (!context) {
    throw new Error(
      "useVendTransition must be used within a VendTransitionProvider"
    );
  }
  return context;
}
