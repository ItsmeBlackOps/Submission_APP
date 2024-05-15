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

  const handleDataReceived = (jsonData) => {
    setData(jsonData);
    setLoading(false);
  };

    const handleTaskReceived = (tData) => {
    setTask(tData); // Fixed typo here
    setLoading(false);
  };

  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

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
      !formData.vendorContact ||
      !formData.vendorName ||
      (InterviewOrSubmission === "Interview" && !formData.InterviewSchedule)
    ) {
      handleOpenSnackbar("All fields are required.");
      return;
    }
    console.log("Existing data:", data);
    console.log('taskdata', taskdata)
    const existingEntry = taskdata.find((item) => {
      console.log("Comparing item:", item);
      console.log("With formData:", formData);
  
      return (
        item.company === formData.company &&
        item.location === formData.location &&
        item.position === formData.position &&
        item.rate === formData.rate &&
        item.sourceOfSubmission === formData.sourceOfSubmission &&
        item.vendorContact === formData.vendorContact &&
        item.vendorName === formData.vendorName &&
        item.candidateName === formData.candidateName &&
        item.comments === formData.comments &&
        item.employmentType === formData.employmentType &&
        item.followUp2 === formData.followUp2 &&
        item.followUp3 === formData.followUp3 &&
        item.followUp4 === formData.followUp4 &&
        item.interview === formData.interview &&
        item.qcStatus === formData.qcStatus &&
        item.recruiterName === formData.recruiterName &&
        item.submission === formData.submission &&
        item.InterviewOrSubmission === formData.InterviewOrSubmission
        );
    });
    if (existingEntry) {
      handleOpenSnackbar("Duplicate entry detected.");
      return;
    }

    // Disable the submit button
    setIsSubmitting(true);
    fetch("https://reportcraft-backend.onrender.com/addData", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Re-enable the submit button
        setIsSubmitting(false);
        // Reset all fields
        // setFormData({
        //   InterviewSchedule: "",
        //   candidateName: "",
        //   comments: "",
        //   company: "",
        //   date: new Date().toISOString().substr(0, 10),
        //   employmentType: "",
        //   followUp2: "",
        //   followUp3: "",
        //   followUp4: "",
        //   interview: "",
        //   location: "",
        //   position: "",
        //   qcStatus: false,
        //   rate: "",
        //   recruiterName: user.name,
        //   sourceOfSubmission: "",
        //   status: "",
        //   submission: "",
        //   vendorContact: "",
        //   vendorName: "",
        // });
      })
      .catch((error) => {
        console.error("Error:", error);
        // Re-enable the submit button
        setIsSubmitting(false);
        handleOpenSnackbar(
          "Failed to submit the form. Please try again later."
        );
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
          severity="error"
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
