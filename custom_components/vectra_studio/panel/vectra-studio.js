/* Vectra Studio — independent HA panel, GPL-2.0. */
// The panel itself is versioned by panel.py. Version the static dependency too:
// otherwise Safari may combine a new panel with an old cached model.js and fail
// module evaluation before it can render anything.
import {vectraDevices, pumpGroup, displayState, sceneOptions, studioDurationSeconds, formatStudioDuration} from "./model.js?v=0.3.0";

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
      </style>
      <header><ha-menu-button></ha-menu-button><img src="/vectra_studio_panel/vectra-studio-logo.png" width="44" height="44" alt=""><strong>Vectra Studio</strong><span>Rückförderung</span><span class="tag">Lesemodus · 0.3.0</span></header>
      <main><div class="eyebrow">Dein Aquarium · lokal verbunden</div><h1>Alles im Fluss.</h1><p>Status deiner Vectra an einem Ort.</p>
        <div class="toolbar"><label>Pumpe<select id="device" aria-label="Pumpe auswählen"></select></label><button id="refresh">Geräte neu laden</button></div>
        <div id="message" role="status" aria-live="polite" hidden></div>
        <section id="empty" class="empty" hidden><h2>Noch keine Vectra gefunden</h2><p>Füge unter Einstellungen → Geräte & Dienste eine Vectra über die Integration „Vectra Studio“ hinzu. Schließe die Mobius-App und prüfe den Bluetooth-Empfang am Pumpencontroller. Lade anschließend die Geräte hier neu.</p></section>
        <section id="content" hidden>
          <div class="metrics"><div class="metric"><small>Motordrehzahl</small><div class="value" id="speed">—</div></div><div class="metric"><small>Geschätzter Durchfluss</small><div class="value" id="flow">—</div></div><div class="metric"><small>Aktueller Modus</small><div class="value" id="mode">—</div></div></div>
          <div class="box"><h2>Steuerung vorübergehend gesperrt</h2><p>Die Szenen-, Pause- und Zeitplan-Schreibfunktionen sind nach einem Hardwarebefund deaktiviert: Die M2 übernahm Werte nicht zuverlässig und konnte nach dem Beenden einer Szene in einem nicht startenden Controllerzustand bleiben. Steuere die Pumpe bitte ausschließlich über die Mobius-App oder direkt am Controller, bis eine mit einer Vectra M2 geprüfte Implementierung vorliegt.</p></div>
        </section>
        <footer>Vectra Studio · Unabhängiges Projekt auf Basis von ha-mobius und python-mobius.<br>Ein fehlender Durchflusswert wird nicht aus der Drehzahl berechnet. Geräteunterstützung und Verbindung müssen an deiner Pumpe geprüft werden.</footer>
      </main>`;
    this.$("refresh").onclick = () => this._load();
    this.$("device").onchange = () => this._choose(this.$("device").value);
  }

  $(id) { return this.shadowRoot.getElementById(id); }
  set narrow(value) { this.shadowRoot.querySelector("ha-menu-button").narrow = value; }
  set hass(hass) {
    this._hass = hass;
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
    for (const [id, key] of [["speed", "speed_entity_id"], ["flow", "flow_entity_id"], ["mode", "mode_entity_id"]]) {
      this.$(id).textContent = displayState(states, this._member[key]);
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
