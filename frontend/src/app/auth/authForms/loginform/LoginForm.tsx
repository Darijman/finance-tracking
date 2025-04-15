'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginUser } from '@/interfaces/loginUser';
import { areObjectsEqual } from '@/helpers/areObjectsEqual';
import useAuthValidation from '@/hooks/useAuthValidation/UseAuthValidation';
import InputField from '@/components/inputField/InputField';
import api from '../../../../../axiosInstance';
import Link from 'next/link';
import './loginForm.css';

export const LoginForm = () => {
  const router = useRouter();

  const [loginUser, setLoginUser] = useState<LoginUser>({
    email: '',
    password: '',
  });

  const [submittedUser, setSubmittedUser] = useState<LoginUser>({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState<{ error: string; type: 'EMAIL' | 'PASSWORD' | '' }>({ error: '', type: '' });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { errors, inputsTouched, validateInputs, markFieldAsTouched } = useAuthValidation('login');

  const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof LoginUser;

    setLoginUser((prev) => {
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

    setSubmittedUser(loginUser);

    await api
      .post(`/auth/login`, loginUser)
      .then(async () => {
        setSubmittedUser({ email: '', password: '' });
        setLoginUser({ email: '', password: '' });
        router.push('/');
      })
      .catch(({ error, type }) => {
        setServerError({ error: error || 'Something went wrong...', type: type || '' });
      });
  };

  // Show only the first validation error in order: Email → Password
  const emailError = !errors.name && inputsTouched.email && errors.email ? errors.email : '';
  const passwordError = !errors.name && !errors.email && inputsTouched.password && errors.password ? errors.password : '';

  const isSubmitButtonDisabled =
    Boolean(errors.name) ||
    Boolean(errors.email) ||
    Boolean(errors.password) ||
    Boolean(serverError.error) ||
    !loginUser.email.trim() ||
    !loginUser.password.trim();

  return (
    <div>
      <h1 className='app_title'>Finance-Tracking</h1>
      <div className='login_container'>
        <h1 className='login_title'>Login</h1>
        {serverError && <div className='login_server_error'>{serverError.error}</div>}
        <hr className='login_title_divider' />
        <form onSubmit={onSubmitHandler}>
          <div className='login_main'>
            <div className='login_item'>
              <InputField
                type='email'
                placeholder='Email*'
                name='email'
                value={loginUser.email}
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
                type='text'
                placeholder='Password*'
                name='password'
                value={loginUser.password}
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

            <button className='login_submit_button' type='submit' disabled={!!isSubmitButtonDisabled}>
              Login
            </button>
          </div>
        </form>
        <div className='no_account'>
          <span style={{ marginRight: '5px' }}>Do not have an account?</span>
          <Link href='/auth/register'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
