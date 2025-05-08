import { t } from "../i18n";

export function passwordValidator(password) {
  if (!password) {
    return t("validation.required");
  }

  if (password.length < 8) {
    return t("validation.minLength", { field: t("fields.password"), length: 8 });
  }
  
  if (password.length > 30) {
    return t("validation.maxLength", { field: t("fields.password"), length: 30 });
  }
  
  if (password.trim() === "") {
    return t("validation.onlySpaces", { field: t("fields.password") });
  }

  // Check for at least one special character
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacterRegex.test(password)) {
    return t("validation.passwordSpecialChar");
  }

  return ""; // Password is valid
}