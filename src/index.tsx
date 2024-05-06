import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import './check.css';  // Your global styles
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { getDefaultConfig, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import Layout from './components/Layout';
import { sepolia } from 'wagmi/chains';
import { ReactNotifications } from 'react-notifications-component'
import { Store } from 'react-notifications-component'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletContextProvider } from '../src/providers/WalletContextProvider';
import WalletInfo from './pages/WalletInfo';
// const myCustomTheme: Theme = {
//   blurs: {
//       modalOverlay: '10px', // Example blur value for modal overlay
//   },
//   colors: {
//       accentColor: '#FFA500', // Example accent color
//       accentColorForeground: '#FFFFFF', // Example accent color foreground
//       // Add other color values here...
//   },
//   fonts: {
//       body: 'Arial, sans-serif', // Example font for body text
//       // Add other font values here...
//   },
//   radii: {
//       actionButton: '4px', // Example border radius for action buttons
//       // Add other border radius values here...
//   },
//   shadows: {
//       connectButton: '0 2px 4px rgba(0, 0, 0, 0.1)', // Example shadow for connect button
//       // Add other shadow values here...
//   },
// };


const config = getDefaultConfig({
  appName: 'Honey Protocol',
  projectId: '52f64f87d27a882c628b4ccd1553f615',
  chains: [
    sepolia
  ],
});

const root = document.getElementById('root') as HTMLElement;

const queryClient = new QueryClient();

ReactDOM.render(
  <WalletContextProvider >
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
  </WalletContextProvider>,
  root
);


reportWebVitals();
