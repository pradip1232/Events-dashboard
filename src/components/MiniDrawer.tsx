import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, CssBaseline, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from './CustomDrawer';

export default function MiniDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Mini Drawer</Typography>
        </Toolbar>
      </AppBar>
      <CustomDrawer open={open} handleClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Typography variant="body1">
          Welcome to the Mini Drawer Example using Material-UI and TypeScript!
        </Typography>
      </Box>
    </Box>
  );
}
