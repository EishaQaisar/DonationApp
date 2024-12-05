export function ngoNameValidator(name) {
    if (!name) {
      return "Please fill in this field.";
    }
  
    // Check if the name contains at least two words
    const words = name.trim().split(/\s+/); // Split the name by spaces
  
    // Ensure each part of the name has a reasonable length
    if (words.some((word) => word.length < 2)) {
      return "Name shuld have atleast 2 characters";
    }
  
    return ""; // Valid name
  }
  