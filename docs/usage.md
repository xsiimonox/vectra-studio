# Bedienung und erster Pumpentest

[Zur Übersicht](../README.md)

> **Sicherheitsmodus ab v0.3.0:** Vectra Studio zeigt Statuswerte, sendet aber
> keine Szenen-, Pause- oder Zeitplan-Schreibbefehle. Die Steuerung der M2 muss
> bis zu einer reproduzierbar getesteten Lösung über Mobius oder den Controller
> erfolgen.

## Status prüfen

Nach der Einrichtung Vectra Studio als Administrator öffnen und die Pumpe wählen.
Die Oberfläche zeigt Motordrehzahl, aktuellen Modus und einen geschätzten
Durchfluss, sofern die Pumpe ihn zuverlässig liefert. „—“ bedeutet fehlende oder
nicht verfügbare Daten; es wird kein Durchfluss aus der Drehzahl erfunden.

Die Werte stammen aus den HA-Entitäten und werden mit deren Aktualisierungen
übernommen. **Geräte neu laden** lädt die Geräteauswahl und Metadaten erneut;
es ist kein sofortiger Bluetooth-Telemetrieabruf. Das Abfrageintervall lässt sich
an der Konfigurationsentität des Aquariums zwischen 10 und 300 Sekunden einstellen.

## Szenen

Eine bereits auf den Geräten konfigurierte Szene wählen und **Szene starten**
betätigen. **Zum Tagesprogramm** beendet die Szene über die Backend-Funktion zur
Rückkehr in den Zeitplan. Die Szene wirkt auf das Aquarium und die Geräte,
auf denen sie eingerichtet ist. Eine Erfolgsmeldung bestätigt den API-Aufruf;
der angezeigte Pumpenzustand wird weiterhin aus den Gerätedaten gelesen.

Es werden keine neuen Feed- oder Wartungsszenen automatisch angelegt. Welche
Szenen verfügbar sind, hängt von der Konfiguration in Mobius ab.

## Studio-Szenen und Pause

Unter **Studio-Szenen & Pause** lassen sich eigene, lokale Schnellzugriffe auf
eine vorhandene Mobius-Szene anlegen. Vergib einen Namen, wähle die Mobius-Szene
und setze die Rückkehrzeit zwischen einer Minute und sieben Tagen. Mit
**Unbegrenzt** bleibt sie aktiv, bis **Pause/Szene beenden** gewählt wird.

Der Eintrag und ein gerade aktiver Rückkehrtimer werden nur in Home Assistant
gespeichert. Bei einem Neustart wird ein endlicher Timer wiederhergestellt.
Eine in Mobius hinterlegte, kürzere Szenendauer kann die Pumpenparameter jedoch
vorher ändern; richte die Mobius-Szene daher passend ein.

**Pause starten** ist absichtlich kein direkter „Pumpe aus“-Befehl: Wähle dafür
eine selbst in Mobius angelegte Feed- oder Wartungsszene. So bleibt die
Rückförderung unter der von Ecotech vorgesehenen Szenenkonfiguration. Beende die
Pause manuell oder lasse Vectra Studio nach der gewählten Dauer zum Tagesprogramm
zurückkehren.

## Zeitpläne

**Zeitplan-Editor öffnen** lädt den mitgelieferten Editor aus ha-mobius. Er ist
noch englischsprachig. Unterstützte Modi und Parameter werden aus der Geräteanbindung
ermittelt; es werden keine beliebigen VorTech-Modi für eine Rückförderpumpe zugesichert.

Vor der ersten Änderung das bestehende Programm als `.mob` exportieren. Änderungen
werden erst über die Speichern-Funktion auf die Pumpe geschrieben. Der Import einer
Datei in den Editor allein ist noch kein Schreiben auf das Gerät.

Die Mobius-App hält eine eigene Kopie des Zeitplans und übernimmt HA-Änderungen
nicht automatisch. Nach dem Speichern die `.mob` exportieren und bei Bedarf in
Mobius importieren. Spätere Änderungen in der App können den Gerätezeitplan ersetzen.

## Erprobung der ersten Version

1. Erkennung und Pumpenidentität prüfen.
2. Live-Werte im normalen Betrieb beobachten und mit Mobius vergleichen. Für den
   App-Zugriff den Studio-Eintrag deaktivieren, anschließend wieder aktivieren.
3. Zeitplan exportieren und die Datei aufbewahren.
4. Eine bekannte, für das Aquarium konfigurierte Szene vor Ort testen.
5. Zum Tagesprogramm zurückkehren und den tatsächlichen Pumpenbetrieb kontrollieren.
6. Erst danach Zeitplanänderungen erproben und einen Export zum Wiederherstellen behalten.

Noch sind weder diese Schritte mit einer echten M2 abgeschlossen noch eine konkrete
Firmware als getestet eingetragen. Ergebnisse können über ein GitHub-Issue gemeldet werden.

## Dashboard ohne Studio-Seitenleiste

Die mitgelieferten Karten lassen sich auch in einem Dashboard verwenden:

```yaml
type: custom:vectra-studio-schedule-card
device_id: DEINE_HOME_ASSISTANT_GERAETE_ID
```

Die Geräte-ID stammt aus Home Assistant, nicht vom Typenschild. Als Ziel die Pumpe
verwenden, nicht das übergeordnete Aquarium-Gerät. Für Szenen:

```yaml
type: custom:vectra-studio-scene-card
entity: select.DEINE_SZENENAUSWAHL
```

In Dashboards im Speichermodus werden Ressourcen automatisch registriert.
Bei YAML-Dashboards die beiden Module aus `/vectra_studio_frontend/` selbst
als `type: module` in der Ressourcenliste eintragen.
