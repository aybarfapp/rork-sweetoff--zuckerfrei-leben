# SweetOff – Dev-Kontext für Claude Code

> **Für Claude Code:** Lies diese Datei zuerst, bevor du Code änderst. Für die vollständige Produktstrategie, Marktanalyse, Roadmap und alle "Warum"-Begründungen siehe **`SWEETOFF_BRAIN.md`** im selben Ordner – dort steht der ausführliche Kontext. Diese Datei hier ist der komprimierte Auszug für die tägliche Entwicklungsarbeit.

## Was ist SweetOff?

Native iOS/Android-App (React Native + Expo) gegen Zucker-Craving. Positionierung: intensiv, diszipliniert (Stil: Quittr) – keine sanfte Wellness- oder Diät-App. Details: `SWEETOFF_BRAIN.md`, Abschnitt 1–5.

## Harte Leitplanken – NIEMALS verletzen

(Ausführliche Begründungen: `SWEETOFF_BRAIN.md`, Abschnitt 9)

- Kein Kalorienzähler, kein Gewichts-Tracking, keine Diät-Sprache ("Gesundes Gewicht" ist nur ein wählbares Motivationsziel, keine Tracking-Funktion)
- Kein "Geld gespart"-Feature
- Kein Level-/XP-System
- Kein beschämender Ton bei Rückfällen (SOS-Flow: "Nachgegeben" → neutral, nie negativ)
- Kein medizinisches Framing (nicht "heilt", nicht "behandelt", nicht "Therapie")
- Keine erfundenen Statistiken, keine Fake-Verknappung, keine Fake-Streichpreise
- Community: kein freies Posten – nur bei erreichten Meilensteinen (Tag 3/7/14/30/60/90)
- SOS-Nachrichten fürs Ziel "Gesundes Gewicht": nie Körperbild-/Schuld-Sprache, nur Mechanik/Kontrolle

## Design-System (Kurzreferenz)

- Dark Mode Standard (#0D0D0F–#1A1A1E), Light Mode optional
- Akzentfarbe: Rot-Orange-Gradient (#FF4D2E–#FF7A00)
- Große fette Zahlen für Streak, Progress-Ringe, kartenbasiertes Layout (16–20px Radius)
- Ton: direkt, motivierend, diszipliniert – nie therapeutisch-sanft

Volles Design-System inkl. Logo-Konzept: `SWEETOFF_BRAIN.md`, Abschnitt 7.

## Tech-Stack

- React Native + Expo (bewusst nicht SwiftUI/Rork Max – siehe Brain, Abschnitt 10)
- Aktueller Stand: Prototyp, lokaler State, kein Backend, keine echte KI-API, kein echtes Payment
- Bekannter behobener Bug: `babel-plugin-module-resolver` fehlte in `babel.config.js` (Metro-Bundler-Alias-Auflösung für `@/`-Importe)

## Aktueller Projekt-Status

✅ Onboarding-Funnel (14 Screens) + Haupt-App (Home, SOS, Coach simuliert, Community, Profil) fertig
⏳ Nächster Schritt: Nutzertest mit 10–15 Personen (Leitfragen: Funnel-Abbrüche, SOS-Verständnis, Zahlungsbereitschaft)
⏳ Danach: Backend-Integration (vermutlich Supabase), echte KI-Coach-API, RevenueCat, App-Store-Vorbereitung

Vollständige Roadmap mit allen Phasen: `SWEETOFF_BRAIN.md`, Abschnitt 11.

## Bei Unsicherheit

Erst `SWEETOFF_BRAIN.md` konsultieren (Strategie, Begründungen, Wettbewerbsanalyse), dann den Gründer fragen – bevor eine der Leitplanken oben verletzt wird.
