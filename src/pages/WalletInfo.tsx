// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet } from '../../src/wallet-connect/src/types';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from 'react-notifications-component'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AccountList from '../components/AccountList';
import WalletMetadata from '../components/WalletMetadata';
import { WalletContext } from '../contexts';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api'


require('./WalletInfo.css');

function WalletInfo (): React.ReactElement {
  const walletContext = useContext(WalletContext);
  console.log({walletContext});
  const [address, setAddress] = useState('');
  const [loaderButton, setloaderButton] = useState(false);
  const [clickedButton, setclickedButton] = useState(false);
  const [amount, setAmount] = useState('');
  let api: ApiPromise;
  const sendTransaction = async(data)=>{


    console.log(!amount.length || !address.length);
    if(!amount.length || !address.length){
      console.log('HWW');
      toast("Address or amount cannot be empty");
    }else{
      setclickedButton(true);
      setloaderButton(true);
      const provider = new WsProvider('wss://www.devnests.com/blockchain/')
      api = await ApiPromise.create({ provider });
      console.log({api});
      console.log({apia:api})
      // '0x08378D177abD7d8b2EFF37c24E84622118974933'
      const tx = api.tx.recieverModule.transferToTreasury(Number(`${amount}000000000000`), address);
      await tx.signAndSend(data.address, { signer: data.signer }, ({ status }) => {
        console.log({status});
        if (status.isInBlock) {
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        } else {
              let toastId;
              if(status.type === 'Ready'){
                toast('Ready');
              }
              if(status.type === 'Broadcast'){
                toastId = toast("Transaction is in progress", {
                  autoClose: false,
                });
              }
              if(status.type === 'Finalized'){
                 // Close the toast after a delay (e.g., 5 seconds)
                toast.dismiss(toastId);
                toast('Transaction Finalized...');
                setclickedButton(false);
                setloaderButton(false);
              }
            console.log(`Current status: ${status.type}`);
        }
   
  }).catch((error: any) => {
      console.log(':( transaction failed', error);
  });
  }
}
  async function connectToChain(provider) {
    // console.log('INNER')
    // try{
    //   const provider = new WsProvider('wss://www.devnests.com/blockchain/')
    //   api = await ApiPromise.create({ provider });
    //   console.log({api});
    // }catch(err){
    //   console.log({err})
    // }
  }


  const handleAddressChange = (event) => {
      setAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
      setAmount(event.target.value);
  };
  useEffect(() => {
    if (walletContext.accounts && walletContext.accounts.length > 0 && walletContext.accounts[walletContext.accounts.length-1].address) {
      connectToChain(walletContext.wallet?.provider);
    }
  }, [walletContext.wallet?.provider, walletContext.accounts[walletContext.accounts.length-1]?.address, walletContext.wallet?.signer]);

  return <>
    {/* <ReactNotifications/> */}
    <ToastContainer />
  <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      {/* <div className='wallet-info-page__text'>Version: {(walletContext?.wallet as Wallet)?.extension?.version}</div> */}
      {/* <div className='wallet-info-page__text'>Account List</div> */}
      {/* <h1>{ walletContext.accounts[0] ? walletContext.accounts[0].address: ''}</h1> */}
      <h3>Enter Address</h3>
            <input
                type="text"
                className='Address'
                placeholder='Enter Address Here'
                value={address}
                onChange={handleAddressChange}
            />
            <h3>Enter Amount</h3>
            <input
                type="text"
                className='Address Amount'
                placeholder='Enter Amount'
                value={amount}
                onChange={handleAmountChange}
            />
                <div className='buttons' style={{ marginTop: "20px" }}>
                  <button className={`loading-button ${loaderButton ? 'loading' : ''}`}disabled={clickedButton} onClick={sendTransaction.bind(null, {address:walletContext.accounts[walletContext.accounts.length-1]?.address, signer:walletContext.wallet?.signer})}>
        <span>Submit</span>
        <div className="loader"></div>
      </button>
                </div>
      {/* <div className='wallet-info-page__text'>Metadata</div> */}
      {/* <WalletMetadata /> */}
    </div>
  </div>
  </>
}

export default WalletInfo;
