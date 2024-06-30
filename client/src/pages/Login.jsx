import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Stack,
  InputAdornment,
} from '@mui/material';
import { CameraAlt as CameraAltIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { userExist } from '../redux/reducers/auth';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { bgGradient } from '../constants/color';
import { server } from '../constants/config';
import { usernameValidator } from '../utils/validators';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const name = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('', usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler('single');

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        username: username.value,
        password: password.value,
      }, config);
      dispatch(userExist(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('bio', bio.value);
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('avatar', avatar.file);

    const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
        const { data } = await axios.post(`${server}/api/v1/user/new`, formData, config);
        dispatch(userExist(true));
        toast.success(data.message);

        // Redirect to home page after successful registration
        if (data.redirect) {
            history.push(data.redirect); // Assuming 'history' is available through React Router
        } else {
            console.error("Redirect URL not provided in response");
            // Handle the case where the server did not provide a redirect URL
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
    }
};


  return (
    <div style={{ backgroundImage: bgGradient, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleLogin}>
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
                  type={showPassword ? 'text' : 'password'}
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button sx={{ marginTop: '1rem' }} variant="contained" color="primary" type="submit" fullWidth>
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
                  <Avatar sx={{ width: '10rem', height: '10rem', objectFit: 'contain' }} src={avatar.preview} />
                  {avatar.error && (
                    <Typography color="error" variant="caption">
                      {avatar.error}
                    </Typography>
                  )}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      ':hover': { bgcolor: 'rgba(0,0,0,0.7)' },
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
                <Button sx={{ marginTop: '1rem' }} variant="contained" color="primary" type="submit" fullWidth>
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
