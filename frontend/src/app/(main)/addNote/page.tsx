'use client';

import { AddNoteForm } from './addNoteForm/AddNoteForm';
import { notification, Typography } from 'antd';
import { AddNoteFormMobile } from './addNoteForm/addNoteFormMobile/AddNoteFormMobile';
import { useCallback, useEffect, useState } from 'react';
import { FinanceNote } from '@/interfaces/financeNote';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useAuth } from '@/contexts/authContext/AuthContext';
import { getFinanceCategories, getUserNotes } from '../history/requests';
import { useIsMobile } from '@/hooks/useIsMobile/UseIsMobile';
import { FinanceCategory } from '@/interfaces/financeCategory';
import { Loader } from '@/ui/loader/Loader';
import { motion } from 'framer-motion';
import { FinanceNoteCard } from '@/components/financeNoteCard/FinanceNoteCard';
import { initialQuery } from '../history/page';
import './addNote.css';

const { Title } = Typography;

const AddNote = () => {
  const { user } = useAuth();
  const { isLoading, showLoader, hideLoader } = useLoader();

  const isMobile: boolean = useIsMobile(800);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);
  const [lastThreeUserNotes, setLastThreeUserNotes] = useState<FinanceNote[]>([]);

  const [hasError, setHasError] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification({
    maxCount: 2,
    placement: 'top',
    duration: 5,
  });

  const getData = useCallback(async () => {
    if (user.id) {
      try {
        setHasError(false);
        showLoader();

        const [financeCategories, lastThreeUserNotes] = await Promise.all([
          getFinanceCategories(user.id),
          getUserNotes(user.id, { ...initialQuery, limit: 3 }),
        ]);
        setFinanceCategories(financeCategories);
        setLastThreeUserNotes(lastThreeUserNotes);
      } catch {
        setHasError(true);
      } finally {
        hideLoader();
      }
    }
  }, [user.id, showLoader, hideLoader]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (hasError) {
      notificationApi.error({
        message: 'Something went wrong..',
        description: 'We couldn’t load form data. Please try again later.',
      });
    }
  }, [hasError, notificationApi]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {contextHolder}
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Add Note
      </Title>
      {hasError ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-text-color)' }}>Failed to load form data.</div>
      ) : (
        <>
          {isMobile ? (
            <AddNoteFormMobile financeCategories={financeCategories} setLastThreeUserNotes={setLastThreeUserNotes} />
          ) : (
            <AddNoteForm financeCategories={financeCategories} setLastThreeUserNotes={setLastThreeUserNotes} />
          )}

          {lastThreeUserNotes.length ? (
            <>
              <hr style={{ border: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title level={4} style={{ color: 'var(--primary-text-color)', textAlign: 'center', textTransform: 'capitalize' }}>
                  Your Last Notes
                </Title>
                <div className='last_three_notes'>
                  {lastThreeUserNotes.map((financeNote, index) => (
                    <motion.div
                      key={financeNote.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      style={{ marginBottom: 10 }}
                    >
                      <FinanceNoteCard financeNote={financeNote} preview />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default AddNote;
