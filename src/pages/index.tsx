import styles from './index.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import Header from '~/components/Header';
import Content from '~/components/Content';
import { Container } from '@mantine/core';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <Head>
        <title>Notetaker-trpc</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container m={0}>
        <Header />
        <Content />
      </Container>
    </>
  );
};

export default Home;
