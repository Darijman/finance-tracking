'use client';

import React, { ReactNode } from 'react';
import { Select as AntdSelect, ConfigProvider } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { DownOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

interface Props {
  options?: DefaultOptionType[];
  placeholder?: string;
  defaultValue?: string | string[] | null;
  value?: string | string[] | null;
  prefix?: ReactNode;
  suffixIcon?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  allowClear?: boolean | { clearIcon?: ReactNode };
  maxCount?: number;
  onChange?: (value: string | string[], option?: DefaultOptionType | DefaultOptionType[]) => void;
}

export const Select = ({
  options,
  placeholder,
  defaultValue,
  value,
  prefix,
  suffixIcon,
  style,
  className,
  disabled,
  mode,
  placement,
  allowClear,
  maxCount,
  onChange,
}: Props) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionActiveBg: 'var(--submit-button-color)',
            optionSelectedBg: 'var(--submit-button-color)',
            optionSelectedColor: 'var(--primary-text-color)',
            colorText: 'var(--primary-text-color)',
            colorBgContainer: 'var(--background-color)',
            colorBgElevated: 'var(--foreground-color)',
            colorBorder: 'var(--secondary-text-color)',
            hoverBorderColor: 'none',
            colorTextPlaceholder: 'var(--secondary-text-color)',
          },
        },
      }}
    >
      <AntdSelect
        options={options}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        prefix={prefix}
        suffixIcon={suffixIcon ?? <DownOutlined style={{ color: 'var(--secondary-text-color)' }} />}
        style={style}
        className={className}
        disabled={disabled}
        mode={mode}
        placement={placement}
        allowClear={allowClear}
        maxCount={maxCount}
        onChange={onChange}
        notFoundContent={
          <div style={{ textAlign: 'center' }}>
            <Empty description={<span style={{ color: 'var(--red-color)' }}>No Data</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        }
      />
    </ConfigProvider>
  );
};
