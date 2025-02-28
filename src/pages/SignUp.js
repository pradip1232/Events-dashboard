import React, { useState } from "react";
import { Button, TextField, Typography, Box, Paper, Grid } from "@mui/material";

const SignUp = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost/events/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh", background: "#f4f4f4" }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Create Account
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField name="name" label="Name" variant="outlined" fullWidth margin="normal" onChange={handleChange} required />
                        <TextField name="email" type="email" label="Email" variant="outlined" fullWidth margin="normal" onChange={handleChange} required />
                        <TextField name="password" type="password" label="Password" variant="outlined" fullWidth margin="normal" onChange={handleChange} required />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                            Sign Up
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SignUp;
