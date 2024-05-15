import React from 'react';
import Grid from '@mui/system/Unstable_Grid/Grid';

const Home = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }} >

        <div className="container">
            <h1>Welcome to my website!</h1>

            <p>This page should be protected by a PrivateRoutes component for authenticated users</p>
        </div>
</Grid>
  )
}

export default Home