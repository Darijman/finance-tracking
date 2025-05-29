'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginUser } from '@/interfaces/loginUser';
import { areObjectsEqual } from '@/helpers/areObjectsEqual';
import { InputField } from '@/components/inputField/InputField';
import { Checkbox, CheckboxChangeEvent, Form, Typography, Button } from 'antd';
import useAuthValidation from '@/hooks/useAuthValidation/UseAuthValidation';
import api from '../../../../../axiosInstance';
import Link from 'next/link';
import './loginForm.css';

const { Title, Paragraph } = Typography;

export const LoginForm = () => {
  const router = useRouter();
  const [form] = Form.useForm<LoginUser>();

  const [loginUser, setLoginUser] = useState<LoginUser>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [submittedUser, setSubmittedUser] = useState<LoginUser>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [serverError, setServerError] = useState<{ error: string; type: 'EMAIL' | 'PASSWORD' | '' }>({ error: '', type: '' });
  const { errors, inputsTouched, validateInputs, markFieldAsTouched } = useAuthValidation('login');

  const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof LoginUser;

    setLoginUser((prev) => {
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
    setLoginUser((prevState) => ({
      ...prevState,
      rememberMe: e.target.checked,
    }));
    form.setFieldsValue({ rememberMe: e.target.checked });
  };

  const onFinishHandler = async (values: LoginUser) => {
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      setServerError({ error: 'Please fix the validation errors!', type: '' });
      return;
    }

    setSubmittedUser(values);

    await api
      .post(`/auth/login`, values)
      .then(async () => {
        setSubmittedUser({ email: '', password: '' });
        setLoginUser({ email: '', password: '' });
        router.push('/');
      })
      .catch((error) => {
        const errorMessage = error?.response.data?.error;
        const errorType = error?.response.data?.type;
        setServerError({ error: errorMessage || 'Something went wrong...', type: errorType || '' });
      });
  };

  const emailError = inputsTouched.email && errors.email ? errors.email : '';
  const passwordError = !errors.email && inputsTouched.password && errors.password ? errors.password : '';

  const isSubmitButtonDisabled =
    Boolean(errors.name) ||
    Boolean(errors.email) ||
    Boolean(errors.password) ||
    Boolean(serverError.error) ||
    !loginUser.email.trim() ||
    !loginUser.password.trim();

  return (
    <div className='login'>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 5px 0px' }}>
        Finance-Tracking
      </Title>
      <Paragraph style={{ textAlign: 'center', color: 'var(--secondary-text-color)', margin: '0px 0px 20px 0px', fontSize: '16px' }}>
        The best place to track your money
      </Paragraph>
      <div className='login_container'>
        <Title level={2} style={{ textAlign: 'center', margin: '0px 0px 10px 0px' }}>
          Log in
        </Title>
        {serverError && <div className='login_server_error'>{serverError.error}</div>}
        <hr className='login_title_divider' />
        <Form form={form} onFinish={onFinishHandler} name='login'>
          <div className='login_main'>
            <Form.Item
              name='email'
              rules={[{ required: true, message: emailError || 'Invalid email format!', type: 'email' }]}
              style={{ maxWidth: '300px', width: '100%', textAlign: 'center', margin: '0px 0px 20px 0px' }}
            >
              <InputField placeHolder='Email*' value={loginUser.email} onChange={inputOnChangeHandler} name='email' maxLength={254} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: passwordError || 'Please input your password!' }]}
              style={{ maxWidth: '300px', width: '100%', textAlign: 'center', margin: '0px 0px 10px 0px' }}
            >
              <InputField
                placeHolder='Password*'
                value={loginUser.password}
                onChange={inputOnChangeHandler}
                name='password'
                type='password'
                minLength={6}
                maxLength={20}
              />
            </Form.Item>
            <Form.Item name='rememberMe' style={{ maxWidth: '300px', width: '100%', margin: '0px 0px 10px 0px' }} valuePropName='checked'>
              <Checkbox checked={loginUser.rememberMe} onChange={checkboxOnChangeHandler}>
                Remember me
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ maxWidth: '300px', width: '100%', textAlign: 'center' }}>
              <Button className='login_submit_button' htmlType='submit' disabled={isSubmitButtonDisabled}>
                Sign In
              </Button>
            </Form.Item>
          </div>
        </Form>
        <div className='no_account'>
          <span style={{ marginRight: '5px' }}>Do not have an account?</span>
          <Link href='/auth/register'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
