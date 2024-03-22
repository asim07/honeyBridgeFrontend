import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract,useWaitForTransactionReceipt } from 'wagmi';
import  abi from './utils/abi.json'
import { ethers } from 'ethers';
import ParentComponent from './components/ParentComponent';
import PolkadotToEtheriem from './components/PolkadotToEtheriem';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component'
import { Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const contractAddress = '0x23A91f96A3BA610f0b5268E9448080F4253f7D43';
  const openModals  = () => {
    setIsModalOpens(true);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const { 
    data: hash, 
    isPending, 
    error,
    writeContract 
  } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
  useWaitForTransactionReceipt({ 
    hash, 
  })
  console.log({isConfirming, isConfirmed})
  const [notificationsShown, setNotificationsShown] = useState(false);

  useEffect(() => {
    if (isConfirming) {
      showConfirmationNotification();
      setNotificationsShown(true);
    }
  }, [isConfirming]);
  useEffect(() => {
    if (error) {
      showErrorNotification(error);
      setNotificationsShown(true);
    }
  }, [error]);
  useEffect(() => {
    if (isConfirmed) {
      showSuccessNotification();
      setNotificationsShown(true);
    }
  }, [isConfirmed]);

  const showErrorNotification  = (error: any) => {
    Store.addNotification({
      title: error,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
      },
    });
  };
  const showConfirmationNotification = () => {
    Store.addNotification({
      title: 'Transaction is in Progress..',
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
      },
    });
  };

  const showSuccessNotification = () => {
    Store.addNotification({
      title: 'Transaction Successful!',
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
      },
    });
  };
  console.log({isPending}); 
  let CustomIsPending = isPending || isConfirming
  const submit = (amount: string, address: string) => {
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'transferToPolkadot',
      args: [ethers.parseUnits(amount, 12), address],
    });
  };
  
  return (
    <>
    <ReactNotifications/>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
      <PolkadotToEtheriem  submit={submit} isPending={CustomIsPending} isModalOpen={isModalOpens} setIsModalOpen={setIsModalOpens} />      
      <ParentComponent  submit={submit} isPending={CustomIsPending} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />      
      <button onClick={openModal}>ETHERIUM TO POLKADOT</button>
      <button onClick={openModals}>POLKADOT TO ETHERIUM</button>
    </div>
    </>
  );
};

export default App;
