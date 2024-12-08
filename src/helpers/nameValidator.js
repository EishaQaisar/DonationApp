export function nameValidator(name) {
  if (!name) {
    return "Please fill in this field.";
  }

  // Check if the name contains any numbers
  if (/\d/.test(name)) {
    return "The name should not contain any numbers.";
  }

  // Check if the total length of the name is less than 50 characters
  if (name.length > 50) {
    return "The name must be less than 50 characters.";
  }

  if (name.trim() === "") {
    return "name cannot contain only spaces.";
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
