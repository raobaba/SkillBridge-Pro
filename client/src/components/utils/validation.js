// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length < 6 ? "Password must be at least 6 characters" : null
  };
};

export const validateRequired = (value, fieldName) => {
  return {
    isValid: value && value.trim().length > 0,
    message: !value || value.trim().length === 0 ? `${fieldName} is required` : null
  };
};

export const validateForm = (formData, requiredFields = []) => {
  const errors = {};
  let isValid = true;

  // Check required fields
  requiredFields.forEach(field => {
    const validation = validateRequired(formData[field], field);
    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });

  // Email validation
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  // Password validation
  if (formData.password) {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
      isValid = false;
    }
  }

  // Password confirmation
  if (formData.password && formData.confirmPassword) {
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
  }

  return { isValid, errors };
};

export const getInitialFormState = (fields) => {
  return fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {});
};
