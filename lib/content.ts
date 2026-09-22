// ─────────────────────────────────────────────────────────────
//  WEDDING DETAILS — edit everything here. No other file needs to change.
//  Hebrew is the primary language; keep every string exactly as written
//  (nikud, gershayim ״, geresh ׳, and ז״ל are intentional — do not "fix" them).
// ─────────────────────────────────────────────────────────────

export const content = {
  // Small blessing in the upper-right corner
  bsd: "בס״ד",

  // Opening verse (Song of Songs 3:4) — one elegant line at the top of the card
  verse: "עַד שֶׁמָּצָאתִי אֵת שֶׁאָהֲבָה נַפְשִׁי אֲחַזְתִּיו וְלֹא אַרְפֶּנּוּ",

  // The couple — the visual centerpiece (large uppercase serif)
  namesEn: "SHOVAL & DANIEL",
  subtitleEn: "are getting married", // delicate handwritten script

  // Invitation body (two Hebrew lines)
  invite: [
    "שמחים ונרגשים להזמינכם לחגוג עמנו את יום נישואינו",
    "שיתקיים אי״ה ביום רביעי, כ״ה בחשוון תשפ״ז",
  ],

  // Wedding date — shown prominently
  date: "04.11.2026",

  // Venue
  venue: {
    name: "ADIA | עדיה",
    place: "אולם עדיה, יבנה",
  },

  // Event times — kept on one balanced line
  times: "קבלת פנים 19:30  |  חופה וקידושין 20:30",

  // Closing note
  closing: "בשמחה לראותכם",

  // Parents — two balanced columns (right = bride, left = groom)
  parents: {
    bride: {
      label: "הורי הכלה",
      names: ["עמליה גיברי", "אמיר גיברי ז״ל"],
    },
    groom: {
      label: "הורי החתן",
      names: ["תמי לוי", "אלכסנדר סמריגאן"],
    },
  },

  // Envelope face
  envelope: {
    monogram: "S&D",       // intertwined gold monogram
    script: "Shoval & Daniel", // gold calligraphy under the monogram
  },
} as const;

export type Content = typeof content;
