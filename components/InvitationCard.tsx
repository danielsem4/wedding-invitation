import { content } from "@/lib/content";

/** A small gold divider with a center diamond. */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <span className="h-px w-10 bg-gold/50 sm:w-16" />
      <span className="rotate-45 text-gold text-[10px] leading-none">◆</span>
      <span className="h-px w-10 bg-gold/50 sm:w-16" />
    </div>
  );
}

/** A bilingual block: Hebrew line (RTL) stacked over English line (LTR). */
function BiLine({
  he,
  en,
  className = "",
  heClass = "",
  enClass = "",
}: {
  he: string;
  en: string;
  className?: string;
  heClass?: string;
  enClass?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <p dir="rtl" className={`font-hebrew ${heClass}`}>
        {he}
      </p>
      <p dir="ltr" className={enClass}>
        {en}
      </p>
    </div>
  );
}

/**
 * The invitation content — rendered statically (already "printed" on the card).
 * The reveal comes from the card physically sliding out of the envelope, not
 * from fading these lines in.
 */
export function InvitationCard() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-9 text-ink sm:px-9">
      <BiLine
        he={content.invite.he}
        en={content.invite.en}
        className="max-w-[15rem]"
        heClass="text-base text-ink-soft sm:text-lg"
        enClass="mt-1 text-xs uppercase tracking-[0.18em] text-ink-soft sm:text-sm"
      />

      {/* Couple names — the centerpiece */}
      <div className="text-center">
        <h1
          dir="rtl"
          className="font-hebrew text-4xl font-medium leading-tight text-ink sm:text-5xl"
        >
          {content.couple.he}
        </h1>
        <h2 className="mt-1 text-2xl font-light tracking-wide text-gold sm:text-3xl">
          {content.couple.en}
        </h2>
      </div>

      <Divider />

      <BiLine
        he={content.date.he}
        en={content.date.en}
        heClass="text-lg font-medium text-ink sm:text-xl"
        enClass="mt-0.5 text-sm tracking-wide text-ink-soft sm:text-base"
      />

      <BiLine
        he={content.time.he}
        en={content.time.en}
        heClass="text-base text-ink sm:text-lg"
        enClass="mt-0.5 text-xs tracking-wide text-ink-soft sm:text-sm"
      />

      <BiLine
        he={content.venue.he}
        en={content.venue.en}
        heClass="text-base text-ink sm:text-lg"
        enClass="mt-0.5 text-xs tracking-wide text-ink-soft sm:text-sm"
      />

      <Divider />

      <BiLine
        he={content.closing.he}
        en={content.closing.en}
        heClass="text-sm text-sage sm:text-base"
        enClass="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-sage sm:text-xs"
      />
    </div>
  );
}
