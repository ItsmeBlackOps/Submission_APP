import React from 'react';
import Grid from '@mui/joy/Grid';
import MetricBox from './MetricBox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const AppView = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricBox title="Total Users" value="1,234" icon={<PeopleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricBox title="Revenue" value="$12,345" icon={<MonetizationOnIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricBox title="Avg. Time" value="5:34" icon={<AccessTimeIcon />} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppView;
