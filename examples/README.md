# Beispiele

`esp32-bluetooth-proxy.yaml` ist eine Vorlage für einen ESP32 mit aktivem
Bluetooth-Proxy. Sie verwendet ein ESP32 DevKit mit ESP-IDF; Board und Pins bei
anderer Hardware anpassen. Bereits vorhandene ESPHome-Proxys müssen nicht ersetzt werden.

Die Datei benötigt im lokalen ESPHome-`secrets.yaml` die Einträge `wifi_ssid`,
`wifi_password`, `api_encryption_key` und `ota_password`. Einen API-Schlüssel über
ESPHome erzeugen; keine Platzhalterzeichenfolge als Schlüssel verwenden.
Nach Installation den Proxy über die ESPHome-Integration mit HA verbinden.
Die Vorlage wurde nicht auf deiner Hardware getestet.
