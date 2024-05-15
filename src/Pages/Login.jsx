import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContent';
import { Container, Typography, TextField, Button, Box, Grid, Card } from '@mui/material';
import PageContainer from './Components/PageContainer';

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const loginForm = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/form');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;
    const userInfo = { email, password };
    loginUser(userInfo);
  };

  return (
    <PageContainer>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }} >
      
      <Grid item xs={12} sm={10} md={8}>
          <Card variant="outlined" sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit} ref={loginForm}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                margin="normal"
                variant="outlined"
                placeholder="Enter email..."
              />
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                margin="normal"
                variant="outlined"
                placeholder="Enter password..."
                autoComplete="password"
              />
              <Box mt={2}>
                <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                  Login
                </Button>
              </Box>
            </form>
            
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
