import { Button, Container, Divider, Group, Input, List } from '@mantine/core';
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

  return (
    <Container p={10}>
      <Group position='apart'>
        <Container miw={'20%'} m={0} p={0}>
          <List center icon={<></>}>
            {topics?.map((topic) => {
              return (
                <List.Item key={topic.id}>
                  <Button
                    w={200}
                    variant='default'
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic.title}
                  </Button>
                </List.Item>
              );
            })}
          </List>
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
        <Container miw={'60%'} m={0} p={0}>
          <NoteEditor />
        </Container>
      </Group>
    </Container>
  );
};

export default Content;
