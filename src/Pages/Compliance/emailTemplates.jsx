import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  MenuItem,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/system";
import InstallmentTable from './installments';

const RootContainer = styled("div")({
  margin: "16px",
  padding: "16px",
  borderRadius: "8px",
});

const Title = styled(Typography)({
  marginBottom: "8px",
});

const ListItemContainer = styled(ListItem)({
  padding: 0,
});

const MessageBody = styled("div")({
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  border: "1px solid #ccc",
  whiteSpace: "pre-line", // Preserve line breaks and spacing
});

const EmailTemplates = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [joiningDate, setJoiningDate] = useState(""); // Add joiningDate state
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const [emailContent, setEmailContent] = useState(""); // Add emailContent state
  const [endingmess, setEnding] = useState(""); // Add emailContent state
  const [annualPackage, setAnnualPackage] = useState("");
  const [agreementPercentage, setAgreementPercentage] = useState("");
  const [upfront, setUpfront] = useState("");
  const [formData, setFormData] = useState(null); // State to store form data

  const handleClose = () => {
    setOpen(false);
    setShowForm(true); // Show the form when dialog is closed
  };

  useEffect(() => {
    if (open && dialogRef.current) {
      // Focus on the first input element when the dialog is opened
      dialogRef.current.focus();
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormData({
      name,
      company,
      joiningDate, // Store joiningDate in formData
      annualPackage: Number(annualPackage),
      agreementPercentage,
      upfront: Number(upfront),
    }); // Store form data
    setOpen(true);
    setShowForm(false); // Hide the form when dialog is opened
  };

  useEffect(() => {
    if (formData) {
      // Generate the email content
      const generatedEmailContent = `
          <div>
            <p>Hello ${formData.name},</p>
            <p>Congratulations on your offer! It was our pleasure to serve you and help you achieve your career goals.</p>
            <p>We request you to make a payment of <b>$${formData.annualPackage}</b> for the background verification process.</p>
            <p><b>Please find below the payment break up and schedule:<b></p>
          </div>
        `;
      const ending = `<div>            <p>Thank you for choosing ${formData.company}. We look forward to working with you again in the future.</p>
</div>`;
      // Display generated email content
      setEmailContent(generatedEmailContent);
      setEnding(ending);
      setOpen(true);
      setShowForm(false); // Hide the form when dialog is opened
    }
  }, [formData]);

  return (
    <RootContainer>
      {showForm && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item xs={3}>
            <form onSubmit={handleSubmit}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Company"
                  name="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="Silverspace Technologies Inc.">Silverspace Technologies Inc.</MenuItem>
                  <MenuItem value="Vizva Consultancy Services">Vizva Consultancy Services</MenuItem>
                </TextField>
              </Grid>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Annual Package"
                value={annualPackage}
                onChange={(e) => setAnnualPackage(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Agreement Percentage"
                value={agreementPercentage}
                onChange={(e) => setAgreementPercentage(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Upfront"
                value={upfront}
                onChange={(e) => setUpfront(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Joining Date"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button type="submit" variant="contained" color="primary">Submit</Button>
            </form>
          </Grid>
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} disableEnforceFocus>
        <DialogTitle>Payment Schedule {company}</DialogTitle>
        <DialogContent dividers>
          <div ref={dialogRef} tabIndex={-1}>
            <div dangerouslySetInnerHTML={{ __html: emailContent }} />
          </div>
          <InstallmentTable formData={formData} />
          <div ref={dialogRef} tabIndex={-1}>
            <div dangerouslySetInnerHTML={{ __html: endingmess }} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default EmailTemplates;
