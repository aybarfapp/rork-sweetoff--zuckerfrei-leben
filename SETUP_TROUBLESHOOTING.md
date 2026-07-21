# SweetOff – Technisches Setup & Troubleshooting-Lastenheft

> **Für Claude Code:** Lies dieses Dokument VOR jedem Versuch, den Dev-Server zu starten. Es dokumentiert drei bereits gelöste Bugs und eine Netzwerk-Problematik, die uns in der Vergangenheit mehrere Stunden gekostet haben. Prüfe die Fixes unten, bevor du irgendetwas neu debuggst – die Wahrscheinlichkeit ist hoch, dass ein "neuer" Fehler bereits hier dokumentiert ist.

---

## 0. Verifizierter Ausgangszustand (Commit `552ca19`)

Ab diesem Commit sind folgende drei Fixes bereits im Code enthalten. **Bei einem frischen `git clone` sollten sie automatisch vorhanden sein** – trotzdem hier verifizieren, bevor Zeit in erneutes Debugging investiert wird:

```bash
cd expo
grep -A5 "plugins" babel.config.js       # sollte module-resolver zeigen
grep "zod" package.json                   # sollte "zod": "4.1.12" als direkte Dependency zeigen
grep "typescript" package.json            # sollte ~5.9.2 zeigen, NICHT ~7.x
```

Falls einer dieser Checks fehlschlägt, siehe die passende Sektion unten.

---

## 1. Bekannter Bug: `@/`-Alias wird zur Laufzeit nicht aufgelöst

**Symptom:**
```
Unable to resolve module @/components/XYZ from .../app/(tabs)/_layout.tsx
```
oder beim allerersten Auftreten:
```
TypeError: undefined is not an object (evaluating 'ts.sys.getCurrentDirectory')
```

**Ursache:** Das Projekt nutzt TypeScript 7 (neue Rust-Portierung), aber Expos CLI griff intern auf eine alte TypeScript-API zu, die in Version 7 nicht mehr existiert (`ts.sys.getCurrentDirectory`). Das brachte Metro beim Start zum Absturz. Der ursprüngliche Fix deaktivierte zwar die kaputte `tsconfigPaths`-Auflösung in `app.json`, aber die Ersatzlösung über `babel-plugin-module-resolver` wurde nie tatsächlich in `babel.config.js` registriert – das Paket war installiert, aber "nicht eingeschaltet". TypeScript-Checks (`tsc`) fanden das nicht, weil sie über `tsconfig.json`-Pfade auflösen, unabhängig vom Metro-Bundler zur Laufzeit.

**Fix (bereits in `babel.config.js` enthalten, Stand Commit `552ca19`):**
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
          extensions: [".ios.js", ".android.js", ".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
    ],
  };
};
```

**Falls der Fehler trotzdem wieder auftaucht:** Metro-Cache leeren mit `npx expo start --clear`, nicht nur `npx expo start`.

---

## 2. Bekannter Bug: `zod` fehlt in `node_modules`

**Symptom:** Bundling stürzt ab, bevor überhaupt der `@/`-Alias geprüft wird. Fehler bezieht sich auf `@rork-ai/toolkit-sdk`, das intern `zod/v4` importiert.

**Ursache:** `@rork-ai/toolkit-sdk` deklariert `zod` nur als `peerDependency`, nicht als direkte Abhängigkeit. npm installiert `peerDependencies` nicht automatisch.

**Fix (bereits in `package.json` enthalten):** `"zod": "4.1.12"` wurde als direkte Dependency ergänzt.

**Falls der Fehler wieder auftaucht:**
```bash
npm install zod@4.1.12 --legacy-peer-deps
```

---

## 3. Bekannter Bug: TypeScript-Versionskonflikt

**Symptom:** Beim Serverstart eine Warnung, dass die installierte TypeScript-Version nicht mit der von Expo erwarteten übereinstimmt; Expo warnt, das Projekt könne bis zur Korrektur nicht richtig funktionieren.

**Ursache:** Installiert war `typescript@7.0.2` (neue Rust-Portierung mit abweichendem Verhalten), Expo 54 erwartet `~5.9.2`.

**Fix (bereits in `package.json` enthalten):** TypeScript auf `~5.9.2` zurückgesetzt (installiert: `5.9.3`).

**Falls der Fehler wieder auftaucht:**
```bash
npm install typescript@~5.9.2 --legacy-peer-deps
```

---

## 4. Netzwerk-Problem: Expo Go kann den Dev-Server nicht erreichen

Dies ist **keine Code-Frage**, sondern ein Netzwerk-/Umgebungsproblem, das uns am längsten aufgehalten hat. Symptome: "Could not connect to the server" in Expo Go, oder Safari kann `http://<lan-ip>:8082` auf dem Handy nicht laden.

