export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email address is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Enter a valid email address (e.g. name@example.com)";
  return "";
};

export const validateMobile = (mobile, label = "Mobile number") => {
  if (!mobile || !mobile.trim()) return `${label} is required`;
  const cleanMobile = mobile.replace(/\D/g, "");
  if (cleanMobile.length !== 10) return `${label} must be exactly 10 digits`;
  return "";
};

export const validateOptionalMobile = (mobile, label = "Alternate contact") => {
  if (!mobile || !mobile.trim()) return "";
  const cleanMobile = mobile.replace(/\D/g, "");
  if (cleanMobile.length !== 10) return `${label} must be exactly 10 digits`;
  return "";
};

export const validateRequired = (val, label) => {
  if (!val || (typeof val === "string" && !val.trim())) return `${label} is required`;
  return "";
};

export const validateUrl = (url, label = "URL") => {
  if (!url || !url.trim()) return "";
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/i;
  if (!urlRegex.test(url.trim())) return `Enter a valid ${label} (e.g. https://github.com/username)`;
  return "";
};
