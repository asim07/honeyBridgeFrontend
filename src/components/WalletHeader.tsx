// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React, { useContext } from 'react';

import { OpenSelectWallet, WalletContext } from '../contexts';
import { getWalletBySource } from '../wallet-connect/src/dotsama/wallets';
import { useNavigate } from 'react-router-dom';

require('./WalletHeader.css');

interface Props {
  visible?: boolean
}

function WalletHeader ({ visible }: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);
  const wallet = walletContext.wallet || walletContext.evmWallet;
  console.log({ahah:wallet})
  const navigate = useNavigate()
  const disconnect = (wallet) => {
    localStorage.clear();
    console.log('localStorage cleared!');
    
    if ((walletContext as any).setAccounts) {
      (walletContext as any).setAccounts([]);
      // (walletContext as any).setWalletType('');
      // (walletContext as any).setWalletKey('');
    }
    if ((walletContext as any).setWallet) {
      (walletContext as any).setWallet('ajja','aa',true);
      // (walletContext as any).setWalletType('');
      // (walletContext as any).setWalletKey('');
    }
    
  };
  
  
    
  if (!visible) {
    return (<></>);
  }

  return (<header className={'wallet-header-wrapper'}>
    <div className={'boxed-container'}>
      <div className={'wallet-header-content'}>
        <div>
          <img
            alt={wallet?.logo?.alt}
            className={'wallet-logo'}
            src={wallet?.logo?.src}
          />
        </div>
        <div className={'wallet-title'}>
          {wallet?.title}
        </div>
        <div className='spacer' />
        <Button
          className='sub-wallet-btn sub-wallet-btn-small-size'
          onClick={selectWallet.open}
          type={'primary'}
        >Select Wallet</Button>
        <Button
          style={{marginLeft:"20px"}}
          className='sub-wallet-btn sub-wallet-btn-small-size'
          onClick={disconnect.bind(null, {wallet, extension:'substrate'})}
          type={'primary'}
        >DIsconnect</Button>
      </div>
    </div>
  </header>);
}

export default WalletHeader;
