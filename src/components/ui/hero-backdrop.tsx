/**
 * Backdrop for dark hero sections: an engineering-drawing hairline grid, a deep oxblood
 * vignette, and a red signal line along the bottom edge. Decorative only.
 */
export function HeroBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.045)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)] [background-size:72px_72px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_35%,rgb(61_1_1/0.75),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand-600/70 to-transparent"
      />
    </>
  )
}
