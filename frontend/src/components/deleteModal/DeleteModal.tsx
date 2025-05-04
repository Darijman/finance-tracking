'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
import { Loader } from '@/ui/loader/Loader';
import './deleteModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  text: string;
  style?: React.CSSProperties;
}

export const DeleteModal = ({ isOpen, onClose, onDelete, text, style }: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (isOpen) {
      setServerError({ error: '' });
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error: any) {
      setServerError(error || { error: 'Something went wrong' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='delete_modal_overlay'>
      <div className='delete_modal_content' ref={modalRef} style={style}>
        <button className='close_delete_modal_button' onClick={onClose}>
          X
        </button>

        {isDeleting ? (
          <Loader style={{ width: '40px' }} />
        ) : (
          <div className='delete_modal_x_icon_container'>
            <span style={{ userSelect: 'none' }}>{serverError.error ? '!' : 'X'}</span>
          </div>
        )}

        {serverError.error ? (
          <div className='delete_modal_server_error'>{serverError.error}</div>
        ) : (
          <>
            <h3 className='delete_modal_confirm_title'>Are you sure?</h3>
            <p className='delete_modal_text'>{text}</p>
          </>
        )}

        {!serverError.error ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className='delete_modal_yes_button' onClick={handleDelete} disabled={isDeleting}>
              Yes, delete
            </button>
            <button className='delete_modal_no_button' onClick={onClose} disabled={isDeleting}>
              Cancel
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
