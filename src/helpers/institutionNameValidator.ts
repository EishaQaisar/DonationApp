export function institutionNameValidator(institutionName: string): string {
  if (!institutionName) {
    return "Please fill in this field.";

  }

  if (institutionName.trim() === "") {
    return "Institution cannot contain only spaces.";
  }

  if (institutionName.length > 30) {
    return "Institution name should not be longer than 30 characters.";
  }

  return ""; // Valid institution name
}

