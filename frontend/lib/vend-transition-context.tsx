"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { VEND_ANIMATION_MS } from "@/components/machine/machine-items";

type VendTransitionPhase = "covering" | "holding" | "fading";

type VendTransitionState = {
  active: boolean;
  color: string;
  phase: VendTransitionPhase;
};

// Durations for the three-phase page transition triggered when a vend
// finishes on a real item: a color swatch grows to fill the screen (in
// step with MachineNav's own squirrel-arms scale-up — see
// vend-reveal--covering in _vending-machine.scss), holds fully opaque for
// exactly as long as the actual navigation takes (however long that is —
// see the isPending effect below, not a guessed timer), then fades to
// reveal the now-ready destination page. COVER_MS/FADE_MS must match the
// animation-durations in _vending-machine.scss.
const COVER_MS = VEND_ANIMATION_MS.covering;
const FADE_MS = 380;
// Once the navigation is actually ready, stay fully covered for at least
// this long before fading — otherwise an already-cached destination
// resolves instantly and the reveal reads as an abrupt jump-cut instead of
// a deliberate transition.
const MIN_HOLD_MS = 150;

const IDLE_STATE: VendTransitionState = {
  active: false,
  color: "",
  phase: "covering",
};

type VendTransitionContextValue = {
  state: VendTransitionState;
  start: (color: string, href: string) => void;
};

const VendTransitionContext = createContext<VendTransitionContextValue | null>(
  null
);

/**
 * Lives in the root layout (outside {children}) so it survives the
 * navigation a vend triggers — MachineNav itself unmounts with the
 * homepage once the destination has committed, but this overlay needs to
 * keep animating (and stay mounted) across that route change.
 *
 * Owns the actual `router.push` for real-item vends (rather than
 * MachineNav firing it immediately) so the color swatch can finish
 * covering the screen BEFORE navigation starts, and can stay covered for
 * however long the navigation genuinely takes (tracked via
 * `useTransition`'s `isPending`) instead of a fixed guessed duration —
 * this is what keeps a slow/uncached navigation from finishing its
 * animation before the destination is ready (a dead pause), and keeps a
 * fast/cached one from letting the destination page flash into view
 * before the cover animation has actually finished covering it.
 */
export function VendTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<VendTransitionState>(IDLE_STATE);
  const [isPending, startTransition] = useTransition();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const holdResolvedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const start = useCallback(
    (color: string, href: string) => {
      clearTimers();
      holdResolvedRef.current = false;
      setState({ active: true, color, phase: "covering" });

      timers.current.push(
        setTimeout(() => {
          setState((s) => ({ ...s, phase: "holding" }));
          startTransition(() => {
            router.push(href, { scroll: false });
          });
        }, COVER_MS)
      );
    },
    [clearTimers, router, startTransition]
  );

  // Fires once the navigation started above has actually committed
  // (isPending clears) while still sitting in the fully-covered "holding"
  // state. Guarded by holdResolvedRef so a fast/cached navigation — where
  // isPending may clear almost immediately — still gets exactly one
  // MIN_HOLD_MS beat before fading, rather than re-scheduling on every
  // render.
  useEffect(() => {
    if (state.phase !== "holding" || isPending || holdResolvedRef.current) {
      return;
    }
    holdResolvedRef.current = true;
    timers.current.push(
      setTimeout(() => {
        setState((s) => ({ ...s, phase: "fading" }));
        timers.current.push(setTimeout(() => setState(IDLE_STATE), FADE_MS));
      }, MIN_HOLD_MS)
    );
  }, [state.phase, isPending]);

  useEffect(() => clearTimers, [clearTimers]);

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
