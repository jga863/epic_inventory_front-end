import epicEmployee from "../../../assets/epic_employee.png";
import epicComputer from "../../../assets/epic_computer.png";
import epicBattery from "../../../assets/epic_battery.png";
import epicPeripheral from "../../../assets/epic_periferal.png";
import epicSurvey from "../../../assets/epic_survey.png";

/**
 * Per-entity fallback images. Used when the backend returns 404 for the asset image
 * (i.e. no image has been uploaded yet) or when displaying placeholders during loading.
 *
 * To add an image for a new entity (e.g. "vehicles"), drop the asset under
 * `src/assets/` and add an entry below.
 */
export const DEFAULT_IMAGES = {
  employees: epicEmployee,
  computers: epicComputer,
  monitors: epicComputer,
  "battery-backups": epicBattery,
  peripherals: epicPeripheral,
  surveys: epicSurvey,
};

/**
 * Maps frontend entity keys (the URL slug) to the backend AssetOwnerType enum.
 * Keep in sync with `AssetOwnerType.java`.
 */
export const OWNER_TYPE_BY_ENTITY = {
  employees: "EMPLOYEE",
  computers: "COMPUTER",
  monitors: "MONITOR",
  "battery-backups": "BATTERY_BACKUP",
  peripherals: "PERIPHERAL",
  surveys: "SURVEY",
};

export function getDefaultImage(entityKey) {
  return DEFAULT_IMAGES[entityKey] || epicComputer;
}

export function getOwnerType(entityKey) {
  return OWNER_TYPE_BY_ENTITY[entityKey];
}
