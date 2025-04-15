'use client';

import { FinanceNote } from '@/interfaces/financeNote';
import { formatDate } from '@/helpers/formatDate';
import Image from 'next/image';
import './financeNoteCard.css';

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface Props {
  financeNote: FinanceNote;
}

export const FinanceNoteCard = ({ financeNote }: Props) => {
  const { id, noteDate, amount, type, category, comment, userId, createdAt, updatedAt } = financeNote;

  const formattedAmountText = formatCurrency(amount);

  const amountText = type === `INCOME` ? `+${formattedAmountText}` : `-${formattedAmountText}`;
  const typeClass = type === 'EXPENSE' ? 'expense_text' : '';

  const imagePath = category.image ? `http://localhost:9000/uploads/${category.image}` : '/default-image.png';

  return (
    <div className='notecard_container'>
      <div className='menu_dots'>⋯</div>
      <div className='category_image_container'>
        <Image className='category_image' src={imagePath} alt={category.name} width={40} height={40} />
      </div>
      <div className='notecard_top'>
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
  );
};
