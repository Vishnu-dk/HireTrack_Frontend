import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react'; 
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}> 
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);