import { Button, Divider, Input, Paper, Stack, Textarea } from '@mantine/core';
import type { NextComponentType, NextPageContext } from 'next';
import { useState } from 'react';

interface Props {
  onSave: (note: { title: string; content: string }) => void;
  selectedTopic?: string;
}

const NoteEditor: NextComponentType<NextPageContext, null, Props> = ({
  onSave,
  selectedTopic,
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  return (
    <Paper h='100%' w='100%' withBorder p={20} my={0}>
      <Stack justify='space-between' h='100%'>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
        />
        <Divider />
        <Textarea
          minRows={10}
          value={content}
          placeholder='Note content'
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          size='md'
          ml='auto'
          onClick={() => {
            onSave({ title, content });
            setContent('');
            setTitle('');
          }}
          disabled={!selectedTopic || !title || !content}
        >
          Save
        </Button>
      </Stack>
    </Paper>
  );
};

export default NoteEditor;
