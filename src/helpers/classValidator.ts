export function classValidator(classInput: string): string {
  if (!classInput) {
    return "Please fill in this field.";
  }

  if (classInput.trim() === "") {
    return "Class cannot contain only spaces.";
  }

  if (!isNaN(Number(classInput))) {
    // If it's a number
    if (classInput.length > 2) {
      return "Class number should not be longer than 2 digits.";
    }
  } else {
    // If it's not a number (assuming it's characters)
    if (classInput.length > 20) {
      return "Class name should not be longer than 20 characters.";
    }
  }

  return ""; // Valid class
}

