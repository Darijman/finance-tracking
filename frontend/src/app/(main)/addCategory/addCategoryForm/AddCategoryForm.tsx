'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, message } from 'antd';
import { TextField } from '@/components/textField/TextField';
import api from '../../../../../axiosInstance';
import './addCategoryForm.css';
import { FinanceCategory } from '@/interfaces/financeCategory';

interface Props {
  setUserFinanceCategories: Dispatch<SetStateAction<FinanceCategory[]>>;
}

export const AddCategoryForm = ({ setUserFinanceCategories }: Props) => {
  const [form] = Form.useForm<{ name: string }>();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2 });
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onFinishHandler = async (values: { name: string }) => {
    setIsCreating(true);
    try {
      const category = await api.post<FinanceCategory>(`/finance_categories/user`, values);

      setUserFinanceCategories((prevState) => [...prevState, category.data]);
      form.resetFields();

      messageApi.open({
        type: 'success',
        content: 'Category has been created!',
      });
    } catch (error: any) {
      const errorText: string = error.response?.data.error || 'Something went wrong..';

      messageApi.open({
        type: 'error',
        content: errorText,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='add_category_page_wrapper'>
      {contextHolder}

      <Form form={form} onFinish={onFinishHandler}>
        <div className='add_category_form_container'>
          <Form.Item name='name' style={{ width: '100%' }} rules={[{ required: true, message: '', max: 30 }]}>
            <TextField placeHolder='Category Name' maxLength={30} showCount={true} />
          </Form.Item>
          <Form.Item style={{ width: '100%', marginBottom: 0 }}>
            <Button
              htmlType='submit'
              type='primary'
              style={{ width: '100%', textTransform: 'uppercase' }}
              iconPosition='start'
              loading={isCreating}
            >
              Add Category
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
