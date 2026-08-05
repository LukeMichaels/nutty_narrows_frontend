"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    // The header is fixed, so it needs a class toggled on <body> (rather
    // than local state) to also shrink the spacer below that reserves its
    // space in normal document flow. The sentinel sits at the very top of
    // the page; once it scrolls out of view the user has scrolled at all,
    // which is the cue to switch to the compact header.
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle(
          "header-scrolled",
          !entry.isIntersecting
        );
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      document.body.classList.remove("header-scrolled");
    };
  }, []);

  // Header and its sentinel live in the root layout, so they never remount
  // on navigation — the IntersectionObserver above only re-checks once the
  // browser gets around to it, which can leave the compact header (sized
  // for wherever the user scrolled to on the PREVIOUS page) on screen just
  // long enough to cover the new page's content. Forcing both the scroll
  // position and the header's own state back to "top" the instant the route
  // changes removes that gap instead of waiting on it to self-correct.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.remove("header-scrolled");
  }, [pathname]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="header-sentinel" />
      <header>
        <div className="header-content site-margins">
          <div className="header-left">
            <Logo />
          </div>
          <div className="header-right">
            <HeaderNav />
          </div>
        </div>
      </header>
      <div className="header-spacer" aria-hidden="true" />
    </>
  );
}
