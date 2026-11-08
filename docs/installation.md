# Installation und Updates

[Zur Übersicht](../README.md)

## Vorbereitung

- Home Assistant ab 2026.8.0 verwenden und eine Konfigurationssicherung anlegen.
- Die Pumpe zunächst in Mobius einrichten; kein Zurücksetzen und keine neue
  Kalibrierung für die Integration erforderlich.
- Unter **Einstellungen → Geräte & Dienste** prüfen, ob **Bluetooth** eingerichtet ist.
- Die Mobius-App schließen und einen vorhandenen Mobius-Integrationseintrag für
  dasselbe Aquarium deaktivieren. Andere Integrationen oder Geräte nicht entfernen.

## HACS

1. HACS öffnen und im Menü **Custom repositories / Benutzerdefinierte Repositories** wählen.
2. URL `https://github.com/xsiimonox/vectra-studio`, Typ **Integration**, hinzufügen.
3. Vectra Studio öffnen. Für als Vorabversion markierte Releases gegebenenfalls
   **Beta-Versionen anzeigen / Show beta versions** aktivieren.
4. Herunterladen und Home Assistant neu starten.
5. Unter **Einstellungen → Geräte & Dienste → Integration hinzufügen** nach
   **Vectra Studio** suchen.
6. Das gefundene Gerät bzw. Aquarium bestätigen. Mobius-Geräte desselben Aquariums
   können gemeinsam in einem Eintrag erscheinen; die Studio-Oberfläche zeigt Vectra-Pumpen.
7. Als Administrator **Vectra Studio** in der Seitenleiste öffnen. Falls die erste
   Geräteabfrage noch läuft, kurz warten und **Geräte neu laden** wählen.

Die Versionsanforderungen und Python-Abhängigkeiten stehen im Manifest. Home
Assistant installiert `python-mobius` und `bleak-retry-connector` automatisch.

## Manuell vom Repository

1. Repository herunterladen oder klonen.
2. Den vollständigen Ordner `custom_components/vectra_studio` nach
   `/config/custom_components/vectra_studio` kopieren.
3. Prüfen, dass das Manifest genau unter
   `/config/custom_components/vectra_studio/manifest.json` liegt.
4. Home Assistant neu starten und den Einrichtungsdialog wie oben öffnen.

Die JavaScript-Builds sind bereits enthalten. Nicht nur einzelne Python-Dateien kopieren.

## ZIP aus einem Release

Es gibt zwei ZIP-Dateien mit verschiedenen Zielen:

| Datei | Inhalt | Ziel beim Entpacken |
| --- | --- | --- |
| `vectra_studio.zip` | Nur die Integration, Manifest direkt im ZIP | `/config/custom_components/vectra_studio/` |
| `vectra-studio-VERSION.zip` | Konfigurationspfad, Dokumentation und Editor-Quellen | `/config/` |

HACS installiert seit 0.1.1 direkt aus `custom_components/vectra_studio` im
Repository; die ZIP-Dateien sind zusätzliche manuelle Downloads. GitHubs automatisch erzeugte
**Source code**-Archive sind vollständige Repository-Kopien; daraus nur den
Integrationsordner kopieren.

## Bluetooth

Ein Adapter am HA-Host genügt, wenn der Controller zuverlässig erreichbar ist.
Scanning muss Active/Auto ermöglichen. Ein aktiver ESPHome-Proxy ist eine Alternative;
eine Beispielkonfiguration steht unter [examples/](../examples/).

## Aktualisieren und Rückkehr zu einer vorherigen Version

Mit HACS die gewünschte Version herunterladen und Home Assistant neu starten.
Bei manuellen Updates die alte Version außerhalb von `custom_components` sichern
und den Integrationsordner vollständig ersetzen; keine Versionsmischung stehen lassen.
Die Einrichtung bleibt in Home Assistant gespeichert. Vor Änderungen Gerätezeitpläne
separat als `.mob` sichern. Für ein Rollback die vorherige Integrationsversion
wieder installieren und HA neu starten. Es ist kein Geräte-Firmware-Downgrade.

## Zurück zur Mobius-App

Unter **Geräte & Dienste → Vectra Studio** den Aquarium-Eintrag vorübergehend
**deaktivieren**. Danach kann die App die Verbindung nutzen. Anschließend die App
schließen und den Eintrag wieder aktivieren. Zum Deinstallieren zuerst die Einträge
entfernen, dann die Integration über HACS löschen bzw. den Ordner entfernen und neu starten.
