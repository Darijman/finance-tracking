'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterUser } from '@/interfaces/registerUser';
import { areObjectsEqual } from '@/helpers/areObjectsEqual';
import useAuthValidation from '@/hooks/useAuthValidation/UseAuthValidation';
import InputField from '@/components/inputField/InputField';
import api from '../../../../../axiosInstance';
import Link from 'next/link';
import './registerForm.css';

export const RegisterForm = () => {
  const router = useRouter();

  const [registrationUser, setRegistrationUser] = useState<RegisterUser>({
    name: '',
    email: '',
    password: '',
  });

  const [submittedUser, setSubmittedUser] = useState<RegisterUser>({
    name: '',
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState<{ error: string; type: 'NAME' | 'EMAIL' | 'PASSWORD' | '' }>({ error: '', type: '' });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { errors, inputsTouched, validateInputs, markFieldAsTouched } = useAuthValidation('register');

  const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof RegisterUser;

    setRegistrationUser((prev) => {
      const updatedUser = { ...prev, [fieldName]: value };

      const hasDataChanged = !areObjectsEqual(updatedUser, submittedUser);

      if (serverError.error && hasDataChanged) {
        setServerError({ error: '', type: '' });
      }

      return updatedUser;
    });

    validateInputs(fieldName, value.trim());
    markFieldAsTouched(fieldName);
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      setServerError({ error: 'Please fix the validation errors!', type: '' });
      return;
    }

    setSubmittedUser(registrationUser);

    await api
      .post(`/auth/register`, registrationUser)
      .then(async () => {
        setSubmittedUser({ name: '', email: '', password: '' });
        setRegistrationUser({ name: '', email: '', password: '' });
        router.push('/');
      })
      .catch((error) => {
        setServerError({ error: error.error || 'Something went wrong...', type: error.type || '' });
      });
  };

  // Show only the first validation error in order: Name → Email → Password
  const nameError = inputsTouched.name && errors.name ? errors.name : '';
  const emailError = !errors.name && inputsTouched.email && errors.email ? errors.email : '';
  const passwordError = !errors.name && !errors.email && inputsTouched.password && errors.password ? errors.password : '';

  const isSubmitButtonDisabled =
    Boolean(errors.name) ||
    Boolean(errors.email) ||
    Boolean(errors.password) ||
    Boolean(serverError.error) ||
    !registrationUser.name.trim() ||
    !registrationUser.email.trim() ||
    !registrationUser.password.trim();

  return (
    <div>
      <h1 className='app_title'>Finance-Tracking</h1>
      <div className='register_container'>
        <h1 className='register_title'>Register</h1>
        {serverError && <div className='register_server_error'>{serverError.error}</div>}
        <hr className='register_title_divider' />
        <form onSubmit={onSubmitHandler}>
          <div className='register_main'>
            <div className='register_item'>
              <InputField
                type='text'
                placeholder='Name*'
                name='name'
                value={registrationUser.name}
                onChange={inputOnChangeHandler}
                error={nameError}
                style={{
                  border: serverError.type === 'NAME' ? '1px solid #e57373' : 'none',
                  boxShadow: serverError.type === 'NAME' ? '0 0 5px #e57373' : 'none',
                }}
              />
            </div>

            <div className='register_item'>
              <InputField
                type='email'
                placeholder='Email*'
                name='email'
                value={registrationUser.email}
                onChange={inputOnChangeHandler}
                error={emailError}
                style={{
                  border: serverError.type === 'EMAIL' ? '1px solid #e57373' : 'none',
                  boxShadow: serverError.type === 'EMAIL' ? '0 0 5px #e57373' : 'none',
                }}
              />
            </div>

            <div className='password_input_container'>
              <InputField
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Password*'
                name='password'
                value={registrationUser.password}
                onChange={inputOnChangeHandler}
                error={passwordError}
                style={{
                  border: serverError.type === 'PASSWORD' ? '1px solid #e57373' : 'none',
                  boxShadow: serverError.type === 'PASSWORD' ? '0 0 5px #e57373' : 'none',
                }}
              />
              <button
                type='button'
                className='toggle_password_button'
                onMouseDown={() => setPasswordVisible((prev) => !prev)}
                title={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? '👁️' : '🙈'}
              </button>
            </div>

            <button className='register_submit_button' type='submit' disabled={!!isSubmitButtonDisabled}>
              Register
            </button>
          </div>
        </form>
        <div className='has_account'>
          <span style={{ marginRight: '5px' }}>Already have an account?</span>
          <Link href='/auth/login'>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
