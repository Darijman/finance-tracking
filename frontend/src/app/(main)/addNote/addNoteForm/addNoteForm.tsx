'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { NoteType } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { FinanceNote } from '@/interfaces/financeNote';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { getFinanceCategories, getUserNotes } from '../../history/requests';
import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { DatePicker } from '@/components/datePicker/DatePicker';
import { InputField } from '@/components/inputField/InputField';
import { Form, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { TextField } from '@/components/textField/TextField';
import { Button } from '@/components/button/Button';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { Loader } from '@/ui/loader/Loader';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dayjs from 'dayjs';
import api from '../../../../../axiosInstance';
import './addNoteForm.css';

const { Title, Paragraph } = Typography;

const transformToFinanceNote = (note: NewFinanceNote, categories: FinanceCategory[]): FinanceNote => {
  return {
    id: 0,
    type: note.type,
    amount: parseFloat(note.amount || '0'),
    noteDate: note.noteDate.toISOString(),
    userId: note.userId,
    comment: note.comment ?? '',
    category: categories.find((cat) => cat === note.category) ?? {
      id: 0,
      name: '',
      image: '',
      userId: note.userId,
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
  };
};

interface NewFinanceNote {
  type: NoteType;
  amount: string;
  noteDate: Date;
  category: FinanceCategory | null;
  userId: number;
  comment?: string;
}

export const AddNoteForm = () => {
  const { user } = useAuth();
  const { isLoading, showLoader, hideLoader } = useLoader();

  const [newFinanceNote, setNewFinanceNote] = useState<NewFinanceNote>({
    type: NoteType.INCOME,
    amount: '',
    noteDate: dayjs().startOf('minute').toDate(),
    category: null,
    userId: 0,
    comment: '',
  });

  const [form] = useForm<NewFinanceNote>();
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);
  const [lastThreeUserNotes, setLastThreeUserNotes] = useState<FinanceNote[]>([]);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [hasCategoryError, setHasCategoryError] = useState<boolean>(false);
  const [hasAmountError, setHasAmountError] = useState<boolean>(false);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const getData = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();
        const [financeCategories, lastThreeUserNotes] = await Promise.all([getFinanceCategories(user.id), getUserNotes(user.id, 3)]);

        setFinanceCategories(financeCategories);
        setLastThreeUserNotes(lastThreeUserNotes);
      } catch (error: any) {
        setServerError(error.response.data);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, showLoader, hideLoader]);

  useEffect(() => {
    getData();
  }, [getData]);

  const typeOnChangeHandler = (type: NoteType) => {
    form.setFieldsValue({ type });
    setNewFinanceNote((prevState) => ({
      ...prevState,
      type,
    }));
  };

  const amountOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const regex = /^\d*\.?\d{0,2}$/;

    if (inputValue === '' || regex.test(inputValue)) {
      const numericValue = Number(inputValue);

      if (numericValue <= 1_000_000_000) {
        setNewFinanceNote((prevState) => ({
          ...prevState,
          amount: inputValue,
        }));
        setHasAmountError(false);
      }
    }
  };

  const commentOnChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewFinanceNote((prevState) => ({
      ...prevState,
      comment: event.target.value,
    }));
  };

  const categoryOnChangeHandler = (category: FinanceCategory) => {
    form.setFieldsValue({ category });
    setNewFinanceNote((prevState) => ({
      ...prevState,
      category: category,
    }));
    setHasCategoryError(false);
  };

  const dateOnChangeHandler = (date: dayjs.Dayjs | null) => {
    const formattedDate = date?.startOf('minute') ?? dayjs();
    setNewFinanceNote((prevState) => ({
      ...prevState,
      noteDate: formattedDate.toDate(),
    }));
  };

  const onFinishFailedHandler = (errorInfo: ValidateErrorEntity<NewFinanceNote>) => {
    const { errorFields } = errorInfo;

    errorFields.forEach((error) => {
      if (error.name.includes('category')) {
        setHasCategoryError(true);
      }
    });

    if (!newFinanceNote.amount.trim().length) {
      setHasAmountError(true);
    }
  };

  const onFinishHandler = async () => {
    if (!newFinanceNote.amount.trim().length) {
      return setHasAmountError(true);
    }

    setIsCreating(true);

    const financeNote = {
      type: newFinanceNote.type,
      amount: Number(newFinanceNote.amount),
      noteDate: newFinanceNote.noteDate,
      categoryId: newFinanceNote.category?.id,
      userId: user.id,
      comment: newFinanceNote.comment,
    };

    try {
      const { data: createdNote } = await api.post<FinanceNote>(`/finance_notes`, financeNote);

      const createdNoteWithCategory = {
        ...createdNote,
        category: newFinanceNote.category,
      };

      setNewFinanceNote({
        type: newFinanceNote.type,
        amount: '',
        noteDate: dayjs().startOf('minute').toDate(),
        category: null,
        userId: user.id,
        comment: '',
      });

      form.setFieldsValue({
        type: newFinanceNote.type,
        amount: '',
        noteDate: dayjs().startOf('minute'),
        category: null,
        comment: '',
      });

      setLastThreeUserNotes((prevNotes: any) => {
        const updatedNotes = [createdNoteWithCategory, ...prevNotes];
        return updatedNotes.slice(0, 3);
      });
    } catch (error: any) {
      setServerError(error.response.data);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='addNote_page_wrapper'>
        <Form
          form={form}
          onFinish={onFinishHandler}
          onFinishFailed={onFinishFailedHandler}
          onValuesChange={() => {
            if (serverError.error) {
              setServerError({ error: '' });
            }
          }}
        >
          <div className='addNote_form_container'>
            <Form.Item name='category' rules={[{ required: true, message: '' }]}>
              <div className={`addNote_categories ${hasCategoryError ? 'error' : ''}`}>
                <span className='addNote_categories_required_mark'>*</span>
                <ul className='addNote_categories_list'>
                  {financeCategories.map((financeCategory) => {
                    const imagePath = `http://localhost:9000/uploads/${financeCategory.image}`;
                    return (
                      <li
                        key={financeCategory.id}
                        onClick={() => categoryOnChangeHandler(financeCategory)}
                        className={
                          newFinanceNote.category?.id === financeCategory.id
                            ? `addNote_categories_list_item active`
                            : `addNote_categories_list_item`
                        }
                        title={financeCategory.name}
                      >
                        <Image className='addNote_category_image' src={imagePath} alt={financeCategory.name} width={40} height={40} />
                        <div style={{ textTransform: 'uppercase' }}>{financeCategory.name}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Form.Item>

            <div className='addNote_form_main'>
              <InputField
                status={hasAmountError ? 'error' : ''}
                placeHolder='Amount*'
                size='large'
                value={newFinanceNote.amount}
                onChange={amountOnChangeHandler}
                style={{ marginBottom: '20px' }}
              />
              <Form.Item name='comment' rules={[{ required: false, message: '' }]}>
                <TextField
                  className='addNote_comment'
                  placeHolder='Comment'
                  onChange={commentOnChangeHandler}
                  value={newFinanceNote.comment}
                  showCount={true}
                  maxLength={255}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType='submit'
                  type='primary'
                  className='addNote_submit_button'
                  label='Create'
                  iconPosition='start'
                  loading={isCreating}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item name='type' initialValue={newFinanceNote.type} rules={[{ required: true, message: '' }]}>
                <div className='addNote_type_buttons_container'>
                  <span className='addNote_type_required_mark'>*</span>
                  <div className='addNote_type_buttons'>
                    <Button
                      htmlType='button'
                      type='primary'
                      className={`addNote_expense_button ${newFinanceNote.type === 'EXPENSE' ? 'active' : ''}`}
                      onClick={() => typeOnChangeHandler(NoteType.EXPENSE)}
                      disabled={newFinanceNote.type === 'EXPENSE'}
                      label='EXPENSE'
                    />
                    <Button
                      htmlType='button'
                      type='primary'
                      className={`addNote_income_button ${newFinanceNote.type === 'INCOME' ? 'active' : ''}`}
                      onClick={() => typeOnChangeHandler(NoteType.INCOME)}
                      disabled={newFinanceNote.type === 'INCOME'}
                      label='INCOME'
                    />
                  </div>
                </div>
              </Form.Item>
              <div className='addNote_date_container'>
                <span className='addNote_type_required_mark'>*</span>
                <Form.Item
                  name='noteDate'
                  initialValue={dayjs(newFinanceNote.noteDate)}
                  rules={[{ required: true, message: '' }]}
                  style={{ margin: 0 }}
                >
                  <DatePicker
                    needConfirm={true}
                    onChange={dateOnChangeHandler}
                    value={dayjs(newFinanceNote.noteDate)}
                    showSecond={false}
                    showTime={true}
                    placeholder='Date & Time'
                  />
                </Form.Item>
              </div>

              {serverError.error ? (
                <div className='addNote_error_container'>
                  <div className='addNote_error_exclamation_mark'>
                    <span style={{ userSelect: 'none' }}>!</span>
                  </div>
                  <Paragraph style={{ margin: 0, color: 'var(--red-color)' }}>{serverError.error}</Paragraph>
                </div>
              ) : null}
            </div>
          </div>
        </Form>

        {lastThreeUserNotes.length ? null : (
          <div className='newNote_preview_container'>
            <h2 style={{ textAlign: 'center' }}>Preview:</h2>
            <FinanceNoteCard financeNote={transformToFinanceNote(newFinanceNote, financeCategories)} preview />
          </div>
        )}
      </div>

      {lastThreeUserNotes.length ? (
        <>
          <hr style={{ border: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Title level={4} style={{ color: 'var(--primary-text-color)', textAlign: 'center', textTransform: 'capitalize' }}>
              Your Last Notes
            </Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {lastThreeUserNotes.map((financeNote, index) => (
                <motion.div
                  key={financeNote.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <FinanceNoteCard financeNote={financeNote} preview />
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
