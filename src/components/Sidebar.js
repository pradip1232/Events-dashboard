import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <Drawer variant="permanent">
            <Toolbar />
            <List>
                <ListItemButton component={Link} to="/">
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={Link} to="/users">
                    <ListItemText primary="Users" />
                </ListItemButton>
                <ListItemButton component={Link} to="/create-new-events">
                    <ListItemText primary="Your Events" />
                </ListItemButton>
                <ListItemButton component={Link} to="/create-new-form">
                    <ListItemText primary="Your Form" />
                </ListItemButton>
                <ListItemButton component={Link} to="/volunteer">
                    <ListItemText primary="Volunteer" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;
