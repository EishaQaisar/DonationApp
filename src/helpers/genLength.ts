import { t } from "../i18n";

export function generalLengthValidator(input, maxLength = 30) {
  if (!input) {
    return t("validation.required");
  }
  
  if (input.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.input") });
  }

  if (input.length > maxLength) {
    return t("validation.maxLength", { field: t("fields.input"), length: maxLength });
  }

  return ""; // Valid input
}