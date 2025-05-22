'use client';

import { useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { formatDate } from '@/helpers/formatDate';
import { DeleteModal } from '../deleteModal/DeleteModal';
import { EditFinanceNoteModal } from '../editFinanceNoteModal/EditFinanceNoteModal';
import Image from 'next/image';
import api from '../../../axiosInstance';
import './financeNoteCard.css';
import './responsive.css';

import EditIcon from '@/assets/svg/edit-icon.svg';
import DeleteIcon from '@/assets/svg/delete-icon.svg';

function formatCurrency(amount: number, currencyCode: string) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface Props {
  financeNote: FinanceNote;
  onDelete?: (financeNoteId: number) => void;
  onEdit?: (updatedNote: FinanceNote) => void;
  preview?: boolean;
}

export const FinanceNoteCard = ({ financeNote, onDelete, onEdit, preview }: Props) => {
  const { id, noteDate, amount, type, category, comment, user } = financeNote;

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const userCurrencyCode = user?.currency?.code || 'USD';
  const formattedAmountText = formatCurrency(amount, userCurrencyCode);

  const amountText = type === `INCOME` ? `+${formattedAmountText}` : `-${formattedAmountText}`;
  const typeClass = type === 'EXPENSE' ? 'expense_text' : '';

  const imagePath = category.image
    ? `http://localhost:9000/uploads/${category.image}`
    : 'http://localhost:9000/uploads/questionMark-icon.svg';

  const deleteFinanceNoteHandler = async () => {
    await api.delete(`/finance_notes/${id}`);
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteModal(false);
  };

  const editFinanceNoteHandler = (updatedNote: FinanceNote) => {
    if (onEdit) {
      onEdit(updatedNote);
    }
    setShowEditModal(false);
  };

  return (
    <>
      <div className='notecard_container'>
        {!preview ? (
          <>
            <div className='edit_button' title='Edit' onClick={() => setShowEditModal(true)}>
              <EditIcon className='edit_icon' />
            </div>
            <div className='delete_button' onClick={() => setShowDeleteModal(true)} title='Delete'>
              <DeleteIcon className='delete_icon' />
            </div>
          </>
        ) : null}
        <div className='category_image_container'>
          <Image className='category_image' src={imagePath} alt={category.name} width={40} height={40} />
        </div>
        <div className='notecard_info'>
          <div className={`amount_text ${typeClass}`}>{amountText}</div>
          <div className={`category_text ${typeClass}`}>
            <span>{category.name}</span>
          </div>
        </div>
        <div className='notecard_mid'>
          <p className='notecard_comment'>{comment}</p>
        </div>
        <div className='note_created_date'>{formatDate(noteDate, true)}</div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteFinanceNoteHandler}
        text='Do you really want to delete this Note? This process cannot be undone!'
      />

      <EditFinanceNoteModal
        isOpen={showEditModal}
        financeNote={financeNote}
        onClose={() => setShowEditModal(false)}
        onEdit={editFinanceNoteHandler}
      />
    </>
  );
};
