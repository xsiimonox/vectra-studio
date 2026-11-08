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
| `.github/workflows/` | CI und Veröffentlichung getaggter Versionen |

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
python3 -m unittest discover -s tests -p "test_*.py"
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
3. Einen passenden Tag setzen und pushen, etwa `v0.1.1`.
4. Der Release-Workflow prüft den Tag gegen das Manifest, baut und testet die
   Karten und veröffentlicht die ZIP-Dateien als regulären, neuesten GitHub-Release.
5. HACS-Installation der nummerierten Version und danach Hardwaretests durchführen.

Die GitHub-Klassifizierung als regulärer Release ermöglicht HACS die Auswahl
der Versionsnummer ohne Beta-Option. Sie ist keine Bestätigung eines Hardwaretests:
Der experimentelle Entwicklungsstand bleibt in README und Changelog dokumentiert.
Nur Vorabversionen zu veröffentlichen führt bei deaktivierten Betas zum Rückfall
auf den Standardbranch; HACS zeigt dann eine Commit-ID statt einer Versionsnummer.

`vectra_studio.zip` enthält nur die Integrationsdateien für eine manuelle Installation.
HACS selbst lädt die Dateien direkt aus dem Repository, damit auch Branch- und
Commit-Installationen ohne vorhandenes Release-Asset funktionieren. Das zweite ZIP
enthält den Konfigurationspfad, die Dokumentation, Buildskripte und Editor-Quellen.
Zum kompletten Stand gehört außerdem das Git-Repository mit dem entsprechenden Tag.

## Upstream-Änderungen übernehmen

Ausgangsbasis ist ha-mobius v0.12.0. Änderungen bewusst vergleichen und einzeln
übernehmen, statt den eigenen Namensraum und das Studio-Panel zu überschreiben.
Protokollnamen wie `MOBIUS` in Bluetooth-Ankündigungen und Python-Imports aus
`mobius` gehören zur Geräte-/Bibliotheksanbindung und werden nicht umbenannt.
