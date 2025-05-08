import { LoginUser } from '@/interfaces/loginUser';
import { Errors, RegisterUser } from '@/interfaces/registerUser';
import { useState } from 'react';

type ValidationType = 'register' | 'login';

const useAuthValidation = (type: ValidationType) => {
  const [errors, setErrors] = useState<Errors>({});
  const [inputsTouched, setInputsTouched] = useState<Partial<Record<keyof RegisterUser, boolean>>>({});

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateInputs = (name: keyof RegisterUser | keyof LoginUser, value: string) => {
    let error = '';

    if (type === 'register' && name === 'name' && (value.length < 2 || value.length > 40)) {
      error = 'Name should be between 2 and 40 characters!';
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        error = 'Invalid email format!';
      } else if (value.length > 254) {
        error = 'Email must not exceed 254 characters!';
      }
    }

    if (name === 'password' && (value.length < 6 || value.length > 20)) {
      error = 'Password must be between 6 and 20 characters!';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const markFieldAsTouched = (name: keyof RegisterUser | keyof LoginUser) => {
    if (type === 'login' && name === 'name') return;
    setInputsTouched((prev) => ({ ...prev, [name]: true }));
  };

  return {
    errors,
    inputsTouched,
    validateInputs,
    markFieldAsTouched,
  };
};

export default useAuthValidation;
