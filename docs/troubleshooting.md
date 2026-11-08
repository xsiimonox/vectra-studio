# Fehlersuche

[Zur Übersicht](../README.md)

## Download schlägt für Version `596924f` fehl

Version 0.1.0 setzte `zip_release: true`, obwohl ohne aktivierte Vorabversionen
kein regulärer Release ausgewählt wurde. HACS versuchte den Commit zu installieren,
für den kein Release-ZIP existiert. Ab 0.1.1 ist diese Release-ZIP-Abhängigkeit entfernt.

In HACS die Repository-Seite öffnen, im Menü **Informationen aktualisieren / Update
information** ausführen und erneut herunterladen. Falls angeboten **Beta-Versionen
anzeigen** aktivieren und **v0.1.1** wählen; alternativ den aktuellen Standardbranch.
Bleibt noch die alte Auswahl sichtbar, die HACS-Seite neu laden und nötigenfalls
Home Assistant neu starten. Die neue Konfiguration muss vor dem Download eingelesen sein.

## HACS zeigt eine Commit-ID statt der Versionsnummer

`981e022` bezeichnet einen Git-Commit, nicht die Integrationsversion. Bis zur
Korrektur der Release-Metadaten waren alle Releases als Vorabversion markiert.
Ohne Beta-Option wählte HACS deshalb den Standardbranch. **v0.1.2** ist nun als
regulärer, neuester Release verfügbar; künftige Versionen werden ebenso veröffentlicht.

In HACS **Informationen aktualisieren / Update information** auswählen und
anschließend unter **Herunterladen / Erneut herunterladen** die Version **v0.1.2**
oder neuer wählen. Ein bereits als Branch installierter Stand kann eine explizite
Versionsauswahl benötigen. Für den Wechsel zur nummerierten Version ist weder
das Löschen der Pumpe noch ein Zurücksetzen ihrer Konfiguration erforderlich.

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

## Studio-Seite vollständig leer (0.1.0/0.1.1)

Diese Versionen übergaben URL-Pfad und Webcomponent-Namen vertauscht an die
Home-Assistant-Panelregistrierung. Dadurch erschien ein Seitenleisteneintrag,
aber die Oberfläche wurde nicht erzeugt. Version **0.1.2** korrigiert den Aufruf.

In HACS die Informationen aktualisieren, die Version v0.1.2
oder neuer auswählen und herunterladen. Anschließend Home Assistant **vollständig neu
starten**, damit die alte Panelregistrierung entfernt wird. Den Browser danach
neu laden; auf dem Desktop gegebenenfalls mit Strg+F5 bzw. Cmd+Shift+R. In der
Companion-App die Oberfläche schließen und erneut öffnen.

Den Eintrag aus der Seitenleiste neu öffnen. Die richtige URL endet jetzt auf
`/vectra-studio`, nicht auf `/vectra-studio-panel`. Die Pumpe muss dafür nicht
gelöscht oder erneut eingerichtet werden.

## „device_id … is not a Tank device“

Versionen bis 0.1.2 übergaben beim Laden der Studio-Oberfläche die Pumpe an
einen Zeitplan-Endpunkt, der das zugehörige Aquarium erwartet. Version **0.1.3**
ermittelt die Aquarium-ID aus der Gerätebeziehung und behält anschließend trotzdem
die ausgewählte Pumpe bei.

In HACS die Informationen aktualisieren, Version 0.1.3 oder neuer herunterladen
und Home Assistant vollständig neu starten. Die vorhandene Pumpeneinrichtung bleibt
erhalten. Falls danach die Meldung erscheint, dass die Pumpe keinem Aquarium-Gerät
zugeordnet ist, die Vectra-Studio-Integration einmal neu laden und die Diagnose der
Integration herunterladen.

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
