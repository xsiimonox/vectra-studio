# Änderungen

## 0.7.5

- Lokales ESP-Webinterface mit manueller Firmwareprüfung und -installation
  über das veröffentlichte Vectra-Studio-Manifest. Die Prüfung erfolgt zudem
  alle sechs Stunden; ein Update wird niemals automatisch installiert.
- ESP8266 kann das GitHub-Pages-Zertifikat nicht validieren. Die Entscheidung
  für verschlüsselten Abruf ohne Zertifikatsprüfung wurde ausdrücklich
  dokumentiert; Updates nur im vertrauenswürdigen lokalen Netzwerk auslösen.

## 0.7.4

- Neue Diagnose **„Sensor aktiv“** und Watchdog: Keine VL53L0X-Antwort für zwei
  Minuten markiert den Sensor als inaktiv und startet den ESP einmal neu.
- I²C zurück auf die belastbaren D1/D2-Pins. D4 ist mit der blauen D1-mini-LED
  verbunden; Dauerlicht ist ein Hinweis auf einen festhängenden SCL-Bus.

## 0.7.3

- Neue wiederherstellbare Home-Assistant-Number **„Messintervall“** (2–60 s,
  Standard 10 s). Der Sensor wird jede Sekunde gemessen, aber nur im gewählten
  Intervall als Wasserstand veröffentlicht.
- Oberflächenbewegung wird durch einen Median aus neun Proben und einen
  gleitenden Mittelwert über 21 Sekunden zuverlässig geglättet.

## 0.7.2

- ESPHome-Beispiel und Anschlussanleitung auf die Verdrahtung `VIN` → `5V`,
  `GND` → `GND`, `SCL` → `D4` und `SDA` → `D3` aktualisiert. Die Anleitung
  nennt die Voraussetzung eines 5-V-tauglichen VL53L0X-Breakouts sowie den
  Hinweis zu den Boot-Pins D3/D4.

## 0.7.1

- GitHub-Pages-Browser-Flasher für den Vectra Schachtwächter mit ESP Web Tools.
  Die zugehörige GitHub Action erstellt die ESP8266-Firmware und das Manifest
  auf jedem relevanten Push automatisch.
- Nach Browser-Flash kann der Leerabstand direkt als wiederherstellbare
  Home-Assistant-Number-Entität kalibriert werden; kein erneutes Kompilieren
  nötig.

## 0.7.0

- Neuer Dienst `vectra_studio.adjust_water_level` zur konservativen Regelung
  eines Rückförderschachts über einen externen Zentimeter-Sensor und die
  vorhandene Vectra-Konstantleistungsentität.
- Regelung mit Totzone, mehreren Bestätigungsmessungen, begrenzten ganzzahligen
  Leistungsschritten, Min-/Max-Grenzen und hydraulischer Sperrzeit nach jedem
  Stellschritt sowie nach Start oder Rückkehr aus Pause/Stillstand.
- Keine Regelung in `Scene`, `OOB`, bei 0 % Motordrehzahl sowie bei ungültigen
  oder veralteten Pumpen- und Wasserstandswerten. Entscheidungen erscheinen als
  `vectra_studio_water_level_control`-Ereignisse.
- Vollständige ESPHome-Beispielkonfiguration für D1 mini und VL53L0X mit
  Median- und gleitender Mittelwertfilterung sowie Zentimeter-Kalibrierung.

## 0.6.0

- Neue dunkle, responsive Studio-Oberfläche mit Leistungsring, getrennten
  Ist-/Sollwerten und Schieberegler. Schreiben erst bei „Übernehmen“.
- App-Freigabestatus, echte Entitäts-IDs für Automationen und aufklappbare Diagnose.
- Pause/Aus als deaktivierte Vorschau, bis Stop und Wiederanlauf an der M2
  belegt sind. Noch keine funktionsfähigen Pause-/Aus-Entitäten.

## 0.5.1

- Leere Fehlermeldungen bei Leistungsänderungen zeigen jetzt Fehlerklasse und
  Schritt: Verbindungsaufbau, Identität, Zustand, Override, Modus oder Live-Schreiben
  samt ACK-Warten. Timeout beim Schreiben wird als unbestätigter Pumpenzustand
  markiert; kein automatischer erneuter Schreibversuch.
- Vollständiger Fehler-Trace im HA-Protokoll und `last_control_error` an der
  Leistungsentität. Diese Änderung verbessert die Diagnose; sie behauptet keine
  Behebung der noch ungeklärten Transportursache.

## 0.5.0

- Schalter „Vectra Studio – Für Mobius-App freigeben“ und Studio-Schaltfläche:
  AN entlädt die Pumpenverbindungen aller aktiven Vectra-Studio-Einträge; AUS
  lädt sie wieder. Schalter bleibt unabhängig von den Pumpenentitäten verfügbar.
  Freigabe bleibt über Neustarts erhalten. Manuell deaktivierte Einträge werden
  nicht automatisch aktiviert.
- M2-LiveDemo-Konstantleistung verwendet den 37-Byte-Befehl auf Attribut 407
  aus einem erfolgreichen Mobius-HCI-Mitschnitt (70→80→70 %). FSCI/CRC-Prüfung
  der Bibliothek und anschließende Motorwertprüfung bleiben erforderlich.
  Der Live-Befehl speichert keinen Zeitplan. Schedule-Schreibweg bleibt separat.
- Keine privaten Bluetooth-Mitschnitte im Repository. Automatisierte Tests für
  den beobachteten Payload und den Freigabe-/Wiederverbindungsablauf.

## 0.4.2

- Controller-Diagnose liest zusätzlich LiveDemoScene (407), LiveDemoTimeout
  (405) und LiveDemoTimer (406). Alle gelieferten Elemente und ihre Rohbytes
  bleiben erhalten. Der noch ungeklärte M2-LiveDemo-Payload wird nicht als
  verifizierter Leistungswert interpretiert.
