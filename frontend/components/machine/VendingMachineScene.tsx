import SceneBackdrop from "./SceneBackdrop";
import VendingMachineArt from "./VendingMachineArt";
import MachineNav from "./MachineNav";

/**
 * The vending-machine homepage scene: full-bleed floor/wall/baseboard with
 * the machine centered on top, and the accessible nav overlay aligned to
 * it. Backdrop, art, and nav overlay all share the same source viewBox
 * (see machine-items.ts), so stacking them in one aspect-ratio-locked box
 * keeps everything in registration at any screen size — no separate
 * cropping/scaling math needed between layers.
 *
 * Plant_1, Plant_2, and Picture_of_Sandy (wide-viewport-only decoration)
 * aren't ported yet — a quick follow-up once this is verified working.
 */
export default function VendingMachineScene() {
  return (
    <div className="vending-machine-scene full-bleed">
      <SceneBackdrop />
      <VendingMachineArt />
      <MachineNav />
    </div>
  );
}
