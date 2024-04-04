import { ListItemButton, ListItemIcon } from "@mui/material";
import colorConfigs from "./configs/colorConfigs";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MyModal from './components/chainDropdown';

import assets from "./assets";
import Container from 'react-bootstrap/Container';
import { Tooltip } from 'react-tooltip'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useWriteContract,useWaitForTransactionReceipt, useAccount } from 'wagmi';
import  abi from './utils/abi.json'
import { Box, Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import sizeConfigs from "./configs/sizeConfigs";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import './app.css';
import { ethers } from 'ethers';
import ParentComponent from './components/ParentComponent';
import PolkadotToEtheriem from './components/PolkadotToEtheriem';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications-component/dist/theme.css'
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import SelectWalletModal from './components/SelectWalletModal'
import {OpenSelectWallet, WalletContext} from './contexts';
const App = () => {

  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletContext.wallet && walletContext.walletType === 'substrate') {
      navigate('/wallet-info');
    } else if (walletContext.evmWallet && walletContext.walletType === 'evm') {
      navigate('/evm-wallet-info');
    }
  }, [navigate, walletContext]);
  const {address, isConnected} = useAccount()
  console.log({isConnected});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
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
  const showConfirmationNotification = () => {
    toast('Transaction is in Progress..');
  };

  const showSuccessNotification = () => {
    toast('Transaction Successful!');
  };
  console.log({isPending}); 
  let CustomIsPending = isPending || isConfirming

  const submit = (amount: string, address: string) => {
    if(amount.length && address.length){
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'transferToPolkadot',
        args: [ethers.parseUnits(amount, 12), address],
      });
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const onSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
  };
  const [showModal, setShowModal] = useState(false);
  const [chains, setChain] = useState([{name:"Etheriem", logo:assets.images.eth, selected:false, tick:assets.images.tick},{name:"Polkadot", logo:assets.images.polkadot, selected:true, tick:assets.images.tick}])
  const selectedChains = chains.filter(chain => chain.selected);
  const nonSelectedChains = chains.filter(chain => !chain.selected);
  const opposie = ()=>{
    setChain(() => {
      return chains.map(item => ({
        ...item,
        selected: !item.selected // Toggle the selected property
      }));
    });
  }
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleConfirm = () => {
    // Handle confirm action
    handleClose();
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
          <img src={assets.images.polkadot} style={{width:"25px", marginRight:"10px"}}></img>
          HONEY</Navbar.Brand>
        <Navbar.Toggle style={{backgroundColor:"white"}} aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
            <Button style={{backgroundColor:"#fcff6b", borderRight:"2px solid #dac400", borderBottom:"2px solid #dac400"}}>Connect Wallet</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Tooltip id="my-tooltip" />
    <div style={{margin:"15% 38%"}}>
      <div className="mainHeading">
        <p className="m-0" style={{fontSize:"22px", fontWeight:"900"}}>Transfer</p>
        <div className="d-flex align-items-center mb-3">
          <div style={{backgroundColor:"#fdff0f", width:"10px", height:"10px", borderRadius:"50%", marginRight:"10px"}}></div>
          <a data-tooltip-id="my-tooltip" data-tooltip-content="0xjhk1098jajqyuqqqiohh882182hkajhkl4933">
            <p className="m-0">0xjhk1098jaj...4933</p>
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
                  <img src={assets.images.arrow} style={{width:"20px"}}></img>
                </div>
              </div>
            </div>
            <div className="innerHeadingLeft d-flex justify-content-between" style={{backgroundColor:"#222938",  padding:"15px 10px 20px 10px", borderRadius:"0px 0px 10px 10px"}}>
              <input type="number" className="Inputs" placeholder="0"></input>          
              <div className="d-flex align-items-center">
                <img src={assets.images.polkadot} style={{width:"24px", marginRight:"10px"}}></img>
                <p className="m-0">HONEY</p>
              </div>
            </div>
            </div>
          ))
        }
        <img className="chnage" src={assets.images.downarrow} style={{backgroundColor:"#222938", width:"45px", padding:"5px", borderRadius:"50%", border:"2px solid #141925", position:"absolute", left:"50%", transform:"translate(-50%, -50%)"}} onClick={opposie}></img>
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
        <input type="text" className="Inputs w-100" placeholder="Address"></input>          
        <div className=" d-flex justify-content-between">
        <input type="number" className="Inputs" placeholder="0" disabled></input>          
          <div className="d-flex align-items-center">
            <img src={assets.images.polkadot} style={{width:"24px", marginRight:"10px"}}></img>
            <p className="m-0">HONEY</p>
          </div>
        </div>
        </div>
        </div>
        {/* <ConnectButton label="Connect Wallet" className="connectButton" /> */}

        <button style={{backgroundColor:"#fcff6b", width:"100%", borderRight:"2px solid #dac400", borderBottom:"4px solid #dac400", padding:"10px 0px", fontSize:"20px", borderRadius:"10px"}} onClick={openModal}>Connect Wallet</button>

      </div>
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

    
    {/* <button style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px"}} onClick={openModal}>ETHERIUM TO POLKADOT</button> */}
    {/* <button
     style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px", fontSize:"14px", marginLeft:"20px"}}
      // onClick={selectWallet.open}
    >Select Wallet</button> */}

  </>
  );
};

export default App;
