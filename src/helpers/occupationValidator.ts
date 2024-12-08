export function occupationValidator(occupation: string): string {
  if (!occupation) {
    return "Please fill in this field.";
  }

  if (occupation.trim() === "") {
    return "Occupation cannot contain only spaces.";
  }
  if (occupation.length > 50) {
    return "Occupation should not be longer than 50 characters.";
  }

  return ""; // Valid occupation
}

