import { t } from "../i18n";

export function validateAge(age) {
  if (!age) {
    return t("validation.required");
  }

  const numAge = Number(age);

  if (isNaN(numAge)) {
    return t("validation.ageNumber");
  }

  if (age.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.age") });
  }

  if (!Number.isInteger(numAge)) {
    return t("validation.ageInteger");
  }

  if (numAge < 1) {
    return t("validation.ageMin");
  }

  if (numAge > 120) {
    return t("validation.ageMax");
  }

  return ""; // Valid age
}