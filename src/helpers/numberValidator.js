export function numberValidator(phoneNumber) {
    if (!phoneNumber) return "Please fill in this field."

    if (phoneNumber.trim() === "") {
      return "Phone number cannot contain only spaces.";
    }
    
    else if (!/^\+92\d{10}$/.test(phoneNumber)) {
      return 'Invalid phone number format. Use "+923485255947"';
  }
  return ''
}