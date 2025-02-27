import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
    return (
        <Box display="flex" height="100vh">
            {/* Sidebar with 15% width */}
            <Box width="15%" minWidth={200} bgcolor="">
                <Sidebar />
            </Box>

            {/* Main content with 85% width */}
            <Box width="85%" p={5} overflow="auto">
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
