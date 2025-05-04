'use client';

import React, { ReactNode } from 'react';
import { Button as AntdButton } from 'antd';

interface Props {
  variant?: 'outlined' | 'solid' | 'text' | 'link';
  type?: 'primary' | 'link' | 'text';
  size?: 'large' | 'middle' | 'small';
  htmlType?: 'submit' | 'reset' | 'button';
  iconPosition?: 'start' | 'end';
  label?: string;
  href?: string;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean | { delay: number; icon: ReactNode };
  style?: React.CSSProperties;
  target?: string;
  className?: string;
  onClick?: React.MouseEventHandler;

  // backgroundColor?: string;
  // textColor?: string;
  // activeBg?: string;
  // borderColor?: string;
  // activeBorderColor?: string;
  // hoverBorderColor?: string;
  // hoverTextColor?: string;
  // hoverBackgroundColor?: string;
}

export const Button = ({
  variant,
  type,
  size,
  htmlType,
  iconPosition,
  label,
  href,
  disabled,
  icon,
  loading,
  style,
  target,
  className,
  onClick,
}: Props) => {
  return (
    <AntdButton
      variant={variant}
      type={type}
      size={size}
      htmlType={htmlType}
      iconPosition={iconPosition}
      icon={icon}
      loading={loading}
      style={style}
      disabled={disabled}
      target={target}
      className={className}
      href={href}
      onClick={onClick}
    >
      {label}
    </AntdButton>
  );
};
