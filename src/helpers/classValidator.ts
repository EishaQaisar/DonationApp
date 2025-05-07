import { t } from "../i18n";

export function classValidator(classInput) {
  if (!classInput) {
    return t("validation.required");
  }

  if (classInput.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.class") });
  }

  if (!isNaN(Number(classInput))) {
    // If it's a number
    if (classInput.length > 2) {
      return t("validation.classDigits");
    }
  } else {
    // If it's not a number (assuming it's characters)
    if (classInput.length > 20) {
      return t("validation.classNameLength");
    }
  }

  return ""; // Valid class
}