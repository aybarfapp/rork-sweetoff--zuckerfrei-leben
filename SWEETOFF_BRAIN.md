# SweetOff – Projekt-Brain

> **Zweck dieses Dokuments:** Dies ist die zentrale Wissensbasis für das SweetOff-Projekt. Es fasst die gesamte Strategie, alle bewussten Entscheidungen, die Marktanalyse und den aktuellen Stand zusammen. Jede KI (Claude, Claude Code) und jede Person, die an diesem Projekt arbeitet – ob an Business-Strategie, Design oder Code – soll dieses Dokument zuerst lesen. Es wird laufend aktualisiert, sobald neue strategische Entscheidungen getroffen werden.

---

## 1. Executive Summary

**SweetOff** ist eine native iOS/Android-App (React Native + Expo), die Menschen hilft, ihren Zuckerkonsum zu reduzieren und akute Heißhunger-Momente zu überstehen. Die App folgt dem bewiesenen Erfolgsmuster von Sucht-Recovery-Apps wie Quittr und Puffr – übertragen auf Zucker, lokalisiert für den deutschen Markt, mit einem Kernfeature (SOS-Craving-Flow), das keine der bestehenden deutschen Konkurrenz-Apps bietet.

- **Zielmarkt:** Deutschsprachige Erwachsene, 18–35 Jahre, B2C
- **Geschäftsmodell:** Abo (Wochen- und Jahresabo über die Paywall)
- **Vertriebsstrategie:** TikTok-Content-Marketing durch den Gründer (bestehende Distributions-Infrastruktur)
- **Entwicklungsweg:** No-Code/Vibe-Coding (Rork) → Übergabe an Claude Code für Feinschliff, Backend-Integration und App-Store-Launch
- **Status:** Klickbarer Prototyp fertiggestellt (Onboarding-Funnel + Haupt-App), bereit für Nutzertests

---

## 2. Strategische Herleitung – Wie wir zu SweetOff kamen

### 2.1 Ausgangslage
Der Gründer hat keine Coding-Erfahrung und wollte eine App-Store-App bauen, die realistisch **15.000–20.000 €/Monat** Umsatz erzielen kann. Die Suche begann breit (verschiedenste App-Ideen) und wurde systematisch verengt.

### 2.2 Warum B2C-Consumer-App, kein B2B/SaaS
Ursprünglich wurde erwogen, auf "schnelles, verlässliches Geld" durch ein B2B-Tool (z. B. für Content-Creator oder Shopify-Händler) zu optimieren. Diese Richtung wurde verworfen, weil der Gründer explizit an der **App-Store-Vorgabe** festhielt – B2B-Tools mit hoher ARPU leben aber meist im Web, nicht im App Store. Der Kompromiss: eine App-Store-taugliche Nische mit realistischer Erreichbarkeit über eigene Kanäle statt viralem Lotteriespiel.

### 2.3 Ideen, die geprüft und verworfen wurden (und warum)
| Idee | Verworfen, weil |
|---|---|
| KI-Hautanalyse-App (GlowScan) | Rechtliches Risiko: Nähe zu Medizinprodukte-Regulierung (MDR/DiGA) bei gesundheitsbezogenen Analysen |
| ADHS-/Fokus-App | Doppelt problematisch: Markt in DE bereits besetzt (Tiimo, Forest, Inflow) UND MDR-Risiko bei Erwachsenen-ADHS-Apps |
| Manifestation/Journaling-App | Niedrige ARPU, Zielgruppe (TikTok-Manifestation-Community) deckt sich nicht mit der bestehenden Reichweite des Gründers |
| Gutenachtgeschichten-App (DE/TR) | Gute Idee, aber zurückgestellt zugunsten der schärferen Zucker-Nische |
| KI-Rap-Generator | Musikrechte-Komplexität, zurückgestellt |
| Lieferfahrer-Steuer-App | Gute Idee (Insider-Zugang via Gründer-Netzwerk), aber Gründer entschied sich für "Problemlöser mit Gamification" |
| Gamifiziertes Sparen | Markt in DE bereits besetzt (52-Wochen-Challenge, Savvy Goals) |
| Deutsch-Lernen für Migranten (gamifiziert) | Schwache Zahlungsbereitschaft (Gratis-/Institutions-Apps dominieren: Goethe, BAMF Ankommen) |

