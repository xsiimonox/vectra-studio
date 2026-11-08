# Vectra Studio

<p align="center"><img src="assets/vectra-studio-logo.png" width="180" alt="Vectra Studio – V mit Wasserströmung"></p>

[![Prüfungen](https://github.com/xsiimonox/vectra-studio/actions/workflows/validate.yml/badge.svg)](https://github.com/xsiimonox/vectra-studio/actions/workflows/validate.yml)
[![Lizenz: GPL-2.0](https://img.shields.io/badge/Lizenz-GPL--2.0-blue.svg)](LICENSE)

Lokale Home-Assistant-Integration für EcoTech Vectra-Pumpen mit einer eigenen
Oberfläche in der Seitenleiste: Pumpenstatus, Szenen und Tagesprogramme an einem Ort.

**Experimentell:** Version 0.2.0 ist lokal auf Quellcode- und Frontend-Ebene geprüft.
Ein Laufzeittest auf Home Assistant und ein Hardwaretest mit der Vectra M2 stehen
noch aus. Unterstützungsangaben sind keine Bestätigung für jede Firmware.

## Funktionen

- Native **Vectra Studio**-Seitenleiste mit Pumpenauswahl.
- Motordrehzahl, aktueller Modus und geschätzter Durchfluss, soweit zuverlässig
  vom Gerät gemeldet. Fehlende Werte werden als „—“ angezeigt.
- Bereits konfigurierte Szenen starten und zum Tagesprogramm zurückkehren.
- Integrierter Zeitplan-Editor mit unterstützten Pumpenmodi sowie `.mob`-Import und -Export.
- Deutsche Einrichtung und Übersetzungen zentraler Entitäten.
- Verbindung über den Bluetooth-Adapter von Home Assistant oder einen aktiven ESPHome-Proxy.

Die Bluetooth-/Mesh-Anbindung und der derzeit englischsprachige Zeitplan-Editor
basieren auf [ha-mobius v0.12.0](https://github.com/r3pek/ha-mobius/tree/v0.12.0).
Die separate Mobius-Integration muss nicht installiert werden. Vectra Studio
verwendet `python-mobius` als Protokollbibliothek. Siehe [Herkunft und Änderungen](NOTICE.md).

Ein vollständig eigener Zeitplan-Editor, eine Programmbibliothek und frei einstellbare,
zeitlich begrenzte Wartungsmodi sind noch nicht implementiert.

## Voraussetzungen

Home Assistant **2026.8.0 oder neuer**, eine bereits mit Mobius eingerichtete
Vectra und Bluetooth-Empfang am Controller. Die erste Erprobung ist für eine M2
mit Home Assistant OS und Core 2026.10.1 vorgesehen.

## Installation über HACS

1. In HACS das Menü **Benutzerdefinierte Repositories / Custom repositories** öffnen.
2. `https://github.com/xsiimonox/vectra-studio` als Typ **Integration** hinzufügen.
3. **Vectra Studio** öffnen und die nummerierte Version **v0.2.0** oder neuer wählen.
   Beta-Versionen müssen dafür nicht aktiviert werden.
4. **Vectra Studio** herunterladen und Home Assistant neu starten.
5. Die Mobius-App schließen. Einen bereits eingerichteten `ha-mobius`-Eintrag für
   dasselbe Aquarium deaktivieren, damit nur eine Integration die Verbindung verwaltet.
6. **Einstellungen → Geräte & Dienste → Integration hinzufügen → Vectra Studio** öffnen.
7. Das erkannte Gerät/Aquarium bestätigen und **Vectra Studio** in der Seitenleiste öffnen.

Der Seitenleisteneintrag ist für Administratoren sichtbar. Eine Aufnahme in den
HACS-Standardkatalog ist nicht beantragt; die Installation erfolgt als benutzerdefiniertes Repository.

[Ausführliche Installation und Updates](docs/installation.md) ·
[Bedienung und erster Pumpentest](docs/usage.md) ·
[Bluetooth und Fehlersuche](docs/troubleshooting.md)

HACS lädt die enthaltenen Integrationsdateien direkt aus dem Repository.
Damit funktionieren sowohl Release-Tags als auch der Standardbranch ohne ein
zusätzliches Release-ZIP. Bei einem Fehler mit `596924f` zuerst in HACS
**Informationen aktualisieren** wählen und danach erneut herunterladen.

## Manuelle Installation

Den Ordner `custom_components/vectra_studio` nach
`/config/custom_components/vectra_studio` kopieren, Home Assistant neu starten
und ab Schritt 5 oben fortfahren. Die gebauten Dashboard-Karten sind im Repository
enthalten; für die Installation ist kein Node.js nötig.

Das Release enthält außerdem `vectra-studio-0.1.2.zip`. Es wird direkt im
Home-Assistant-Konfigurationsverzeichnis entpackt und enthält den Pfad
`custom_components/vectra_studio/` bereits. ZIP-Layouts und Updates erklärt die
[Installationsanleitung](docs/installation.md).

## Entwicklung

```bash
git clone https://github.com/xsiimonox/vectra-studio.git
cd vectra-studio
npm --prefix frontend-src ci --ignore-scripts
npm --prefix frontend-src run typecheck
npm --prefix frontend-src run build
(cd frontend-src && node --test)
npm test
npm run check
python3 -m unittest discover -s tests -p "test_*.py"
python3 tools/validate_release.py --package
```

Node.js 24 und Python 3.13+ verwenden. Python-Pakete von Home Assistant werden
für diese lokalen Strukturprüfungen nicht benötigt. Sie ersetzen keinen HA-Laufzeittest.

[Architektur, Prüfungen und Releases](docs/development.md) ·
[Mitwirken](CONTRIBUTING.md) · [Änderungen](CHANGELOG.md)

## Grenzen und Zusammenspiel mit Mobius

Szenen wirken auf die Geräte des zugehörigen Aquariums, auf denen die Szene
eingerichtet ist. Vor Zeitplanänderungen eine `.mob`-Sicherung exportieren.
Die Mobius-App übernimmt HA-Zeitplanänderungen nicht automatisch; Details in der
[Bedienungsanleitung](docs/usage.md).

Die Pumpensteuerung erfolgt lokal. Paketinstallation und Firmware-Angebotsprüfung
verwenden Internetdienste. Die übernommene Backend-Logik kann bei nicht erreichbaren
Mesh-Geräten Neustarts auslösen und synchronisiert Geräteuhren.

## Lizenz und Support

GPL-2.0, einschließlich der übernommenen Teile. Siehe [LICENSE](LICENSE) und
[NOTICE.md](NOTICE.md). Unabhängiges Projekt ohne Verbindung zu EcoTech Marine.

[Fehler melden oder Funktionen vorschlagen](https://github.com/xsiimonox/vectra-studio/issues).
