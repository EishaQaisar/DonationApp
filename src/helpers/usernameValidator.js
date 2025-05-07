import { t } from "../i18n";

export function usernameValidator(username) {
  if (!username) {
    return t("validation.required");
  }
  
  if (username.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.username") });
  }
  
  if (username.length < 6) {
    return t("validation.minLength", { field: t("fields.username"), length: 6 });
  }
  
  if (username.length > 30) {
    return t("validation.maxLength", { field: t("fields.username"), length: 30 });
  }
  
  return '';
}