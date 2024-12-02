export function usernameValidator(username) {
    if (!username) return "Please fill in this field."
    if (username.length < 6) return 'Username should contain at least 6 characters.'
    return ''
  }
  