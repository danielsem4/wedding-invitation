// ─────────────────────────────────────────────────────────────
//  WEDDING DETAILS — edit everything here. No other file needs to change.
//  Each field has a Hebrew (he) and English (en) version.
// ─────────────────────────────────────────────────────────────

export const content = {
  // The couple's names
  couple: {
    he: "דניאל & נועה", //           <-- EDIT: bride & groom (Hebrew)
    en: "Daniel & Noa", //           <-- EDIT: bride & groom (English)
  },

  // A short line inviting guests
  invite: {
    he: "מתכבדים להזמינכם לחגוג עמנו את יום נישואינו", // <-- EDIT
    en: "Together with their families, invite you to celebrate their wedding", // <-- EDIT
  },

  // Date
  date: {
    he: "יום חמישי, 25 ביוני 2026", //  <-- EDIT
    en: "Thursday, June 25, 2026", //   <-- EDIT
  },

  // Time
  time: {
    he: "קבלת פנים בשעה 19:00", //      <-- EDIT
    en: "Reception at 7:00 PM", //      <-- EDIT
  },

  // Venue name + location
  venue: {
    he: "אולמי גן ורדים, ראשון לציון", // <-- EDIT
    en: "Gan Vradim, Rishon LeZion", //   <-- EDIT
  },

  // Small closing note shown at the bottom of the card
  closing: {
    he: "נשמח לראותכם",  //             <-- EDIT
    en: "We can't wait to celebrate with you", // <-- EDIT
  },
} as const;

export type Content = typeof content;
