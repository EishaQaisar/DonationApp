export function validateAge(age: string): string {
    if (!age) {
      return "Please fill in this field.";
    }
  
    const numAge = Number(age);
  
    if (isNaN(numAge)) {
      return 'Age must be a number';
    }

    if (age.trim() === "") {
      return "Age cannot contain only spaces.";
    }
  
    if (!Number.isInteger(numAge)) {
      return 'Age must be a whole number';
    }
  
    if (numAge < 1) {
      return 'Age must be at least 1';
    }
  
    if (numAge > 120) {
      return 'Age must be 120 or less';
    }
  
    return ""; // Valid age
  }
  