### 2.4 Wie Zucker-Reduktion gewonnen hat
Der Gründer schlug das Quittr/Puffr-Prinzip für **Zucker-Craving** vor. Marktprüfung ergab:
- **Nicht komplett unbesetzt** in DE (LittleLess, NoSugar, Zuckerfrei existieren), aber alle sind **sanft/basic positioniert** – keine hat einen Panik-Button/SOS-Flow, keinen echten KI-Coach, keine native Community mit Leaderboard
- **US-Blaupausen existieren bereits** (Sugarless: CBT-Journey + Panik-Button-Widget + Garten-Gamification; SugarOff: KI-Craving-Coach-Ansatz) – das Produkt-Muster ist bewiesen, aber in DE noch nicht mit dieser Tiefe umgesetzt
- **Rechtlich sauber**, solange strikt als Lifestyle-/Gewohnheits-Tool positioniert (kein Medizinprodukt), im Gegensatz zu Haut- oder ADHS-Apps
- **Passt zur Distribution:** Gründer kann über TikTok-Content die Zielgruppe direkt erreichen

**Der Wedge:** US-Feature-Tiefe (SOS-Flow, KI-Coach, Community) + deutsche Sprache + eigene Content-Distribution, wo die bestehenden DE-Player schwach sind.

---

## 3. Zielgruppe

- **Primär:** Deutschsprachige Erwachsene, 18–35 Jahre
- **Psychografie:** Wollen zugesetzten Zucker reduzieren oder ganz weglassen, oft mit vorherigen gescheiterten Versuchen; suchen kein Kalorienzähl-Tool, sondern Hilfe im akuten Heißhunger-Moment
- **Motivations-Cluster (aus Onboarding-Zielen):** Energie, Hautbild, Selbstkontrolle/Disziplin, Schlafqualität, gesundes Gewicht (bewusst nicht als Diät-Ziel formuliert), allgemeines Wohlbefinden
- **Trigger-Muster:** Stress, Langeweile, nach dem Essen, abends/vor dem Fernseher, Müdigkeit, soziale Situationen, PMS/Zyklus
- **Vertriebskanal:** TikTok – Content-Formate wie Vorher/Nachher-Transformationen, "Craving besiegt"-Momente, Streak-Reveals

---

## 4. Wettbewerbsanalyse

### 4.1 Deutsche Konkurrenz (direkt)
| App | Stärken | Schwächen (= unsere Chance) |
|---|---|---|
| **LittleLess** | KI-Sprach-Tracking, Community-Live-Challenges, gute Bewertungen | Driftet Richtung Kalorienzählen/Diät – verwässert den Sucht-Fokus |
| **NoSugar – Zuckerfrei Challenge** | Sauberes Streak/Badge-System | Rein passiv, kein Coach, keine Community, keine Krisenhilfe |
| **Zuckerfrei** | Sanfter Ton, Cheat-Day-Tracking, gute Reviews | Kein emotionaler/intensiver Kern, kein SOS-Moment |

### 4.2 US-Vorbilder (Blaupause)
- **Sugarless:** CBT-basierte 18-Schritte-Journey, Panik-Button-Homescreen-Widget, Garten-Gamification (wächst/welkt je nach Erfolg), Team-Story "Engineer + Psychologe" als Vertrauens-Marketing, Community via Discord/Reddit (extern, nicht nativ)
- **SugarOff:** KI-Craving-Coaching-Ansatz, Geld-gespart-Zähler (von uns bewusst NICHT übernommen, siehe Abschnitt 6.5) – wirkt wie ein kleines/frühes Indie-Projekt

### 4.3 Analoge Kategorie-Vorbilder (Mechanik-Beweis)
- **Quittr** (Porno-Sucht): Referenz für gesamtes Design-System, Ton, Paywall-Struktur
- **PuffCount** (Vaping): Referenz für Onboarding-Funnel-Aufbau (Quiz-Struktur, Fakten-Zwischenscreens, Belohnungs-Screen)

---

## 5. Positionierung & Differenzierung

