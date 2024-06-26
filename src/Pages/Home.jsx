import React from 'react';
import Grid from '@mui/material/Grid';
import MetricsBox from '../Overview/App-Widget-Summary';
import { useAuth } from '../utils/AuthContent';

const Home = () => {
  const { user } = useAuth();
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Welcome to my website!</h1>
        <p>This page should be protected by a PrivateRoutes component for authenticated users</p>
        {user && user.labels && <MetricsBox />}
        {/* <AppView /> */}
      </div>
    </Grid>
  );
}

export default Home;
