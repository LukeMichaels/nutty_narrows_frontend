"use client";

import { useEffect, useRef } from "react";
import Logo from "./Logo";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);

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
