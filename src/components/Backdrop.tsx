/**
 * Fixed ambient backdrop: deep gradient blobs, a whisper-thin grid and a
 * grain layer. Pure CSS so it never fights with GSAP for frame time.
 */
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#131625_0%,#07080d_45%,#04050a_100%)]" />

      <div className="animate-drift-a absolute -top-[18vh] left-[-10vw] h-[62vh] w-[62vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(125,108,255,0.30),transparent_65%)] blur-[60px]" />
      <div className="animate-drift-b absolute top-[38vh] right-[-14vw] h-[58vh] w-[54vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(140,231,255,0.20),transparent_65%)] blur-[70px]" />
      <div className="animate-drift-a absolute bottom-[-16vh] left-[22vw] h-[52vh] w-[48vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(216,255,62,0.13),transparent_62%)] blur-[80px]" />

      <div className="grid-lines absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(80%_60%_at_50%_35%,black,transparent)]" />
      <div className="noise absolute inset-0 opacity-[0.055] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(4,5,10,0.6))]" />
    </div>
  );
}
