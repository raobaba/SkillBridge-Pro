import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAuthState } from "../../modules/authentication/slice/userSlice";
import { validateForm } from "../utils/validation";

export const useAuthForm = (initialFormData, requiredFields = []) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Memoized form validation
  const formValidation = useMemo(() => {
    return validateForm(formData, requiredFields);
  }, [formData, requiredFields]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }, [errors]);

  // Handle form submission with validation
  const handleSubmit = useCallback((submitAction) => {
    return async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!formValidation.isValid) {
        setErrors(formValidation.errors);
        Object.values(formValidation.errors).forEach(error => {
          if (error) toast.error(error);
        });
        return;
      }

      // Clear previous errors
      setErrors({});
      
      try {
        await submitAction(formData);
      } catch (err) {
        console.error("Form submission error:", err);
        toast.error("Something went wrong, please try again.");
      }
    };
  }, [formData, formValidation]);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [message, error, dispatch]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, [initialFormData]);

  return {
    formData,
    errors,
    loading,
    formValidation,
    handleChange,
    handleSubmit,
    handleAuthStateChange,
    resetForm,
    setFormData,
    setErrors
  };
};
