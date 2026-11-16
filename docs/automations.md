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

## Pause und dauerhaft Aus fehlen noch

Es gibt noch keine Pause-/Aus-Entitäten: Der Mitschnitt belegt Live-Konstantleistung
70→80→70 %, aber keinen echten Stop mit Wiederanlauf. Frühere Szenenbefehle
verursachten an der M2 einen nicht startenden Zustand. 1 % ersetzt keinen Stop.

Für die gewünschte Automation (Steckdose AN → Pause; AUS → Fortsetzen) müssen
diese Befehle zuerst geklärt werden. Benötigt wird ein Mitschnitt von Mobius-Pause
und vorzeitigem Beenden sowie, falls angeboten, Ausschalten und Einschalten.
Nur regulär von der App angebotene Funktionen verwenden; Uhrzeiten notieren.
