import {test} from "node:test";
import assert from "node:assert/strict";
import {vectraDevices, pumpGroup, displayState, sceneOptions} from "../custom_components/vectra_studio/panel/model.js";

test("only configured, enabled Vectra devices belong in the pump selector", () => {
  const device = {id: "m2", model: "VectraM2", identifiers: [["vectra_studio", "123"]]};
  const devices = [device, {...device, id: "disabled", disabled_by: "user"},
    {...device, id: "tank", identifiers: [["vectra_studio", "tank_123"]]},
    {...device, id: "upstream", identifiers: [["mobius", "123"]]},
    {...device, id: "light", model: "Radion"}];
  assert.deepEqual(vectraDevices(devices), [device]);
});

test("selecting one pump never uses a different pump's scene/group metadata", () => {
  const groups = [{kind: "pump", members: [{device_id: "other"}]},
    {kind: "light", members: [{device_id: "m2"}]},
    {kind: "pump", members: [{device_id: "m2"}], scene_entity_id: "select.reef_scene"}];
  assert.equal(pumpGroup(groups, "m2"), groups[2]);
  assert.equal(pumpGroup(groups, "missing"), undefined);
});

test("missing telemetry is displayed as missing, including flow; zero is preserved", () => {
  const states = {speed: {state: "0", attributes: {unit_of_measurement: "%"}},
    flow: {state: "unavailable"}, mode: {state: "unknown"}};
  assert.equal(displayState(states, "speed"), "0 %");
  assert.equal(displayState(states, "flow"), "—");
  assert.equal(displayState(states, "mode"), "—");
  assert.equal(displayState(states, null), "—");
});

test("unavailable scenes cannot be started; return to schedule is separate", () => {
  const attributes = {options: ["None", "Feed", "Maintenance"]};
  assert.deepEqual(sceneOptions({scene: {state: "None", attributes}}, "scene"), ["Feed", "Maintenance"]);
  assert.deepEqual(sceneOptions({scene: {state: "unavailable", attributes}}, "scene"), []);
  assert.deepEqual(sceneOptions({}, "scene"), []);
});
