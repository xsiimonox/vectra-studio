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

export function studioDurationSeconds(minutes, infinite) {
  if (infinite) return null;
  const value = Number(minutes);
  if (!Number.isInteger(value) || value < 1 || value > 10080) return undefined;
  return value * 60;
}

export function formatStudioDuration(seconds) {
  if (seconds == null) return "bis manuell beendet";
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes} Min.` : `${Math.floor(minutes / 60)} Std. ${minutes % 60 ? `${minutes % 60} Min.` : ""}`.trim();
}
