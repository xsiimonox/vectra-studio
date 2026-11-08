# Änderungen

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
