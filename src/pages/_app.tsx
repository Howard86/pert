import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';

import store from '@/app/redux/store';
import theme from '@/app/theme';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
  require('../../mocks');
}

const App = ({ Component, pageProps }: AppProps) => (
  <ReduxProvider store={store}>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </ReduxProvider>
);

export default App;
