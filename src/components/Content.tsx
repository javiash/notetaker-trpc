import {
  Accordion,
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Input,
  ScrollArea,
  Stack,
} from '@mantine/core';
import type { NextComponentType, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import NoteEditor from './NoteEditor';

type Topic = RouterOutputs['topic']['getAll'][0];

const Content: NextComponentType<NextPageContext> = () => {
  const { data: sessionData } = useSession();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? '',
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const deleteNotesFromTopic = (topicId: string) => {
    notes
      ?.filter((note) => note.topicId === topicId)
      .forEach((note) => {
        deleteNote.mutate({ id: note.id });
      });
  };

  return (
    <Stack w='100%' px={50} pt={20}>
      <Group position='center' align='flex-start'>
        <Container miw={'20%'} p={0}>
          <ScrollArea.Autosize mah={'38vh'}>
            <Stack spacing={2}>
              {topics?.map((topic) => {
                return (
                  <Group key={topic.id} noWrap spacing={0}>
                    <ActionIcon
                      color='red'
                      onClick={() => {
                        deleteNotesFromTopic(topic.id);
                        deleteTopic.mutate({ id: topic.id });
                        if (selectedTopic?.id === topic.id)
                          setSelectedTopic(null);
                      }}
                    >
                      x
                    </ActionIcon>
                    <Button
                      w='90%'
                      variant={
                        selectedTopic?.id === topic.id ? 'filled' : 'default'
                      }
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic.title}
                    </Button>
                  </Group>
                );
              })}
            </Stack>
          </ScrollArea.Autosize>
          <Divider my={10} />
          <Input
            type='text'
            placeholder='New Topic'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                createTopic.mutate({
                  title: e.currentTarget.value,
                });
                e.currentTarget.value = '';
              }
            }}
          />
        </Container>
        <Container h={'100%'} miw={'70%'} m={0} p={0}>
          <NoteEditor
            onSave={({ title, content }) => {
              void createNote.mutate({
                title,
                content,
                topicId: selectedTopic?.id ?? '',
              });
            }}
            selectedTopic={selectedTopic?.id}
          />
        </Container>
      </Group>
      <Divider my={15} />
      <Stack mb={20}>
        <Accordion
          variant='contained'
          radius='md'
          styles={{
            label: { fontWeight: 'bold' },
            panel: { whiteSpace: 'pre' },
          }}
        >
          {notes?.map((note) => (
            <Accordion.Item key={note.id} value={note.id}>
              <Accordion.Control>{note.title}</Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  {note.content}
                  <Button
                    size='xs'
                    color='orange'
                    ml='auto'
                    onClick={() => deleteNote.mutate({ id: note.id })}
                  >
                    Delete
                  </Button>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>
    </Stack>
  );
};

export default Content;
