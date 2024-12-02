export function idCardValidator(idCard) {
    // Regular expression to match the ID card format "34101-7678623-8"
    const re = /^\d{5}-\d{7}-\d{1}$/;
  
    if (!idCard) return "Please fill in this field.";
    if (!re.test(idCard)) return 'Please enter a valid ID card number in the format 34101-7678623-8!';
    
    return '';
  }
  