**Kernaussage:** *"Zuckerfrei wird man nicht an einem Tag. Sondern in den 5 Minuten, wenn der Drang kommt."*

SweetOff ist keine Diät-App und kein Kalorienzähler. Es ist eine **Gewohnheits- und Krisenmoment-App**: Der Kern ist nicht "Was hast du gegessen", sondern "Was tust du, wenn der Drang gerade jetzt kommt". Das unterscheidet SweetOff sowohl von den deutschen Konkurrenten (zu passiv/Tracking-fokussiert) als auch von generischen Diät-Apps (falscher Fokus).

**Vier Differenzierungs-Säulen:**
1. **SOS-Craving-Flow** mit personalisierten, nie wiederholenden Motivationsnachrichten
2. **KI-Coach-Chat** (echte Konversation statt statischem Content)
3. **Native Community mit Leaderboard** (nicht extern wie bei Sugarless via Discord)
4. **Deutsche Sprache + eigene Distribution** – kein lokalisierter US-Import, sondern von Grund auf für den deutschen Markt und die eigene Zielgruppe gebaut

---

## 6. Kernfeatures im Detail

### 6.1 Onboarding-Funnel (14 Screens)
Quiz-Funnel-Struktur (bewiesenes Muster von PuffCount/Quittr): Fragen und motivierende Zwischen-Screens im Wechsel, endet in der Paywall.

1. Willkommen (Value Proposition)
2. Feature-Vorschau SOS
3. Geschlecht (Einzelauswahl)
4. Geburtsjahr (**natives Scroll-Rad**, bewusst keine Buttons/Freitext)
5. Konsum-Häufigkeit
6. Trigger (Mehrfachauswahl)
7. Frühere Aufhörversuche (Ja/Nein)
8. Fakten-Zwischenscreen (wissenschaftlich fundiert: 21-Tage-Gewöhnung, KEINE erfundenen Statistiken)
9. Ziele (Mehrfachauswahl, inkl. "Gesundes Gewicht" – bewusst vorsichtig formuliert)
10. Start-Intensität (reduzieren / komplett / schrittweise)
11. Notification-Permission
12. Berechnungs-Animation (~5,6 Sek., Haptik synchronisiert mit Progress bei 25/50/75/100 %, bewusst nicht zu schnell, um nicht "billig" zu wirken)
13. Belohnungs-Screen: **Sofort-Start-Prinzip** ("Tag 1 beginnt JETZT", kein fernes Enddatum-Versprechen wie bei PuffCount, weil unser Streak-Modell sofortiges Engagement statt schrittweiser Reduktion ist)
14. Paywall

### 6.2 SOS-Craving-Flow (Herzstück der App)
1. Intensitäts-Slider (1–10)
2. 60-Sekunden geführter Atem-Timer mit Kreis-Animation ("Der Drang klingt jetzt ab. Atme mit mir.")
3. Personalisierte "Warum"-Nachricht – gezogen aus den im Onboarding gewählten Zielen (Energie, Haut, Kontrolle, Schlaf, Gesundes Gewicht), Pool-basiert mit Ausschluss der zuletzt gezeigten Nachrichten (kein Wiederholungsgefühl)
4. Ergebnis loggen: "Craving überstanden 💪" (Konfetti, zählt in Statistik) oder "Nachgegeben" (schamfrei: "Kein Problem. Morgen ist ein neuer Tag.")

### 6.3 KI-Coach-Chat
Chat-Interface im Messenger-Stil. Aktuell (Prototyp-Stand) mit vorgefertigten Beispiel-Konversationen simuliert. **Phase 2:** echte KI-API-Anbindung, die Trigger-Muster über Zeit lernt und kontextbezogen reagiert.

### 6.4 Community-Tab
- **Leaderboard** ganz oben: Top 10 der Woche + eigene Platzierung hervorgehoben, Umschalter Woche/Allzeit
- Banner "Gemeinsame Challenge diese Woche"
- Feed mit Erfolgs-Posts
- **Bewusste Einschränkung:** Kein freies Posten (kein "+"-Button, kein offenes Textfeld). Posten ist ausschließlich bei erreichten Meilensteinen möglich (automatischer, vorausgefüllter Teilen-Screen) – reduziert Moderationsaufwand und hält den Feed automatisch positiv

