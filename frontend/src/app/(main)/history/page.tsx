'use client';

import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import api from '../../../../axiosInstance';
import './history.css';

const History = () => {
  const { user } = useAuth();
  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  const [selectedFinanceCategory, setSelectedFinanceCategory] = useState<string>('');
  const [sortByDate, setSortByDate] = useState<'asc' | 'desc'>('desc');
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc' | null>(null);
  const [sortByType, setSortByType] = useState<'INCOME' | 'EXPENSE' | null>(null);

  const getUserNotes = useCallback(async () => {
    if (user) {
      const response = await api.get<FinanceNote[]>(`/finance_notes/user/${user?.id}`);
      setUserFinanceNotes(response.data);
    }
  }, [user]);

  const getFinanceCategories = useCallback(async () => {
    if (user) {
      const mainFinanceCategories = await api.get<FinanceCategory[]>(`/finance_categories/`);
      const userFinanceCategories = await api.get<FinanceCategory[]>(`/finance_categories/user/${user.id}`);
      const allCategories = mainFinanceCategories.data.concat(userFinanceCategories.data);
      setFinanceCategories(allCategories);
    }
  }, [user]);

  useEffect(() => {
    getUserNotes();
    getFinanceCategories();
  }, [getUserNotes, getFinanceCategories]);

  const categoryOnChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    setSelectedFinanceCategory(selectedCategory);
  };

  const sortByDateHandler = () => {
    const newSort = sortByDate === 'asc' ? 'desc' : 'asc';
    setSortByDate(newSort);
  };

  const sortByPriceHandler = () => {
    const newSort = sortByPrice === 'asc' ? 'desc' : sortByPrice === 'desc' ? null : 'asc';
    setSortByPrice(newSort);
  };

  const filteredAndSortedFinanceNotes = useMemo(() => {
    let filteredNotes = [...userFinanceNotes];

    if (selectedFinanceCategory) {
      filteredNotes = filteredNotes.filter((note) => note.category.name === selectedFinanceCategory);
    }

    if (sortByType) {
      filteredNotes = filteredNotes.filter((note) => note.type === sortByType);
    }

    if (sortByDate) {
      filteredNotes = filteredNotes.sort((a, b) => {
        const dateA = new Date(a.noteDate).getTime();
        const dateB = new Date(b.noteDate).getTime();
        return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    if (sortByPrice) {
      filteredNotes = filteredNotes.sort((a, b) => {
        return sortByPrice === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      });
    }

    return filteredNotes;
  }, [userFinanceNotes, selectedFinanceCategory, sortByType, sortByDate, sortByPrice]);

  return (
    <div className='history_container'>
      <h2 className='history_title'>History</h2>
      <div className='history_top_buttons'>
        <div>
          <button
            className={`sortby_expense_button ${sortByType === 'EXPENSE' ? 'active' : ''}`}
            onClick={() => setSortByType((prev) => (prev === 'EXPENSE' ? null : 'EXPENSE'))}
          >
            EXPENSE
          </button>
          <button
            className={`sortby_income_button ${sortByType === 'INCOME' ? 'active' : ''}`}
            onClick={() => setSortByType((prev) => (prev === 'INCOME' ? null : 'INCOME'))}
          >
            INCOME
          </button>
        </div>
        <select className='financecategory_select' value={selectedFinanceCategory} onChange={categoryOnChangeHandler}>
          <option value=''>Category</option>
          {financeCategories.map((financeCategory) => {
            return (
              <option key={financeCategory.id} value={financeCategory.name}>
                {financeCategory.name}
              </option>
            );
          })}
        </select>
        <div>
          <button className='sortby_date_button' onClick={sortByDateHandler}>
            Date
            {sortByDate === 'asc' && <span className='sort_arrow up'></span>}
            {sortByDate === 'desc' && <span className='sort_arrow down'></span>}
          </button>
          <button className='sortby_price_button' onClick={sortByPriceHandler}>
            Price
            {sortByPrice === 'asc' && <span className='sort_arrow up'></span>}
            {sortByPrice === 'desc' && <span className='sort_arrow down'></span>}
            {sortByPrice === null && <span className='sort_arrow none'></span>}
          </button>
        </div>
      </div>
      <hr className='history_divider' />
      <div>
        {sortByType || selectedFinanceCategory ? (
          <h3 className='financenotes_type_title'>
            ({selectedFinanceCategory})
            <span className={`financenotes_type_word ${sortByType === 'EXPENSE' ? 'expense' : 'income'}`}>Only {sortByType}</span>
          </h3>
        ) : null}
        {/* {selectedFinanceCategory ? (
          <h3 className='financenotes_type_title'>
            Only <span className='financenotes_type_word'>{selectedFinanceCategory}</span>
          </h3>
        ) : null} */}
        <div className='financenotes_grid'>
          {filteredAndSortedFinanceNotes.map((financeNote) => {
            return <FinanceNoteCard key={financeNote.id} financeNote={financeNote} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default History;
