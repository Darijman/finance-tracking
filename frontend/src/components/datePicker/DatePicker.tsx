'use client';

import React from 'react';
import { DatePicker as AntdDatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import './datePicker.css';

interface Props {
  style?: React.CSSProperties;
  status?: 'warning' | 'error' | '';
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean;
  defaultValue?: any;
  needConfirm?: boolean;
  showTime?: boolean;
  showSecond?: boolean;
  placeHolder?: string;
  onChange?: (date: dayjs.Dayjs | null, dateString: string | string[]) => void;
  value?: any;
}

export const DatePicker = ({
  style,
  status,
  size,
  disabled,
  defaultValue,
  needConfirm,
  showTime,
  showSecond,
  placeHolder,
  onChange,
  value,
}: Props) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            colorBgContainer: 'var(--foreground-color)', //closed datepicker
            colorText: 'var(--primary-text-color)', //colortext
            colorBgElevated: 'var(--background-color)', //opened datepicker
            colorTextPlaceholder: 'var(--secondary-text-color)', //placeholder
            activeBorderColor: 'var(--primary-text-color)', //activeborder
            hoverBorderColor: 'var(--secondary-text-color)', //hoverborder
            colorBorder: 'var(--primary-text-color)', //colorborder
            colorTextHeading: 'var(--primary-text-color)', //APR 2025
            colorIcon: 'var(--primary-text-color)', //arrows
            colorIconHover: 'var(--hover-color)', //arrows hover
          },
        },
      }}
    >
      <AntdDatePicker
        className='datepicker'
        style={style}
        size={size}
        status={status}
        onChange={onChange}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        needConfirm={needConfirm}
        showTime={showTime ? { format: 'HH:mm' } : undefined}
        placeholder={placeHolder}
        showSecond={showSecond}
      />
    </ConfigProvider>
  );
};
