import { t } from "../i18n";

export function numberValidator(phoneNumber) {
  if (!phoneNumber) {
    return t("validation.required");
  }

  if (phoneNumber.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.phoneNumber") });
  }
  
  else if (!/^\+92\d{10}$/.test(phoneNumber)) {
    return t("validation.validPhoneNumber");
  }
  
  return '';
}