### 6.5 Bewusst NICHT gebaute Features (und warum)
- **Kein Kalorienzähler/Gewichts-Tracking** – auch wenn "Gesundes Gewicht" als Motivationsziel wählbar ist, gibt es keine Waage, keine Diät-Zahlen. Grund: Abgrenzung von LittleLess (die dorthin gedriftet sind) + Vermeidung von Trigger-Potenzial für Essstörungen
- **Kein "Geld gespart"-Feature** – bei Zucker gibt es kein klares 1:1-Kauf-Delta wie bei Zigaretten (SugarOff hat das, wir bewusst nicht übernommen)
- **Kein Level-/XP-System** – wäre redundant zum Streak-System, verwässert den Fokus
- **Keine erfundenen Erfolgsstatistiken oder Fake-Verknappung** an der Paywall (im Gegensatz zu PuffCount/Quittr, die teils fragwürdige "78 % unserer Nutzer..."-Zahlen oder Fake-Rabatte zeigen) – rechtliches Risiko in Deutschland (UWG)

---

## 7. Design-System

- **Referenz:** Quittr – dunkler, intensiver, disziplinierter Look, explizit kein Soft-Wellness-Stil
- **Farben:** Dark Mode als Standard (#0D0D0F–#1A1A1E), Light Mode optional. Akzentfarbe: Rot-Orange-Gradient (#FF4D2E–#FF7A00)
- **Typografie:** Große, fette Zahlen für Kernwerte (Streak-Tage als visuelles Zentrum jedes Screens)
- **UI-Elemente:** Kreisförmige Progress-Ringe, kartenbasiertes Layout (16–20px Radius), Micro-Animationen bei Erfolgen (Konfetti, Pulse, Glow)
- **Tonalität:** Direkt, motivierend, diszipliniert ("Du bist stärker als der Drang.") – niemals therapeutisch-sanft, niemals Diät-Sprache
- **Logo-Konzept:** Kreis-Ring + zentraler, stilisierter Zuckerwürfel, durchbrochen von einem diagonalen Blitz (Symbol: "den Drang durchbrechen") – aktuell nur Annäherung im Prototyp, finales Icon wird separat/extern gestaltet

---

## 8. Monetarisierung

| Option | Preis | Rolle |
|---|---|---|
| Wochenabo | 4,99 €/Woche | Niedrigschwelliger Einstieg, Impulskauf |
| **Jahresabo** (vorausgewählt) | **34,99 €/Jahr**, 3 Tage kostenlos testen | "Bester Wert"-Badge, "Spare 87 % gegenüber wöchentlich" |

**Herleitung:** Orientiert an Quittrs Paywall-Struktur (niedriger Einstiegspreis für Volumen-Play, zwei simple Optionen statt komplexer Staffelung), aber bewusst **ohne** Quittrs fragwürdige Fake-Rabatt-Anzeige und ohne PuffCounts erfundene Verknappungshinweise. Kein Lifetime-Plan – bewusst auf zwei Optionen reduziert für Entscheidungs-Einfachheit.

---

## 9. Rechtliche & ethische Leitplanken (NIEMALS verletzen)

Diese Regeln entstanden aus expliziten Abwägungen im Strategieprozess und sind nicht verhandelbar bei zukünftigen Feature-Entscheidungen:

1. **Kein medizinisches Framing** ("heilt", "behandelt", "Therapie") – durchgängig "Motivation/Gewohnheit/Wohlbefinden"-Sprache. Grund: Vermeidung der EU-Medizinprodukte-Regulierung (MDR/DiGA), die bei Haut- und ADHS-App-Konzepten ein Blocker war
2. **Keine Diagnose- oder Diät-Sprache**, kein Kalorienzählen, keine Gewichtszahlen
3. **Keine erfundenen Statistiken, keine Fake-Verknappung, keine Fake-Streichpreise** – rechtliches Risiko (UWG-Abmahnung) in Deutschland
4. **SOS-Nachrichten für "Gesundes Gewicht":** bewusst ohne Körperbild- oder Schuld-Sprache, Fokus auf Mechanik/Kontrolle statt Aussehen
5. **Kein beschämender Ton bei Rückfällen** – neutrale, unterstützende Formulierungen
6. **Community: kein freies Posten** – nur meilenstein-getriggert, um Missbrauch/Moderationsaufwand strukturell zu minimieren

---

## 10. Tech-Stack & Entwicklungsweg

- **Stack:** React Native + Expo (Cross-Platform, iOS + Android)
- **Bewusste Tool-Entscheidung:** Rork mit Plattform-Option "Expo – Cross-platform with React Native" (NICHT "For iPhone", das an Rork Max/SwiftUI bindet – teurer, nicht portabel, hätte unseren Export-Plan durchkreuzt)
- **Entwicklungsablauf:** Prompt-Engineering in Rork (zwei-Prompt-Struktur: Onboarding-Funnel, dann Haupt-App) → GitHub-Export → Weiterentwicklung in Claude Code
- **Bekannter, behobener Bug:** `babel-plugin-module-resolver` war installiert, aber nicht in `babel.config.js` registriert → verursachte Laufzeit-Fehler bei `@/`-Importen (TypeScript-Checks fanden das nicht, da sie einen anderen Auflösungsmechanismus nutzen als der Metro-Bundler)
- **Aktueller Stand:** Prototyp mit lokalem State – kein echtes Backend, keine echte KI-API, kein echtes Payment. Alles simuliert für Nutzertests

---

## 11. Roadmap / Meilensteine

### Phase 1 – Prototyp (✅ abgeschlossen)
- Onboarding-Funnel (14 Screens) gebaut und funktionsfähig
- Haupt-App (Home, SOS-Flow, Coach simuliert, Community, Profil) gebaut
- Bekannte Build-Fehler behoben
- Projekt von Rork zu GitHub exportiert, lokale Entwicklungsumgebung eingerichtet

### Phase 2 – Validierung (⏳ aktueller Schritt)
- Test mit 10–15 echten Personen über Expo Go
- Leitfragen: Wo brechen Nutzer im Funnel ab? Verstehen sie den SOS-Button ohne Erklärung? Würden sie an der Paywall wirklich zahlen (Wochen- vs. Jahresabo)? Wird die Community/das Leaderboard von selbst entdeckt?
- Ergebnis bestimmt, welche Screens/Flows vor dem nächsten Schritt überarbeitet werden müssen

### Phase 3 – Backend & echte Anbindungen (offen)
- Backend-Entscheidung (vermutlich Supabase: Auth, Nutzerdaten, Streak-Speicherung)
- Echte KI-Coach-API-Anbindung
- RevenueCat für In-App-Payments (Apple IAP)
- `.env`-Handling für Secrets einrichten (aktuell noch nicht nötig, da Prototyp ohne echte Keys)

### Phase 4 – App-Store-Vorbereitung (offen)
- Finales App-Icon/Logo (separat gestaltet, aktuelles Konzept: Kreis + Zuckerwürfel + Blitz)
- App-Store-Listing (Screenshots, Beschreibung, Keywords)
- Apple Developer Account, TestFlight-Beta
- Rechtliche Prüfung der finalen Texte (Datenschutz, AGB, Impressum)

### Phase 5 – Launch & Distribution (offen)
- TikTok-Content-Kampagne des Gründers (Vorher/Nachher, Craving-Reveals, App-Demos)
- Launch-Metriken definieren (Installs, Trial-zu-Paid-Conversion, Retention D1/D7/D30)

---

## 12. Offene Entscheidungen / Noch zu klären

- Finales App-Icon/Logo-Design (extern zu gestalten)
- Konkrete Backend-Architektur (Supabase vs. Alternativen)
- KI-Modell/API für den echten Coach-Chat
- Detaillierte Datenschutz-/AGB-Texte
- Nach Nutzertests: mögliche Anpassungen an Funnel-Reihenfolge oder Feature-Priorität

---

*Letzte Aktualisierung: nach Abschluss von Phase 1 (Prototyp fertiggestellt). Dieses Dokument wird bei jeder größeren strategischen Entscheidung erweitert – neue Erkenntnisse aus Nutzertests, Backend-Entscheidungen und Launch-Vorbereitung gehören hier rein.*
