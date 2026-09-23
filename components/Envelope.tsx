"use client";

import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { InvitationCard } from "./InvitationCard";
import { WaxSeal } from "./Toile";
import { EmbossedFloral, CornerFlourish } from "./Florals";
import { content } from "@/lib/content";

// ── Geometry (px) ──────────────────────────────────────────────
// A classic four-flap envelope back: a wide top flap folds down to the
// center, where it meets the left/right/bottom flaps. The seams radiating
// from that center to the four corners are what make it read, at a glance,
// as a sealed envelope.
const W = 540; // envelope width
const H = 300; // envelope height (≈1.8:1 — deep enough for legible flaps)
const CW = 480; // invitation card width

const STAGE_W = 660; // extra width so the card's shadow + corner flourishes aren't clipped
const STAGE_H = 1040; // fits the tall Shoval & Daniel card centered, with room for the close control

const ENV_LEFT = (STAGE_W - W) / 2; // 60
const ENV_RIGHT = ENV_LEFT + W; // 600
const CENTER_X = STAGE_W / 2; // 330

const ENV_TOP = STAGE_H - H; // envelope sits at the bottom of the stage
const CENTER_Y = ENV_TOP + H / 2; // the V apex / seam junction (stage y) — the seal's home
const CARD_TOP = 40; // card's resting top → roughly centered in the stage
const SLIDE_D = CENTER_Y - CARD_TOP + 44; // how far down the card starts (hidden inside)
const STAGE_SHIFT = CENTER_Y - STAGE_H / 2; // shift so the *envelope* is centered when closed

const SEAL = 120; // wax-seal diameter

// ── Motion ─────────────────────────────────────────────────────
const EASE_FLAP = [0.22, 1, 0.36, 1] as const;
const EASE_SLIDE = [0.16, 1, 0.3, 1] as const; // weighty, cinematic ease-out

// Timings (seconds). Tuned so the full open lands around ~5s — gracefully
// slow and cinematic. Edit here to re-pace the whole sequence in one place.
const T = {
  seal: 0.55,
  beatAfterSeal: 0.12,
  flap: 1.4,
  beatAfterFlap: 0.42,
  slide: 2.4,
  shift: 2.5,
  shadow: 2.3,
  driftAt: 1.0, // when the emptied envelope begins fading (into the slide)
  drift: 1.5, // how long it takes to drift away
  // Close is symmetrical but noticeably quicker, so replaying isn't tedious.
  closeCard: 1.3,
  closeShift: 1.3,
  closeFlap: 0.8,
};

const SHADOW_IN = "0 6px 14px -10px rgba(40,55,95,0.45)";
const SHADOW_OUT =
  "0 40px 80px -34px rgba(40,55,95,0.55), 0 10px 24px -14px rgba(40,55,95,0.35)";

// While closed / emerging, the card is revealed only through the downward "V"
// of the envelope mouth — everything below the V (and the whole lower body) is
// masked, so the card looks like it's being drawn up out of the envelope.
const B = 1500;
const CLIP_CLOSED = `polygon(${-B}px ${-B}px, ${STAGE_W + B}px ${-B}px, ${STAGE_W + B}px ${ENV_TOP}px, ${ENV_RIGHT}px ${ENV_TOP}px, ${CENTER_X}px ${CENTER_Y}px, ${ENV_LEFT}px ${ENV_TOP}px, ${-B}px ${ENV_TOP}px)`;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Mobile-first fit ───────────────────────────────────────────
// Scale the fixed-size stage to whatever the device gives us. We fit to the
// viewport in BOTH dimensions (no lower floor) so the whole stage always fits
// on screen — that's what keeps the envelope vertically centered rather than
// overflowing and being top-aligned.
const MARGIN_X = 20; // breathing room left/right
const MARGIN_Y = 24; // breathing room top/bottom
const MAX_SCALE = 1.75; // ceiling — lets the stage scale up to fill big screens
const DEFAULT_SCALE = 0.7; // SSR / first-paint guess before we can measure