- Diagnose verwendet weiterhin nur Lesebefehle; keine neue LiveDemo-Steuerung.

## 0.4.1

- Neuer Button „Betriebszustand auslesen“: liest Attribute 104, 105, 705,
  401 und 700 direkt per Bluetooth ohne Schreibbefehle. Zeigt Rohbytes,
  numerische Werte, Zeitstempel und Fehler je Attribut auch bei unbekannten
  Firmwarewerten an.
- Eine fehlgeschlagene Schedule-Prüfung meldet den tatsächlich dekodierten
  Zustand; sie behauptet nicht mehr pauschal, dass Feed aktiv sei.

## 0.4.0

- Neue M2-NumberEntity und Studio-Bedienung für 1–100 % Konstantleistung.
  Ändert ausschließlich den aktuellen ConstantSpeed-Block in Schedule1;
  sichert vorher den vollständigen Zeitplan in Home Assistants `.storage`.
- Nutzt den gepaddeten Pumpen-Zeitplanwriter der Bibliothek, prüft Rücklesedaten
  und fordert anschließend bis zu fünf aktuelle Statusabfragen an. Erfolg wird
  nur bei passender Motorleistung (±1 Prozentpunkt) und Schedule-Zustand gemeldet.
- Fehler enthalten Seriennummer, Parameter und angeforderten Wert. Keine
  optimistische Erfolgsanzeige, keine automatische Rückkehr/ungeprüfter Rollback.
- Feed, unbekannter/aktiver Override, andere Modelle und andere aktuelle Modi
  werden vor dem Schreiben abgewiesen. Szenen und allgemeine Editor-Schreibwege
  bleiben gesperrt. Neue Steuerung ist noch nicht an echter M2 getestet.

## 0.3.2

- Die erwartete Bluetooth-Einschränkung bei einem Aquarium mit nur einer
  Vectra erzeugt keine dauerhafte Home-Assistant-Benachrichtigung mehr.
  Bereits vorhandene Meldungen werden beim nächsten Laden der Integration
  entfernt; der Hinweis bleibt als Protokolleintrag erhalten.

## 0.3.1

- Sicherheitsmodus: Szenen, Pause und Zeitplan-Schreibbefehle sind wegen eines
  gemeldeten, nicht reproduzierbar verifizierten Vectra-M2-Hardwareverhaltens
  deaktiviert. Die Studio-Seite bleibt für Telemetrie lesend verfügbar.
- Bereits gespeicherte Studio-Timer werden nach einem Neustart nicht mehr
  wiederhergestellt und können keine automatische Rückkehr zum Zeitplan auslösen.

## 0.2.2

- Leer bleibende Studio-Seite nach einem Update behoben: `model.js` wird nun
  mit derselben Versionskennung wie das Panel geladen. Damit kann Safari keine
  neue Oberfläche mehr mit einer älteren, zwischengespeicherten Hilfsdatei
  kombinieren.

## 0.2.1

- Ein nicht verfügbarer Studio-Szenenspeicher blockiert die Studio-Seite nicht
  mehr: Live-Werte und die vorhandenen Mobius-Szenen bleiben sichtbar und nutzbar.
- Studio-Szenen fordern nach Start und Rückkehr sofort eine Aktualisierung der
  Gerätedaten an, statt auf das reguläre Abfrageintervall zu warten.

## 0.2.0

- Lokale Studio-Szenenbibliothek: Eine vorhandene Mobius-Szene kann mit einem
  eigenen Namen und einer Rückkehrzeit von einer Minute bis sieben Tagen gespeichert
  und gestartet werden.
- Neuer Pause-Button mit frei wählbarer Dauer oder „Unbegrenzt“. Nach einer
  endlichen Dauer wird das Tagesprogramm wieder aktiviert; unbegrenzt bleibt die
  Szene aktiv, bis sie manuell beendet wird.
- Szenen und aktive Rückkehrzeit werden lokal in Home Assistant gespeichert und
  ein endlicher Timer wird nach einem Home-Assistant-Neustart erneut eingeplant.
- Die Pause startet bewusst eine konfigurierte Mobius-Wartungs-/Feed-Szene, statt
  eine Rückförderpumpe mit einem nicht verifizierten Direktbefehl hart auszuschalten.

## 0.1.4

- Das logische Aquarium-Gerät heißt nun `Aquarium: …` und trägt das Modell
  `Mobius Aquarium`, damit es nicht wie eine zweite physische Vectra erscheint.

## 0.1.3

- Studio lädt Zeitplan- und Szenenmetadaten über das zugehörige Aquarium statt
  über die einzelne Pumpe; behebt „device_id … is not a Tank device“.
- Verständliche Meldung, wenn Home Assistant die Pumpenbeziehung zum Aquarium
  noch nicht angelegt hat.

## Noch nicht veröffentlicht

- Release-Workflow veröffentlicht nummerierte Versionen regulär statt ausschließlich
  als Vorabversion; HACS kann sie ohne Beta-Option auswählen.
- Bestehenden Release v0.1.2 als regulären, neuesten Release bereitgestellt.
  Der Anwendungscode und die Geräteunterstützung dieses Releases bleiben unverändert.

## 0.1.2

- Leere Studio-Seite behoben: URL-Pfad und Webcomponent-Name wurden bei
  `panel_custom.async_register_panel` vertauscht übergeben.
- Benannte Parameter verhindern die Verwechslung; die Studio-URL ist `/vectra-studio`.
- Regressionstests prüfen den tatsächlich registrierten JavaScript-Komponentennamen
  und das einmalige Registrieren bei erneutem Laden der Integration.

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
