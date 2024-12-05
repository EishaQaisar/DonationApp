export function passwordValidator(password) {
  if (!password) {
    return "Please fill in this field.";
  }

  if (password.length < 8) {
    return "Password should contain at least 8 characters.";
  }

  // Check for at least one special character
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacterRegex.test(password)) {
    return "Password should contain at least one special character.";
  }

  return ""; // Password is valid
}
