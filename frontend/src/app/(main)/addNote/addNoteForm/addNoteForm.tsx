'use client';

import { useState, useEffect, FormEvent } from 'react';
import { NoteType } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { FinanceNote } from '@/interfaces/financeNote';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { getFinanceCategories } from '../../history/requests';
import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { DatePicker } from '@/components/datePicker/DatePicker';
import InputField from '@/components/inputField/InputField';
import Image from 'next/image';
import dayjs from 'dayjs';
import api from '../../../../../axiosInstance';
import './addNoteForm.css';

const transformToFinanceNote = (note: NewFinanceNote, categories: FinanceCategory[]): FinanceNote => {
  return {
    id: 0,
    type: note.type,
    amount: parseFloat(note.amount || '0'),
    noteDate: note.noteDate.toISOString(),
    userId: note.userId,
    comment: note.comment ?? '',
    category: categories.find((cat) => cat.id === note.categoryId) ?? {
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
  categoryId: number | null;
  userId: number;
  comment?: string;
}

export const AddNoteForm = () => {
  const { user } = useAuth();
  const [newFinanceNote, setNewFinanceNote] = useState<NewFinanceNote>({
    type: NoteType.INCOME,
    amount: '',
    noteDate: dayjs().startOf('minute').toDate(),
    categoryId: null,
    userId: 0,
    comment: '',
  });

  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  useEffect(() => {
    if (user.id) {
      getFinanceCategories(user.id).then(setFinanceCategories);
    }
  }, [user.id]);

  const typeOnChangeHandler = (type: NoteType) => {
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
      }
    }
  };

  const commentOnChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewFinanceNote((prevState) => ({
      ...prevState,
      comment: event.target.value,
    }));
  };

  const categoryOnChangeHandler = (categoryId: number) => {
    setNewFinanceNote((prevState) => ({
      ...prevState,
      categoryId: categoryId,
    }));
  };

  const dateOnChangeHandler = (date: dayjs.Dayjs | null) => {
    const formattedDate = date?.startOf('minute') ?? dayjs();
    setNewFinanceNote((prevState) => ({
      ...prevState,
      noteDate: formattedDate.toDate(),
    }));
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const financeNote = {
      type: newFinanceNote.type,
      amount: Number(newFinanceNote.amount),
      noteDate: newFinanceNote.noteDate,
      categoryId: newFinanceNote.categoryId,
      userId: user.id,
      comment: newFinanceNote.comment,
    };

    try {
      await api.post(`/finance_notes`, financeNote);
      setNewFinanceNote({
        type: NoteType.INCOME,
        amount: '',
        noteDate: dayjs().startOf('minute').toDate(),
        categoryId: null,
        userId: 0,
        comment: '',
      });
    } catch (error: any) {
      console.log(`error`, error);
    }
  };

  return (
    <div className='addNote_page_wrapper'>
      <form onSubmit={submitHandler}>
        <div className='addNote_form_container'>
          <div className='addNote_categories'>
            <span className='addNote_categories_required_mark'>*</span>
            <ul className='addNote_categories_list'>
              {financeCategories.map((financeCategory) => {
                const imagePath = `http://localhost:9000/uploads/${financeCategory.image}`;
                return (
                  <li
                    onClick={() => categoryOnChangeHandler(financeCategory.id)}
                    key={financeCategory.id}
                    className={
                      newFinanceNote.categoryId === financeCategory.id
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
          <div className='addNote_form_main'>
            <InputField
              className='addNote_amount'
              type='text'
              value={newFinanceNote.amount}
              placeholder='Amount*'
              onChange={amountOnChangeHandler}
            />
            <div className='addNote_comment_container'>
              <textarea
                className='addNote_comment'
                placeholder='Comment'
                maxLength={255}
                value={newFinanceNote.comment}
                onChange={commentOnChangeHandler}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 10,
                  fontSize: '12px',
                  color: 'gray',
                  pointerEvents: 'none',
                }}
              >
                {newFinanceNote.comment?.length}/255
              </div>
            </div>

            <button type='submit' className='addNote_submit_button'>
              Create
            </button>
          </div>
          <div>
            <div className='addNote_type_buttons_container'>
              <span className='addNote_type_required_mark'>*</span>
              <div className='addNote_type_buttons'>
                <button
                  type='button'
                  className={`addNote_expense_button ${newFinanceNote.type === 'EXPENSE' ? 'active' : ''}`}
                  onClick={() => typeOnChangeHandler(NoteType.EXPENSE)}
                  disabled={newFinanceNote.type === 'EXPENSE'}
                >
                  EXPENSE
                </button>
                <button
                  type='button'
                  className={`addNote_income_button ${newFinanceNote.type === 'INCOME' ? 'active' : ''}`}
                  onClick={() => typeOnChangeHandler(NoteType.INCOME)}
                  disabled={newFinanceNote.type === 'INCOME'}
                >
                  INCOME
                </button>
              </div>
            </div>
            <div className='addNote_date_container'>
              <span className='addNote_type_required_mark'>*</span>
              <DatePicker
                needConfirm={true}
                onChange={dateOnChangeHandler}
                value={dayjs(newFinanceNote.noteDate)}
                showSecond={false}
                showTime={true}
                placeHolder='Date & Time'
              />
            </div>
          </div>
        </div>
      </form>
      <div className='newNote_preview_container'>
        <h2 style={{ textAlign: 'center' }}>Preview:</h2>
        <FinanceNoteCard financeNote={transformToFinanceNote(newFinanceNote, financeCategories)} preview />
      </div>
    </div>
  );
};
