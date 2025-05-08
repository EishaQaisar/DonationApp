import { t } from "../i18n";

export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  
  if (!email) {
    return t("validation.required");
  }
  
  if (email.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.email") });
  }
  
  if (!re.test(email)) {
    return t("validation.validEmail");
  }
  
  return '';
}