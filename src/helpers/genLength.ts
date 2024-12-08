export function generalLengthValidator(input: string, maxLength: number = 30): string {
    if (!input) {
      return "Please fill in this field.";
    }
    if (input.trim() === "") {
      return "Input cannot contain only spaces.";
    }
  
    if (input.length > maxLength) {
      return `Input should not be longer than ${maxLength} characters.`;
    }
  
    return ""; // Valid input
  }
  