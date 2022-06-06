import { Container, Heading } from '@chakra-ui/react';
import Head from 'next/head';

import PertTable from '@/features/pert/PerTable';

const Home = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>PERT Analysis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        as="main"
        display="flex"
        flexDir="column"
        py="12"
        h="full"
        maxWidth="container.lg"
        centerContent
      >
        <Heading as="h1">PERT Analysis</Heading>
        <PertTable />
      </Container>
    </>
  );
};

export default Home;
