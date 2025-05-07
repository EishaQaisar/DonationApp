import { t } from "../i18n";

export function idCardValidator(idCard) {
  // Regular expression to match the ID card format "34101-7678623-8"
  const re = /^\d{5}-\d{7}-\d{1}$/;

  if (!idCard) {
    return t("validation.required");
  }
  
  if (idCard.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.idCard") });
  }
  
  if (!re.test(idCard)) {
    return t("validation.validIdCard");
  }
  
  return '';
}