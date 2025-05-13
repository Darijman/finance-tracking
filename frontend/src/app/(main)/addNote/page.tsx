'use client';

import { AddNoteForm } from './addNoteForm/AddNoteForm';
import { Typography } from 'antd';

const { Title } = Typography;

const AddNote = () => {
  return (
    <div>
      <Title level={1} style={{ textAlign: 'center', margin: '0px 0px 20px 0px' }}>
        Add Note
      </Title>
      <AddNoteForm />
    </div>
  );
};

export default AddNote;
