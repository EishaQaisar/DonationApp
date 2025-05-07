import { t } from "../i18n";

export function nameValidator(name) {
  if (!name) {
    return t("validation.required");
  }

  // Check if the name contains any numbers
  if (/\d/.test(name)) {
    return t("validation.noNumbers", { field: t("fields.name") });
  }

  // Check if the total length of the name is less than 50 characters
  if (name.length > 50) {
    return t("validation.maxLength", { field: t("fields.name"), length: 50 });
  }

  if (name.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.name") });
  }

  // Check if the name contains at least two words
  const words = name.trim().split(/\s+/); // Split the name by spaces
  if (words.length < 2) {
    return t("validation.fullName");
  }

  // Ensure each part of the name has a reasonable length
  if (words.some((word) => word.length < 2)) {
    return t("validation.namePartLength");
  }

  return ""; // Valid name
}