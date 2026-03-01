export function capitalizeFirstLetter(str) {
  if (typeof str !== "string" || str.length === 0) {
    return ""; // Handle empty or non-string input gracefully
  }
  // Get the first character and capitalize it, then add the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
}
