import { ListItemButton, ListItemIcon } from "@mui/material";
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import colorConfigs from "./configs/colorConfigs";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { isAddress } from 'web3-validator';
import MyModal from './components/chainDropdown';
import { BigNumber } from 'bignumber.js';
import assets from "./assets";
import Container from 'react-bootstrap/Container';
import { Tooltip } from 'react-tooltip'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useWriteContract,useWaitForTransactionReceipt, useAccount, useBalance ,useReadContract} from 'wagmi';
import  abi from './utils/abi.json'
import { Box, Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import sizeConfigs from "./configs/sizeConfigs";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import './app.css';
import { ethers } from 'ethers';
import ParentComponent from './components/ParentComponent';
// import polkadotToEthereum from './components/polkadotToEthereum';
import { AccountInfo } from '@polkadot/types/interfaces'

import { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications-component/dist/theme.css'
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import SelectWalletModal from './components/SelectWalletModal'
import {OpenSelectWallet, WalletContext} from './contexts';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api'
const App = () => {
  const [amount, setAmount] = useState('');
  const [addresss, setAddress] = useState('');  
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  console.log({main:walletContext.accounts});
  const navigate = useNavigate();
  const [loaderButton, setloaderButton] = useState(false);
  const [clickedButton, setclickedButton] = useState(false);
  const [HoneyBalance, setHoneyBalance] = useState('Loaded');
  let api: ApiPromise;
  async function getBalanceHoney(address: string) {
    try{

      const provider = new WsProvider('wss://www.devnests.com/blockchain/')
      api = await ApiPromise.create({ provider });
        const account = (await api.query.system.account(address)) as AccountInfo
        const { nonce, data: balance } = account
    
        console.log('Free Balance: ', balance.free.toString())
        console.log('Reserved Balance: ', balance.reserved.toString())
        console.log('Nonce :', nonce.toHuman())
        console.log(' Existential deposit :', api.consts.balances.existentialDeposit.toHuman())
        // Assuming balance.free, balance.reserved, and api.consts.balances.existentialDeposit are strings from API response
        const freeBalance: number = Number(balance.free)
        // console.log(freeBalance)
        console.log(freeBalance)
        const reservedBalance: number = Number(balance.reserved)
        console.log(reservedBalance)
        const existentialDeposit: number = Number(api.consts.balances.existentialDeposit)
        console.log(existentialDeposit)
        const val: number = freeBalance - reservedBalance - existentialDeposit
        // Ensure val is not negative
        let transferableBalance: number = Math.max(val - 1, 0)
        console.log({transferableBalance});
        const divisor = Math.pow(10, 12);
        transferableBalance = transferableBalance / divisor;
      return transferableBalance.toFixed(4);
    }catch(err:any){
      console.log({err});
    }
  }
  const sendTransaction = async(data)=>{

    if(isAddress(addresss)){

    }else{
      toast('Invalid Address')
      return;
    }
    console.log(amount , addresss);
    if(!amount.length || !addresss.length){
      console.log('HWW');
      toast("Address or amount cannot be empty");
    }else{
      setclickedButton(true);
      setloaderButton(true);
      const provider = new WsProvider('wss://www.devnests.com/blockchain/')
      api = await ApiPromise.create({ provider });
      console.log({api});
      // console.log({apia:api})
      // '0x08378D177abD7d8b2EFF37c24E84622118974933'
      const tx = api.tx.recieverModule.transferToTreasury(Number(`${amount}000000000000`), addresss);
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
                setHoneyBalance((prev=> prev - amount));
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
  useEffect(() => {
    if (walletContext.accounts && walletContext.accounts.length > 0 && walletContext.accounts[walletContext.accounts.length-1].address) {
      connectToChain(walletContext.wallet?.provider);
    }
  }, [walletContext.wallet?.provider, walletContext.accounts[walletContext.accounts.length-1]?.address, walletContext.wallet?.signer]);
  let [connectedToHoney,setConnected]= useState(false);
  useEffect(() => {
    if (walletContext.wallet && walletContext.walletType === 'substrate') {
      setConnected(true);
    }
  }, [walletContext]);
  const {address, isConnected} = useAccount();
  const contractAddress = '0x23A91f96A3BA610f0b5268E9448080F4253f7D43';
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: [address],
  });
  let [ethAddress, setEthAddress] = useState<number | string>(0); // Initialize with number or string type
  // Assuming balance and symbol are defined somewhere above in your code
  const balanceNumber = typeof balance === 'string' ? new BigNumber(balance as string) : new BigNumber(balance as number);
  const isBalanceZero = balanceNumber.isEqualTo(0);
// Convert BigNumber to string before setting to ethAddress
// Set ethAddress state directly based on the balance value
useEffect(() => {

    setEthAddress(balanceNumber.toString());

}, [balance]);
  const { data: symbol } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'symbol',
    args: [],
  })
  // const { data, isError, isLoading } = useBalance({
  //   address: address,
  // })
  const setAddressToChain = (address,chainName) => {
    console.log("HIIIIII", chainName, address);
    console.log({chains});
    setChain(() => {
      return chains.map(item => {
        console.log(item.name , chainName);
        if (item.name === chainName) {
          return {
            ...item,
            address: address // Set the address for Honey
          };
        }
        return {
          ...item,
        };
      });
    });
  }

  const connectButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleButtonClick = () => {
    // Check if the ConnectButton ref is available
    if (connectButtonRef.current) {
      // Trigger the click event of the ConnectButton
      connectButtonRef.current.click();
    }
  };
  console.log({isConnected});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpens, setIsModalOpens] = useState(false);
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
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };
  console.log({isConfirming, isConfirmed})
  const [notificationsShown, setNotificationsShown] = useState(false);
  const isValidAddressPolkadotAddress = (address) => {
    try {
      console.log({address});
      encodeAddress(
        isHex(address)
          ? hexToU8a(address)
          : decodeAddress(address)
      );
  
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    if (isPending) {
      setInprogress(0)
    }
  }, [!isPending]);
  
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
    toast(error);
  };
  let toastId;
  let [inpro, setInprogress]= useState<number | string>(0);
  const showConfirmationNotification = () => {
    setInprogress(1);
    toastId = toast("Transaction is in progress", {
      autoClose: false,
    });
  };

  const showSuccessNotification = () => {
    console.log('DONE',Number(ethAddress) - Number(amount));
    setEthAddress(Number(ethAddress) - Number(amount) * 1000000000000);
    toast.dismiss(toastId);
    setInprogress(0);
    toast('Transaction Successful!');
  };
  console.log({isPending}); 
  let CustomIsPending = isPending || isConfirming

  const submit = (obj: any) => {
    console.log({oqo:isValidAddressPolkadotAddress(obj.addresss)})
    if(!isValidAddressPolkadotAddress(obj.addresss)){
      toast('Invalid Address')
      return;
    }
    if(obj.amount.length && obj.addresss.length){
      setInprogress(1);
      console.log(obj.amount , obj.addresss);
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'transferToPolkadot',
        args: [ethers.parseUnits(obj.amount, 12), obj.addresss],
      });
    }else{
      toast('Address or anount must not be empty!');
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const onSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
  };
  const [showModal, setShowModal] = useState(false);
  const [chains, setChain] = useState([{name:"Ethereum", logo:assets.images.eth.default, selected:false, tick:assets.images.tick.default, address:""},{name:"Honey", logo:assets.images.polkadot.default, selected:true, tick:assets.images.tick.default, address:""}])
  console.log({chains});
  const selectedChains = chains.filter(chain => chain.selected);
  console.log({selectedChains});
  const nonSelectedChains = chains.filter(chain => !chain.selected);
  const opposie = ()=>{
    setChain(() => {
      return chains.map(item => ({
        ...item,
        selected: !item.selected // Toggle the selected property
      }));
    });
  }
  useEffect(() => {
    if (address) {
      console.log({address});
      setAddressToChain(address,'Ethereum')
    }
  }, [address]);
  // useEffect(()=>{
  // if(localStorage.getItem('WagmiDisconnected')){
  //   localStorage.clear();
  // }
  // },[localStorage.getItem('WagmiDisconnected')]);
  useEffect(() => {
    if (!isConnected) {
      // console.log({address});
      // localStorage.setItem('WagmiDisconnected','true');
      setAddressToChain('','Ethereum')
    }
  }, [!isConnected]);
  // useEffect(() => {
  //   if (!walletContext.accounts[walletContext.accounts.length-1]?.address) {
  //     // console.log({address});
  //     setAddressToChain('','Honey')
  //   }
  // }, [!walletContext.accounts[walletContext.accounts.length-1]?.address]);
  useEffect(() => {
    if (walletContext.accounts[walletContext.accounts.length-1]?.address) {
      setAddressToChain(walletContext.accounts[walletContext.accounts.length-1]?.address,'Honey')
      getBalanceHoney(walletContext.accounts[walletContext.accounts.length-1]?.address).then((balancee)=>  setHoneyBalance(Number(balancee)));
    }
  }, [walletContext.accounts[walletContext.accounts.length-1]?.address]);
  const shortenAddress = (address) => {
    if (address.length <= 10) return address; // Return full address if it's already short
  
    const firstPart = address.substring(0, 8);
    const lastPart = address.substring(address.length - 8);
  
    return `${firstPart}.....${lastPart}`;
  }
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleConfirm = () => {
    // Handle confirm action
    handleClose();
  };
  const disconnect = () => {
    setAddressToChain('','Honey')
    setHoneyBalance(0);
    localStorage.removeItem('wallet-type');
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
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  return (
    <>
    <div className="modal">
      <div className="modal-content" style={{backgroundColor:"#020412"}}>
        <span className="close">&times;</span>
        {/* {children} */}
      </div>
    </div>
    <ToastContainer />
    {/* NAVAR */}
    <Navbar expand="lg" style={{backgroundColor: "rgba(0,0,0,0.0)", color:"white", borderBottom:"1px solid #2f3645"}}>
      <Container>
        <Navbar.Brand href="#" style={{color:"white", fontWeight:"900"}}>
          <img src={assets.images.polkadot.default} style={{width:"25px", marginRight:"10px"}}></img>
          HIVVE BRIDGE</Navbar.Brand>
        <Navbar.Toggle style={{backgroundColor:"white"}} aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          {
  selectedChains[0]['name'] === 'Honey' ?
  !walletContext.wallet &&   <Button style={{backgroundColor:"#5f894d", borderRight:"2px solid #5f894d",color:"white", borderBottom:"2px solid #5f894d"}} onClick={selectWallet.open}>Connect Wallet</Button>
            :
            <ConnectButton.Custom>
  {({
    account,
    chain,
    openAccountModal,
    openChainModal,
    openConnectModal,
    authenticationStatus,
    mounted,
  }) => {
    // Note: If your app doesn't use authentication, you
    // can remove all 'authenticationStatus' checks
    
    const ready = mounted && authenticationStatus !== 'loading';
    const connected =
      ready &&
      account &&
      chain &&
      (!authenticationStatus ||
        authenticationStatus === 'authenticated');
    // connected && setAddressToChain(account?.address,selectedChains[0]['address']);
    if(connected){
      // Disconnect logic
    authenticationStatus = undefined;
    }
    return (
      <div
        {...(!ready && {
          'aria-hidden': true,
          'style': {
            opacity: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          },
        })}
      >
        {(() => {
          if (!connected) {
            return (
              <button onClick={openConnectModal} type="button" className="connectButtonAnother">
                Connect Wallett
              </button>
            );
          }

          if (chain.unsupported) {
            return (
              <button onClick={openChainModal} type="button">
                Wrong network
              </button>
            );
          }

          return (
            <div style={{ display: 'flex', gap: 12 }}>
              {/* <button
                onClick={openChainModal}
                style={{ display: 'flex', alignItems: 'center' }}
                type="button"
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginRight: 4,
                    }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        style={{ width: 12, height: 12 }}
                      />
                    )}
                  </div>
                )}
                {chain.name}
              </button> */}

              <button onClick={openAccountModal} type="button"  className="btn btn-primary">
                {"Disconnect"}
                {/* {account.displayName}
                {account.displayBalance
                  ? ` (${account.displayBalance})`
                  : ''} */}
              </button>
            </div>
          );
        })()}
      </div>
    );
  }}
</ConnectButton.Custom>
          }
      {
        selectedChains[0]['name'] === 'Honey' && walletContext.wallet &&             <Button
        style={{marginLeft:"20px"}}
        className='sub-wallet-btn sub-wallet-btn-small-size'
        onClick={disconnect.bind(null, {})}
        type={'primary'}
      >DIsconnect</Button>
      }

        </Navbar.Collapse>
      </Container>
    </Navbar>
    

    <Tooltip id="my-tooltip" />
    <div className="mainContent" style={{margin:"8% 38%"}}>
      {/* <p>{balance}</p> */}
    <p className="text-center mt-3" style={{fontSize:"40px", fontWeight:"900"}}>Bridge Token Anytime</p>

      <div className="mainHeading">
        {/* <p className="m-0" style={{fontSize:"22px", fontWeight:"900"}}>Transfer</p> */}

        {selectedChains[0]['name'] === 'Ethereum' ? 

        <div style={{fontSize:"20px",  borderRadius:"20px"}}>
          <p className="m-0">Balance</p>
          <p style={{fontSize:"30px"}}>
            
          {isBalanceZero ? 
        '0' :
        `${new BigNumber(ethAddress as string).dividedBy(1e12).toFixed(4) === 'NaN' ?'---': new BigNumber(ethAddress as string).dividedBy(1e12).toFixed(4)} ${symbol}`
      }
          </p> 
        </div>
        
        :HoneyBalance === 'Loaded'? 
        <div style={{fontSize:"20px",  borderRadius:"20px"}}>
          <p className="m-0">Balance</p>
          <p style={{fontSize:"30px"}}>{`...`}</p>
        </div>:<div style={{fontSize:"20px",  borderRadius:"20px"}}>
          <p className="m-0">Balance</p>
          <p style={{fontSize:"30px"}}>{`${walletContext.accounts[walletContext.accounts.length-1]?.address?HoneyBalance:'---'} HNY`}</p>
        </div>
        }

        <div className="d-flex align-items-center mb-3">
        {selectedChains[0]['address'].length ? 
        <div style={{backgroundColor:"#2ef704", width:"10px", height:"10px", borderRadius:"50%", marginRight:"10px"}}></div>:
        <div style={{backgroundColor:"#fdff0f", width:"10px", height:"10px", borderRadius:"50%", marginRight:"10px"}}></div>
        }
          
          <a data-tooltip-id="my-tooltip" data-tooltip-content={selectedChains[0]['address']}>
            <p className="m-0">{selectedChains[0]['address'].length? shortenAddress(selectedChains[0]['address']): 'Not Connected'}</p>
          </a>
        </div>
        {
          selectedChains.map(item=>(
            <div className="content">
            <div className="innerHeadingLeft" style={{backgroundColor:"#222938", padding:"15px 10px", borderRadius:"10px 10px 0px 0px"}}>
              <img src={item.logo} style={{width:"40px"}}></img>
              <div>
                <p className="m-0 froms">From</p>
                <div className="d-flex drops dropdown" onClick={handleShow}>
                  <p className="m-0">{item.name}</p>
                  <img src={assets.images.arrow.default} style={{width:"20px"}}></img>
                </div>
              </div>
            </div>
            <div className="innerHeadingLeft d-flex justify-content-between" style={{backgroundColor:"#222938",  padding:"15px 10px 20px 10px", borderRadius:"0px 0px 10px 10px"}}>
              <input type="number" className="Inputs"  placeholder="0" onChange={handleAmountChange} value={amount}></input>          
              <div className="d-flex align-items-center">
                <img src={assets.images.polkadot.default} style={{width:"24px", marginRight:"10px"}}></img>
                <p className="m-0">HONEY</p>
              </div>
            </div>
            </div>
          ))
        }
        <img className="chnage" src={assets.images.downarrow.default} style={{backgroundColor:"#222938", width:"45px", padding:"5px", borderRadius:"50%", border:"2px solid #141925", position:"absolute", left:"50%", transform:"translate(-50%, -50%)"}} onClick={opposie}></img>
        <div className="content">
        <div className="innerHeadingLeft" style={{backgroundColor:"#222938", padding:"15px 10px", borderRadius:"10px 10px 0px 0px"}}>
          <img src={nonSelectedChains[0].logo} style={{width:"40px"}}></img>
          <div>
            <p className="m-0 froms">To</p>
            <div className="d-flex drops">
              <p className="m-0">{nonSelectedChains[0].name}</p>
              {/* <img src={assets.images.arrow} style={{width:"20px"}}></img> */}
            </div>
          </div>
        </div>
        <div className="innerHeadingLeft d-block" style={{backgroundColor:"#222938",  padding:"15px 10px 20px 10px", borderRadius:"0px 0px 10px 10px"}}>
        <input type="text" className="Inputs w-100 addressInput" placeholder="Address" value={addresss} onChange={handleAddressChange}></input>
        <div className=" d-flex justify-content-between">
        <input type="number" className="Inputs" placeholder="0"  value={amount} disabled></input>          
          <div className="d-flex align-items-center">
            <img src={assets.images.polkadot.default} style={{width:"24px", marginRight:"10px"}}></img>
            <p className="m-0">HONEY</p>
          </div>
        </div>
        </div>
        </div>
{
  selectedChains[0]['name'] === 'Honey' ?
  !walletContext.accounts[walletContext.accounts.length-1]?.address ?
<button  style={{backgroundColor:"#5f894d", width:"100%", borderRight:"2px solid #5f894d", borderBottom:"4px solid #5f894d", padding:"10px 0px", fontSize:"20px",color:"white", borderRadius:"10px"}}       onClick={selectWallet.open}>Connect Wallet</button>
:
<button  style={{backgroundColor:"#5f894d", width:"100%", borderRight:"2px solid #5f894d", borderBottom:"4px solid #5f894d", padding:"10px 0px", fontSize:"20px", color:"White", borderRadius:"10px"}}  onClick={sendTransaction.bind(null, {address:walletContext.accounts[walletContext.accounts.length-1]?.address, signer:walletContext.wallet?.signer})}>Transfer</button>:''
}

      {
          selectedChains[0]['name'] === 'Ethereum' ? isConnected ? <button disabled={inpro ===1? true: false} style={{backgroundColor:"#5f894d", width:"100%", borderRight:"2px solid #5f894d", borderBottom:"4px solid #5f894d", padding:"10px 0px", fontSize:"20px", color:"White", borderRadius:"10px"}} onClick={submit.bind(null,{amount,addresss})}>{inpro ===1? 'Progress...':'Transfer'}</button>
        : 
<ConnectButton.Custom>
  {({
    account,
    chain,
    openAccountModal,
    openChainModal,
    openConnectModal,
    authenticationStatus,
    mounted,
  }) => {
    // Note: If your app doesn't use authentication, you
    // can remove all 'authenticationStatus' checks
    const ready = mounted && authenticationStatus !== 'loading';
    const connected =
      ready &&
      account &&
      chain &&
      (!authenticationStatus ||
        authenticationStatus === 'authenticated');

    return (
      <div
        {...(!ready && {
          'aria-hidden': true,
          'style': {
            opacity: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          },
        })}
      >
        {(() => {
          if (!connected) {
            return (
              <button onClick={openConnectModal} type="button" className="connectButton">
                Connect Wallet
              </button>
            );
          }

          if (chain.unsupported) {
            return (
              <button onClick={openChainModal} type="button">
                Wrong network
              </button>
            );
          }

          return (
            <div style={{ display: 'flex', gap: 12 }}>
              {/* <button
                onClick={openChainModal}
                style={{ display: 'flex', alignItems: 'center' }}
                type="button"
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginRight: 4,
                    }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        style={{ width: 12, height: 12 }}
                      />
                    )}
                  </div>
                )}
                {chain.name}
              </button> */}

              {/* <button onClick={openAccountModal} type="button">
                {account.address}
                {account.displayBalance
                  ? ` (${account.displayBalance})`
                  : ''}
              </button> */}
            </div>
          );
        })()}
      </div>
    );
  }}
</ConnectButton.Custom>
:""
      }
          

      </div>
      {/* <p className="text-center mt-3" style={{fontSize:"20px"}}>HIVVE BRIDGE</p> */}
    </div>
    <MyModal
        show={showModal}
        onHide={handleClose}
        onConfirm={handleConfirm}
        title="Select chain"
        content={chains}
        setChain={setChain}
        setShowModal={setShowModal}
    />
{/* <ConnectButton label="HELLO" /> */}
    {/* <ParentComponent isConnected={isConnected}  submit={submit} isPending={CustomIsPending} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    {/* <SelectWalletModal theme={'dark'} /> */}

    
    {/* <button style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px"}} onClick={openModal}>Ethereum TO Honey</button> */}
    {/* <button
     style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px", fontSize:"14px", marginLeft:"20px"}}
      // onClick={selectWallet.open}
    >Select Wallet</button> */}

  </>
  );
};

export default App;
