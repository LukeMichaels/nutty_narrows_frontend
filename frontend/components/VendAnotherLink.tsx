"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Persistent way back to the vending machine from a real content page — the
 * shaped reveal on the homepage is only a transition, not a permanent
 * container, so once someone lands on /about (etc.) they need a quick path
 * back to vending instead of relying on browser back.
 *
 * The icon (ported from frontend/design/tiny vending machine.svg) fills
 * with `currentColor`, so it follows whatever `color` is set on
 * .vend-another-link (or .vend-another-link__icon directly, for an icon
 * color independent of the text) in _vend-another-link.scss.
 */
export default function VendAnotherLink() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link href="/" className="vend-another-link">
      <svg
        className="vend-another-link__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 882.5 1080"
        aria-hidden="true"
      >
        <defs>
          <style>{`
      .vend-another-link__icon .st0 {
        fill: currentColor;
      }
          `}</style>
        </defs>
        <path id="vending_outline" className="st0" d="M872.5,64.1c0-33.9-30-58.3-62.2-58.3l-740.8.2c-31.2,0-59.6,26.1-59.6,58v919.1c0,31.9,28.4,58,59.6,58h16.1c2.6,7.7,14,33,49.8,33s48.2-27.2,48.1-33h512c2.6,7.7,14,33,49.8,33s48.2-27.2,48.1-32.9h19.7c31.2,0,59.6-26.1,59.6-58.5V64.1ZM809.7,999.4H72.2c-11.1,0-20.5-6.9-20.5-18.7V66.5c0-9.2,7.4-18.4,17-18.4h744.9c9.6,0,17,9.2,17,18.5v914.2c-.4,11.8-9,18.7-21,18.7Z"/>
        <path id="vending_window" className="st0" d="M169.9,763.8l351.8.4c27.9-2.3,47.7-24.9,47.7-52.2l-.2-544.3c0-25.6-22-49.1-48-49.1l-348.7-.2c-29.2,0-50.6,24.6-50.5,52.9l.4,544.3c0,25,22.3,48.2,47.5,48.2ZM519.8,722H174.4c-5.2,0-10-2.5-10-8.1v-20.1c0,0,362.6,0,362.6,0l.2,20.2c0,2.7-3,8-7.5,8ZM261.4,597h21.9c0,0,0,42.3,0,42.3l-21.9.3v-42.6ZM408.5,596.9h21.6c0,0,0,42.4,0,42.4l-21.6.2v-42.6ZM472.1,652v-68.5c-.9-15.5-12.7-27.3-28.3-28.4h-48.4c-15.9.2-28,12.9-29.1,28.4v68.4s-41.1,0-41.1,0v-65.9c.6-16.1-11.9-30.8-28.5-30.8h-47.6c-16.1-.2-28.7,12.6-29.6,28.4v68.3s-55.2,0-55.2,0v-152.7s363,0,363,0v152.6s-55.2,0-55.2,0ZM261.4,457.4v-42.5c0,0,21.9,0,21.9,0v42.2s-21.9.2-21.9.2ZM408.5,415h21.6c0,0,0,42.1,0,42.1l-21.7.2v-42.3ZM172.7,160.4h346.7c4.2,0,7,4.3,7.9,7.6v107.2s-55.2,0-55.2,0v-56.4c-1.2-15.6-13.6-27.4-29.2-28h-47.5c-15.9.2-28.3,13.2-29.1,28.8v55.6s-41.2,0-41.2,0v-56.6c-1.1-15-13.2-27.6-28.6-27.7l-48.2-.2c-15.9.8-28.1,13-28.8,28.9v55.4s-55.2,0-55.2,0v-106.6c.7-4.2,3.5-8.2,8.4-8.2ZM430.2,275.1h-21.7c0,0,0-42.2,0-42.2h21.6s0,42.2,0,42.2ZM283.3,232.9v42.2s-21.9,0-21.9,0v-42.2s21.9,0,21.9,0ZM164.3,317.4h363s0,139.9,0,139.9h-55.2c0,0,0-53.5,0-53.5.4-17.2-12.8-30.7-30-30.9l-47.6.2c-16.5,0-28.8,15.3-28.2,31.4v52.7s-41.1,0-41.1,0v-57.2c-1.5-15.2-13.8-27.1-29.4-27.2h-46.7c-16.1.4-28.6,12.3-29.6,28.3v55.9s-55.2,0-55.2,0v-139.9Z"/>
        <path id="controls_outline" className="st0" d="M762,118.4h-127.8c-20.2.2-36.3,17.8-36.3,37.8v349.6c0,20.3,15.4,38.5,36.4,38.5h128.9c20.1,0,36.1-17.7,36.1-37.1V154.9c0-20.2-17.7-36.5-37.4-36.4ZM757.5,502.4h-117.6c0,0,0-342.1,0-342.1h117.6s0,342.1,0,342.1Z"/>
        <path id="open_door" className="st0" d="M531.8,809.3H159.4c-20.2,0-37,17.1-37,36.7l-.2,93.7c0,19,15,38.5,35.4,38.5h375.6c21.3,0,36.2-19.1,36.2-38.6v-90.9c0-20.8-15.8-39.4-37.6-39.4ZM527.3,936.6H164.3s0-85.2,0-85.2h363s0,85.2,0,85.2Z"/>
        <path id="top_button" className="st0" d="M671.2,236.3h57.7c12.6-.1,20.5-10.2,20.1-22-.4-11.3-8.1-20.1-19.7-20.1l-61.5.2c-10.9,0-17.9,10.7-17.9,20.6,0,12.9,8.8,21.3,21.3,21.3Z"/>
        <path id="second_button" className="st0" d="M668,301.1l59.2.2c13.3,0,21.9-10.1,21-22.7-.8-11.6-8.9-19.5-20.6-19.6h-57.2c-12.8,0-21.8,9.4-21.2,22.4.5,10.3,7.7,19.7,18.8,19.7Z"/>
        <path id="third_button" className="st0" d="M665.9,365.9h63.9c11,0,17.4-10.6,17.6-20.3.2-10-6.3-21-17.2-21l-65.1-.2c-11,1.9-17.4,11.2-16.8,22.2.5,9.5,7.1,19.4,17.5,19.3Z"/>
        <path id="bottom_button" className="st0" d="M664.3,430.7l65.1.2c10.3,0,17-10.1,17.2-20,.3-10.3-6.4-21.2-17.2-21.3l-62.5-.2c-10.3,0-17.3,6.9-19.1,16.8-1.9,10.5,4.3,24.6,16.4,24.6Z"/>
      </svg>
      Vend another
    </Link>
  );
}
