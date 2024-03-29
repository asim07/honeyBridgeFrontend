import { ListItemButton, ListItemIcon } from "@mui/material";
import colorConfigs from "./configs/colorConfigs";
import assets from "./assets";
import Container from 'react-bootstrap/Container';
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
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'transferToPolkadot',
      args: [ethers.parseUnits(amount, 12), address],
    });
  };
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const onSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
  };
  return (
    <>
    <ToastContainer />
    <Navbar className="bg-body-tertiary navbarResp w-100 d-none">
  <Container fluid>
    <Navbar.Brand href="#home" className="brand">React-Bootstrap</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav>
        <Nav.Link href="#deets">       
        <ListItemButton
        className="itemsss"
        onClick={openModal}
      >
        <ListItemIcon sx={{
          color: colorConfigs.sidebar.color,
        }}>
        <Avatar src={assets.images.eth}  style={{width:"20px", height:"20px", marginLeft:"20px"}} />
        </ListItemIcon>
        {'ETHEREUM TO POLKADOT'}
      </ListItemButton></Nav.Link>
        <Nav.Link eventKey={2} href="#memes">
        <ListItemButton
        className="itemsss"
        onClick={selectWallet.open}
      >
        <ListItemIcon sx={{
          color: colorConfigs.sidebar.color
        }}>
        <Avatar src={assets.images.polkadot} style={{width:"20px", height:"20px", marginLeft:"20px"}} />
        </ListItemIcon>
        {'POLKADOT TO ETHEREUM'}
      </ListItemButton>
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

    <Box sx={{ display: "flex", flexDirection: "column" }}>
    {/* <Topbar /> */}
    <Box
        component="nav"
        className="resp"
        sx={{
            width: "100%", // Adjusted for mobile
            flexShrink: 0
        }}
    >
        <Sidebar selectWallet={selectWallet} openModal={openModal} />
    </Box>
    <Box
        component="main"
        sx={{
            flexGrow: 1,
            p: 3,
            width: "100%", // Adjusted for mobile
            minHeight: "100vh",
            textAlign: "center", // Moved to the main box
            h1: {
                fontSize: "2rem" // Adjusted font size for mobile
            }
        }}
    >
        <div className='sideContent'>
            <h1>ABOUT</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat repellendus in optio nisi eos tempore non. Suscipit rerum, aut voluptatum perspiciatis temporibus at nobis quidem fuga officia, nulla odio. Reprehenderit.</p>
        </div>
    </Box>
    </Box>

    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      {/* <PolkadotToEtheriem isConnected={isConnected}  submit={submit} isPending={CustomIsPending} isModalOpen={isModalOpens} setIsModalOpen={setIsModalOpens} />       */}
      <ParentComponent isConnected={isConnected}  submit={submit} isPending={CustomIsPending} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />      
      <button style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px"}} onClick={openModal}>ETHERIUM TO POLKADOT</button>
      {/* <button
       style={{backgroundColor:"#2776fd", color:"white", border:"None", borderRadius:"5px", padding:"15px", fontSize:"14px", marginLeft:"20px"}}
        // onClick={selectWallet.open}
      >Select Wallet</button> */}
    </div>
    {/* <SelectWalletModal theme={'dark'} /> */}

    </>
  );
};

export default App;
