import { ChildrenProps } from 'react';

import { ChakraProvider, theme } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';

import { type RootState, configureAppStore } from '@/app/redux/store';

type AppRenderOption = Parameters<typeof render>[1] & {
  preloadedState?: DeepPartial<RootState>;
};

export const appRender = (
  ui: JSX.Element,
  { preloadedState, ...options }: AppRenderOption = {},
) => {
  const AppProvider = ({ children }: ChildrenProps) => (
    <ReduxProvider store={configureAppStore(preloadedState)}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ReduxProvider>
  );

  return render(ui, { wrapper: AppProvider, ...options });
};

export const themeRender = (
  ui: JSX.Element,
  { preloadedState, ...options }: AppRenderOption = {},
) => {
  const AppProvider = ({ children }: ChildrenProps) => (
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
  );

  return render(ui, { wrapper: AppProvider, ...options });
};
