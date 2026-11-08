import {test} from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";

const require = createRequire(new URL("../frontend-src/package.json", import.meta.url));
const {JSDOM} = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", {url: "http://ha.test/"});
for (const name of ["window", "document", "HTMLElement", "customElements"]) globalThis[name] = dom.window[name];
await import("../custom_components/vectra_studio/panel/vectra-studio.js");
const flush = () => new Promise(resolve => setImmediate(resolve));
const devices = [{id: "m2", via_device_id: "tank", model: "VectraM2", name_by_user: "<img src=x onerror=alert(1)>", identifiers: [["vectra_studio", "123"]]}];
const group = {kind: "pump", scene_entity_id: "select.scene", members: [{device_id: "m2", speed_entity_id: "sensor.speed", flow_entity_id: null, mode_entity_id: "sensor.mode"}]};

function setup(overrides = {}) {
  const writes = [];
  const hass = {
    states: {"sensor.speed": {state: "45", attributes: {unit_of_measurement: "%"}},
      "sensor.mode": {state: "Constant"}, "select.scene": {state: "None", attributes: {options: ["None", "Feed"]}}},
    async callWS(message) {
      if (message.type === "config/device_registry/list") return devices;
      if (message.type === "vectra_studio/resolve_schedule_groups") return {groups: [group]};
      if (message.type === "vectra_studio/studio_scene_list") return {scenes: [], active: null};
      return {};
    },
    async callService(...args) { writes.push(args); },
    ...overrides,
  };
  const panel = document.createElement("vectra-studio-panel");
  document.body.append(panel);
  panel.hass = hass;
  return {panel, hass, writes};
}

test("initial load is read-only; live values and device labels are rendered safely", async () => {
  const {panel, hass, writes} = setup();
  await flush();
  assert.equal(panel.$("content").hidden, false);
  assert.equal(panel.$("speed").textContent, "45 %");
  assert.equal(panel.$("flow").textContent, "—");
  assert.equal(panel.$("device").querySelector("img"), null);
  assert.match(panel.$("device").textContent, /<img/);
  assert.deepEqual(writes, []);
  hass.states["sensor.speed"].state = "unavailable";
  panel.hass = hass;
  assert.equal(panel.$("speed").textContent, "—");
  panel.remove();
});

test("empty setup offers installation instructions without imaginary telemetry", async () => {
  const {panel, writes} = setup({callWS: async () => []});
  await flush();
  assert.equal(panel.$("empty").hidden, false);
  assert.equal(panel.$("content").hidden, true);
  assert.deepEqual(writes, []);
  panel.remove();
});

test("late metadata from a previously selected pump cannot replace current selection", async () => {
  const {panel} = setup();
  await flush();
  let finishOld;
  panel._devices.push({...devices[0], id: "old", via_device_id: "old-tank"});
  panel._hass.callWS = async message => message.device_id === "old-tank"
    ? await new Promise(resolve => {finishOld = resolve;}) : {groups: [group]};
  const oldRequest = panel._choose("old");
  await panel._choose("m2");
  finishOld({groups: []});
  await oldRequest;
  assert.equal(panel._member.device_id, "m2");
  assert.equal(panel.$("content").hidden, false);
  panel.remove();
});

test("pump selection resolves tank-wide metadata through its parent tank", async () => {
  const calls = [];
  const {panel} = setup({callWS: async message => {
    calls.push(message);
    return message.type === "config/device_registry/list" ? devices : {groups: [group]};
  }});
  await flush();
  assert.deepEqual(calls[1], {type: "vectra_studio/resolve_schedule_groups", device_id: "tank"});
  panel.remove();
});

test("read-only panel exposes telemetry but no pump control actions", async () => {
  const {panel, writes} = setup();
  await flush();
  assert.equal(panel.$("content").hidden, false);
  assert.equal(panel.$("speed").textContent, "45 %");
  assert.equal(panel.$("start"), null);
  assert.match(panel.shadowRoot.textContent, /Steuerung vorübergehend gesperrt/);
  assert.deepEqual(writes, []);
  panel.remove();
});

test("a pump without a tank relationship explains the setup issue without calling the backend", async () => {
  const calls = [];
  const orphan = [{...devices[0], via_device_id: null}];
  const {panel} = setup({callWS: async message => {
    calls.push(message);
    return orphan;
  }});
  await flush();
  assert.match(panel.$("message").textContent, /keinem Aquarium-Gerät zugeordnet/);
  assert.equal(calls.length, 1);
  panel.remove();
});
