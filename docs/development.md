# Entwicklung und Releases

[Zur Übersicht](../README.md)

## Aufbau

| Pfad | Aufgabe |
| --- | --- |
| `custom_components/vectra_studio/` | HA-Integration, Geräteanbindung, Entitäten und Dienste |
| `custom_components/vectra_studio/panel/` | Eigene native Studio-Seitenleiste |
| `frontend-src/` | Bearbeitbare Quellen des übernommenen Zeitplan-/Szenen-Editors |
| `custom_components/vectra_studio/frontend/dist/` | Gebaute Karten, im Repository enthalten |
| `tests/` | Eigene Modell- und DOM-Tests der Studio-Oberfläche |
| `tools/validate_release.py` | Strukturprüfung und Release-Pakete |
| `.github/workflows/` | CI und Veröffentlichung getaggter Vorabversionen |

Das Panel verwendet die authentifizierte HA-Frontend-Sitzung. Es entdeckt Geräte
über die Geräteverwaltung, liest Gruppenmetadaten über
`vectra_studio/resolve_schedule_groups` und nutzt HA-Entitäten für Live-Werte.
Szenen laufen über `select.select_option`. Zeitpläne werden über die übernommenen
WebSocket-Befehle und Dienste im eigenen `vectra_studio`-Namensraum verarbeitet.
Es besteht keine Laufzeitabhängigkeit von einer separat installierten `mobius`-Integration.

## Lokale Prüfungen

Node.js 24 und Python 3.13+ verwenden:

```bash
npm --prefix frontend-src ci --ignore-scripts
npm --prefix frontend-src run typecheck
npm --prefix frontend-src run build
(cd frontend-src && node --test)
npm test
npm run check
python3 tools/validate_release.py --package
```

`npm test` im Projektstamm prüft die eigene Studio-Oberfläche. Die Editor-Tests
liegen separat in `frontend-src/test/`. Python wird geparst; Home Assistant und
Bluetooth werden dabei nicht simuliert oder als geprüft ausgegeben.

Ein tatsächlicher Backend-Test benötigt eine unterstützte HA-Installation und
eine echte Pumpe. Vor einer stabilen Version insbesondere Einrichtung, Trennen/
Wiederverbinden, HA-Neustart, Szenenrückkehr und Zeitplan-Export/Import/Schreiben testen.

## Änderungen am Editor

Nur die Quellen in `frontend-src/src/` bearbeiten und anschließend neu bauen.
Die beiden Builds unter `frontend/dist/` mit committen, damit manuelle und
HACS-Installationen direkt funktionieren. Keine unabhängige zweite Änderung am
minifizierten JavaScript vornehmen. Die Herkunftshinweise und GPL-Lizenz erhalten.

## Version veröffentlichen

1. Versionsnummer im Manifest erhöhen und `CHANGELOG.md` ergänzen.
2. Alle Prüfungen ausführen und Änderungen auf `main` committen.
3. Einen passenden Tag setzen und pushen, etwa `v0.1.0`.
4. Der Release-Workflow prüft den Tag gegen das Manifest, baut und testet die
   Karten und veröffentlicht die ZIP-Dateien als **Vorabversion**.
5. HACS-Beta-Installation und danach Hardwaretests durchführen.

Der Workflow markiert Releases bewusst als Vorabversion, solange das Projekt
experimentell ist. Ein stabiler Release erfordert eine dokumentierte Hardware-Erprobung
und eine ausdrückliche Anpassung dieses Veröffentlichungsprozesses.

`vectra_studio.zip` enthält nur die Integrationsdateien für HACS. Das zweite ZIP
enthält den Konfigurationspfad, die Dokumentation, Buildskripte und Editor-Quellen.
Zum kompletten Stand gehört außerdem das Git-Repository mit dem entsprechenden Tag.

## Upstream-Änderungen übernehmen

Ausgangsbasis ist ha-mobius v0.12.0. Änderungen bewusst vergleichen und einzeln
übernehmen, statt den eigenen Namensraum und das Studio-Panel zu überschreiben.
Protokollnamen wie `MOBIUS` in Bluetooth-Ankündigungen und Python-Imports aus
`mobius` gehören zur Geräte-/Bibliotheksanbindung und werden nicht umbenannt.
