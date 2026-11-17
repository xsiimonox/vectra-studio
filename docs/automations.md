# Automationen

Die Studio-Seite zeigt die tatsächlichen IDs von Leistungsentität und App-Schalter.
Sie können umbenannt sein; IDs aus der eigenen Installation verwenden.

## Leistung

Aktion im Home-Assistant-Automationseditor:

```yaml
action: number.set_value
target:
  entity_id: number.DEINE_M2_KONSTANTLEISTUNG
data:
  value: 40
```

Das führt denselben Handler aus wie die Oberfläche. Die eigentliche
HA-Leistungsänderung an der M2 ist bislang noch nicht erfolgreich bestätigt.

## Mobius-App freigeben

```yaml
action: switch.turn_on
target:
  entity_id: switch.DEINE_MOBIUS_APP_FREIGABE
```

`switch.turn_off` beendet die Freigabe; Mobius vorher schließen. Der Schalter
trennt Bluetooth, nicht die Pumpenversorgung.

## Wasserstand im Rückförderschacht regeln

Das vollständige ESPHome-Beispiel für D1 mini und VL53L0X liegt unter
[`examples/d1-mini-vl53l0x-water-level.yaml`](../examples/d1-mini-vl53l0x-water-level.yaml).
Vor dem Flashen `empty_distance_cm` mit montiertem Spritzschutz kalibrieren.

### D1 mini per USB flashen

Das Skript [`tools/flash-vl53l0x-d1-mini.sh`](../tools/flash-vl53l0x-d1-mini.sh)
benötigt die ESPHome-CLI und den seriellen Port des D1 mini:

```bash
pipx install esphome
./tools/flash-vl53l0x-d1-mini.sh /dev/cu.usbserial-0001 18.4
```

Nach dem Flashen mit dem WLAN **„Vectra Schacht Fallback“** verbinden
(Kennwort `vectra-setup`), `http://192.168.4.1` öffnen und das eigene WLAN
eintragen. Danach erscheint das Gerät in Home Assistant zur Übernahme.

Die Integration stellt `vectra_studio.adjust_water_level` bereit. Der Dienst
wertet pro Aufruf genau einen Messwert aus. Erst nach drei gleichgerichteten
Abweichungen erfolgt ein kleiner Schritt; danach sperrt `settle_seconds` weitere
Änderungen, damit die träge Hydraulik reagieren kann. `Scene`, `OOB`, eine
gestoppte Pumpe sowie unbekannte oder alte Messwerte löschen die bisherige
Bestätigung und führen niemals zu einer Leistungsänderung.

Beispielautomation, Entitäts-IDs an die eigene Installation anpassen:

```yaml
alias: Vectra Schachtregelung
mode: single
triggers:
  - trigger: time_pattern
    seconds: "/10"
actions:
  - action: vectra_studio.adjust_water_level
    data:
      level_sensor: sensor.vectra_schacht_schacht_wasserstand
      power_entity: number.vectra_m2_konstantleistung
      operation_state_sensor: sensor.vectra_m2_betriebszustand
      motor_speed_sensor: sensor.vectra_m2_motordrehzahl
      target_cm: 10.0
      deadband_cm: 0.3
      step_percent: 1
      minimum_percent: 25
      maximum_percent: 75
      settle_seconds: 120
      confirmations: 3
      higher_power_lowers_level: true
      max_sample_age_seconds: 30
      max_pump_state_age_seconds: 90
```

Bei `higher_power_lowers_level: true` erhöht ein zu hoher Schachtstand die
Pumpenleistung; ein zu niedriger Stand senkt sie. Vor dem Automatikbetrieb mit
manuellen 1-%-Änderungen prüfen, ob diese Wirkrichtung im eigenen Becken stimmt.
Jede Entscheidung wird als Ereignis `vectra_studio_water_level_control`
ausgegeben und kann in den Home-Assistant-Entwicklerwerkzeugen beobachtet werden.

Die Konstantleistungsentität schreibt im Zustand `Schedule` den aktiven
Zeitplanblock dauerhaft. Deshalb kleine Schritte, eine lange Wartezeit und enge
Leistungsgrenzen verwenden. Im Zustand `LiveDemo` erfolgt die bestätigte
Live-Schreibweise der Integration.

## Pause und dauerhaft Aus fehlen noch

Es gibt noch keine Pause-/Aus-Entitäten: Der Mitschnitt belegt Live-Konstantleistung
70→80→70 %, aber keinen echten Stop mit Wiederanlauf. Frühere Szenenbefehle
verursachten an der M2 einen nicht startenden Zustand. 1 % ersetzt keinen Stop.

Für die gewünschte Automation (Steckdose AN → Pause; AUS → Fortsetzen) müssen
diese Befehle zuerst geklärt werden. Benötigt wird ein Mitschnitt von Mobius-Pause
und vorzeitigem Beenden sowie, falls angeboten, Ausschalten und Einschalten.
Nur regulär von der App angebotene Funktionen verwenden; Uhrzeiten notieren.
