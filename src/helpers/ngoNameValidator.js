import { t } from "../i18n";

export function ngoNameValidator(name) {
  if (!name) {
    return t("validation.required");
  }

  // Check if the name contains at least two words
  const words = name.trim().split(/\s+/); // Split the name by spaces

  // Ensure each part of the name has a reasonable length
  if (words.some((word) => word.length < 2)) {
    return t("validation.minLength", { field: t("fields.name"), length: 2 });
  }

  return ""; // Valid name
}