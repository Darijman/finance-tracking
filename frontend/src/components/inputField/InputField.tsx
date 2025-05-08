'use client';

import React, { ReactNode } from 'react';
import { ConfigProvider, Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface Props {
  variant?: 'outlined' | 'filled' | 'borderless' | 'underlined';
  size?: 'large' | 'middle' | 'small';
  value?: string;
  defaultValue?: string;
  placeHolder?: string;
  type?: 'search' | 'password';
  style?: React.CSSProperties;
  allowClear?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  status?: 'error' | 'warning' | '';
  loading?: boolean;
  visible?: boolean;
  name?: string;
  className?: string;
  iconRender?: (visible: boolean) => ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSearch?: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement> | undefined,
    info?: { source?: 'input' | 'clear' },
  ) => void;
  onClear?: () => void;
}

export const InputField = ({
  variant,
  size,
  value,
  defaultValue,
  placeHolder,
  type,
  style,
  allowClear,
  disabled,
  maxLength,
  minLength,
  status,
  loading,
  visible,
  name,
  className,
  iconRender = (visible): ReactNode =>
    visible ? (
      <EyeOutlined style={{ color: 'var(--primary-text-color)' }} />
    ) : (
      <EyeInvisibleOutlined style={{ color: 'var(--primary-text-color)' }} />
    ),
  onVisibleChange,
  onChange,
  onSearch,
  onClear,
}: Props) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: 'var(--background-color)',
            colorBorder: 'var(--background-color)',
            colorText: 'var(--primary-text-color)',
            activeBorderColor: 'var(--primary-text-color)',
            activeShadow: 'none',
            hoverBorderColor: 'none',

            colorTextPlaceholder: 'var(--secondary-text-color)',
            colorError: 'var(--red-color)',
            colorSuccess: 'var(--green-color)',
            colorErrorBorder: 'var(--red-color)',
            colorErrorBorderHover: 'var(--red-color)',
            colorSuccessBorder: 'var(--green-color)',
            colorSuccessBorderHover: 'var(--green-color)',

            fontSize: 16,
            paddingInline: 20,
            paddingInlineLG: 20,
            paddingInlineSM: 20,
            paddingBlockLG: 10,
            paddingBlockSM: 10,
            paddingBlock: 10,
            borderRadiusLG: 10,
            borderRadiusSM: 10,
            borderRadiusXS: 10,
          },
        },
      }}
    >
      {type === 'password' ? (
        <Input.Password
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeHolder}
          style={style}
          allowClear={allowClear}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          status={status}
          name={name}
          className={className}
          iconRender={iconRender}
          onChange={onChange}
          visibilityToggle={{ visible, onVisibleChange }}
          onClear={onClear}
        />
      ) : type === 'search' ? (
        <Input.Search
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeHolder}
          style={style}
          allowClear={allowClear}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          status={status}
          name={name}
          className={className}
          loading={loading}
          onChange={onChange}
          onSearch={onSearch}
          onClear={onClear}
        />
      ) : (
        <Input
          variant={variant}
          size={size}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeHolder}
          style={style}
          allowClear={allowClear}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          status={status}
          name={name}
          className={className}
          onChange={onChange}
          onClear={onClear}
        />
      )}
    </ConfigProvider>
  );
};
