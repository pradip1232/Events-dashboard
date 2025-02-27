import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface CustomDrawerProps {
  open: boolean;
  handleClose: () => void;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ open, handleClose }) => {
  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <IconButton onClick={handleClose}>
        <ChevronLeftIcon />
      </IconButton>
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem component="button" key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CustomDrawer;
