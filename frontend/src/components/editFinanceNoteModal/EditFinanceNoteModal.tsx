'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import { FinanceNote, NoteType } from '@/interfaces/financeNote';
import { FinanceNoteCard } from '../financeNoteCard/FinanceNoteCard';
import { InputField } from '../inputField/InputField';
import { TextField } from '../textField/TextField';
import { Form, Typography, Button } from 'antd';
import { DatePicker } from '../datePicker/DatePicker';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { getFinanceCategories } from '@/app/(main)/history/requests';
import { FinanceCategory } from '@/interfaces/financeCategory';
import Image from 'next/image';
import dayjs from 'dayjs';
import api from '../../../axiosInstance';
import './editFinanceNoteModal.css';

const { Title, Paragraph } = Typography;

interface Props {
  isOpen: boolean;
  financeNote: FinanceNote;
  onClose: () => void;
  onEdit: (updatedNote: FinanceNote) => void;
}

export const EditFinanceNoteModal = ({ isOpen, financeNote, onClose, onEdit }: Props) => {
  const { user } = useAuth();
  const [editedNote, setEditedNote] = useState<FinanceNote>(financeNote);
  const [form] = Form.useForm<FinanceNote>();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });
  const [hasCategoryError, setHasCategoryError] = useState<boolean>(false);
  const [hasAmountError, setHasAmountError] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(modalRef, onClose);

  const getCategories = useCallback(async () => {
    if (user.id) {
      try {
        const financeCategories = await getFinanceCategories(user.id);

        setFinanceCategories(financeCategories);
      } catch (error: any) {
        const errorText = error.response?.data?.error;
        setServerError({ error: errorText || 'Something went wrong' });
      }
    }
  }, [user.id]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (isOpen) {
      setEditedNote(financeNote);
      setServerError({ error: '' });
      form.setFieldsValue({
        comment: financeNote.comment,
      });
    }
  }, [isOpen, financeNote, form]);

  useEffect(() => {
    if (JSON.stringify(editedNote) !== JSON.stringify(financeNote)) {
      setIsFormChanged(true);
    } else {
      setIsFormChanged(false);
    }
  }, [editedNote, financeNote]);

  const typeOnChangeHandler = (type: NoteType) => {
    form.setFieldsValue({ type });
    setEditedNote((prevState) => ({
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
        setEditedNote((prevState) => ({
          ...prevState,
          amount: Number(inputValue),
        }));
        if (numericValue <= 0) {
          return setHasAmountError(true);
        }
        setHasAmountError(false);
      }
    }
  };

  const commentOnChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedNote((prevState) => ({
      ...prevState,
      comment: event.target.value,
    }));
  };

  const categoryOnChangeHandler = (category: FinanceCategory) => {
    form.setFieldsValue({ category });
    setEditedNote((prevState) => ({
      ...prevState,
      category: category,
    }));
    setHasCategoryError(false);
  };

  const dateOnChangeHandler = (date: dayjs.Dayjs | null) => {
    const formattedDate = date?.startOf('minute') ?? dayjs();
    setEditedNote((prevState) => ({
      ...prevState,
      noteDate: formattedDate.toDate().toISOString(),
    }));
  };

  const onFinishHandler = async () => {
    if (hasAmountError) {
      return;
    }

    const finalEditedNote = {
      noteDate: editedNote.noteDate,
      amount: Number(editedNote.amount),
      type: editedNote.type,
      categoryId: editedNote.category?.id,
      userId: user.id,
      comment: editedNote.comment,
    };

    try {
      await api.put(`/finance_notes/${editedNote.id}`, finalEditedNote);
      const updatedFullNote: FinanceNote = {
        ...financeNote,
        ...finalEditedNote,
        category: editedNote.category!,
      };

      onEdit(updatedFullNote);
      onClose();
    } catch (error: any) {
      const errorText = error.response?.data?.error;
      setServerError({ error: errorText || 'Something went wrong' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='edit_note_modal_overlay'>
      <div className='edit_note_modal_content' ref={modalRef}>
        <button className='close_edit_modal_button' onClick={onClose}>
          X
        </button>
        <Title level={2}>Edit Note</Title>
        <div className='editNote_container'>
          <div style={{ marginRight: '50px' }}>
            <Form
              form={form}
              id='editFinanceNoteForm'
              onFinish={onFinishHandler}
              onValuesChange={() => {
                if (serverError.error) {
                  setServerError({ error: '' });
                }
              }}
            >
              <div className='editNote_form_container'>
                <Form.Item name='category' initialValue={editedNote.category} rules={[{ required: true, message: '' }]}>
                  <div className={`editNote_categories ${hasCategoryError ? 'error' : ''}`}>
                    <span className='editNote_categories_required_mark'>*</span>
                    <ul className='editNote_categories_list'>
                      {financeCategories.map((financeCategory) => {
                        const imagePath = `http://localhost:9000/uploads/${financeCategory.image}`;
                        return (
                          <li
                            key={financeCategory.id}
                            onClick={() => categoryOnChangeHandler(financeCategory)}
                            className={
                              editedNote.category?.id === financeCategory.id
                                ? `editNote_categories_list_item active`
                                : `editNote_categories_list_item`
                            }
                            title={financeCategory.name}
                          >
                            <Image className='editNote_category_image' src={imagePath} alt={financeCategory.name} width={40} height={40} />
                            <div style={{ textTransform: 'uppercase' }}>{financeCategory.name}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Form.Item>

                <div className='editNote_form_main'>
                  <InputField
                    status={hasAmountError ? 'error' : ''}
                    placeHolder='Amount'
                    size='large'
                    value={editedNote.amount.toString()}
                    onChange={amountOnChangeHandler}
                    style={{ marginBottom: '20px' }}
                  />
                  <Form.Item name='comment' rules={[{ required: false, message: '' }]}>
                    <TextField
                      className='editNote_comment'
                      placeHolder='Comment'
                      onChange={commentOnChangeHandler}
                      value={editedNote.comment}
                      showCount={true}
                      maxLength={255}
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item name='type' initialValue={editedNote.type} rules={[{ required: true, message: '' }]}>
                    <div className='editNote_type_buttons_container'>
                      <span className='editNote_type_required_mark'>*</span>
                      <div className='editNote_type_buttons'>
                        <Button
                          htmlType='button'
                          type='primary'
                          className={`editNote_expense_button ${editedNote.type === 'EXPENSE' ? 'active' : ''}`}
                          onClick={() => typeOnChangeHandler(NoteType.EXPENSE)}
                          disabled={editedNote.type === 'EXPENSE'}
                        >
                          Expense
                        </Button>
                        <Button
                          htmlType='button'
                          type='primary'
                          className={`editNote_income_button ${editedNote.type === 'INCOME' ? 'active' : ''}`}
                          onClick={() => typeOnChangeHandler(NoteType.INCOME)}
                          disabled={editedNote.type === 'INCOME'}
                        >
                          Income
                        </Button>
                      </div>
                    </div>
                  </Form.Item>
                  <div className='editNote_date_container'>
                    <span className='editNote_type_required_mark'>*</span>
                    <Form.Item
                      name='noteDate'
                      initialValue={dayjs(editedNote.noteDate)}
                      rules={[{ required: true, message: '' }]}
                      style={{ margin: 0 }}
                    >
                      <DatePicker
                        needConfirm={true}
                        onChange={dateOnChangeHandler}
                        value={dayjs(editedNote.noteDate)}
                        showSecond={false}
                        showTime={true}
                        placeholder='Date & Time'
                        getPopupContainer={(trigger) => {
                          const parent = trigger?.parentNode;
                          return parent instanceof HTMLElement ? parent : document.body;
                        }}
                      />
                    </Form.Item>
                  </div>

                  {serverError.error ? (
                    <div className='editNote_error_container'>
                      <div className='editNote_error_exclamation_mark'>
                        <span style={{ userSelect: 'none' }}>!</span>
                      </div>
                      <Paragraph style={{ margin: 0, color: 'var(--red-color)' }}>{serverError.error}</Paragraph>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form>
          </div>
          <div className='financeNoteCard_container'>
            <FinanceNoteCard financeNote={editedNote} preview />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            type='primary'
            htmlType='submit'
            form='editFinanceNoteForm'
            className='edit_modal_save_button'
            loading={isSaving}
            disabled={!isFormChanged}
          >
            Save Changes
          </Button>
          <Button type='primary' className='edit_modal_cancel_button' onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
