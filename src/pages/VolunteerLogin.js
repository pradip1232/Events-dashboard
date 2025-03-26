import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button } from '@mui/material';

const VolunteerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const location = useLocation();

    useEffect(() => {
        try {
            // Get base64 encoded email from URL query params
            const queryParams = new URLSearchParams(location.search);
            const encodedEmail = queryParams.get('email');

            console.log('Encoded email from URL:', encodedEmail);

            if (encodedEmail) {
                try {
                    // Decode base64 email
                    const decodedEmail = atob(encodedEmail);
                    console.log('Decoded email:', decodedEmail);

                    if (decodedEmail) {
                        setEmail(decodedEmail);
                    } else {
                        setError('Invalid email format');
                    }
                } catch (decodeError) {
                    console.error('Decoding error:', decodeError);
                    setError('Failed to decode email');
                }
            } else {
                console.log('No email parameter found in URL');
            }
        } catch (err) {
            console.error('URL parsing error:', err);
            setError('Invalid URL format');
        } finally {
            setLoading(false);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }



        try {
            console.log('Submitting login with:', { email });
            const response = await fetch('http://localhost/volunteer/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.status === 'success') {
                // Handle successful login
                console.log('Login successful');
                // Redirect or set auth state
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Volunteer Login
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default VolunteerLogin;
