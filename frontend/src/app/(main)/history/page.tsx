'use client';

import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { Button, message, notification, Typography } from 'antd';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { Loader } from '@/ui/loader/Loader';
import { getFinanceCategories, getUserNotes } from './requests';
import { AnimatePresence, motion } from 'framer-motion';
import { Select } from '@/components/select/Select';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './history.css';
import './responsive.css';

const { Title } = Typography;

const History = () => {
  const { user } = useAuth();

  const [messageApi, messageContextHolder] = message.useMessage({ maxCount: 2 });
  const { isLoading, showLoader, hideLoader } = useLoader();
  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  const [selectedFinanceCategory, setSelectedFinanceCategory] = useState<string | null>(null);
  const [sortByDate, setSortByDate] = useState<'asc' | 'desc'>('desc');
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc' | null>(null);
  const [sortByType, setSortByType] = useState<'INCOME' | 'EXPENSE' | null>(null);

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getData = useCallback(async () => {
    if (user.id) {
      try {
        setHasError(false);
        showLoader();
        const [notes, categories] = await Promise.all([getUserNotes(user.id), getFinanceCategories(user.id)]);

        setUserFinanceNotes(notes);
        setFinanceCategories(categories);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user, hideLoader, showLoader]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (hasError) {
      notificationApi.error({
        message: 'Something went wrong..',
        description: 'We couldn’t load your history. Please try again later.',
      });
    }
  }, [hasError, notificationApi]);

  const deleteFinanceNoteHandler = (noteId: number) => {
    setUserFinanceNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

    messageApi.open({
      type: 'success',
      content: 'Note has been removed!',
    });
  };

  const editFinanceNoteHandler = (updatedNote: FinanceNote) => {
    setUserFinanceNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? { ...note, ...updatedNote } : note)));

    messageApi.open({
      type: 'success',
      content: 'Note updated successfully!',
    });
  };

  const categoryOnChangeHandler = (value: string | string[]) => {
    if (Array.isArray(value)) return;
    setSelectedFinanceCategory(value);
  };

  const sortByDateHandler = () => {
    const newSort = sortByDate === 'asc' ? 'desc' : 'asc';
    setSortByDate(newSort);
  };

  const sortByPriceHandler = () => {
    const newSort = sortByPrice === 'asc' ? 'desc' : sortByPrice === 'desc' ? null : 'asc';
    setSortByPrice(newSort);
  };

  const selectFinanceCategories = useMemo(() => {
    return [
      { label: 'Category', value: '' },
      ...financeCategories.map((category) => ({
        label: category.name,
        value: category.name,
      })),
    ];
  }, [financeCategories]);

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
      {messageContextHolder}
      {notificationContextHolder}

      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        History
      </Title>
      <div className='history_top_buttons'>
        <div className='sortby_type_buttons'>
          <Button
            className={`sortby_expense_button ${sortByType === 'EXPENSE' ? 'active' : ''}`}
            onClick={() => setSortByType((prev) => (prev === 'EXPENSE' ? null : 'EXPENSE'))}
            disabled={hasError}
          >
            EXPENSE
          </Button>
          <Button
            className={`sortby_income_button ${sortByType === 'INCOME' ? 'active' : ''}`}
            onClick={() => setSortByType((prev) => (prev === 'INCOME' ? null : 'INCOME'))}
            disabled={hasError}
          >
            INCOME
          </Button>
        </div>
        <Select
          placeholder='Category'
          value={selectedFinanceCategory}
          onChange={categoryOnChangeHandler}
          className='history_select_category'
          options={selectFinanceCategories}
          disabled={hasError}
        />
        <div className='sortby_date_and_price_buttons'>
          <Button
            className='sortby_date_button'
            onClick={sortByDateHandler}
            iconPosition='end'
            icon={sortByDate === 'asc' ? <ArrowUpOutlined /> : sortByDate === 'desc' ? <ArrowDownOutlined /> : null}
            disabled={hasError}
          >
            Date
          </Button>
          <Button
            className='sortby_price_button'
            onClick={sortByPriceHandler}
            iconPosition='end'
            icon={sortByPrice === 'asc' ? <ArrowUpOutlined /> : sortByPrice === 'desc' ? <ArrowDownOutlined /> : null}
            disabled={hasError}
          >
            Price
          </Button>
        </div>
      </div>
      <hr className='history_divider' />

      {hasError ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-text-color)' }}>Failed to load history data.</div>
      ) : (
        <>
          {(sortByType || selectedFinanceCategory) && (
            <Title level={3} style={{ margin: '0px 0px 10px 0px', textAlign: 'center' }}>
              {sortByType && (
                <span className={`financenotes_type_word ${sortByType === 'EXPENSE' ? 'expense' : 'income'}`}>{sortByType}</span>
              )}
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
        </>
      )}
    </div>
  );
};

export default History;
