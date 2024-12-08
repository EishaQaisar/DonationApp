export function addressValidator(address: string): string {
    if (!address) {
      return "Please fill in this field.";
    }

    if (address.trim() === "") {
      return "Address cannot contain only spaces.";
    }
  
    if (address.length > 120) {
      return "Address should not be longer than 120 characters.";
    }
  
    return "";
  }
  
  