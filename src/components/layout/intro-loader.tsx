import Image from 'next/image'

import { HeroBackdrop } from '@/components/ui/hero-backdrop'

const STORAGE_KEY = 'vtegi-intro'

/**
 * Inlined into <head> as a string, so it runs before the first paint and must stay
 * self-contained (no imports or outer variables). See the intro section in globals.css.
 */
function startIntro(storageKey: string) {
  const html = document.documentElement
  try {
    if (sessionStorage.getItem(storageKey)) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    sessionStorage.setItem(storageKey, '1')
  } catch {
    return // Storage blocked: skip the intro rather than replay it on every load.
  }

  const end = () => html.removeAttribute('data-intro')
  const isExit = (event: AnimationEvent) => event.animationName === 'intro-exit'

  html.setAttribute('data-intro', 'hold')
  addEventListener(
    'animationstart',
    (event) => isExit(event) && html.setAttribute('data-intro', 'exit'),
  )
  addEventListener('animationend', (event) => isExit(event) && end())
  // Clicking, typing or scrolling skips it.
  ;['pointerdown', 'keydown', 'wheel'].forEach((type) =>
    addEventListener(type, end, { once: true, passive: true }),
  )
  setTimeout(end, 4000) // Safety net in case animation events never fire.
}

/** Decides before the first paint whether to play the intro. Render inside <head>. */
export function IntroScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `(${startIntro.toString()})('${STORAGE_KEY}')` }} />
  )
}

/**
 * First-visit intro, once per browser session and never for reduced-motion users: the mark and
 * wordmark rise in while the HQ coordinates type out and a red signal line counts to 100%, then
 * the panel lifts away to reveal the page. Hidden unless the script above turned it on, so it
 * costs nothing on later page loads or without JavaScript.
 */
export function IntroLoader() {
  return (
    <div
      aria-hidden
      className="intro fixed inset-0 z-200 place-items-center bg-ink-1000 text-white"
    >
      <HeroBackdrop />

      <div className="relative flex flex-col items-center px-4 text-center">
        <Image
          src="/brand/vtegi-mark.png"
          alt=""
          width={80}
          height={77}
          priority
          className="intro-mark h-auto w-14 md:w-20"
        />
        <p className="mt-6 flex overflow-hidden pb-[0.08em] text-[clamp(3.5rem,2rem+7vw,8rem)] leading-none font-extrabold tracking-tight font-stretch-expanded">
          {[...'VTEGI'].map((letter, i) => (
            <span
              key={i}
              className="inline-block animate-line-up"
              style={{ animationDelay: `${0.15 + i * 0.06}s` }}
            >
              {letter}
            </span>
          ))}
        </p>
        <p className="mt-5 animate-fade-in font-mono text-[10px] tracking-[0.25em] text-ink-400 uppercase [animation-delay:600ms] sm:text-[11px] sm:tracking-[0.35em]">
          Virtual Technology Enterprise Group
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-between px-4 font-mono text-[11px] tracking-[0.18em] text-ink-500 uppercase md:bottom-8 md:px-8">
        <span className="intro-coords whitespace-nowrap">38.42°N 77.41°W · Stafford, VA</span>
        <span className="intro-count text-white" />
      </div>
      <div className="intro-line absolute inset-x-0 bottom-0 h-0.5 bg-brand-500 shadow-[0_0_16px_var(--color-brand-600)]" />
    </div>
  )
}
