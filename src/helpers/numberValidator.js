export function numberValidator(phoneNumber) {
    if (!phoneNumber) return "Please fill in this field."
    
    else if (!/^\+92\d{10}$/.test(phoneNumber)) {
      return 'Invalid phone number format. Use "+923485255947"';
  }
  return ''
}