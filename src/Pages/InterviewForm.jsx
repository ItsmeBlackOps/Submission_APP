import React, { useState, useEffect } from "react";
import "./../App.css";
// import { useAuth } from "../utils/AuthContext";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CandidateData from "./DataSources/CandidateData";
import { MenuItem } from "@mui/material";
import { useAuth } from "../utils/AuthContent";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TaskList from "./DataSources/TasksData";

const InterviewForm = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [taskdata, setTask] = useState([]);
  
  const [formData, setFormData] = useState({
    InterviewSchedule: "",
    candidateName: "",
    comments: "",
    company: "",
    date: new Date().toISOString().substr(0, 10),
    vendorEmail: "",
    employmentType: "",
    followUp2: "",
    followUp3: "",
    followUp4: "",
    InterviewOrSubmission: "",
    location: "",
    position: "",
    qcStatus: false,
    rate: "",
    recruiterName: user.name,
    sourceOfSubmission: "",
    vendorContact: "",
    vendorName: "",
    avatarUrl: '',
  });
  const inputRef = React.useRef(null);
  const [InterviewOrSubmission, setInterviewOrSubmission] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // default to success

  useEffect(() => {
    if (success) {
      handleOpenSnackbar("Form submitted successfully.", "success");
      setSuccess(false); // Reset success status
    }
  }, [success]);


  const handleDataReceived = (jsonData) => {
    console.log(jsonData);
    const filteredData = jsonData.filter((item) => item.Recruiter === user.name);
    setData(filteredData);
    setLoading(false);
  };
  
  
    const handleTaskReceived = (tData) => {
    setTask(tData); // Fixed typo here
    setLoading(false);
  };

  const handleOpenSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setSnackbarSeverity(severity);
  };
  function areObjectsEqual(obj1, obj2) {
    console.log("Comparing objects", obj1, obj2);
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectChange = (event) => {
    const selectedUserName = event.target.value;
    setSelectedUser(selectedUserName); // Update selected user state
    setFormData((prevFormData) => ({
      ...prevFormData,
      candidateName: selectedUserName,
      avatarUrl: data.find(user => user.Candidate === selectedUserName)['Random URL'] || '', // Set avatarUrl based on selected candidate
    }
  ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform field validation
    if (
      !formData.candidateName ||
      !formData.company ||
      !formData.employmentType ||
      !formData.location ||
      !formData.position ||
      !formData.rate ||
      !formData.sourceOfSubmission ||
      !formData.InterviewOrSubmission ||
      !formData.vendorContact ||
      !formData.vendorName ||
      !formData.vendorEmail ||
      (InterviewOrSubmission === "Interview" && !formData.InterviewSchedule)
    ) {
      handleOpenSnackbar("All fields are required.", 'error');
      return;
    }
    const existingEntry = taskdata.find((item) => {
      delete item['id'];
      const keys1 = Object.keys(item);
      const keys2 = Object.keys(formData);
      // if (keys1.length != keys2.length) {
      //   return false;
      // }

      for (let key of keys1) {
        console.log(item[key], formData[key]);
        if (typeof item[key] === 'object' && typeof formData[key] === 'object') {
          if (!areObjectsEqual(item[key], formData[key])) {
            console.log("Objects not equal:", item[key], formData[key]);
            return false;
          }
        } else if (item[key] !== formData[key]) {
          return false;
        }
      }
    
      return true;
    }
      
    );
    if (existingEntry) {
      handleOpenSnackbar("Duplicate entry detected.", 'error');
      return;
    }

    // Disable the submit button
    setIsSubmitting(true);
    fetch("https://reportcraft-backend.onrender.com/addData", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        'user-id': user.name,
        'user-label': user.labels[0]
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Re-enable the submit button
        setIsSubmitting(false);
        setSuccess(true);
        setFormData({
          InterviewSchedule: "",
          candidateName: "",
          comments: "",
          company: "",
          date: new Date().toISOString().substr(0, 10),
          vendorEmail: "",
          employmentType: "",
          followUp2: "",
          followUp3: "",
          followUp4: "",
          InterviewOrSubmission: '',
          location: "",
          position: "",
          qcStatus: false,
          rate: "",
          recruiterName: user.name,
          sourceOfSubmission: "",
          vendorContact: "",
          vendorName: "",
          avatarUrl: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        // Re-enable the submit button
        setIsSubmitting(false);
        handleOpenSnackbar("Failed to submit the form. Please try again later.", "error");
      });
  };

  const handleInterviewOrSubmissionChange = (event) => {
    const selectedOption = event.target.value;
    setInterviewOrSubmission(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      InterviewOrSubmission: selectedOption
    }));
  };
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "90%" },
        marginTop: "64px", textAlign: 'center'
      }}
      autoComplete="off"
    >
      <div>
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData["date"]}
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          disabled
        />

        <TextField
          select
          label="Candidate Name"
          name="candidateName"
          value={formData.candidateName}
          onChange={handleSelectChange}
          variant="standard"
          required
        >
          {data.map((user, index) => (
            <MenuItem key={index} value={user.Candidate}>
              {user.Candidate}
            </MenuItem>
          ))}
        </TextField>
        <TaskList onDataReceived={handleTaskReceived} />

        <TextField
          select
          label="Submission or Interview"
          name="InterviewOrSubmission"
          value={formData.InterviewOrSubmission}
          onChange={handleInterviewOrSubmissionChange}
          variant="standard"
          required
        >
          <MenuItem value="Submission">Submission</MenuItem>
          <MenuItem value="Interview">Interview</MenuItem>
          {/* <MenuItem value="">Select</MenuItem> */}
          
        </TextField>

        {InterviewOrSubmission === "Interview" && (
          <TextField
            label="Interview Schedule"
            name="InterviewSchedule"
            type="date"
            value={formData.InterviewSchedule}
            onChange={handleInputChange}
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        )}
        <CandidateData onDataReceived={handleDataReceived} />

        <TextField
          required
          label="Company"
          name="company"
          value={formData["company"]}
          onChange={handleInputChange}
          variant="standard"
        />
        <TextField
          select
          label="Employment Type"
          name="employmentType"
          value={formData["employmentType"]}
          onChange={handleInputChange}
          variant="standard"
          required
        >
          <MenuItem value="Full-Time">Full-time</MenuItem>
          <MenuItem value="W2">W2</MenuItem>
          <MenuItem value="C2C">C2C</MenuItem>
          <MenuItem value="1099">1099</MenuItem>
        </TextField>

        <TextField
          label="Location"
          name="location"
          value={formData["location"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
        <TextField
          label="Position"
          name="position"
          value={formData["position"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
        {/* <TextField
          label="QC Status"
          name="qcStatus"
          value={formData["qcStatus"]}
          onChange={handleInputChange}
          variant="standard"
        /> */}
        <TextField
          label="Rate"
          name="rate"
          value={formData["rate"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
        {/* <TextField
          label="Recruiter Name"
          name="recruiterName"
          value={formData["recruiterName"]}
          onChange={handleInputChange}
          variant="standard"
        /> */}
        <TextField
          label="Source of Submission"
          name="sourceOfSubmission"
          value={formData["sourceOfSubmission"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
        <TextField
          label="Vendor Contact"
          name="vendorContact"
          value={formData["vendorContact"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
        <TextField
          label="Vendor Email"
          name="vendorEmail"
          value={formData["vendorEmail"]}
          onChange={handleInputChange}
          variant="standard"
          type='email'
          required
        />
        <TextField
          label="Vendor Name"
          name="vendorName"
          value={formData["vendorName"]}
          onChange={handleInputChange}
          variant="standard"
          required
        />
      </div>
      <TextField
        label="Comments"
        name="comments"
        value={formData["comments"]}
        onChange={handleInputChange}
        variant="standard"
        required
      />

      {/* <TextField
        label="Follow Up 2"
        name="followUp2"
        value={formData["followUp2"]}
        onChange={handleInputChange}
        variant="standard"
      />
      <TextField
        label="Follow Up 3"
        name="followUp3"
        value={formData["followUp3"]}
        onChange={handleInputChange}
        variant="standard"
      />
      <TextField
        label="Follow Up 4"
        name="followUp4"
        value={formData["followUp4"]}
        onChange={handleInputChange}
        variant="standard"
      /> */}

      {/* Add other TextField components here */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity} // use severity state
          >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <div>
      <Stack spacing={2} direction="row" sx={{ marginLeft: '5%' }}>
          <Button
            varient="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </div>
    </Box>
  );
};

export default InterviewForm;