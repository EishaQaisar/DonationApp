import { t } from "../i18n";

export function addressValidator(address) {
  if (!address) {
    return t("validation.required");
  }

  if (address.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.address") });
  }

  if (address.length > 120) {
    return t("validation.maxLength", { field: t("fields.address"), length: 120 });
  }

  return "";
}