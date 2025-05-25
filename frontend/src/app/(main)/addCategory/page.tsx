'use client';

import { Button, message, Typography } from 'antd';
import { AddCategoryForm } from './addCategoryForm/AddCategoryForm';
import { Loader } from '@/ui/loader/Loader';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { useCallback, useEffect, useState } from 'react';
import api from '../../../../axiosInstance';
import DeleteIcon from '@/assets/svg/delete-icon.svg';
import { DeleteModal } from '@/components/deleteModal/DeleteModal';
import './addCategory.css';

const { Title } = Typography;
const MAX_CATEGORIES_AMOUNT: number = 10;

const AddCategory = () => {
  const { user } = useAuth();
  const { isLoading, showLoader, hideLoader } = useLoader();

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 2 });
  const [userFinanceCategories, setUserFinanceCategories] = useState<FinanceCategory[]>([]);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  const getUserFinanceCategories = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();

        const response = await api.get<FinanceCategory[]>(`/finance_categories/user`);
        setUserFinanceCategories(response.data);
      } catch (error: any) {
        console.log(`error`, error);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, showLoader, hideLoader]);

  useEffect(() => {
    getUserFinanceCategories();
  }, [getUserFinanceCategories]);

  const openDeleteCategoryModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setShowDeleteCategoryModal(true);
  };

  const onDeleteCategoryHandler = async () => {
    if (user.id) {
      try {
        await api.delete(`/finance_categories/${selectedCategoryId}`);
        setUserFinanceCategories((prevState) => prevState.filter((category) => category.id !== selectedCategoryId));

        messageApi.open({
          type: 'success',
          content: 'Category has been deleted!',
        });
      } catch (error: any) {
        const errorText: string = error.response?.data.error || 'Something went wrong..';

        messageApi.open({
          type: 'error',
          content: errorText,
        });
      } finally {
        setShowDeleteCategoryModal(false);
        setSelectedCategoryId(0);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {contextHolder}
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Add Category
      </Title>
      <AddCategoryForm setUserFinanceCategories={setUserFinanceCategories} />
      <hr style={{ border: '1px solid var(--border-color)', width: '100%' }} />

      <div className='user_finance_categories'>
        <div className='user_finance_categories_list_top'>
          <Title level={3} style={{ margin: 0, textAlign: 'center', flex: 1, textTransform: 'capitalize' }}>
            Your Custom Categories
          </Title>
          <Title
            level={5}
            style={{ margin: 0, color: 'var(--secondary-text-color)', position: 'absolute', right: 20, textTransform: 'capitalize' }}
          >
            You can add up to{' '}
            <span style={{ color: userFinanceCategories.length < MAX_CATEGORIES_AMOUNT ? 'var(--green-color)' : 'var(--red-color)' }}>
              {MAX_CATEGORIES_AMOUNT - userFinanceCategories.length}
            </span>{' '}
            categories
          </Title>
        </div>
        <ul className='user_finance_categories_list'>
          {userFinanceCategories.map((financeCategory) => {
            const { id, name } = financeCategory;
            return (
              <li className='user_finance_categories_list_item' key={id}>
                {name}
                <Button
                  style={{ backgroundColor: 'transparent', border: 'none', marginLeft: 10 }}
                  iconPosition='end'
                  icon={<DeleteIcon className='delete_icon' />}
                  onClick={() => openDeleteCategoryModal(id)}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <DeleteModal
        isOpen={showDeleteCategoryModal}
        onClose={() => setShowDeleteCategoryModal(false)}
        onDelete={onDeleteCategoryHandler}
        text='Do you really want to delete this Category? This process cannot be undone!'
      />
    </>
  );
};

export default AddCategory;
