// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { useClickOutside } from '@/hooks/useClickOutside/UseClickOutside';
// import { FinanceNote } from '@/interfaces/financeNote';
// import { FinanceNoteCard } from '../financeNoteCard/FinanceNoteCard';
// import { Button } from '../button/Button';
// import { InputField } from '../inputField/InputField';
// import { TextField } from '../textField/TextField';
// import { Form, Typography } from 'antd';
// import './editFinanceNoteModal.css';
// import { DatePicker } from '../datePicker/DatePicker';

// const { Paragraph } = Typography;

// interface Props {
//   isOpen: boolean;
//   financeNote: FinanceNote;
//   onClose: () => void;
//   onConfirm: () => Promise<void>;
// }

// export const EditModal = ({ isOpen, financeNote, onClose, onConfirm }: Props) => {
//   const [editedNote, setEditedNote] = useState<FinanceNote>(financeNote);
//   const [form] = Form.useForm();

//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [serverError, setServerError] = useState<{ error: string }>({ error: '' });

//   const modalRef = useRef<HTMLDivElement | null>(null);
//   useClickOutside(modalRef, onClose);

//   useEffect(() => {
//     if (isOpen) {
//       setEditedNote(financeNote);
//       setServerError({ error: '' });
//     }
//   }, [isOpen, financeNote]);

//   const handleDelete = async () => {
//     try {
//       await onConfirm();
//     } catch (error: any) {
//       setServerError(error || { error: 'Something went wrong' });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const onFinishFailedHandler = () => {

//   }

//   const onFinishHandler = async () => {

//   };

//   if (!isOpen) return null;

//   return (
//     <div className='delete_modal_overlay'>
//       <div className='delete_modal_content' ref={modalRef}>
//         <button className='close_delete_modal_button' onClick={onClose}>
//           X
//         </button>
//         <div className='edit_container'>
//           <div>
//             <Form
//               form={form}
//               onFinish={onFinishHandler}
//               onFinishFailed={onFinishFailedHandler}
//               onValuesChange={() => {
//                 if (serverError.error) {
//                   setServerError({ error: '' });
//                 }
//               }}
//             >
//               <div className='addNote_form_container'>
//                 <Form.Item name='category' rules={[{ required: true, message: '' }]}>
//                   <div className={`addNote_categories ${hasCategoryError ? 'error' : ''}`}>
//                     <span className='addNote_categories_required_mark'>*</span>
//                     <ul className='addNote_categories_list'>
//                       {financeCategories.map((financeCategory) => {
//                         const imagePath = `http://localhost:9000/uploads/${financeCategory.image}`;
//                         return (
//                           <li
//                             key={financeCategory.id}
//                             onClick={() => categoryOnChangeHandler(financeCategory)}
//                             className={
//                               newFinanceNote.category?.id === financeCategory.id
//                                 ? `addNote_categories_list_item active`
//                                 : `addNote_categories_list_item`
//                             }
//                             title={financeCategory.name}
//                           >
//                             <Image className='addNote_category_image' src={imagePath} alt={financeCategory.name} width={40} height={40} />
//                             <div style={{ textTransform: 'uppercase' }}>{financeCategory.name}</div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 </Form.Item>

//                 <div className='addNote_form_main'>
//                   <InputField
//                     status={hasAmountError ? 'error' : ''}
//                     placeHolder='Amount'
//                     size='large'
//                     value={newFinanceNote.amount}
//                     onChange={amountOnChangeHandler}
//                     style={{ marginBottom: '20px' }}
//                   />
//                   <Form.Item name='comment' rules={[{ required: false, message: '' }]}>
//                     <TextField
//                       className='addNote_comment'
//                       placeHolder='Comment'
//                       onChange={commentOnChangeHandler}
//                       value={newFinanceNote.comment}
//                       showCount={true}
//                       maxLength={255}
//                     />
//                   </Form.Item>
//                   <Form.Item>
//                     <Button
//                       htmlType='submit'
//                       type='primary'
//                       className='addNote_submit_button'
//                       label='Create'
//                       iconPosition='start'
//                       loading={isCreating}
//                     />
//                   </Form.Item>
//                 </div>

//                 <div>
//                   <Form.Item name='type' initialValue={newFinanceNote.type} rules={[{ required: true, message: '' }]}>
//                     <div className='addNote_type_buttons_container'>
//                       <span className='addNote_type_required_mark'>*</span>
//                       <div className='addNote_type_buttons'>
//                         <Button
//                           htmlType='button'
//                           type='primary'
//                           className={`addNote_expense_button ${newFinanceNote.type === 'EXPENSE' ? 'active' : ''}`}
//                           onClick={() => typeOnChangeHandler(NoteType.EXPENSE)}
//                           disabled={newFinanceNote.type === 'EXPENSE'}
//                           label='EXPENSE'
//                         />
//                         <Button
//                           htmlType='button'
//                           type='primary'
//                           className={`addNote_income_button ${newFinanceNote.type === 'INCOME' ? 'active' : ''}`}
//                           onClick={() => typeOnChangeHandler(NoteType.INCOME)}
//                           disabled={newFinanceNote.type === 'INCOME'}
//                           label='INCOME'
//                         />
//                       </div>
//                     </div>
//                   </Form.Item>
//                   <div className='addNote_date_container'>
//                     <span className='addNote_type_required_mark'>*</span>
//                     <Form.Item
//                       name='noteDate'
//                       initialValue={dayjs(newFinanceNote.noteDate)}
//                       rules={[{ required: true, message: '' }]}
//                       style={{ margin: 0 }}
//                     >
//                       <DatePicker
//                         needConfirm={true}
//                         onChange={dateOnChangeHandler}
//                         value={dayjs(newFinanceNote.noteDate)}
//                         showSecond={false}
//                         showTime={true}
//                         placeHolder='Date & Time'
//                       />
//                     </Form.Item>
//                   </div>

//                   {serverError.error ? (
//                     <div className='addNote_error_container'>
//                       <div className='addNote_error_exclamation_mark'>
//                         <span style={{ userSelect: 'none' }}>!</span>
//                       </div>
//                       <Paragraph style={{ margin: 0, color: 'var(--red-color)' }}>{serverError.error}</Paragraph>
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             </Form>
//           </div>
//           <div className='financeNoteCard_container'>
//             <FinanceNoteCard financeNote={editedNote} preview />
//           </div>
//         </div>

//         {!serverError.error ? (
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <Button type='primary' className='edit_modal_save_button' onClick={handleDelete} disabled={isSaving} label='Save' />
//             <Button type='primary' className='edit_modal_no_button' onClick={onClose} disabled={isSaving} label='Cancel' />
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };
