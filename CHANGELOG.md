# Änderungen

## 0.1.1

- HACS-Download repariert: direkte Repository-Installation statt zwingendem Release-ZIP,
  auch wenn nur ein Commit oder eine Vorabversion ausgewählt wird.
- Eigenes Vectra-Studio-Logo in README, Studio-Kopfzeile und lokalen Marken-Icons.
- Dokumentation zur Behebung des Downloadfehlers für Commit `596924f`.
- Regressionstest für die HACS-Konfiguration und mitgelieferte Laufzeitdateien.

## 0.1.0

- Experimentelle eigenständige Integration mit Domain `vectra_studio`.
- Native Vectra-Studio-Seitenleiste mit Pumpenauswahl, Live-Werten und Szenen.
- Bluetooth-/Mesh-Backend und Zeitplan-Editor aus ha-mobius v0.12.0 übernommen.
- Editor für eigenen Service-/WebSocket-Namensraum gebaut; Quellen enthalten.
- Deutsche Einrichtung und zentrale Entitätsnamen.
- Frontend-Tests, TypeScript-Prüfung und lokales Installationspaket.

Noch kein Home-Assistant-Laufzeittest und kein Hardwaretest mit der Vectra M2.
