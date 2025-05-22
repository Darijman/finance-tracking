'use client';

import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { Typography } from 'antd';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { Loader } from '@/ui/loader/Loader';
import { getFinanceCategories, getUserNotes } from './requests';
import { AnimatePresence, motion } from 'framer-motion';
import './history.css';
import './responsive.css';

const { Title } = Typography;

const History = () => {
  const { user } = useAuth();

  const { isLoading, showLoader, hideLoader } = useLoader();
  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  const [selectedFinanceCategory, setSelectedFinanceCategory] = useState<string>('');
  const [sortByDate, setSortByDate] = useState<'asc' | 'desc'>('desc');
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc' | null>(null);
  const [sortByType, setSortByType] = useState<'INCOME' | 'EXPENSE' | null>(null);

  const getData = useCallback(async () => {
    if (user.id) {
      try {
        showLoader();
        const [notes, categories] = await Promise.all([getUserNotes(user.id), getFinanceCategories(user.id)]);

        setUserFinanceNotes(notes);
        setFinanceCategories(categories);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        hideLoader();
      }
    }
  }, [user, hideLoader, showLoader]);

  useEffect(() => {
    getData();
  }, [getData]);

  const deleteFinanceNoteHandler = (noteId: number) => {
    setUserFinanceNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const editFinanceNoteHandler = (updatedNote: FinanceNote) => {
    setUserFinanceNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? { ...note, ...updatedNote } : note)));
  };

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='history_container'>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        History
      </Title>
      {!userFinanceNotes.length ? (
        <Title level={3} style={{ textAlign: 'center', margin: 0, color: 'var(--red-color)' }}>
          There is nothing here
        </Title>
      ) : (
        <>
          <div className='history_top_buttons'>
            <div className='sortby_type_buttons'>
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
            <div className='sortby_date_and_price_buttons'>
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
        </>
      )}

      <div>
        {(sortByType || selectedFinanceCategory) && (
          <Title level={3} style={{ margin: '0px 0px 10px 0px', textAlign: 'center' }}>
            {sortByType && <span className={`financenotes_type_word ${sortByType === 'EXPENSE' ? 'expense' : 'income'}`}>{sortByType}</span>}
            {selectedFinanceCategory && (
              <>
                {sortByType ? ' ' : ''}({selectedFinanceCategory})
              </>
            )}
          </Title>
        )}
        <div className='financenotes_grid'>
          <AnimatePresence>
            {filteredAndSortedFinanceNotes.map((financeNote, index) => (
              <motion.div
                key={financeNote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{
                  delay: index < 6 ? index * 0.03 : 0.15,
                  duration: 0.2,
                }}
              >
                <FinanceNoteCard
                  financeNote={financeNote}
                  onDelete={() => deleteFinanceNoteHandler(financeNote.id)}
                  onEdit={editFinanceNoteHandler}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default History;
