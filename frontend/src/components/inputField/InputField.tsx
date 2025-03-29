'use client';

import React from 'react';
import './inputField.css';

interface InputFieldProps {
  type: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  value,
  placeholder,
  error,
  onChange,
  className = 'inputField',
  style,
  children,
}) => {
  return (
    <>
      <input
        style={style}
        className={`${className} ${error ? 'error' : ''}`}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {children}
      {error && <div style={{ color: '#e57373', margin: '5px 0px 0px 0px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
    </>
  );
};

export default InputField;