### 4.1 Bekannte Teilursache: Expos automatische LAN-IP-Erkennung ist unzuverlässig

Expo nutzt intern das Paket `lan-network`, das die eigene LAN-IP über einen kurzlebigen Subprozess mit 500ms-Timeout ermittelt. Dieser Subprozess ist im Kontext von `expo start` wiederholt fehlgeschlagen und lieferte fälschlich `127.0.0.1` (Loopback, vom Handy aus nie erreichbar) statt der echten WLAN-IP des Macs.

**Workaround (offizielle Env-Variable):**
```bash
REACT_NATIVE_PACKAGER_HOSTNAME=<echte-mac-lan-ip> npx expo start --port 8082 --clear
```
Aktuelle Mac-IP ermitteln: `ipconfig getifaddr en0`

**Verifikation, dass es funktioniert hat:** Manifest UND Bundle müssen über die LAN-IP (nicht nur `localhost`) mit HTTP 200 erreichbar sein:
```bash
curl -I http://<lan-ip>:8082
```

### 4.2 Falls die manuelle Hostname-Angabe NICHT reicht: echtes Netzwerkproblem

Falls Safari auf dem iPhone `http://<lan-ip>:8082` nicht laden kann, obwohl die IP korrekt ist, liegt eine tiefere Netzwerk-Blockade vor. In dieser Reihenfolge prüfen:

1. **Gleiches WLAN?** iPhone-WLAN-Name exakt mit Mac-WLAN-Name vergleichen. Achtung bei Routern mit getrennten 2,4-GHz-/5-GHz-Netzwerken – diese können unterschiedliche Netze sein.
2. **VPN aktiv?** Auf iPhone UND Mac prüfen. Ein VPN auf irgendeinem der beiden Geräte kappt praktisch immer die lokale Netzwerksicht.
3. **Mac-Firewall?** Systemeinstellungen → Netzwerk → Firewall → temporär deaktivieren, erneut testen.
4. **Client-/AP-Isolation im Router?** Häufig bei Gäste-WLANs, Firmen-/Uni-Netzen, manchen Mesh-Systemen. Geräte verbinden sich zwar beide mit dem Internet, sehen sich aber nicht gegenseitig. Kein Fix von unserer Seite möglich außer Netzwerkwechsel.

### 4.3 Empfohlener zuverlässiger Fallback: Tunnel-Modus

Da die lokale Netzwerk-Problematik in der Vergangenheit sehr viel Zeit gekostet hat, **ist der Tunnel-Modus der empfohlene Standard-Start**, nicht erst der letzte Ausweg:

```bash
npx expo start --tunnel --clear
```

Vorteil: Läuft über Expos eigene Relay-Server, umgeht WLAN/Firewall/VPN/Isolation komplett. Nachteil: etwas langsamer beim Laden.

**QR-Code am zuverlässigsten scannen:** Mit der iPhone-**Kamera-App** (nicht Expo Go direkt öffnen) – die Kamera erkennt `exp://`-Links automatisch und bietet an, in Expo Go zu öffnen.

**Alternative, falls kein QR-Code sichtbar/scanbar ist:** Die `exp://...`-URL in die Notizen-App oder eine Nachricht an sich selbst schreiben, antippen – iOS öffnet Expo Go automatisch über das URL-Schema, ohne dass ein Menü gesucht werden muss.

---

## 5. Empfohlener Standard-Startbefehl (statt einzeln zu debuggen)

Um die Debugging-Schleife aus der Vergangenheit nicht zu wiederholen, mit diesem Befehl direkt starten:

```bash
cd expo
npx expo start --tunnel --clear
```

Erst wenn das aus unerwarteten Gründen nicht funktioniert, die einzelnen Sektionen oben der Reihe nach durchgehen.

---

## 6. Port-Hinweis

Port 8081 ist häufig durch ein anderes lokales Projekt belegt (z. B. `stild`). Das ist unkritisch – Expo weicht auf 8082 aus. Bei nicht-interaktiven Sessions (Claude Code) muss der Port aber explizit übergeben werden, da die interaktive "Use port 8082 instead?"-Nachfrage sonst den Start blockiert:

```bash
npx expo start --port 8082 --tunnel --clear
```

---

*Dieses Dokument bei jedem neu auftretenden, bisher unbekannten Bug um eine entsprechende Sektion erweitern – Ziel ist, dass kein Fehler zweimal von Grund auf neu debuggt werden muss.*
