import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContent';
import { Container, Typography, TextField, Button, Box, Grid, Card } from '@mui/material';
import PageContainer from './Components/PageContainer';

const SignUp = () => {
  const { user, signUpUser } = useAuth();
  const navigate = useNavigate();
  const signUpForm = useRef(null);



  const handleSubmit = (e) => {
    e.preventDefault();
    const email = signUpForm.current.email.value;
    const password = signUpForm.current.password.value;
    const name = signUpForm.current.name.value;
    const userInfo = { email, password, name };
    signUpUser(userInfo);
  };

  return (
    <PageContainer>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }} >
      
      <Grid item xs={12} sm={10} md={8}>
          <Card variant="outlined" sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Create User
            </Typography>
            <form onSubmit={handleSubmit} ref={signUpForm}>
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
              <TextField
                fullWidth
                required
                label="Name"
                name="name"
                
                margin="normal"
                variant="outlined"
                placeholder="Enter Full Name"
                autoComplete="name"
              />
              <Box mt={2}>
                <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                  Create User
                </Button>
              </Box>
            </form>
            
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default SignUp;
