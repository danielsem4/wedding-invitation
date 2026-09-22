"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { InvitationCard } from "./InvitationCard";
import { content } from "@/lib/content";

// ── Geometry (px) ──────────────────────────────────────────────
const W = 340; // envelope width
const H = 214; // envelope height
const POCKET = 132; // front-pocket height (masks the card = "inside")
const CW = 308; // invitation card width

const STAGE_W = 440; // extra width so the card's soft shadow isn't clipped
const STAGE_H = 930; // fits the tall Shoval & Daniel card centered, with room for the close control

const ENV_TOP = STAGE_H - H; // envelope sits at the bottom of the stage
const MOUTH = ENV_TOP + (H - POCKET); // y of the pocket's top edge (the opening)
const CARD_TOP = 40; // card's resting top → roughly centered in the stage
const SLIDE_D = MOUTH - CARD_TOP + 44; // how far down the card starts (hidden inside)
const STAGE_SHIFT = ENV_TOP + H / 2 - STAGE_H / 2; // shift so the *envelope* is centered when closed
const CLIP_BOTTOM = STAGE_H - MOUTH; // clip everything below the mouth while emerging

// ── Motion ─────────────────────────────────────────────────────
const EASE_FLAP = [0.22, 1, 0.36, 1] as const;
const EASE_SLIDE = [0.16, 1, 0.3, 1] as const; // weighty, cinematic ease-out

const SHADOW_IN = "0 6px 14px -10px rgba(80,60,20,0.45)";
const SHADOW_OUT =
  "0 40px 80px -34px rgba(80,60,20,0.55), 0 10px 24px -14px rgba(80,60,20,0.35)";

const CLIP_CLOSED = `inset(-1500px -1500px ${CLIP_BOTTOM}px -1500px)`;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = "closed" | "opening" | "open";

