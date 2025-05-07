import { t } from "../i18n";

export function institutionNameValidator(institutionName) {
  if (!institutionName) {
    return t("validation.required");
  }

  if (institutionName.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.institution") });
  }

  if (institutionName.length > 30) {
    return t("validation.maxLength", { field: t("fields.institution"), length: 30 });
  }

  return ""; // Valid institution name
}