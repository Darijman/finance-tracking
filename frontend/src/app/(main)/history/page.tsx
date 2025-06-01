'use client';

import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { Button, message, notification, Typography } from 'antd';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { Loader } from '@/ui/loader/Loader';
import { getFinanceCategories, getUserNotes, GetUserNotesQuery } from './requests';
import { AnimatePresence, motion } from 'framer-motion';
import { Select } from '@/components/select/Select';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import './history.css';
import './responsive.css';

const { Title } = Typography;

export const initialQuery: GetUserNotesQuery = {
  offset: 0,
  limit: 20,
  sortByDate: 'DESC',
  sortByPrice: null,
  type: null,
  categoryId: null,
};

const History = () => {
  const { user } = useAuth();

  const [messageApi, messageContextHolder] = message.useMessage({ maxCount: 2 });
  const { isLoading, showLoader, hideLoader } = useLoader();
  const [userFinanceNotes, setUserFinanceNotes] = useState<FinanceNote[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);

  const [queryLoader, setQueryLoader] = useState<boolean>(false);
  const [query, setQuery] = useState<GetUserNotesQuery>(initialQuery);

  const [offset, setOffset] = useState<number>(0);

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const getCategories = useCallback(async () => {
    if (user.id) {
      try {
        setHasError(false);
        showLoader();
        const categories = await getFinanceCategories(user.id);

        setFinanceCategories(categories);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user, hideLoader, showLoader]);

  const getDataOnQueryChange = useCallback(
    async (query: GetUserNotesQuery) => {
      if (user.id) {
        try {
          setQueryLoader(true);
          setHasError(false);
          setOffset(0);

          const notes = await getUserNotes(user.id, { ...query, offset: 0 });
          setUserFinanceNotes(notes);
          setHasMore(notes.length === 20);
        } catch {
          setHasError(true);
        } finally {
          setQueryLoader(false);
        }
      }
    },
    [user.id],
  );

  const loadMoreUserFinanceNotes = useCallback(async () => {
    if (!hasMore || loadingMore || hasError || !user.id) return;

    setLoadingMore(true);
    try {
      const nextOffset = offset + 20;
      const newNotes = await getUserNotes(user.id, { ...query, offset: nextOffset });
      setUserFinanceNotes((prev) => [...prev, ...newNotes]);
      setOffset(nextOffset);

      if (newNotes.length < 20) {
        setHasMore(false);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoadingMore(false);
      setQueryLoader(false);
    }
  }, [user.id, hasMore, loadingMore, hasError, query, offset]);

  useEffect(() => {
    getDataOnQueryChange(query);
  }, [query, getDataOnQueryChange]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

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
    setQuery((prev) => ({
      ...prev,
      categoryId: Number(value),
      offset: 0,
    }));
  };

  const sortByDateHandler = () => {
    setQuery((prev) => ({
      ...prev,
      sortByDate: prev.sortByDate === 'ASC' ? 'DESC' : 'ASC',
      offset: 0,
    }));
  };

  const sortByPriceHandler = () => {
    setQuery((prev) => {
      let newSort: 'ASC' | 'DESC' | null;
      if (prev.sortByPrice === 'ASC') newSort = 'DESC';
      else if (prev.sortByPrice === 'DESC') newSort = null;
      else newSort = 'ASC';

      return {
        ...prev,
        sortByPrice: newSort,
        offset: 0,
      };
    });
  };

  const selectFinanceCategoriesOptions = useMemo(() => {
    return [
      { label: 'Category', value: '' },
      ...financeCategories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ];
  }, [financeCategories]);

  const selectedCategoryName = financeCategories.find((cat) => cat.id === query.categoryId)?.name || null;

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
            className={`sortby_expense_button ${query.type === 'EXPENSE' ? 'active' : ''}`}
            onClick={() =>
              setQuery((prev) => ({
                ...prev,
                type: prev.type === 'EXPENSE' ? null : 'EXPENSE',
              }))
            }
            disabled={hasError}
          >
            EXPENSE
          </Button>
          <Button
            className={`sortby_income_button ${query.type === 'INCOME' ? 'active' : ''}`}
            onClick={() =>
              setQuery((prev) => ({
                ...prev,
                type: prev.type === 'INCOME' ? null : 'INCOME',
              }))
            }
            disabled={hasError}
          >
            INCOME
          </Button>
        </div>
        <Select
          placeholder='Category'
          value={selectedCategoryName}
          onChange={categoryOnChangeHandler}
          className='history_select_category'
          options={selectFinanceCategoriesOptions}
          disabled={hasError}
        />
        <div className='sortby_date_and_price_buttons'>
          <Button
            className='sortby_date_button'
            onClick={sortByDateHandler}
            iconPosition='end'
            icon={query.sortByDate === 'ASC' ? <ArrowUpOutlined /> : query.sortByDate === 'DESC' ? <ArrowDownOutlined /> : null}
            disabled={hasError}
          >
            Date
          </Button>
          <Button
            className='sortby_price_button'
            onClick={sortByPriceHandler}
            iconPosition='end'
            icon={query.sortByPrice === 'ASC' ? <ArrowUpOutlined /> : query.sortByPrice === 'DESC' ? <ArrowDownOutlined /> : null}
            disabled={hasError}
          >
            Price
          </Button>
        </div>
      </div>
      <hr className='history_divider' />

      {queryLoader ? (
        <Loader style={{ width: '40px', height: '40px' }} />
      ) : hasError ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-text-color)' }}>Failed to load history data.</div>
      ) : (
        <>
          {(query.type || selectedCategoryName) && (
            <Title level={3} style={{ margin: '0px 0px 10px 0px', textAlign: 'center' }}>
              {query.type && (
                <span className={`financenotes_type_word ${query.type === 'EXPENSE' ? 'expense' : 'income'}`}>{query.type}</span>
              )}
              {selectedCategoryName && (
                <>
                  {query.type ? ' ' : ''}({selectedCategoryName})
                </>
              )}
            </Title>
          )}

          <InfiniteScroll
            dataLength={userFinanceNotes.length}
            next={loadMoreUserFinanceNotes}
            hasMore={hasMore}
            loader={<Loader style={{ marginTop: 10, width: '40px', height: '40px' }} />}
            endMessage={
              <Title level={5} style={{ textAlign: 'center', margin: '10px 0px 0px 0px', color: 'var(--red-color)' }}>
                Looks like you have reached the end!
              </Title>
            }
            scrollableTarget='scrollableMainLayout'
            style={{ overflowY: 'hidden' }}
          >
            <div className='financenotes_grid'>
              <AnimatePresence>
                {userFinanceNotes.map((financeNote, index) => (
                  <motion.div
                    key={financeNote.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};

export default History;