export function Envelope() {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");
  const [clipOpen, setClipOpen] = useState(false);
  const busy = useRef(false);

  // Set the closed starting positions imperatively (kept out of JSX so React
  // re-renders never fight the imperative transforms).
  useEffect(() => {
    animate(".shift", { y: -STAGE_SHIFT }, { duration: 0 });
    animate(".inv-card", { y: SLIDE_D, rotate: -0.8, scale: 0.985, boxShadow: SHADOW_IN }, { duration: 0 });
    animate(".env-flap", { rotateX: 0 }, { duration: 0 });
    animate(".env-part", { opacity: 1, y: 0, scale: 1 }, { duration: 0 });
    animate(".env-seal", { opacity: 1, scale: 1 }, { duration: 0 });
    animate(".close-btn", { opacity: 0 }, { duration: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = async () => {
    if (busy.current) return;
    busy.current = true;
    setPhase("opening");

    if (reduce) {
      animate(".hdr", { opacity: 0 }, { duration: 0.2 });
      animate(".hint", { opacity: 0 }, { duration: 0.2 });
      animate(".env-seal", { opacity: 0 }, { duration: 0.2 });
      animate(".env-part", { opacity: 0 }, { duration: 0.3 });
      animate(".shift", { y: 0 }, { duration: 0.3 });
      await animate(".inv-card", { y: 0, rotate: 0, scale: 1, boxShadow: SHADOW_OUT }, { duration: 0.3 });
      setClipOpen(true);
      animate(".close-btn", { opacity: 1 }, { duration: 0.3 });
      setPhase("open");
      busy.current = false;
      return;
    }

    // 1) seal releases + headings fade
    animate(".hdr", { opacity: 0, y: -8 }, { duration: 0.4, ease: "easeOut" });
    animate(".hint", { opacity: 0 }, { duration: 0.3 });
    await animate(".env-seal", { opacity: 0, scale: 0.4, y: 6 }, { duration: 0.35, ease: "easeIn" });

    // 2) flap swings open
    await animate(".env-flap", { rotateX: 180 }, { duration: 0.8, ease: EASE_FLAP });

    // 3) a beat, then the card is drawn out (slide + recenter + shadow lift), concurrently
    await delay(180);
    animate(".shift", { y: 0 }, { duration: 1.35, ease: EASE_SLIDE });
    animate(
      ".inv-card",
      { boxShadow: [SHADOW_IN, SHADOW_OUT] },
      { duration: 1.2, ease: "easeOut" },
    );
    const slide = animate(
      ".inv-card",
      { y: 0, rotate: 0, scale: 1 },
      { duration: 1.25, ease: EASE_SLIDE },
    );

    // 4) as the card clears the mouth, drop the clip and let the envelope drift away
    await delay(520);
    setClipOpen(true);
    animate(
      ".env-part",
      { opacity: 0, y: 30, scale: 0.97 },
      { duration: 0.85, ease: "easeInOut" },
    );

    await slide;
    setPhase("open");
    animate(".close-btn", { opacity: 1 }, { duration: 0.5, ease: "easeOut" });
    busy.current = false;
  };

  const close = async () => {
    if (busy.current) return;
    busy.current = true;
    setPhase("opening");
    setClipOpen(false);

    if (reduce) {
      animate(".close-btn", { opacity: 0 }, { duration: 0.15 });
      animate(".env-part", { opacity: 1, y: 0, scale: 1 }, { duration: 0.2 });
      animate(".inv-card", { y: SLIDE_D, rotate: -0.8, scale: 0.985, boxShadow: SHADOW_IN }, { duration: 0.2 });
      animate(".shift", { y: -STAGE_SHIFT }, { duration: 0.2 });
      animate(".env-flap", { rotateX: 0 }, { duration: 0.2 });
      animate(".env-seal", { opacity: 1, scale: 1, y: 0 }, { duration: 0.2 });
      animate(".hdr", { opacity: 1, y: 0 }, { duration: 0.2 });
      await animate(".hint", { opacity: 1 }, { duration: 0.2 });
      setPhase("closed");
      busy.current = false;
      return;
    }

    animate(".close-btn", { opacity: 0 }, { duration: 0.25 });
    animate(".env-part", { opacity: 1, y: 0, scale: 1 }, { duration: 0.5, ease: "easeOut" });
    animate(".shift", { y: -STAGE_SHIFT }, { duration: 0.9, ease: EASE_SLIDE });
    animate(".inv-card", { boxShadow: SHADOW_IN }, { duration: 0.7 });
    await animate(
      ".inv-card",
      { y: SLIDE_D, rotate: -0.8, scale: 0.985 },
      { duration: 0.9, ease: EASE_SLIDE },
    );
    await animate(".env-flap", { rotateX: 0 }, { duration: 0.55, ease: EASE_FLAP });
    animate(".env-seal", { opacity: 1, scale: 1, y: 0 }, { duration: 0.35, ease: "easeOut" });
    animate(".hdr", { opacity: 1, y: 0 }, { duration: 0.5 });
    animate(".hint", { opacity: 1 }, { duration: 0.5 });
    setPhase("closed");
    busy.current = false;
  };

  const cx = { left: "50%", marginLeft: -W / 2 } as const; // center a W-wide box

  return (
    <div className="flex flex-col items-center">
      <div className="origin-center scale-[0.78] sm:scale-90 xl:scale-100">
        <div ref={scope} className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
          {/* stage shift: centers the envelope when closed, the card when open */}
          <div className="shift absolute inset-0">
            <div
              className={`absolute inset-0 ${phase === "closed" ? "env-float" : ""}`}
              style={{ perspective: 1400 }}
            >
              {/* headings (overlay, fade out on open) */}
              <header
                className="hdr absolute w-full text-center"
                style={{ top: ENV_TOP - 92 }}
              >
                <p className="font-hebrew text-lg text-ink-soft sm:text-xl">הזמנה לחתונה</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">
                  You&rsquo;re Invited
                </p>
              </header>

              {/* envelope back wall */}
              <div
                className="env-part absolute rounded-[8px] border border-gold-soft/70"
                style={{
                  ...cx,
                  bottom: 0,
                  width: W,
                  height: H,
                  zIndex: 0,
                  background: "linear-gradient(160deg, #fffdf9 0%, #f1e9d8 100%)",
                  boxShadow:
                    "inset 0 10px 22px -14px rgba(90,70,25,0.55), 0 18px 40px -22px rgba(90,70,25,0.5)",
                }}
              />

              {/* the invitation card — lives BEHIND the front pocket, clipped while inside */}
              <div
                className="absolute inset-0"
                style={{ zIndex: 10, clipPath: clipOpen ? "none" : CLIP_CLOSED }}
              >
                <div
                  className="inv-card absolute rounded-[14px] border border-gold-soft/70"
                  style={{
                    left: "50%",
                    marginLeft: -CW / 2,
                    top: CARD_TOP,
                    width: CW,
                    willChange: "transform",
                    background: "linear-gradient(170deg, #fffefb 0%, #fbf6ec 100%)",
                  }}
                >
                  <InvitationCard />
                </div>
              </div>

              {/* interior shade at the mouth, so the card emerges from a shadowed inside */}
              <div
                className="env-part absolute"
                style={{
                  ...cx,
                  top: MOUTH - 30,
                  width: W,
                  height: 42,
                  zIndex: 15,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(60,45,15,0) 0%, rgba(60,45,15,0.16) 100%)",
                }}
              />

              {/* front pocket */}
              <div
                className="env-part absolute overflow-hidden rounded-b-[8px]"
                style={{ ...cx, bottom: 0, width: W, height: POCKET, zIndex: 20 }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, #f3ecdd 0%, #ece1cd 100%)" }}
                />
                <svg
                  className="absolute inset-0"
                  width={W}
                  height={POCKET}
                  viewBox={`0 0 ${W} ${POCKET}`}
                  fill="none"
                  aria-hidden="true"
                >
                  <line x1="0" y1="0" x2={W} y2="0" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6" />
                  <path
                    d={`M0 0 L ${W / 2} ${POCKET} L ${W} 0`}
                    stroke="var(--gold-soft)"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* top flap */}
              <div
                className="env-part env-flap absolute"
                style={{
                  ...cx,
                  top: ENV_TOP,
                  width: 0,
                  height: 0,
                  borderLeft: `${W / 2}px solid transparent`,
                  borderRight: `${W / 2}px solid transparent`,
                  borderTop: `${POCKET}px solid var(--gold-soft)`,
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  // in front while sealed; behind the card once it starts coming out
                  zIndex: phase === "closed" ? 30 : 5,
                  filter: "drop-shadow(0 4px 5px rgba(120,95,40,0.2))",
                }}
              />

              {/* wax seal */}
              <div
                className="env-part env-seal absolute flex h-12 w-12 items-center justify-center rounded-full text-paper"
                style={{
                  left: "50%",
                  marginLeft: -24,
                  top: ENV_TOP + 58,
                  zIndex: 40,
                  background: "radial-gradient(circle at 35% 30%, #d8b25e, #b5872f)",
                  boxShadow: "0 4px 10px -2px rgba(120,90,30,0.55)",
                }}
              >
                <span className="font-display text-base font-medium leading-none tracking-tight">
                  {content.envelope.monogram}
                </span>
              </div>

              {/* couple's name in gold calligraphy on the pocket */}
              <p
                className="env-part absolute w-full text-center font-script text-gold"
                style={{
                  top: ENV_TOP + H - 50,
                  fontSize: 27,
                  lineHeight: 1,
                  zIndex: 22,
                  pointerEvents: "none",
                }}
              >
                {content.envelope.script}
              </p>

              {/* invisible click target over the closed envelope */}
              {phase === "closed" && (
                <button
                  type="button"
                  aria-label="Open the invitation"
                  onClick={open}
                  className="absolute cursor-pointer rounded-[8px] outline-none"
                  style={{ ...cx, top: ENV_TOP, width: W, height: H, zIndex: 50 }}
                />
              )}

              {/* hint (overlay, fades out on open) */}
              <p
                className="hint absolute w-full text-center text-sm tracking-wide text-ink-soft"
                style={{ top: ENV_TOP + H + 18 }}
              >
                <span className="font-hebrew">לחצו לפתיחה</span>
                <span className="mx-2 text-gold">·</span>
                <span className="uppercase tracking-[0.18em]">Tap to open</span>
              </p>
            </div>
          </div>

          {/* close / replay (fades in once open) */}
          <button
            type="button"
            onClick={close}
            disabled={phase !== "open"}
            className="close-btn absolute bottom-1 left-1/2 -translate-x-1/2 cursor-pointer text-xs uppercase tracking-[0.2em] text-ink-soft underline-offset-4 transition-colors hover:text-gold hover:underline disabled:pointer-events-none"
          >
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );
}
