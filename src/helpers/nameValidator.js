export function nameValidator(name) {
  if (!name) {
    return "Please fill in this field.";
  }

  // Check if the name contains at least two words
  const words = name.trim().split(/\s+/); // Split the name by spaces
  if (words.length < 2) {
    return "Please enter your full name.";
  }

  // Ensure each part of the name has a reasonable length
  if (words.some((word) => word.length < 2)) {
    return "Each part of the name must have at least 2 characters.";
  }

  return ""; // Valid name
}
