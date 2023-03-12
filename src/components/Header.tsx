import { Avatar, Button, Container, Group, Text, Tooltip } from '@mantine/core';
import type { NextComponentType, NextPageContext } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header: NextComponentType<NextPageContext> = () => {
  const { data: sessionData } = useSession();
  return (
    <Container fluid px={2} py={2} c='white' bg='indigo'>
      <Group position='apart' p={10}>
        <Text size='md'>
          {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ''}
        </Text>
        {sessionData?.user ? (
          <Tooltip label='Log Out'>
            <Avatar
              style={{ cursor: 'pointer' }}
              onClick={() => void signOut()}
              radius='xl'
              variant='outline'
              size='sm'
              src={sessionData?.user?.image ?? ''}
              alt={sessionData?.user?.name ?? ''}
            />
          </Tooltip>
        ) : (
          <Button color='lime' onClick={() => void signIn()}>
            Sign in
          </Button>
        )}
      </Group>
    </Container>
  );
};

export default Header;
