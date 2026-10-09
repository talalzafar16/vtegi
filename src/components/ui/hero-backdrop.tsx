/** Dotted grid + soft red glow used behind dark hero sections. Decorative only. */
export function HeroBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_75%_45%,black,transparent_65%)] [background-size:28px_28px]"
      />
      <div
        aria-hidden
        className="absolute top-1/4 right-[-10%] size-[640px] rounded-full bg-brand-700/25 blur-[140px]"
      />
    </>
  )
}
