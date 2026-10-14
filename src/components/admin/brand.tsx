import Image from 'next/image'

/** Logo on the login and other sign-in screens. */
export function Logo() {
  return (
    <div className="vtegi-logo">
      <Image src="/brand/vtegi-mark.png" alt="" width={48} height={46} priority />
      <div>
        <span className="vtegi-logo__word">VTEGI</span>
        <span className="vtegi-logo__sub">Website admin</span>
      </div>
    </div>
  )
}

/** Mark in the admin header breadcrumb. */
export function Icon() {
  return (
    <Image src="/brand/vtegi-mark.png" alt="VTEGI" width={26} height={25} className="vtegi-icon" />
  )
}
