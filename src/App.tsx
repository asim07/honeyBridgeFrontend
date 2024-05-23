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
  const [clickedEthButton, setclickedEthTransfer] = useState(false);
  const [HoneyBalance, setHoneyBalance] = useState<any>('Loaded');
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
  const sendTransaction = async(data: any)=>{

    if(isAddress(addresss)){

    }else{
      toast('Invalid Address')
      return;
    }
    setloaderButton(true);
    console.log(amount , addresss);
    if(!amount.length || !addresss.length){
      console.log('HWW');
      toast("Address or amount cannot be empty");
    }else{
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
                toastId = toast("Transaction is in progress", {
                  autoClose: false,
                });
                setloaderButton(true)
              }
              if(status.type === 'Broadcast'){
                setloaderButton(true)
              }
              if(status.type === 'Finalized'){
                 // Close the toast after a delay (e.g., 5 seconds)
                toast.dismiss(toastId);
                setAmount('');
                setAddress('');
                toast('Transaction Finalized...');
                setHoneyBalance((prev: number) => prev - Number(amount));
                setclickedButton(false);
                setloaderButton(false);
              }
            console.log(`Current status: ${status.type}`);
        }
   
  }).catch((error: any) => {
      setloaderButton(false);
      console.log(':( transaction failed', error);
  });
  }
}
  async function connectToChain(provider: any) {
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
    args: [address || ""],
  });
  console.log({checkEthBalance:balance});
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
  const setAddressToChain = (address: any,chainName: any) => {
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
  const isValidAddressPolkadotAddress = (address: any) => {
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
    if (!isPending) {
      setclickedEthTransfer(false);
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
      setclickedEthTransfer(false);
      showSuccessNotification();
      setNotificationsShown(true);
    }
  }, [isConfirmed]);

  const showErrorNotification  = (error: any) => {
    toast(error);
  };
  let toastId: any;
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
    if(!isValidAddressPolkadotAddress(obj.addresss)){
      toast('Invalid Address')
      return;
    }
    if(obj.amount.length && obj.addresss.length){
      setclickedEthTransfer(true);
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
  const [chains, setChain] = useState([{name:"Ethereum", logo:assets.images.eth, selected:false, tick:assets.images.tick, address:""},{name:"Honey", logo:assets.images.polkadot, selected:true, tick:assets.images.tick, address:""}])
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
  const shortenAddress = (address: any) => {
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
    <Navbar expand="lg" style={{backgroundColor: "#2673fa", color:"white", borderBottom:"1px solid #2f3645"}}>
      <Container>
        <Navbar.Brand href="#" style={{color:"white", fontWeight:"900"}}>
          <img src={assets.images.polkadot} style={{width:"35px",borderRadius:"50%", marginRight:"10px", backgroundColor:"white"}}></img>
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
  !walletContext.wallet &&   <Button style={{backgroundColor:"white", borderRight:"2px solid #2673fa",color:"#2673fa", borderBottom:"2px solid #2673fa"}} onClick={selectWallet.open}>Connect Wallet</Button>
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

              <button onClick={openAccountModal} type="button"  className="btn btn-primary connectButtonAnother">
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
        className='sub-wallet-btn sub-wallet-btn-small-size connectButtonAnothers'
        onClick={disconnect}
        type={'primary'}
      >DIsconnect</Button>
      }

        </Navbar.Collapse>
      </Container>
    </Navbar>
    

    <Tooltip id="my-tooltip" />
    <div className="mainContent" style={{margin:"2% 38%", padding:"20px", borderRadius:"10px"}}>
      {/* <p>{balance}</p> */}
    <div className="text-center">
      <img  src={assets.images.bridge} style={{width:"90px"}} alt="image"></img>
    </div>
    <p className="text-center mt-3 checkIntoHeading" style={{fontSize:"30px", fontWeight:"900"}}>Cross-Bridge Connection</p>
    <div className="d-flex align-items-center mb-3">
   

        {selectedChains[0]['address'].length ? 
        <div style={{backgroundColor:"#2ef704", width:"10px", height:"10px", borderRadius:"50%", marginRight:"10px"}}></div>:
        <div style={{backgroundColor:"#fdff0f", width:"10px", height:"10px", borderRadius:"50%", marginRight:"10px"}}></div>
        }
          
          <a data-tooltip-id="my-tooltip" data-tooltip-content={selectedChains[0]['address']}>
            <p className="m-0">{selectedChains[0]['address'].length? shortenAddress(selectedChains[0]['address']): 'Not Connected'}</p>
          </a>
        </div>
      <div className="mainHeading" style={{backgroundColor:"white", padding:"20px", borderRadius:"10px"}}>
        {/* <p className="m-0" style={{fontSize:"22px", fontWeight:"900"}}>Transfer</p> */}

        
        {
          selectedChains.map(item=>(
            <div className="content">
            <div className="innerHeadingLeft" style={{backgroundColor:"#ececec", padding:"15px 15px", borderRadius:"10px 10px 0px 0px"}}>
              <h4 style={{fontWeight:"370", letterSpacing:"1px"}}>Pay</h4>
            </div>
            <div className="innerHeadingLeft d-flex justify-content-between" style={{backgroundColor:"#ececec",  padding:"0px 10px 0px 10px", borderRadius:"0px 0px 10px 10px"}}>
              <input type="number" className="Inputs"  placeholder="Enter amount" onChange={handleAmountChange} value={amount}></input>
              
              <div className="d--column-flex align-items-center" style={{ transform:"translate(0%,-20%)"}}>
              
              <div className="d-flex dropdown" onClick={handleShow} style={{backgroundColor:"white", width:"160px", color:"black", padding:"10px 30px 10px 20px", borderRadius:"15px"}}>
                <img src={item.logo} className="logoOfChain" style={{width:"35px", height:"35px"}}></img>
              
                <div className="d-flex drops">
                  <p className="m-0 chainNames" style={{fontSize:"22px"}}>{item.name === 'Honey'? 'HIVVE':"ETH"}</p>
                </div>
              </div>
        {selectedChains[0]['name'] === 'Ethereum' ? 

<div style={{fontSize:"20px",  borderRadius:"20px"}}>
  {/* <p className="m-0">Balance</p> */}
  <p style={{fontSize:"18px", marginTop:"10px"}}>
    
  {isBalanceZero ? 
'0' :
`${new BigNumber(ethAddress as string).dividedBy(1e12).toFixed(4) === 'NaN' ?'---': new BigNumber(ethAddress as string).dividedBy(1e12).toFixed(4)} ${symbol? 'HIVVE': 'HIVVE'}`
}
  </p> 
</div>

:HoneyBalance === 'Loaded'? 
<div style={{fontSize:"18px",  borderRadius:"20px"}}>
  <p style={{fontSize:"18px"}}>{`--- HIVVE`}</p>
</div>:<div style={{fontSize:"18px",  borderRadius:"20px"}}>
  <p style={{fontSize:"18px", marginTop:"10px"}}>{`${walletContext.accounts[walletContext.accounts.length-1]?.address?HoneyBalance:'---'} HIVVE`}</p>
</div>
}
                
                {/* <img src={assets.images.polkadot} style={{width:"24px", marginRight:"10px"}}></img>
                <p className="m-0">HONEY</p> */}
              </div>
            </div>
            </div>
          ))
        }
        <img className="chnage" src={assets.images.downarrow} style={{backgroundColor:"#ececec", width:"45px", padding:"5px", borderRadius:"10px", border:"2px solid white", position:"absolute", left:"50%", transform:"translate(-50%, -50%)"}} onClick={opposie}></img>
        <div className="content">
        <div className="innerHeadingLeft" style={{backgroundColor:"#ececec", padding:"15px 10px", borderRadius:"10px 10px 0px 0px"}}>
          {/* <img src={nonSelectedChains[0].logo} style={{width:"40px"}}></img> */}
          <div>
          <h4 style={{fontWeight:"370", letterSpacing:"1px"}}>Receive</h4>
          </div>
        </div>
        <div className="innerHeadingLeft d-block" style={{backgroundColor:"#ececec",  padding:"15px 10px 20px 10px", borderRadius:"0px 0px 10px 10px"}}>
        <div className=" d-flex justify-content-between">
        <input type="number" className="Inputs" placeholder="--"  value={amount} disabled></input>
        <div className="d-flex dropdown" onClick={handleShow} style={{backgroundColor:"white",width:"160px", color:"black", padding:"10px 30px 10px 20px", borderRadius:"15px", transform:"translate(0%,-50%)"}}>
                <img src={nonSelectedChains[0].logo} className="logoOfChain" style={{width:"35px", height:"35px"}}></img>              
                <div className="d-flex drops">
                  <p className="m-0 chainNames" style={{fontSize:"22px"}}>{nonSelectedChains[0].name === 'Honey'? 'HIVVE':"ETH"}</p>
                </div>
              </div>
        </div>
        </div>
        </div>
        <input type="text" className="InputsAddress w-100 addressInput p-2 py-3" placeholder="Enter honey address" value={addresss} onChange={handleAddressChange}></input>

{
  selectedChains[0]['name'] === 'Honey' ?
  !walletContext.accounts[walletContext.accounts.length-1]?.address ?
<button  style={{backgroundColor:"#2673fa", width:"100%", borderRight:"2px solid #2673fa", borderBottom:"4px solid #2673fa", padding:"10px 0px", fontSize:"20px",color:"white", borderRadius:"10px"}}       onClick={selectWallet.open}>Connect Wallet</button>
:
loaderButton ?
<button  style={{backgroundColor:"#2673fa", width:"100%", borderRight:"2px solid #2673fa", borderBottom:"4px solid #2673fa", padding:"10px 10px",paddingTop:"15px", fontSize:"20px", color:"White", borderRadius:"10px"}}  onClick={sendTransaction.bind(null, {address:walletContext.accounts[walletContext.accounts.length-1]?.address, signer:walletContext.wallet?.signer})}><div className="spinner-border text-light" role="status">
<span className="sr-only"></span>
</div></button>:
<button  style={{backgroundColor:"#2673fa", width:"100%", borderRight:"2px solid #2673fa", borderBottom:"4px solid #2673fa", padding:"10px 10px",paddingTop:"15px", fontSize:"20px", color:"White", borderRadius:"10px"}}  onClick={sendTransaction.bind(null, {address:walletContext.accounts[walletContext.accounts.length-1]?.address, signer:walletContext.wallet?.signer})}>Transfer</button>
:''
}

      {
        clickedEthButton?
        <button style={{backgroundColor:"#2673fa", width:"100%", borderRight:"2px solid #2673fa", borderBottom:"4px solid #2673fa", padding:"10px 0px", fontSize:"20px", color:"White", borderRadius:"10px"}}>
          <div className="spinner-border text-light" role="status">
            <span className="sr-only"></span>
          </div>
        </button>
        :
        selectedChains[0]['name'] === 'Ethereum' ? isConnected ? <button style={{backgroundColor:"#2673fa", width:"100%", borderRight:"2px solid #2673fa", borderBottom:"4px solid #2673fa", padding:"10px 0px", fontSize:"20px", color:"White", borderRadius:"10px"}} onClick={submit.bind(null,{amount,addresss})}>Transfer</button>
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

// "dev": "react-scripts start",
// "start": "webpack serve --mode development --config webpack.config.js --open",
// "build": "webpack --mode production",
export default App;