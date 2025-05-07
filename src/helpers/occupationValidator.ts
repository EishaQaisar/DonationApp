import { t } from "../i18n";

export function occupationValidator(occupation) {
  if (!occupation) {
    return t("validation.required");
  }

  if (occupation.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.occupation") });
  }
  
  if (occupation.length > 50) {
    return t("validation.maxLength", { field: t("fields.occupation"), length: 50 });
  }

  return ""; // Valid occupation
}