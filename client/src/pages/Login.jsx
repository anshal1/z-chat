import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Stack, Avatar, IconButton, InputAdornment } from '@mui/material';
import { CameraAlt as CameraAltIcon, Visibility, VisibilityOff } from '@mui/icons-material';

import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { usernameValidator } from '../utils/validators';
import { bgGradient } from '../constants/color';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const toggleLogin = () => {
        setIsLogin(prev => !prev);
    };
    
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const name = useInputValidation("");
    const bio = useInputValidation("");  
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();
    const avatar = useFileHandler("single");

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic
    };

    return (
        <div
            style={{
                backgroundImage: bgGradient,
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {isLogin ? (
                        <>
                            <Typography variant="h5">Login</Typography>
                            <form
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }}
                                onSubmit={handleLogin}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    variant="outlined"
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    margin="normal"
                                    variant="outlined"
                                    type={showPassword ? "text" : "password"}
                                    value={password.value}
                                    onChange={password.changeHandler}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    sx={{ marginTop: '1rem' }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                >
                                    Login
                                </Button>
                                <Typography textAlign="center" m="1rem">
                                    OR
                                </Typography>
                                <Button fullWidth variant="text" onClick={toggleLogin}>
                                    Sign Up
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5">Sign Up</Typography>
                            <form onSubmit={handleSignup}>
                                <Stack position="relative" width="10rem" margin="auto">
                                    <Avatar
                                        sx={{
                                            width: '10rem',
                                            height: '10rem',
                                            objectFit: 'contain',
                                        }}
                                        src={avatar.preview}
                                    />
                                    {avatar.error && (
                                        <Typography color="error" variant="caption">
                                            {avatar.error}
                                        </Typography>
                                    )}
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            color: "white",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            ":hover": {
                                                bgcolor: "rgba(0,0,0,0.7)",
                                            }
                                        }}
                                        component="label"
                                    >
                                        <CameraAltIcon />
                                        <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                                    </IconButton>
                                </Stack>
                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    variant="outlined"
                                    value={name.value}
                                    onChange={name.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Bio"
                                    margin="normal"
                                    variant="outlined"
                                    value={bio.value}
                                    onChange={bio.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    variant="outlined"
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />
                                {username.error && (
                                    <Typography color="error" variant="caption">
                                        {username.error}
                                    </Typography>
                                )}
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    margin="normal"
                                    variant="outlined"
                                    value={password.value}
                                    onChange={password.changeHandler}
                                />
                                {password.error && (
                                    <Typography color="error" variant="caption">
                                        {password.error}
                                    </Typography>
                                )}
                                <Button
                                    sx={{ marginTop: '1rem' }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                >
                                    Sign Up
                                </Button>
                                <Typography textAlign="center" m="1rem">
                                    OR
                                </Typography>
                                <Button fullWidth variant="text" onClick={toggleLogin}>
                                    Login Instead!!
                                </Button>
                            </form>
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default Login;