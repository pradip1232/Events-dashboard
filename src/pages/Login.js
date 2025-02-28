import React, { useState } from "react";
import { Button, TextField, Typography, Box, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost/events/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status === "success") {
                localStorage.setItem("user_logged_in", "true"); // ✅ Fixed key name
                localStorage.setItem("user_email", result.email);

                console.log("Login Successful: user_logged_in set to true");

                alert("Login successful");

                setTimeout(() => {
                    navigate("/"); // ✅ Use navigate instead of window.location.href
                }, 100);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh", background: "#f4f4f4" }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Sign In
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField name="email" type="email" label="Email" variant="outlined" fullWidth margin="normal" onChange={handleChange} required />
                        <TextField name="password" type="password" label="Password" variant="outlined" fullWidth margin="normal" onChange={handleChange} required />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                            Sign In
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
