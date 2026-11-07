/* Vectra Studio, GPL-2.0. Helpers shared by the panel and its tests. */
export function vectraDevices(devices) {
  return devices.filter(d => !d.disabled_by &&
    d.identifiers?.some(([domain, serial]) => domain === "vectra_studio" && !serial.startsWith("tank_")) &&
    /vectra/i.test(d.model || ""));
}

export function pumpGroup(groups, deviceId) {
  return groups.find(g => g.kind === "pump" && g.members.some(m => m.device_id === deviceId));
}

export function displayState(states, entityId) {
  const entity = states?.[entityId];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return "—";
  return `${entity.state}${entity.attributes?.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : ""}`;
}

export function sceneOptions(states, entityId) {
  const entity = states?.[entityId];
  return entity && !["unknown", "unavailable"].includes(entity.state)
    ? (entity.attributes?.options || []).filter(option => option !== "None") : [];
}
