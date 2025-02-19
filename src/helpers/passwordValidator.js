export function passwordValidator(password) {
  if (!password) {
    return "Please fill in this field.";
  }

  if (password.length < 8) {
    return "Password should contain at least 8 characters.";
  }
  if (password.length > 30) {
    return "Password should be less than 30.";
  }
  if (password.trim() === "") {
    return "Password cannot contain only spaces.";
  }

  // Check for at least one special character
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacterRegex.test(password)) {
    return "Password should contain at least one special character.";
  }

  return ""; // Password is valid
}
