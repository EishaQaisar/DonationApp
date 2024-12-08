export function usernameValidator(username) {
    if (!username) return "Please fill in this field."
    if (username.trim() === "") {
      return "username cannot contain only spaces.";
    }
    if (username.length < 6) return 'Username should contain at least 6 characters.'
    if (username.length > 30) return 'Username should be less than 30 characters.'
    return ''
  }
  