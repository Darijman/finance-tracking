'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterUser } from '@/interfaces/registerUser';
import { areObjectsEqual } from '@/helpers/areObjectsEqual';
import { Checkbox, CheckboxChangeEvent, Form, Typography, Button } from 'antd';
import { InputField } from '@/components/inputField/InputField';
import useAuthValidation from '@/hooks/useAuthValidation/UseAuthValidation';
import api from '../../../../../axiosInstance';
import Link from 'next/link';
import './registerForm.css';

const { Title, Paragraph } = Typography;

export const RegisterForm = () => {
  const router = useRouter();
  const [form] = Form.useForm<RegisterUser>();

  const [registrationUser, setRegistrationUser] = useState<RegisterUser>({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const [submittedUser, setSubmittedUser] = useState<RegisterUser>({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const [serverError, setServerError] = useState<{ error: string; type: 'NAME' | 'EMAIL' | 'PASSWORD' | '' }>({ error: '', type: '' });

  const { errors, inputsTouched, validateInputs, markFieldAsTouched } = useAuthValidation('register');

  const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof RegisterUser;

    setRegistrationUser((prev) => {
      const updatedUser = { ...prev, [fieldName]: value };
      const hasDataChanged = !areObjectsEqual(form.getFieldsValue(), submittedUser);

      if (serverError.error && hasDataChanged) {
        setServerError({ error: '', type: '' });
      }

      return updatedUser;
    });

    validateInputs(fieldName, value.trim());
    markFieldAsTouched(fieldName);
  };

  const checkboxOnChangeHandler = (e: CheckboxChangeEvent) => {
    setRegistrationUser((prevState) => ({
      ...prevState,
      rememberMe: e.target.checked,
    }));
    form.setFieldsValue({ rememberMe: e.target.checked });
  };

  const onFinishHandler = async (values: RegisterUser) => {
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      setServerError({ error: 'Please fix the validation errors!', type: '' });
      return;
    }

    setSubmittedUser(values);

    await api
      .post(`/auth/register`, values)
      .then(async () => {
        setSubmittedUser({ name: '', email: '', password: '' });
        setRegistrationUser({ name: '', email: '', password: '' });
        router.push('/');
      })
      .catch((error) => {
        const responseError = error.response?.data;

        setServerError({
          error: responseError?.error || 'Something went wrong...',
          type: responseError?.type || '',
        });
      });
  };

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
    <div className='register'>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 5px 0px' }}>
        Finance-Tracking
      </Title>
      <Paragraph style={{ textAlign: 'center', color: 'var(--secondary-text-color)', margin: '0px 0px 20px 0px', fontSize: '16px' }}>
        The best place to track your money
      </Paragraph>
      <div className='register_container'>
        <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
          Register
        </Title>
        {serverError && <div className='register_server_error'>{serverError.error}</div>}
        <hr className='register_title_divider' />
        <Form form={form} onFinish={onFinishHandler} name='register'>
          <div className='register_main'>
            <Form.Item
              name='name'
              rules={[{ required: true, message: nameError || 'Please input your name!' }]}
              style={{ maxWidth: '300px', width: '100%', textAlign: 'center', margin: '0px 0px 20px 0px' }}
            >
              <InputField placeHolder='Name*' name='name' value={registrationUser.name} onChange={inputOnChangeHandler} />
            </Form.Item>
            <Form.Item
              name='email'
              rules={[{ required: true, message: emailError || 'Invalid email format!', type: 'email' }]}
              style={{ maxWidth: '300px', width: '100%', textAlign: 'center', margin: '0px 0px 20px 0px' }}
            >
              <InputField placeHolder='Email*' name='email' value={registrationUser.email} onChange={inputOnChangeHandler} maxLength={254} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: passwordError || 'Please input your password!' }]}
              style={{ maxWidth: '300px', width: '100%', textAlign: 'center', margin: '0px 0px 10px 0px' }}
            >
              <InputField
                type='password'
                placeHolder='Password*'
                name='password'
                value={registrationUser.password}
                onChange={inputOnChangeHandler}
                minLength={6}
                maxLength={20}
              />
            </Form.Item>

            <Form.Item name='rememberMe' style={{ maxWidth: '300px', width: '100%', margin: '0px 0px 10px 0px' }} valuePropName='checked'>
              <Checkbox checked={registrationUser.rememberMe} onChange={checkboxOnChangeHandler}>
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ maxWidth: '300px', width: '100%', textAlign: 'center' }}>
              <Button className='register_submit_button' htmlType='submit' disabled={!!isSubmitButtonDisabled}>
                Sign up
              </Button>
            </Form.Item>
          </div>
        </Form>
        <div className='has_account'>
          <span style={{ marginRight: '5px' }}>Already have an account?</span>
          <Link href='/auth/login'>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
