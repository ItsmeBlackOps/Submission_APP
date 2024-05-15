import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system"; 

const RootContainer = styled("div")({
  margin: "16px",
  padding: "16px",
//   backgroundColor: "#f5f5f5",
  borderRadius: "8px",
});

const Title = styled(Typography)({
  marginBottom: "8px",
});

const ListItemContainer = styled(ListItem)({
  padding: 0,
});
const subject = 'Introduction and Request for Background Check Information';
const MessageBody = styled("div")({
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  border: "1px solid #ccc",
  whiteSpace: "pre-line", // Preserve line breaks and spacing
});

const ReferenceFormat = () => {
    const [emailContent, setEmailContent] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);
    const [showForm, setShowForm] = useState(true);
    

    const handleClose = () => {
      setOpen(false);
      setShowForm(true); // Show the form when dialog is closed
    };
  
    useEffect(() => {
      if (open && dialogRef.current) {
        // Focus on the first input element when the dialog is opened
        dialogRef.current.querySelector("input").focus();
      }
    }, [open]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      // Gather input values
  
      // Generate the email content
      const generatedEmailContent = `
      <div>
        <p>Hello Anchita</p>
        <p>Hope you are doing well</p>
        <p>I am reaching out to initiate the process for conducting a background check for <strong>${name}</strong> from <strong>${company}</strong>, who has recently made his initial payment.</p>
        <p>Could you please provide me with the necessary information and documentation required to proceed.</p>
        <p>Below are contact details for your reference:</p>
        <ul>
          <li><strong>Personal Phone Number</strong> - ${phoneNumber}</li>
          <li><strong>Email ID</strong> – ${email}</li>
        </ul>
        <p>I will await your prompt response, and please do not hesitate to reach out if you require any further information or clarification.</p>
        <p>Thank you for your cooperation.</p>
        <p>Thanks & Regards</p>
      </div>
    `;
  
      // Display generated email content
      setEmailContent(generatedEmailContent);
      setOpen(true);
      setShowForm(false); // Hide the form when dialog is opened
  
      // Store in Firebase
    };
  
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
          <form onSubmit={handleSubmit} >
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              
              margin="normal"
            />
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
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </form>
          </Grid>
          </Grid>
        )}
        
        <Dialog open={open} onClose={handleClose} disableEnforceFocus>
          <DialogTitle>{subject}</DialogTitle>
          <DialogContent dividers>
            <div ref={dialogRef} tabIndex={-1}>
              <div dangerouslySetInnerHTML={{ __html: emailContent }} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
  
      </RootContainer>
    );
  };
  
  export default ReferenceFormat;
