import React, { useState } from "react";
import { Button, TextField, Typography, Box, Paper, Grid } from "@mui/material";
import { Facebook, Google, LinkedIn } from "@mui/icons-material";

const SignInSignUP = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <Box className={`container ${isSignUp ? "right-panel-active" : ""}`}>
            <Grid container>
                {/* Sign Up Form */}
                <Grid item xs={12} md={6} className="form-container sign-up-container">
                    <Paper elevation={3} className="form-box">
                        <Typography variant="h5">Create Account</Typography>
                        <Box className="social-container">
                            <Facebook className="social" />
                            <Google className="social" />
                            <LinkedIn className="social" />
                        </Box>
                        <Typography variant="body2">or use your email for registration</Typography>
                        <TextField label="Name" variant="outlined" fullWidth margin="normal" />
                        <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" />
                        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                        <Button variant="contained" color="primary">Sign Up</Button>
                    </Paper>
                </Grid>

                {/* Sign In Form */}
                <Grid item xs={12} md={6} className="form-container sign-in-container">
                    <Paper elevation={3} className="form-box">
                        <Typography variant="h5">Sign In</Typography>
                        <Box className="social-container">
                            <Facebook className="social" />
                            <Google className="social" />
                            <LinkedIn className="social" />
                        </Box>
                        <Typography variant="body2">or use your account</Typography>
                        <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" />
                        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                        <Typography variant="body2" component="a" href="#">Forgot your password?</Typography>
                        <Button variant="contained" color="primary">Sign In</Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Overlay */}
            <Box className="overlay-container">
                <Box className="overlay">
                    <Box className="overlay-panel overlay-left">
                        <Typography variant="h5">Welcome Back!</Typography>
                        <Typography variant="body2">To keep connected, please login with your personal info</Typography>
                        <Button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</Button>
                    </Box>
                    <Box className="overlay-panel overlay-right">
                        <Typography variant="h5">Hello, Friend!</Typography>
                        <Typography variant="body2">Enter your personal details and start your journey with us</Typography>
                        <Button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SignInSignUP;
