
export const xAuthToken () => ({
  // "Content-Type": "application/json",
  // "accept": 'application/json',
  "Bearer": localStorage.getItem("token")
})