'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, message } from 'antd';
import { TextField } from '@/components/textField/TextField';
import { FinanceCategory } from '@/interfaces/financeCategory';
import api from '../../../../../axiosInstance';
import './addCategoryForm.css';
import './responsive.css';

interface Props {
  setUserFinanceCategories: Dispatch<SetStateAction<FinanceCategory[]>>;
  userFinanceCategories: FinanceCategory[];
}

export const AddCategoryForm = ({ setUserFinanceCategories, userFinanceCategories }: Props) => {
  const [form] = Form.useForm<{ name: string }>();

  const categoryName: string = Form.useWatch<string>('name', form);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2 });
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onFinishHandler = async (values: { name: string }) => {
    setIsCreating(true);
    values.name = values.name.trim();

    const categoryNameExists = userFinanceCategories.some((financeCategory) => financeCategory.name.trim() === categoryName.trim());
    if (categoryNameExists) {
      setIsCreating(false);
      return messageApi.open({
        type: 'error',
        content: 'Category with this name already exists!',
      });
    }

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
              iconPosition='start'
              loading={isCreating}
              disabled={userFinanceCategories.length >= 10 || !categoryName?.trim()}
              className='add_category_submit_button'
            >
              Add Category
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
