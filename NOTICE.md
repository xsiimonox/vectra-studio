# Herkunft und Änderungen

Vectra Studio 0.1.0 ist ein unabhängiges, experimentelles Derivat von
**r3pek/ha-mobius v0.12.0**, veröffentlicht unter GPL-2.0.

Quelle: https://github.com/r3pek/ha-mobius/releases/tag/v0.12.0

Die ursprüngliche Lizenz liegt in `custom_components/vectra_studio/LICENSE`.
Das Originalarchiv ist über den oben verlinkten Upstream-Release abrufbar.
Seine SHA-256-Prüfsumme lautet:
`cf4133ded262bacd057966a3f5ec0091b62508e7aa3cfcc06276d53b214e30b2`.
Die Bibliothek `python-mobius` wird als externe Abhängigkeit installiert;
die Integration `ha-mobius` muss nicht zusätzlich installiert werden.

Änderungen für Vectra Studio:

- Eigene HA-Domain `vectra_studio`, eigener Service- und WebSocket-Namensraum.
- Eigener Eintrag und eigene native Oberfläche in der HA-Seitenleiste.
- Eigenes generiertes Logo; Motiv und Erzeugungsprompt unter `assets/logo-generation.json`.
- HACS verwendet ab 0.1.1 Repository-Dateien statt eines zwingenden Release-Assets.
- Pumpenübersicht mit Live-Werten, Gerätauswahl und Szenenbedienung.
- Der Zeitplan-Editor aus ha-mobius ist enthalten und für den eigenen
  Namensraum angepasst; er ist keine vollständige Eigenentwicklung.
- Deutsche Einrichtungs- und Entitätsübersetzungen.
- Eigene Paketvalidierung und Frontend-Tests.

Die Bluetooth-, Mesh-, Geräte- und Zeitplanlogik stammt weitgehend aus
ha-mobius. Bestehende Klassennamen und Protokollbezeichnungen bleiben deshalb
teilweise erhalten. Die enthaltene Unterstützung weiterer Mobius-Geräte ist
nicht als eigenständig getestete Vectra-Studio-Funktion zugesichert.

Keine Verbindung zu oder Unterstützung durch EcoTech Marine. Es wurden noch
keine Laufzeittests mit Home Assistant oder einer Vectra M2 durchgeführt.
