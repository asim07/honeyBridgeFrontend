import '@rainbow-me/rainbowkit/styles.css';
// import './polyfills';
// import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import Layout from './components/Layout';
import {
  sepolia,
} from 'wagmi/chains';
import { ReactNotifications } from 'react-notifications-component'
import { Store } from 'react-notifications-component'

import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletContextProvider } from '../src/providers/WalletContextProvider';
import WalletInfo from './pages/WalletInfo';
import './index.css'
const config = getDefaultConfig({
  appName: 'Honey Protocol',
  projectId: '52f64f87d27a882c628b4ccd1553f615',
  chains: [
    sepolia
  ],
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Store.addNotification({
//   title: 'aa',
//   type: "danger",
//   insert: "top",
//   container: "top-right",
//   animationIn: ["animate__animated", "animate__fadeIn"],
//   animationOut: ["animate__animated", "animate__fadeOut"],
//   dismiss: {
//     duration: 5000,
//   },
// });
const queryClient = new QueryClient();

root.render(
  <WalletContextProvider>
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Router>
              <Routes>
              <Route
            element={<Layout />}
            path='/'
          >
            <Route
              element={<App />}
              index
            />
                <Route
                  element={<WalletInfo />}
                  path='/wallet-info'
                />
                </Route>
              </Routes>
            </Router>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  </WalletContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
