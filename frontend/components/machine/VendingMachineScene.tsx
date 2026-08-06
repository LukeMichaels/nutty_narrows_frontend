import SceneFloor from "./SceneBackdrop";
import VendingMachineArt from "./VendingMachineArt";
import MachineNav from "./MachineNav";
import { Plant1, Plant2 } from "./WallDecor";

/**
 * The vending-machine homepage scene. The machine is the focal element and
 * scales independently of the backdrop (edge-to-edge minus a small margin
 * on narrow viewports, capped at 75% of $site-margins on wide ones) — see
 * _vending-machine.scss. The scene is a flex column: a "stage" holds the
 * wall clearance + the machine, and a "floor-wrap" (baseboard + floor) is
 * a flex-grow sibling after it, pulled up 150px via the stage's own
 * negative margin so the machine appears to rest that far into the floor
 * — the floor-wrap still stretches all the way to the footer with zero
 * gap no matter the viewport height, it just starts higher. The machine
 * stays visually in front of the overlap via z-index. VendingMachineArt +
 * MachineNav share the machine's own local viewBox (see machine-items.ts)
 * so the interactive overlay stays in registration with the art
 * regardless of how large the machine renders.
 *
 * Plant_1, Plant_2, and the framed picture are wide-viewport-only wall
 * decoration (hidden below the 'b-943' breakpoint — see
 * _vending-machine.scss) positioned as percentages of the machine's own
 * box, not the wall/canvas, so they scale and stay in registration with it
 * at any width. Plant_1 (left) is placed before the machine art in DOM
 * order with no z-index of its own, so it paints behind the machine
 * (z-index: 1); Plant_2 (right) comes after, so it paints in front —
 * matching the source artwork's arrangement in Nutty Narrows Vending
 * Machine v3.svg.
 */
export default function VendingMachineScene() {
  return (
    <div className="vending-machine-scene full-bleed">
      <div className="vending-machine-scene__stage">
        <div className="vending-machine">
          <div className="wall-plant-slot wall-plant-slot--left">
            <Plant1 />
          </div>
          <VendingMachineArt />
          <MachineNav />
          <div className="wall-plant-slot wall-plant-slot--right">
            <Plant2 />
          </div>
          {/* Purely decorative, wide-viewport-only, and a heavy (~550KB)
              traced SVG — lazy + async-decoded so it never competes with
              the machine (the actual hero) for bandwidth on first paint.
              A plain <img> on purpose: next/image can't optimize SVGs
              (that needs dangerouslyAllowSVG, which we keep off). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="wall-picture"
            src="/wall-picture-of-sandy.svg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div className="scene-backdrop__floor-wrap">
        <div className="scene-backdrop__baseboard" aria-hidden="true" />
        <SceneFloor />
      </div>
    </div>
  );
}
