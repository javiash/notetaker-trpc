import { Input, Paper } from '@mantine/core';
import type { NextComponentType, NextPageContext } from 'next';
import { useState } from 'react';

interface Props {
  onSave?: (note: { title: string; content: string }) => void;
}

const NoteEditor: NextComponentType<NextPageContext, null, Props> = ({
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  return (
    <Paper w='100%'>
      <Input onChange={(e) => setTitle(e.target.value)} />
    </Paper>
  );
};

export default NoteEditor;
