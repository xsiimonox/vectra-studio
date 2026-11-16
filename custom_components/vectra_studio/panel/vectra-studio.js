/* Vectra Studio — independent HA panel, GPL-2.0. */
// The panel itself is versioned by panel.py. Version the static dependency too:
// otherwise Safari may combine a new panel with an old cached model.js and fail
// module evaluation before it can render anything.
import {vectraDevices, pumpGroup, displayState, sceneOptions, studioDurationSeconds, formatStudioDuration} from "./model.js?v=0.6.0";

class VectraStudioPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this._devices = [];
    this._generation = 0;
    this._selection = 0;
    this._busy = false;
    this._studioScenes = [];
    this._studioActive = null;
    this._studioAvailable = true;
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:var(--primary-text-color,#17363d);background:var(--primary-background-color,#f3f7f7);min-height:100vh;font-family:var(--paper-font-body1_-_font-family,system-ui)}
        *{box-sizing:border-box} header{display:flex;align-items:center;gap:12px;padding:18px 24px;background:var(--card-background-color,#fff);border-bottom:1px solid var(--divider-color,#dde6e7)}
        header strong{font-size:18px;letter-spacing:-.5px}header span{font-size:12px;color:var(--secondary-text-color,#667d82)}ha-menu-button{display:block}
        main{max-width:1160px;margin:auto;padding:36px 28px} .eyebrow{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--secondary-text-color,#667d82)}
        h1{font-size:clamp(28px,4vw,42px);letter-spacing:-1.6px;margin:10px 0}p{line-height:1.6;color:var(--secondary-text-color,#667d82)}
        .toolbar,.actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.toolbar{margin:28px 0}.toolbar label{flex:1;min-width:210px;max-width:450px;font-size:12px}label select{display:block;width:100%;margin-top:8px}
        button,select{font:inherit;border:1px solid var(--divider-color,#d4e0e2);border-radius:12px;padding:11px 15px;background:var(--card-background-color,#fff);color:inherit}button{cursor:pointer}button.primary{background:#087e88;color:white;border-color:#087e88}button:disabled,select:disabled{opacity:.5;cursor:default}button:focus-visible,select:focus-visible{outline:3px solid #44b8c2;outline-offset:3px}
        .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:24px 0}.metric,.box{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#dde6e7);border-radius:20px;padding:24px}.metric small{color:var(--secondary-text-color,#667d82)}.value{font-size:30px;letter-spacing:-1px;margin-top:14px;overflow-wrap:anywhere}.box{margin:20px 0}h2{font-size:20px;margin:0 0 12px}.box p{font-size:14px;margin:8px 0 20px}.tag{border-radius:20px;background:#087e8814;color:var(--primary-text-color,#087e88);font-size:11px;padding:6px 10px;margin-left:auto}.fields{display:grid;grid-template-columns:minmax(140px,1fr) minmax(110px,.55fr) auto;gap:10px;align-items:end;margin:13px 0}.fields label{font-size:12px;color:var(--secondary-text-color,#667d82)}.fields input,.fields select{display:block;width:100%;margin-top:6px}.check{white-space:nowrap;padding-bottom:11px;font-size:13px!important;color:inherit!important}.check input{width:auto!important;display:inline!important;margin:0 5px 0 0!important}.studio-list{display:grid;gap:9px;margin-top:16px}.studio-item{display:flex;align-items:center;gap:10px;padding:12px;border-radius:13px;background:var(--secondary-background-color,#f4f8f8)}.studio-item strong{display:block}.studio-item small{color:var(--secondary-text-color,#667d82)}.studio-item button{margin-left:auto;padding:7px 10px}.active-scene{font-size:13px;color:var(--secondary-text-color,#667d82);margin-top:10px}
        #message{white-space:pre-wrap;padding:16px;border-radius:12px;background:var(--card-background-color,#fff);margin:16px 0;border:1px solid var(--divider-color,#d4e0e2)}#message.error{border-color:var(--error-color,#c44)}[hidden]{display:none!important}#editor{margin-top:20px}footer{font-size:12px;line-height:1.7;color:var(--secondary-text-color,#667d82);margin-top:28px} .empty{padding:35px 0;max-width:650px}
        @media(max-width:650px){main{padding:24px 16px}.metrics{grid-template-columns:1fr}.metric{padding:18px}.value{font-size:26px}header{padding:12px}.tag{display:none}.fields{grid-template-columns:1fr}.studio-item{align-items:flex-start;flex-wrap:wrap}.studio-item button{margin-left:0}}
        :host{--reef:#18b8ac;--ink:#e8f3f4;--muted:#91a9b3;color:var(--ink);background:radial-gradient(ellipse at 80% 0%,#13404c 0,transparent 52%),#0b1720;font-family:system-ui,-apple-system,sans-serif}
        header{background:#101f29;border-color:#29404c}header span,p,footer,.eyebrow,.metric small{color:var(--muted)}main{max-width:1180px;padding-top:48px}h1{font-weight:650;letter-spacing:-1.8px}.box,.metric{background:#122530;border-color:#29414d;box-shadow:0 15px 40px #00000012}.box h2{letter-spacing:-.5px}.tag{background:#18b8ac19;color:#7be3d9}button,select,input{background:#19323f;color:var(--ink);border:1px solid #365360;border-radius:12px;padding:12px;font:inherit}button{transition:background .15s,transform .15s}button:hover:enabled{background:#254955}button.primary{background:#23b8a7;color:#082a2d;border:0;font-weight:650}input:focus-visible,button:focus-visible,select:focus-visible{outline:3px solid #4dd9c6;outline-offset:3px}.toolbar label{color:var(--muted)}#message{background:#19323f;border-color:#365360}.hero-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:22px;align-items:stretch}.hero-grid>.box{margin:0}.dial{--level:0;display:grid;place-items:center;width:210px;height:210px;margin:24px auto;border-radius:50%;background:conic-gradient(from 225deg,#25c8b3 calc(var(--level)*2.7deg),#294350 0deg, #294350 270deg,transparent 270deg);position:relative}.dial:before{content:'';position:absolute;inset:13px;background:#122530;border-radius:50%}.dial-inner{position:relative;text-align:center}.dial-value{font-size:48px;font-weight:600;letter-spacing:-2px}.dial-inner small{display:block;color:var(--muted);font-size:11px;letter-spacing:2px;text-transform:uppercase}.range-row{display:flex;gap:14px;align-items:center}.range-row input[type=range]{flex:1;min-width:0;accent-color:var(--reef);padding:0}.range-row input[type=number]{width:88px}.power-actions{display:flex;align-items:center;gap:12px;margin-top:20px}.power-actions button{flex:1}.section-note{font-size:12px!important}.pill{display:inline-block;border-radius:20px;background:#1a3843;padding:5px 10px;font-size:11px;color:#9ec0cc}.control-stack{display:grid;gap:16px}.control-tile{padding:20px;border:1px solid #35505b;border-radius:16px;background:#162d39}.tile-title{display:flex;align-items:center;justify-content:space-between;gap:8px}.tile-title strong{font-size:17px}.control-tile p{font-size:13px!important;margin:10px 0}.control-tile button{width:100%;margin-top:10px}.danger{color:#ffb3ac;border-color:#925652}.paused-fields{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.paused-fields input{width:85px}.disabled-note{color:#d9bb8c!important;font-size:12px!important}.secondary-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px}.secondary-grid>.box{margin:0}.entity-code{display:block;user-select:all;overflow-wrap:anywhere;font-size:12px;padding:10px;background:#0d1c25;border-radius:9px;margin:8px 0;color:#92dcd2}details.box>summary{cursor:pointer;font-weight:600}pre{color:#9ac9cd;max-height:360px;overflow:auto;font-size:12px}.metric .value{font-size:27px}.device-icon{color:#6ce0cf;width:32px;height:32px}.metrics{margin:22px 0}.hero-caption{font-size:14px!important;max-width:650px}button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:800px){.hero-grid,.secondary-grid{grid-template-columns:1fr}.dial{width:180px;height:180px}main{padding-top:28px}.metrics{grid-template-columns:1fr 1fr}.metrics>.metric:last-child{grid-column:1/-1}}@media(prefers-reduced-motion:reduce){button{transition:none}}
      </style>
      <header><ha-menu-button></ha-menu-button><img src="/vectra_studio_panel/vectra-studio-logo.png" width="44" height="44" alt=""><strong>Vectra Studio</strong><span>Rückförderung</span><span class="tag">Experimentell · 0.6.0</span></header>
      <main><div class="eyebrow">Vectra · Return pump control</div><h1>Alles im Fluss.</h1><p class="hero-caption">Deine Rückförderung. Leistung, Verbindung und bestätigte Gerätewerte – direkt in Home Assistant.</p>
        <div class="toolbar"><label>Pumpe<select id="device" aria-label="Pumpe auswählen"></select></label><button id="refresh">Geräte neu laden</button></div>
        <div id="message" role="status" aria-live="polite" hidden></div>
        <div class="secondary-grid"><div class="box"><h2>Verbindung & App</h2><span class="pill" id="connection-state">Status wird geladen</span><p>Gib Bluetooth für Mobius frei. Für die Rückkehr zur HA-Steuerung Mobius schließen und die Freigabe beenden. Gilt für alle eingerichteten Vectra-Aquarien.</p><button id="app-access" disabled>App-Freigabe wird geladen …</button></div><div class="box"><h2>Smart Home</h2><p>Die folgenden Entitäten kannst du in Dashboards, Skripten und Automationen verwenden. IDs lassen sich markieren und kopieren.</p><strong>Leistung · number.set_value</strong><code id="power-entity-id" class="entity-code">Noch keine Pumpenentität geladen</code><strong>App-Freigabe · switch.turn_on / turn_off</strong><code id="app-entity-id" class="entity-code">Noch keine Schalterentität geladen</code><p class="section-note">App-Freigabe trennt nur Bluetooth. Sie stoppt die Pumpe nicht.</p></div></div>
        <section id="empty" class="empty" hidden><h2>Noch keine Vectra gefunden</h2><p>Füge unter Einstellungen → Geräte & Dienste eine Vectra über die Integration „Vectra Studio“ hinzu. Schließe die Mobius-App und prüfe den Bluetooth-Empfang am Pumpencontroller. Lade anschließend die Geräte hier neu.</p></section>
        <section id="content" hidden>
          <div class="hero-grid" style="margin-top:22px"><div class="box"><span class="pill">Konstantleistung</span><div class="dial" id="power-dial"><div class="dial-inner"><span class="dial-value" id="dial-value">—</span><small>Ist-Leistung · %</small></div></div><label for="power-slider">Gewünschte Leistung</label><div class="range-row"><input id="power-slider" type="range" min="1" max="100" step="1" value="50" aria-label="Leistung auswählen"><input id="power" type="number" min="1" max="100" step="1" value="50" aria-label="Konstantleistung in Prozent"><span>%</span></div><div class="power-actions"><button id="apply-power" class="primary" disabled>Leistung übernehmen</button></div><p id="power-result" role="status"></p><p class="section-note">Im LiveDemo-Betrieb direkt, im Zeitplanbetrieb dauerhaft für den aktuellen Konstantleistungsblock. Änderungen werden erst durch „Übernehmen“ gesendet.</p></div><div class="box"><h2>Betriebssteuerung</h2><div class="control-stack"><div class="control-tile"><div class="tile-title"><strong>Ⅱ Pause</strong><span class="pill">Noch nicht verfügbar</span></div><p>Frei wählbare Dauer und manuelle Rückkehr sind vorgesehen.</p><div class="paused-fields"><input type="number" value="15" min="1" disabled aria-label="Pause in Minuten"><span>Minuten</span><label><input type="checkbox" disabled style="width:auto"> Unbegrenzt</label></div><button disabled>Pause starten</button><button disabled>Pause beenden</button></div><div class="control-tile"><div class="tile-title"><strong>⏻ Dauerhaft aus</strong><span class="pill">Noch nicht verfügbar</span></div><p>Aus bis zum ausdrücklichen Wiedereinschalten.</p><button class="danger" disabled>Pumpe ausschalten</button></div></div><p class="disabled-note">Stoppen und Wiederanlaufen sind noch nicht bestätigt. Deshalb senden diese Bedienelemente keine Pumpenbefehle. 1 % Leistung ist kein Aus-Zustand.</p></div></div>
          <div class="metrics"><div class="metric"><small>Motordrehzahl</small><div class="value" id="speed">—</div></div><div class="metric"><small>Geschätzter Durchfluss</small><div class="value" id="flow">—</div></div><div class="metric"><small>Aktueller Modus</small><div class="value" id="mode">—</div></div></div>
        </section>
        <details class="box"><summary>Controller-Diagnose</summary><p>Direktes Auslesen von Zustand, Modus, Override, Szene, Motorleistung und LiveDemo-Daten.</p><button id="read-control">Betriebszustand auslesen</button><pre id="control-state" style="white-space:pre-wrap;overflow-wrap:anywhere" role="status"></pre></details>
        <footer>Vectra Studio · Unabhängiges Projekt auf Basis von ha-mobius und python-mobius.<br>Ein fehlender Durchflusswert wird nicht aus der Drehzahl berechnet. Geräteunterstützung und Verbindung müssen an deiner Pumpe geprüft werden.</footer>
      </main>`;
    this.$("refresh").onclick = () => this._load();
    this.$("device").onchange = () => this._choose(this.$("device").value);
    this.$("apply-power").onclick = () => this._applyPower();
    this.$("power-slider").oninput = () => { this.$("power").value = this.$("power-slider").value; };
    this.$("power").oninput = () => { this.$("power-slider").value = this.$("power").value; };
    this.$("read-control").onclick = () => this._readControlState();
    this.$("app-access").onclick = () => this._toggleAppAccess();
  }

  $(id) { return this.shadowRoot.getElementById(id); }
  set narrow(value) { this.shadowRoot.querySelector("ha-menu-button").narrow = value; }
  set hass(hass) {
    this._hass = hass;
    this._updateAppAccess();
    this.shadowRoot.querySelector("ha-menu-button").hass = hass;
    this._updateLive();
    if (this._card) this._card.hass = hass;
    if (this.isConnected && !this._loaded && !this._loading) this._load();
  }
  connectedCallback() {
    if (this._hass && !this._loaded && !this._loading) this._load();
  }
  disconnectedCallback() {
    this._generation++;
    this._selection++;
    this._loaded = false;
    this._loading = false;
  }
  _message(text = "", error = false) {
    const el = this.$("message");
    el.textContent = text;
    el.hidden = !text;
    el.classList.toggle("error", error);
  }
  async _load() {
    if (this._loading || this._busy) return;
    const generation = ++this._generation;
    this._loading = true;
    this._loaded = true;
    this.$("refresh").disabled = true;
    this._message("Geräte werden geladen …");
    try {
      const devices = await this._hass.callWS({type: "config/device_registry/list"});
      if (generation !== this._generation) return;
      const entities = await this._hass.callWS({type: "config/entity_registry/list"});
      if (generation !== this._generation) return;
      this._appEntity = Array.isArray(entities) ? entities.find(e => e.platform === "vectra_studio" &&
        e.unique_id === "vectra_studio_mobius_app_access")?.entity_id : null;
      this._updateAppAccess();
      this._devices = vectraDevices(devices);
      const select = this.$("device");
      const previous = select.value;
      select.replaceChildren(...this._devices.map(device => {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.name_by_user || device.name || device.model;
        return option;
      }));
      this._loaded = true;
      this.$("empty").hidden = !!this._devices.length;
      if (!this._devices.length) {
        this._selection++;
        this._group = null;
        this._clearEditor();
        this.$("content").hidden = true;
        this._message("");
      } else {
        const id = this._devices.find(d => d.id === previous)?.id || this._devices[0].id;
        select.value = id;
        await this._choose(id);
      }
    } catch (err) {
      if (generation === this._generation) this._message(`Geräte konnten nicht geladen werden: ${err.message || err}`, true);
    } finally {
      if (generation === this._generation) {
        this._loading = false;
        this.$("refresh").disabled = false;
      }
    }
  }
  _clearEditor() {
    this._card = null;
  }
  async _choose(deviceId) {
    const token = ++this._selection;
    const device = this._devices.find(candidate => candidate.id === deviceId);
    this._group = null;
    this._studioScenes = [];
    this._studioActive = null;
    this._studioAvailable = true;
    this._clearEditor();
    this.$("content").hidden = true;
    this._message("Pumpendaten werden geladen …");
    try {
      if (!device?.via_device_id) {
        throw new Error("Die Pumpe ist noch keinem Aquarium-Gerät zugeordnet. Aktualisiere die Integration und versuche es erneut.");
      }
      // Schedules and scenes belong to the parent tank. `pumpGroup()` below
      // still selects the originally chosen pump from the returned members.
      const result = await this._hass.callWS({
        type: "vectra_studio/resolve_schedule_groups",
        device_id: device.via_device_id,
      });
      if (token !== this._selection) return;
      this._group = pumpGroup(result.groups, deviceId);
      if (!this._group) throw new Error("Die Pumpe meldet noch keine unterstützten Zeitplandaten. Prüfe die Diagnose der Integration und lade die Geräte erneut.");
      this._member = this._group.members.find(m => m.device_id === deviceId);
      const entities = await this._hass.callWS({type: "config/entity_registry/list"});
      if (token !== this._selection) return;
      this._powerEntity = Array.isArray(entities) ? entities.find(e => e.device_id === deviceId &&
        e.platform === "vectra_studio" && e.unique_id?.endsWith("_constant_speed_percent") && !e.disabled_by)?.entity_id : null;
      this.$("power-entity-id").textContent = this._powerEntity || "Leistungsentität nicht verfügbar";
      this.$("apply-power").disabled = !this._powerEntity;
      this.$("power-result").textContent = this._powerEntity ? "Bereit für einen geprüften Schreibversuch." : "Leistungsentität noch nicht verfügbar. Integration aktualisieren und Geräte neu laden.";
      this.$("content").hidden = false;
      this._message("");
      this._updateLive();
    } catch (err) {
      if (token === this._selection) this._message(err.message || String(err), true);
    }
  }
  _updateLive() {
    if (!this._group || !this._hass) return;
    const states = this._hass.states;
    const speedState = states[this._member.speed_entity_id]?.state;
    const speed = Number(speedState);
    const validSpeed = speedState != null && speedState !== "" && Number.isFinite(speed) && speed >= 0 && speed <= 100;
    this.$("dial-value").textContent = validSpeed ? speed.toLocaleString(undefined, {maximumFractionDigits: 1}) : "—";
    this.$("power-dial").style.setProperty("--level", validSpeed ? speed : 0);
    for (const [id, key] of [["speed", "speed_entity_id"], ["flow", "flow_entity_id"], ["mode", "mode_entity_id"]]) {
      this.$(id).textContent = displayState(states, this._member[key]);
    }
  }
  async _applyPower() {
    if (!this._powerEntity || this._busy) return;
    const value = Number(this.$("power").value);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      this.$("power-result").textContent = "Bitte eine ganze Prozentzahl zwischen 1 und 100 eingeben.";
      return;
    }
    this._busy = true;
    this.$("apply-power").disabled = true;
    this.$("device").disabled = true;
    this.$("power-result").textContent = "Schreiben und Rücklesen werden geprüft …";
    try {
      await this._hass.callService("number", "set_value", {entity_id: this._powerEntity, value});
      this.$("power-result").textContent = "Befehl und gemeldete Motorleistung bestätigt.";
    } catch (err) {
      this.$("power-result").textContent = `Nicht bestätigt: ${err.message || err}`;
    } finally {
      this._busy = false;
      this.$("apply-power").disabled = !this._powerEntity;
      this.$("device").disabled = false;
    }
  }
  _updateAppAccess() {
    const state = this._hass?.states?.[this._appEntity];
    this.$("app-entity-id").textContent = this._appEntity || "App-Schalter noch nicht verfügbar";
    this.$("connection-state").textContent = state?.state === "on" ? "Für Mobius freigegeben" : state?.state === "off" ? "Home Assistant verwaltet Bluetooth" : "Verbindungsstatus nicht verfügbar";
    this.$("app-access").disabled = this._busy || !state || ["unknown", "unavailable"].includes(state.state);
    this.$("app-access").textContent = state?.state === "on" ? "App-Freigabe beenden – HA verbinden" : "Für Mobius-App freigeben";
  }
  async _toggleAppAccess() {
    if (!this._appEntity || this._busy) return;
    this._busy = true;
    this._updateAppAccess();
    try {
      const on = this._hass.states[this._appEntity]?.state === "on";
      await this._hass.callService("switch", on ? "turn_off" : "turn_on", {entity_id: this._appEntity});
      this._message(on ? "Mobius schließen. Home Assistant verbindet sich wieder." : "Freigabe angefordert. Mobius kann nach dem Trennen der Verbindung verbinden.");
    } catch (err) {
      this._message(`Freigabe fehlgeschlagen: ${err.message || err}`, true);
    } finally {
      this._busy = false;
      this._updateAppAccess();
    }
  }
  async _readControlState() {
    const deviceId = this.$("device").value;
    if (!deviceId || this._busy) return;
    this._busy = true;
    this.$("read-control").disabled = true;
    this.$("device").disabled = true;
    this.$("control-state").textContent = "Controller wird ausgelesen …";
    try {
      const result = await this._hass.callWS({type: "vectra_studio/read_control_state", device_id: deviceId});
      this.$("control-state").textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      this.$("control-state").textContent = `Auslesen fehlgeschlagen: ${err.message || err}`;
    } finally {
      this._busy = false;
      this.$("read-control").disabled = false;
      this.$("device").disabled = false;
    }
  }
  async _scene(option) {
    if (this._busy || !option || !this._group?.scene_entity_id) return;
    this._busy = true;
    this.$("device").disabled = true;
    this.$("refresh").disabled = true;
    this._updateLive();
    this._message("Szene wird umgeschaltet …");
    try {
      await this._hass.callService("select", "select_option", {
        entity_id: this._group.scene_entity_id, option,
      });
      this._message("Befehl ausgeführt. Der aktuelle Status wird von der Integration aktualisiert.");
    } catch (err) { this._message(`Umschalten fehlgeschlagen: ${err.message || err}`, true); }
    finally {
      this._busy = false;
      this.$("device").disabled = false;
      this.$("refresh").disabled = this._loading;
      this._updateLive();
    }
  }
  _tankId() {
    return this._devices.find(device => device.id === this.$("device").value)?.via_device_id;
  }
  _setSourceOptions(options) {
    for (const id of ["studio-source", "pause-source"]) {
      const select = this.$(id);
      const previous = select.value;
      select.replaceChildren(...options.map(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }));
      if (!options.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Keine Mobius-Szene eingerichtet";
        select.append(option);
      } else if (options.includes(previous)) {
        select.value = previous;
      }
      select.disabled = this._busy || !this._studioAvailable || !options.length;
    }
    this.$("studio-save").disabled = this._busy || !this._studioAvailable || !options.length;
    this.$("pause").disabled = this._busy || !this._studioAvailable || !options.length;
  }
  _toggleDuration(prefix) {
    const infinite = this.$(`${prefix}-infinite`).checked;
    const input = this.$(`${prefix}-minutes`);
    input.disabled = infinite;
    input.setAttribute("aria-disabled", String(infinite));
  }
  _renderStudioScenes() {
    const list = this.$("studio-scenes");
    list.replaceChildren();
    if (!this._studioAvailable) {
      const empty = document.createElement("p");
      empty.textContent = "Studio-Szenen sind nach dem Neustart von Home Assistant verfügbar.";
      list.append(empty);
    } else if (!this._studioScenes.length) {
      const empty = document.createElement("p");
      empty.textContent = "Noch keine Studio-Szene gespeichert.";
      list.append(empty);
    } else {
      for (const scene of this._studioScenes) {
        const item = document.createElement("div");
        item.className = "studio-item";
        const text = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = scene.name;
        const detail = document.createElement("small");
        detail.textContent = `${scene.source_scene} · ${formatStudioDuration(scene.duration_seconds)}`;
        text.append(title, detail);
        const start = document.createElement("button");
        start.textContent = "Starten";
        start.disabled = this._busy;
        start.onclick = () => this._activateStudioScene(scene.id, scene.name);
        const remove = document.createElement("button");
        remove.textContent = "Löschen";
        remove.disabled = this._busy;
        remove.onclick = () => this._deleteStudioScene(scene.id);
        item.append(text, start, remove);
        list.append(item);
      }
    }
    const active = this._studioActive;
    this.$("studio-active").textContent = !active ? "Kein Studio-Timer aktiv." :
      active.ends_at ? `${active.label} aktiv bis ${new Date(active.ends_at).toLocaleString()}.` :
      `${active.label} aktiv, bis du sie manuell beendest.`;
    this.$("studio-resume").disabled = this._busy || !active;
  }
  async _loadStudioScenes(token = this._selection) {
    const tankId = this._tankId();
    if (!tankId) return;
    try {
      const result = await this._hass.callWS({type: "vectra_studio/studio_scene_list", tank_device_id: tankId});
      if (token !== this._selection) return;
      this._studioAvailable = true;
      this._studioScenes = result.scenes || [];
      this._studioActive = result.active || null;
      this._renderStudioScenes();
    } catch (err) {
      if (token !== this._selection) return;
      this._studioAvailable = false;
      this._renderStudioScenes();
      this._message(`Live-Werte und Mobius-Szenen sind verfügbar. Studio-Szenen werden nach einem Home-Assistant-Neustart aktiviert: ${err.message || err}`, true);
      this._updateLive();
    }
  }
  _duration(prefix) {
    const seconds = studioDurationSeconds(this.$(`${prefix}-minutes`).value, this.$(`${prefix}-infinite`).checked);
    if (seconds === undefined) throw new Error("Bitte wähle eine Dauer zwischen 1 Minute und 7 Tagen oder „Unbegrenzt“.");
    return seconds;
  }
  async _withStudioRequest(message, success) {
    if (this._busy) return;
    this._busy = true;
    this._updateLive();
    this._message("Befehl wird an das Aquarium gesendet …");
    try {
      const result = await this._hass.callWS(message);
      if (result.scenes) this._studioScenes = result.scenes;
      if (Object.hasOwn(result, "active")) this._studioActive = result.active;
      this._renderStudioScenes();
      this._message(success);
    } catch (err) {
      this._message(`Aktion fehlgeschlagen: ${err.message || err}`, true);
    } finally {
      this._busy = false;
      this._updateLive();
    }
  }
  async _saveStudioScene() {
    try {
      const name = this.$("studio-name").value.trim();
      if (!name) throw new Error("Bitte gib der Studio-Szene einen Namen.");
      await this._withStudioRequest({type: "vectra_studio/studio_scene_create", tank_device_id: this._tankId(), name,
        source_scene: this.$("studio-source").value, duration_seconds: this._duration("studio")}, "Studio-Szene gespeichert.");
      this.$("studio-name").value = "";
    } catch (err) { this._message(err.message || String(err), true); }
  }
  async _activateStudioScene(sceneId, name) {
    await this._withStudioRequest({type: "vectra_studio/studio_scene_activate", tank_device_id: this._tankId(), scene_id: sceneId}, `${name} gestartet.`);
  }
  async _deleteStudioScene(sceneId) {
    await this._withStudioRequest({type: "vectra_studio/studio_scene_delete", tank_device_id: this._tankId(), scene_id: sceneId}, "Studio-Szene gelöscht.");
  }
  async _startPause() {
    try {
      await this._withStudioRequest({type: "vectra_studio/studio_pause", tank_device_id: this._tankId(), source_scene: this.$("pause-source").value,
        duration_seconds: this._duration("pause")}, "Pause gestartet.");
    } catch (err) { this._message(err.message || String(err), true); }
  }
  async _resumeStudioScene() {
    await this._withStudioRequest({type: "vectra_studio/studio_scene_resume", tank_device_id: this._tankId()}, "Tagesprogramm wieder aktiv.");
  }
  async _openEditor() {
    const token = this._selection;
    const member = this._member;
    this.$("open").disabled = true;
    try {
      await import("/vectra_studio_frontend/vectra-studio-schedule-card.js?v=0.2.2");
      if (token !== this._selection || !this._group) return;
      const card = document.createElement("vectra-studio-schedule-card");
      card.setConfig({type: "custom:vectra-studio-schedule-card", device_id: member.device_id});
      card.hass = this._hass;
      this._card = card;
      this.$("editor").replaceChildren(card);
      this.$("open").hidden = true;
    } catch (err) { this._message(`Editor konnte nicht geöffnet werden: ${err.message || err}`, true); }
    finally { this.$("open").disabled = false; }
  }
}

if (!customElements.get("vectra-studio-panel")) customElements.define("vectra-studio-panel", VectraStudioPanel);
