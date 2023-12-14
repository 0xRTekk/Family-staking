// NPM
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { hardhat, goerli, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// import { alchemyProvider } from 'wagmi/providers/alchemy';

// LOCAL
import store from './store';
import App from './App';

// ASSETS
import 'semantic-ui-css/semantic.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

// CONSTANTS
const { chains, publicClient } = configureChains(
  [hardhat, goerli, sepolia],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    // Use the user's wallet provider if they have one
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Family Staking',
  projectId: 'e17d7fec452e48fa9c0044b702f63899',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
    </Provider>
  </BrowserRouter>
);
