export function emailValidator(email) {
    const re = /\S+@\S+\.\S+/
    if (!email) return "Please fill in this field."
    if (email.trim() === "") {
      return "Email cannot contain only spaces.";
    }
    if (!re.test(email)) return 'Please enter a valid email address!'
    return ''
  }