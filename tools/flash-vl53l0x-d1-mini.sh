#!/usr/bin/env bash
# Flash a Wemos D1 mini + VL53L0X without placing Wi-Fi secrets in the repo.
# Requires the ESPHome CLI: https://esphome.io/guides/installing_esphome.html
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_CONFIG="$ROOT_DIR/examples/d1-mini-vl53l0x-water-level.yaml"

usage() {
  cat <<'EOF'
Usage: tools/flash-vl53l0x-d1-mini.sh SERIAL_PORT EMPTY_DISTANCE_CM

Example (macOS):
  tools/flash-vl53l0x-d1-mini.sh /dev/cu.usbserial-0001 18.4

Example (Linux):
  tools/flash-vl53l0x-d1-mini.sh /dev/ttyUSB0 18.4

EMPTY_DISTANCE_CM is the measured distance from the installed VL53L0X lens
to the dry chamber bottom, with the final splash guard already installed.
After flashing, join the Wi-Fi access point "Vectra Schachtwächter Fallback"
(password: vectra-setup), open http://192.168.4.1 and enter your Wi-Fi.
Then add the discovered ESPHome device to Home Assistant.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi
if [[ $# -ne 2 ]]; then
  usage
  exit 2
fi

PORT="$1"
EMPTY_DISTANCE_CM="$2"
if [[ ! -e "$PORT" ]]; then
  echo "Serial port not found: $PORT" >&2
  exit 2
fi
if ! [[ "$EMPTY_DISTANCE_CM" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "EMPTY_DISTANCE_CM must be a positive decimal number, e.g. 18.4" >&2
  exit 2
fi
if ! command -v esphome >/dev/null 2>&1; then
  echo "ESPHome CLI not found. Install it first: pipx install esphome" >&2
  exit 127
fi

WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/vectra-schacht.XXXXXX")"
trap 'rm -rf "$WORK_DIR"' EXIT
CONFIG="$WORK_DIR/vectra-schacht.yaml"

# The argument was restricted to digits and a decimal point above, so it is
# safe to substitute into the YAML number. Keep the repository template intact.
sed "s/empty_distance_cm: \"18.4\"/empty_distance_cm: \"$EMPTY_DISTANCE_CM\"/" \
  "$SOURCE_CONFIG" > "$CONFIG"

echo "Flashing $PORT with an empty distance of ${EMPTY_DISTANCE_CM} cm …"
esphome run "$CONFIG" --device "$PORT"
