# Vectra Studio – Dashboard-Karten

Die Karten stammen aus ha-mobius v0.12.0 (GPL-2.0) und wurden für den eigenen
Vectra-Studio-Namensraum angepasst. Siehe [NOTICE.md](../NOTICE.md).

```bash
npm ci --ignore-scripts
npm run typecheck
npm run build
node --test
```

Nur `src/` bearbeiten. Der Build schreibt nach
`../custom_components/vectra_studio/frontend/dist/`. Die gebauten Dateien sind
im Repository enthalten und müssen bei Quelländerungen mit aktualisiert werden.
Dadurch funktionieren HACS und manuelle Installationen ohne Node.js auf dem HA-Host.

Die eigene Studio-Seitenleiste liegt separat unter
`custom_components/vectra_studio/panel/` und benötigt keinen Build.