// Avoid React's useLayoutEffect-on-server warning while still measuring
// before the browser paints on the client.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Largest scale at which the whole stage fits the viewport (capped at 1×). */
function useStageScale() {
  const [scale, setScale] = useState(DEFAULT_SCALE);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const availW = window.innerWidth - MARGIN_X;
      const availH = window.innerHeight - MARGIN_Y;
      const fit = Math.min(availW / STAGE_W, availH / STAGE_H);
      setScale(Math.min(MAX_SCALE, fit));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return scale;
}

type Phase = "closed" | "opening" | "open";

export function Envelope() {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");
  const [clipOpen, setClipOpen] = useState(false);
  const busy = useRef(false);
  const scale = useStageScale();

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
    animate(".hdr", { opacity: 0, y: -8 }, { duration: 0.5, ease: "easeOut" });
    animate(".hint", { opacity: 0 }, { duration: 0.4 });
    await animate(".env-seal", { opacity: 0, scale: 0.4, y: 6 }, { duration: T.seal, ease: "easeIn" });
    await delay(T.beatAfterSeal * 1000);

    // 2) top flap swings open
    await animate(".env-flap", { rotateX: 180 }, { duration: T.flap, ease: EASE_FLAP });

    // 3) a beat, then the card is drawn out (slide + recenter + shadow lift), concurrently
    await delay(T.beatAfterFlap * 1000);
    animate(".shift", { y: 0 }, { duration: T.shift, ease: EASE_SLIDE });
    animate(
      ".inv-card",
      { boxShadow: [SHADOW_IN, SHADOW_OUT] },
      { duration: T.shadow, ease: "easeOut" },
    );
    const slide = animate(
      ".inv-card",
      { y: 0, rotate: 0, scale: 1 },
      { duration: T.slide, ease: EASE_SLIDE },
    );

    // 4) as the card clears the mouth, drop the clip and let the envelope drift away
    await delay(T.driftAt * 1000);
    setClipOpen(true);
    animate(
      ".env-part",
      { opacity: 0, y: 30, scale: 0.97 },
      { duration: T.drift, ease: "easeInOut" },
    );

    await slide;
    setPhase("open");
    animate(".close-btn", { opacity: 1 }, { duration: 0.6, ease: "easeOut" });
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
    animate(".env-part", { opacity: 1, y: 0, scale: 1 }, { duration: 0.6, ease: "easeOut" });
    animate(".shift", { y: -STAGE_SHIFT }, { duration: T.closeShift, ease: EASE_SLIDE });
    animate(".inv-card", { boxShadow: SHADOW_IN }, { duration: 0.9 });
    await animate(
      ".inv-card",
      { y: SLIDE_D, rotate: -0.8, scale: 0.985 },
      { duration: T.closeCard, ease: EASE_SLIDE },
    );
    await animate(".env-flap", { rotateX: 0 }, { duration: T.closeFlap, ease: EASE_FLAP });
    animate(".env-seal", { opacity: 1, scale: 1, y: 0 }, { duration: 0.35, ease: "easeOut" });
    animate(".hdr", { opacity: 1, y: 0 }, { duration: 0.5 });
    animate(".hint", { opacity: 1 }, { duration: 0.5 });
    setPhase("closed");
    busy.current = false;
  };

  const cx = { left: "50%", marginLeft: -W / 2 } as const; // center a W-wide box

  // Four fold seams radiating from the center to each corner, drawn tone-on-tone
  // (a dark line + a light offset) so they read as pressed paper folds.
  const seams = (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      className="absolute inset-0"
    >
      {(
        [
          ["rgba(34,58,107,0.4)", 0.6, 0.7],
          ["rgba(255,251,242,0.85)", -0.6, -0.7],
        ] as const
      ).map(([col, dx, dy], k) => (
        <g key={k} stroke={col} strokeWidth={k === 0 ? 1.3 : 1} strokeLinecap="round">
          <line x1={W / 2 + dx} y1={H / 2 + dy} x2={0 + dx} y2={0 + dy} />
          <line x1={W / 2 + dx} y1={H / 2 + dy} x2={W + dx} y2={0 + dy} />
          <line x1={W / 2 + dx} y1={H / 2 + dy} x2={0 + dx} y2={H + dy} />
          <line x1={W / 2 + dx} y1={H / 2 + dy} x2={W + dx} y2={H + dy} />
        </g>
      ))}
    </svg>
  );

  return (
    <div className="flex flex-col items-center">
      {/* fluid fit: the wrapper's layout box is the *scaled* size (so the page
          reserves the right space & centers), the inner box is the true-size
          stage scaled from its top-left corner. Scale is measured per device. */}
      <div
        className="stage-fit relative"
        style={
          {
            "--s": scale,
            "--stage-w": STAGE_W,
            "--stage-h": STAGE_H,
          } as CSSProperties
        }
      >
        <div
          ref={scope}
          className="stage-inner relative"
          style={{ width: STAGE_W, height: STAGE_H }}
        >
          {/* stage shift: centers the envelope when closed, the card when open */}
          <div className="shift absolute inset-0">
            <div
              className={`absolute inset-0 ${phase === "closed" ? "env-float" : ""}`}
              style={{ perspective: 1400 }}
            >
              {/* headings (overlay, fade out on open) */}
              <header
                className="hdr absolute w-full text-center"
                style={{ top: ENV_TOP - 128 }}
              >
                <div className="inline-block rounded-2xl border border-gold-soft/60 bg-paper/70 px-6 py-3 shadow-[0_10px_30px_-16px_rgba(40,55,95,0.5)] backdrop-blur-sm">
                  <p className="font-hebrew text-2xl text-ink-soft sm:text-3xl">הזמנה לחתונה של דניאל ושובל</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.35em] text-gold sm:text-base">
                    You&rsquo;re Invited
                  </p>
                </div>
              </header>

              {/* envelope back wall — ivory paper with blue toile florals */}
              <div
                className="env-part absolute overflow-hidden rounded-[8px] border border-gold-soft/60"
                style={{
                  ...cx,
                  bottom: 0,
                  width: W,
                  height: H,
                  zIndex: 0,
                  background: "linear-gradient(165deg, #fbf6ec 0%, #f1e7d3 100%)",
                  boxShadow:
                    "inset 0 10px 22px -14px rgba(40,55,95,0.32), 0 18px 40px -22px rgba(40,55,95,0.4)",
                }}
              >
                <EmbossedFloral id="back" width={W} height={H} className="absolute inset-0" />
              </div>

              {/* the shadowed inside (top triangle) — revealed as the flap opens */}
              <div
                className="env-part absolute"
                style={{
                  ...cx,
                  top: ENV_TOP,
                  width: W,
                  height: H / 2,
                  zIndex: 4,
                  pointerEvents: "none",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #e9ddc4 0%, #d7c8a7 100%)",
                  boxShadow: "inset 0 -20px 28px -14px rgba(30,42,80,0.4)",
                }}
              />

              {/* the invitation card — lives BEHIND the flaps, revealed only
                  through the mouth's V while emerging */}
              <div
                className="absolute inset-0"
                style={{ zIndex: 10, clipPath: clipOpen ? "none" : CLIP_CLOSED }}
              >
                <div
                  className="inv-card absolute overflow-hidden rounded-[14px]"
                  style={{
                    left: "50%",
                    marginLeft: -CW / 2,
                    top: CARD_TOP,
                    width: CW,
                    willChange: "transform",
                    background: "#ffffff",
                  }}
                >
                  <InvitationCard />
                </div>
              </div>

              {/* front assembly — the left + right + bottom flaps as one opaque
                  sheet (rectangle minus the top triangle), with embossed florals.
                  Its top edge is the downward V the card is drawn out of. */}
              <div
                className="env-part absolute overflow-hidden rounded-b-[8px]"
                style={{
                  ...cx,
                  bottom: 0,
                  width: W,
                  height: H,
                  zIndex: 20,
                  clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)",
                  background: "linear-gradient(180deg, #f5ecda 0%, #ece0c6 100%)",
                  filter: "drop-shadow(0 -3px 6px rgba(40,55,95,0.12))",
                }}
              >
                <EmbossedFloral id="front" width={W} height={H} className="absolute inset-0" />
              </div>

              {/* the four fold seams (over the front, under the closed flap) */}
              <div
                className="env-part absolute"
                style={{ ...cx, bottom: 0, width: W, height: H, zIndex: 25, pointerEvents: "none" }}
              >
                {seams}
              </div>

              {/* toile-style border frame — a double navy keyline just inside the
                  envelope edge with a botanical flourish in each corner. Sits
                  above the flaps (below the seal) so it frames the closed
                  envelope; fades with the rest of the envelope on open. */}
              <div
                className="env-part absolute"
                style={{ ...cx, bottom: 0, width: W, height: H, zIndex: 35, pointerEvents: "none" }}
              >
                <div className="absolute inset-[9px] rounded-[5px] border border-gold-deep/40" />
                <div className="absolute inset-[13px] rounded-[3px] border border-gold-soft/70" />
                <CornerFlourish size={54} className="absolute left-[11px] top-[11px]" />
                <CornerFlourish size={54} className="absolute right-[11px] top-[11px] -scale-x-100" />
                <CornerFlourish size={54} className="absolute bottom-[11px] left-[11px] -scale-y-100" />
                <CornerFlourish size={54} className="absolute bottom-[11px] right-[11px] -scale-100" />
              </div>

              {/* top flap — a downward triangle that swings open (rotateX). In
                  front while sealed; drops behind the card once it opens. */}
              <div
                className="env-part env-flap absolute overflow-hidden"
                style={{
                  ...cx,
                  top: ENV_TOP,
                  width: W,
                  height: H / 2,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #f6eedd 0%, #ede1cb 100%)",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  zIndex: phase === "closed" ? 30 : 5,
                  filter: "drop-shadow(0 6px 8px rgba(40,55,95,0.2))",
                }}
              >
                <EmbossedFloral id="flap" width={W} height={H} className="absolute inset-0" />
                {/* fold shadow gathering toward the flap's lower point */}
                <div
                  className="absolute inset-0"
                  style={{ boxShadow: "inset 0 -22px 28px -20px rgba(34,58,107,0.45)" }}
                />
              </div>

              {/* gold wax seal with the intertwined D & S cipher, at the junction */}
              <div
                className="env-part env-seal absolute"
                style={{
                  left: "50%",
                  marginLeft: -SEAL / 2,
                  top: CENTER_Y - SEAL / 2,
                  zIndex: 40,
                }}
              >
                <WaxSeal tone="navy" monogram={content.envelope.monogram} size={SEAL} />
              </div>

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
                className="hint absolute w-full text-center"
                style={{ top: ENV_TOP + H + 22 }}
              >
                <span className="inline-block rounded-full border border-gold-soft/60 bg-paper/70 px-5 py-2 text-base tracking-wide text-ink-soft shadow-[0_10px_24px_-16px_rgba(40,55,95,0.5)] backdrop-blur-sm">
                  <span className="font-hebrew">לחצו לפתיחה</span>
                  <span className="mx-2 text-gold">·</span>
                  <span className="uppercase tracking-[0.18em]">Tap to open</span>
                </span>
              </p>
            </div>
          </div>

          {/* close / replay (fades in once open) — a persistent pill with a
              generous tap target (≥44px), so it works on touch without relying
              on :hover, which never fires on a phone */}
          <button
            type="button"
            onClick={close}
            disabled={phase !== "open"}
            className="close-btn absolute bottom-2 left-1/2 flex min-h-[44px] -translate-x-1/2 cursor-pointer items-center rounded-full border border-gold-soft/70 bg-paper/70 px-6 py-3 text-sm uppercase tracking-[0.2em] text-ink-soft backdrop-blur-sm transition-colors hover:text-gold disabled:pointer-events-none"
          >
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );
}
