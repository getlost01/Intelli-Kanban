import '../styles/globals.css'
import type { AppProps } from 'next/app'
// redux
import { Provider } from 'react-redux';
// redux
import { store } from '../redux/store';
// theme
import ThemeProvider from '../src/theme';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (

        <Provider store={store}>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
  );
}

