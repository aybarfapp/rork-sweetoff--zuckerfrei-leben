/**
 * Personalized "why" messages shown in the SOS flow, grouped by the goal
 * a user picked during onboarding. Message selection combines the pools of
 * all selected goals and avoids repeating the most recently shown messages.
 */

const ENERGIE = [
  "Der Zucker-Crash in 30 Minuten fühlt sich schlimmer an als der Verzicht jetzt.",
  "Du willst mehr Energie, nicht das nächste Hoch-Tief-Karussell.",
  "Stabiler Blutzucker bedeutet stabile Energie den ganzen Tag. Genau das baust du gerade auf.",
  "In 20 Minuten ist der Drang weg. Der Energie-Einbruch danach wäre es nicht.",
  "Jedes Mal, wenn du widerstehst, trainierst du dein Energielevel für morgen.",
];

const HAUT = [
  "Zucker heizt Entzündungen in der Haut an. Du arbeitest gerade FÜR dein Gesicht, nicht dagegen.",
  "Reine Haut beginnt nicht bei der Creme, sondern in Momenten wie diesem.",
  "In ein paar Wochen siehst du im Spiegel, warum sich das gerade lohnt.",
  "Dein zukünftiges Ich mit klarerer Haut dankt dir für diesen einen Moment.",
];

const KONTROLLE = [
  "Es geht nicht um Verzicht. Es geht darum, dass DU entscheidest – nicht der Drang.",
  "Jedes gemeisterte Craving ist ein Beweis: Du hast die Kontrolle, nicht der Zucker.",
  "Das Gefühl danach – stolz, stark – hält länger an als der Geschmack von Süßem.",
];

const SCHLAF = [
  "Zucker am Abend stört deinen Schlaf mehr, als du denkst.",
  "Guter Schlaf heute Nacht beginnt mit dieser Entscheidung jetzt.",
];

const GEWICHT = [
  "Zucker macht hungrig, nicht satt. Du durchbrichst gerade den Kreislauf.",
  "Stabiler Blutzucker bedeutet weniger Heißhunger-Attacken morgen.",
  "Es geht nicht um Verzicht auf Essen – nur um die leeren Kalorien, die dir nichts geben.",
  "Jedes gemeisterte Craving trainiert deinen Appetit neu.",
];

const ALLGEMEIN = [
  "Ein Craving dauert im Schnitt nur 3 bis 5 Minuten. Du bist schon mittendrin, es zu schaffen.",
  "Du hast das schon mehrmals geschafft. Das hier ist nur ein weiteres Mal.",
];

/** Maps the onboarding goal labels to their message pools. */
const GOAL_POOLS: Record<string, string[]> = {
  "Mehr Energie": ENERGIE,
  "Reinere Haut": HAUT,
  "Bessere Kontrolle & Selbstdisziplin": KONTROLLE,
  "Besserer Schlaf": SCHLAF,
  "Gesundes Gewicht": GEWICHT,
  "Allgemein gesünder leben": ALLGEMEIN,
};

/**
 * Picks a personalized craving message based on the user's selected goals,
 * excluding the recently shown ones. Falls back to the general pool.
 */
export function pickCravingMessage(goals: string[], recent: string[]): string {
  const pool = new Set<string>();
  for (const goal of goals) {
    const messages = GOAL_POOLS[goal];
    if (messages) messages.forEach((m) => pool.add(m));
  }
  // Always allow the general fallback messages as a safety net.
  if (pool.size === 0) ALLGEMEIN.forEach((m) => pool.add(m));

  const all = Array.from(pool);
  const available = all.filter((m) => !recent.includes(m));
  const candidates = available.length > 0 ? available : all;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
