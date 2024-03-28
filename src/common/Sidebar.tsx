import React from 'react';
import { ListItemButton, ListItemIcon } from "@mui/material";
import { Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import assets from "../assets";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
console.log({assets});
interface SidebarProps {
  selectWallet: any;
  openModal: any;
}

const Sidebar: React.FC<SidebarProps> = ({ selectWallet,openModal }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color
        }
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            justifyContent="center"
          >
            <Avatar src={assets.images.logo} />
          </Stack>
        </Toolbar>
        <ListItemButton
        onClick={openModal}
        // component={Link}
        // to={item.path}
        // sx={{
        //   "&: hover": {
        //     backgroundColor: colorConfigs.sidebar.hoverBg
        //   },
        //   backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
        //   paddingY: "12px",
        //   paddingX: "24px"
        // }}
      >
        <ListItemIcon sx={{
          color: colorConfigs.sidebar.color
        }}>
        <Avatar src={assets.images.eth} />
        </ListItemIcon>
        {'ETHEREUM TO POLKADOT'}
      </ListItemButton>
      <ListItemButton
      onClick={selectWallet.open}
        // component={Link}
        // to={item.path}
        // sx={{
        //   "&: hover": {
        //     backgroundColor: colorConfigs.sidebar.hoverBg
        //   },
        //   backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
        //   paddingY: "12px",
        //   paddingX: "24px"
        // }}
      >
        <ListItemIcon sx={{
          color: colorConfigs.sidebar.color
        }}>
        <Avatar src={assets.images.polkadot} />
        </ListItemIcon>
        {'POLKADOT TO ETHEREUM'}
      </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
