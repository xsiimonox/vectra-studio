# Fehlersuche

[Zur Übersicht](../README.md)

## Integration erscheint nicht

Nach Installation Home Assistant vollständig neu starten. Bei manueller Installation
muss das Manifest unter `/config/custom_components/vectra_studio/manifest.json`
liegen. Mindestversion 2026.8.0 prüfen und die HA-Protokolle ansehen.

## Keine Pumpe entdeckt

Bluetooth muss in Home Assistant eingerichtet und der Pumpencontroller erreichbar
sein. Die Mobius-App vollständig schließen und eine andere Integration für dasselbe
Aquarium deaktivieren. Active/Auto-Scanning ermöglicht das Lesen der Seriennummer.
Ein passiver Scanner allein reicht nicht. Reichweite zum Controller prüfen;
ein aktiver Proxy nahe am Aquarium kann helfen.

Die Meldung, dass eine Seriennummer noch nicht gelesen werden konnte, kann bei
wechselnden Werbepaketen vorübergehend auftreten. Nach aktivem Scan erneut versuchen.

## Gerät eingerichtet, aber nicht im Studio sichtbar

Die Oberfläche zeigt aktivierte Geräte der Integration `vectra_studio`, deren
Modell als Vectra erkannt wurde. Das übergeordnete Aquarium ist keine Pumpe.
Auf die erste erfolgreiche Geräteabfrage warten und **Geräte neu laden** betätigen.
Bleibt die Liste leer, die gemeldete Modellkennung im Fehlerbericht angeben.

## Kein Durchfluss oder unbekannter Modus

Nicht jede Firmware liefert alle Werte. Ein fehlender Durchfluss ist kein
Beleg dafür, dass die Pumpe steht. Es wird keine M2-Durchflussgenauigkeit zugesichert.
Die Diagnose kann zeigen, welche Unterstützung die Bibliothek erkannt hat.

## Mobius-App kann nicht verbinden

Bei einem einzelnen Gerät belegt die Integration dessen Bluetooth-Verbindung.
Den Aquarium-Eintrag unter **Geräte & Dienste → Vectra Studio** deaktivieren,
dann die App verwenden. Anschließend App schließen und Eintrag wieder aktivieren.

## Seitenleiste fehlt oder Editor lädt nicht

Als Administrator anmelden und Browser neu laden. Prüfen, dass auch `panel/` und
`frontend/dist/` installiert wurden. Nach einem manuellen Update auf Versionsmischungen
achten. Bei YAML-Dashboards Ressourcen wie in der Bedienungsanleitung registrieren.

## Verbindungsabbrüche

Bluetooth-Reichweite und Proxy-Verfügbarkeit prüfen. Der übernommene Backend-Code
stellt Verbindungen wieder her, kann den Gateway wechseln und nicht erreichbare
Mesh-Geräte neu starten. Kurze Pollintervalle beheben keine schlechte Funkverbindung.
Debug-Protokolle zeigen die Verbindungsversuche und automatische Wiederherstellung.

## Fehlerbericht erstellen

Unter **Geräte & Dienste → Vectra Studio** Debug-Protokollierung aktivieren,
den Fehler reproduzieren und die Protokollierung wieder deaktivieren. Die
Integrationsdiagnose kann über das Eintragsmenü heruntergeladen werden.

Im [Issue](https://github.com/xsiimonox/vectra-studio/issues/new/choose) Versionen
von HA und Vectra Studio, Pumpenmodell/Firmware, Bluetooth-Anbindung und konkrete
Schritte angeben. Vor Veröffentlichung Logs und Diagnose auf private Inhalte prüfen.
