import { Card, CardContent, Typography, Grid } from "@mui/material";

const Dashboard = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Total form</Typography>
                        <Typography variant="h4">150</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">total registraed</Typography>
                        <Typography variant="h4">12,000</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
