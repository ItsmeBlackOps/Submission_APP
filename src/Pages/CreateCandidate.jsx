import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/joy/Autocomplete';
import { IMaskInput } from 'react-imask';
import Stack from '@mui/joy/Stack';
import CardOverflow from '@mui/joy/CardOverflow';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import CardActions from '@mui/joy/CardActions';
import Input from '@mui/joy/Input';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';

const TextMaskAdapter = React.forwardRef(function TextMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskAdapter.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumericFormatAdapter = React.forwardRef(function NumericFormatAdapter(
  props,
  ref
) {
  const { onChange, name, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatAdapter.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NewCandidate = () => {
  const [value, setValue] = useState('');
  const [upfront, setUpfront] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: '',
  });
  console.log(value);
  useEffect(() => {
    // Fetch data from endpoint
    axios
      .get('https://reportcraft-backend.onrender.com/recruiters')
      .then((response) => {
        // Add RecruiterName key to each item
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const {
    control,
    handleSubmit,
    register,
    setValue: setFormValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (formData) => {
    const adjustedData = {
      'Branch:': formData.branch,
      'Candidate:': formData.candidate,
      "Candidate's email address:": formData.candidateEmail,
      'Location:': formData.location,
      'Manager:': formData.manager,
      'Marketing start date:': formData.marketingStartDate,
      'Open to Relocate:': formData.openToRelocate,
      'Phone number:': formData.phoneNumber,
      'Recruiter:': formData.recruiter,
      'Status:': formData.status,
      'Team Lead:': formData.teamLead,
      'Technology:': formData.technology,
      'Upfront:': formData.upfront,
      'Visa:': formData.visa,
    };

    try {
      const response = await axios.post(
        'https://reportcraft-backend.onrender.com/addCandidateData',
        adjustedData
      );
      if (response.status === 201) {
        // Show success message
        setNotification({
          open: true,
          message: 'Candidate data added successfully',
          type: 'success',
        });
        window.location.reload();
      } else {
        // Show error message
        setNotification({
          open: true,
          message: 'Failed to add candidate data',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // Show error message
      setNotification({
        open: true,
        message: 'An error occurred',
        type: 'error',
      });
    }
  };

  const handleRecruiterChange = (event, value) => {
    const selectedRecruiter = data.find(
      (recruiter) => recruiter.Recruiter === value
    );
    if (selectedRecruiter) {
      setFormValue('teamLead', selectedRecruiter['Team Lead'] || '');
      setFormValue('manager', selectedRecruiter.Manager || '');
      setFormValue('branch', selectedRecruiter.Branch || '');
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ open: false, message: '', type: '' });
  };

  const uniqueRecruiters = [
    ...new Set(data.map((recruiter) => recruiter.Recruiter)),
  ];

  return (
    <React.Fragment>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<Add />}
          onClick={() => setOpen(true)}
        >
          New project
        </Button>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card variant="outlined" sx={{ width: '100vh', p: 2 }}>
          <Modal open={open} onClose={() => setOpen(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Branch</FormLabel>
                  <Input
                    size="sm"
                    placeholder="AHD"
                    {...register('branch', { required: true })}
                    disabled
                  />
                  {errors.branch && (
                    <Typography color="error">Branch is required</Typography>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Candidate Name</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Candidate Name"
                    {...register('Candidate', { required: true })}
                  />
                  {errors.candidate && (
                    <Typography color="error">Candidate is required</Typography>
                  )}
                </FormControl>
                <Grid container>
                  <Grid item xs={6} sx={{ mb: 0, pr: 2 }}>
                    <FormControl>
                      <FormLabel>Candidate's Email Address</FormLabel>
                      <Input
                        size="sm"
                        type="email"
                        placeholder="abc@xyz.com"
                        {...register('candidateEmail', { required: true })}
                      />
                      {errors.candidateEmail && (
                        <Typography color="error">
                          Candidate's Email is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sx={{ mb: 0, pl: 2 }}>
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        defaultValue={value}
                        rules={{ required: true }}
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Input
                            size="sm"
                            value={value}
                            onChange={(event) => {
                              onChange(event.target.value);
                              setValue(event.target.value); // Ensure state is updated
                            }}
                            placeholder="(901) 682-4449"
                            slotProps={{
                              input: { component: TextMaskAdapter, name },
                            }}
                          />
                        )}
                      />
                      {errors.phoneNumber && (
                        <Typography color="error">
                          Phone Number is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={['Ahmedabad, GJ', 'Gurgaon, HR']}
                        size="sm"
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <Input {...params} placeholder="Location" />
                        )}
                      />
                    )}
                  />
                  {errors.location && (
                    <Typography color="error">Location is required</Typography>
                  )}
                </FormControl>
                <Grid container sx={{ flexGrow: 2, mt: 0, mb: 0 }}>
                  <Grid item xs={6} sx={{ mb: 0, pr: 2 }}>
                    <FormControl>
                      <FormLabel>Recruiter</FormLabel>
                      <Controller
                        name="recruiter"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={uniqueRecruiters}
                            getOptionLabel={(option) => option || ''}
                            size="sm"
                            onChange={(event, value) => {
                              field.onChange(value);
                              handleRecruiterChange(event, value);
                            }}
                            renderInput={(params) => (
                              <Input {...params} placeholder="Recruiter" />
                            )}
                          />
                        )}
                      />
                      {errors.recruiter && (
                        <Typography color="error">
                          Recruiter is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sx={{ mb: 0, pl: 2 }}>
                    <FormControl>
                      <FormLabel>Team Lead</FormLabel>
                      <Input
                        disabled
                        size="sm"
                        placeholder="Team Lead"
                        {...register('teamLead', { required: true })}
                      />
                      {errors.teamLead && (
                        <Typography color="error">
                          Team Lead is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <FormControl>
                  <FormLabel>Manager</FormLabel>
                  <Input
                    disabled
                    size="sm"
                    placeholder="Manager"
                    {...register('manager', { required: true })}
                  />
                  {errors.manager && (
                    <Typography color="error">Manager is required</Typography>
                  )}
                </FormControl>
                <Grid container>
                  <Grid item xs={6} sx={{ mb: 0, pr: 2 }}>
                    <FormControl>
                      <FormLabel>Marketing Start Date</FormLabel>
                      <Input
                        size="sm"
                        type="date"
                        {...register('marketingStartDate', { required: false })}
                      />
                      {errors.marketingStartDate && (
                        <Typography color="error">
                          Marketing Start Date is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sx={{ mb: 0, pl: 2 }}>
                    <FormControl>
                      <FormLabel>Open to Relocate</FormLabel>
                      <Controller
                        name="openToRelocate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={['Yes', 'No']}
                            onChange={(event, value) => field.onChange(value)}
                            size="sm"
                            renderInput={(params) => (
                              <Input {...params} placeholder="Yes or No" />
                            )}
                          />
                        )}
                      />
                      {errors.openToRelocate && (
                        <Typography color="error">
                          Open to Relocate is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Status"
                    {...register('status', { required: true })}
                  />
                  {errors.status && (
                    <Typography color="error">Status is required</Typography>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Technology</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Technology"
                    {...register('technology', { required: true })}
                  />
                  {errors.technology && (
                    <Typography color="error">
                      Technology is required
                    </Typography>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Upfront</FormLabel>
                  <Controller
                    name="upfront"
                    control={control}
                    defaultValue={upfront}
                    rules={{ required: true }}
                    render={({ field: { onChange, ref, name } }) => (
                      <Input
                        size="sm"
                        value={upfront}
                        onChange={(event) => {
                          onChange(event.target.value);
                          setUpfront(event.target.value); // Use setUpfront to update the state
                        }}
                        placeholder="Upfront"
                        slotProps={{
                          input: { component: NumericFormatAdapter, name },
                        }}
                      />
                    )}
                  />
                  {errors.upfront && (
                    <Typography color="error">Upfront is required</Typography>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Visa</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Visa"
                    {...register('visa', { required: true })}
                  />
                  {errors.visa && (
                    <Typography color="error">Visa is required</Typography>
                  )}
                </FormControl>
                <CardOverflow
                  sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}
                >
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      onClick={() => console.log('Cancel')}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      type="submit"
                      disabled={!isValid}
                    >
                      Save
                    </Button>
                  </CardActions>
                </CardOverflow>
              </Stack>
            </form>
            </Modal>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
</React.Fragment>
  );
};

export default NewCandidate;
