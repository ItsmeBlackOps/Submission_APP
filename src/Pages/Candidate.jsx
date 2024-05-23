import React, { useState, useEffect } from "react";
import { Portal } from "@mui/base/Portal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useAuth } from "../utils/AuthContent";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
} from "@mui/x-data-grid";
import CandidateData from "./DataSources/CandidateData";
import Snackbar from "@mui/material/Snackbar";
import { Alert, Avatar } from "@mui/material";
import axios from "axios";
import {
  Autocomplete,
  CssBaseline,
  CardOverflow,
  CardActions,
  Input,
  Button,
  Modal,
  FormControl,
  FormLabel,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography
} from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import PropTypes from "prop-types";
// import Typography from "@mui/material";

const useFakeMutation = () => {
  return React.useCallback(
    (user) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (user.name?.trim() === "") {
            reject(new Error("Error while saving user: name cannot be empty."));
          } else {
            resolve({ ...user, name: user.name?.toUpperCase() });
          }
        }, 200);
      }),
    []
  );
};

const handleCloseSnackbar = () => {
  setSnackbarOpen(false);
};

const TextMaskAdapter = React.forwardRef(function TextMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        "#": /[1-9]/,
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

function MyCustomToolbar(props) {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById("filter-panel")}>
        <GridToolbarQuickFilter />
      </Portal>
      <GridToolbar {...props} />
    </React.Fragment>
  );
}

export default function Candidate_List() {
  const { user } = useAuth();
  const mutateRow = useFakeMutation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedData, setCopiedData] = React.useState("");
  const [snackbar, setSnackbar] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState("");
  const [upfront, setUpfront] = useState("");
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "",
  });
  console.log(user)
  useEffect(() => {
    if (user.labels[0] === "Manager" || user.labels[0] === "admin") {
      axios
        .get("https://reportcraft-backend.onrender.com/recruiters")
        .then((response) => {
          if (user.labels[0] === "Manager") {
            const filteredData = response.data.filter(
              (item) => item.Manager === user.name
              
            );
            setData(filteredData);
          } else if (user.labels[0] === "admin") {
            setData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [user.labels[0], user.name]);

  const onSubmit = async (data) => {
    const adjustedData = {
      "Branch": data.branch,
      "Candidate": data.Candidate,
      "Candidate's email address": data.candidateEmail,
      "Location": data.Location,
      "Manager": data.manager,
      "Marketing start date": data.marketingStartDate,
      "Open to Relocate": data.openToRelocate,
      "Phone number": data.phoneNumber,
      "Recruiter": data.recruiter,
      "Status": data.status,
      "Team Lead": data.teamLead,
      "Technology": data.technology,
      "Upfront": data.upfront,
      "Visa": data.visa,
    };

    try {
      const response = await axios.post(
        "https://reportcraft-backend.onrender.com/addCandidateData",
        adjustedData, {
          headers: {
            'Content-Type': 'application/json',
            'recruiterName': data.recruiter,
            'teamLead': data.teamLead,
            'Manager': data.Manager
          }
        }
      );
      if (response.status === 201) {
        // Show success message
        setNotification({
          open: true,
          message: "Candidate data added successfully",
          type: "success",
        });
        window.location.reload()
      } else {
        // Show error message
        setNotification({
          open: true,
          message: "Failed to add candidate data",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error message
      setNotification({
        open: true,
        message: "An error occurred",
        type: "error",
      });
    }
  };
  
  const uniqueRecruiters = [
    ...new Set(data.map((recruiter) => recruiter.Recruiter)),
  ];

  console.log(uniqueRecruiters)

  const handleRecruiterChange = (event, value) => {
    const selectedRecruiter = data.find(
      (recruiter) => recruiter.Recruiter === value
    );
    if (selectedRecruiter) {
      // setFormValue("teamLead", selectedRecruiter["Team Lead"] || "");
      setFormValue("manager", selectedRecruiter.Manager || "");
      setFormValue("branch", selectedRecruiter.Branch || "");
    }
  };

  const {
    control,
    handleSubmit,
    register,
    setValue: setFormValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onDataReceived = (data) => {
    setRows(data); // Fixed typo here

    setLoading(false);
  };
  console.log(rows);
  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const handleRowEdit = (newRow, oldRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    console.log(updatedRows);

    // Check if the current user is allowed to edit this row
    if (user.labels[0] === "admin" || newRow.Manager === user.name) {
      // Send updated row data to backend
      axios
        .post(
          `https://reportcraft-backend.onrender.com/updateCandidateRow/${newRow.id}`,
          newRow
        )
        .then(() => {
          setSnackbar({
            children: "Row successfully saved",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating row in backend:", error);
          setSnackbar({
            children: "Error updating row: " + error.message,
            severity: "error",
          });
        });
    } else {
      // Show a popup indicating that the user cannot edit this row
      setSnackbar({
        children: "You cannot edit this user's data",
        severity: "warning",
      });
    }

    console.log("Updated rows:", updatedRows); // Log the updated rows

    return updatedRows;
  };

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      const response = await mutateRow(newRow);
      handleRowEdit(newRow);
      setSnackbar({ children: "User successfully saved", severity: "success" });
      return response;
    },
    [mutateRow]
  );

  let columns = [
    {
      field: "Random URL",
      headerName: "Avatar",
      display: "flex",
      editable: false,
      renderCell: (params) => <Avatar alt="Avatar" src={params.value} />,
    },
    {
      field: "Branch",
      headerName: "Branch",
      width: 150,
      editable: false,
    },
    {
      field: "Candidate",
      headerName: "Candidate Name",
      width: "200",
      editable: false,
    },
    {
      field: "Recruiter",
      headerName: "Recruiter",
      display: "flex",
      width: "200",
      editable: false,
    },
    {
      field: "Team Lead",
      headerName: "Team Lead",
      width: 200,
      editable: false,
    },
    {
      field: "Manager",
      headerName: "Manager",
      width: 200,
      editable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "Visa",
      headerName: "Visa",
      width: 100,
      editable: false,
    },
    {
      field: "Candidate's email address",
      headerName: "Candidate's Email Address",
      width: 200,
      editable: false,
    },
    {
      field: "Location",
      headerName: "Location",
      width: 150,
      editable: false,
    },
    {
      field: "Marketing start date",
      headerName: "Marketing Start Date",
      width: 200,
      editable: false,
    },
    {
      field: "Open to Relocate",
      headerName: "Open to Relocate",
      width: 150,
      editable: false,
    },
    {
      field: "Phone number",
      headerName: "Phone Number",
      width: 200,
      editable: false,
    },

    {
      field: "Technology",
      headerName: "Technology",
      width: 200,
      editable: false,
    },
    {
      field: "Upfront",
      headerName: "Upfront",
      width: 150,
      editable: false,
    },

    {
      field: "id",
      headerName: "ID",
      width: 200,
      editable: false,
    },
  ];

  columns = columns.map((column) => {
    if (user.labels[0] === "admin" || user.labels[0] === "Manager") {
      return { ...column, editable: true };
    }
    return column;
  });
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Box
          sx={{
            height: "calc(100vh - 64px)",
            width: "100%",
            mt: "64px",
            boxSizing: "border-box",
            padding: 2,
          }}
        >
          {(user.labels[0] === "Manager" || user.labels[0] === "admin") && (
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<Add />}
              onClick={() => setOpen(true)}
            >
              New Candidate
            </Button>
          )}
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Branch</FormLabel>
                    <Input
                      size="sm"
                      placeholder="AHD"
                      {...register("branch", { required: true })}
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
                      {...register("Candidate", { required: true })}
                    />
                    {errors.candidate && (
                      <Typography color="error">
                        Candidate is required
                      </Typography>
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
                          {...register("candidateEmail", { required: true })}
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
                          render={({
                            field: { onChange, value, ref, name },
                          }) => (
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
                    <Input
                      size="sm"
                      placeholder="New York, NY"
                      {...register("Location", { required: true })}
                    />
                    {errors.location && (
                      <Typography color="error">
                        Location is required
                      </Typography>
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
                              getOptionLabel={(option) => option || ""}
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
                          
                          size="sm"
                          placeholder="Team Lead"
                          {...register("teamLead", { required: true })}
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
                      {...register("manager", { required: true })}
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
                          {...register("marketingStartDate", {
                            required: false,
                          })}
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
                              options={["Yes", "No"]}
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
                      {...register("status", { required: true })}
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
                      {...register("technology", { required: true })}
                    />
                    {errors.technology && (
                      <Typography color="error">
                        Technology is required
                      </Typography>
                    )}
                  </FormControl>
                  <Grid container>
                    <Grid item xs={6} sx={{ mb: 0, pr: 2 }}>
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
                                input: {
                                  component: NumericFormatAdapter,
                                  name,
                                },
                              }}
                            />
                          )}
                        />
                        {errors.upfront && (
                          <Typography color="error">
                            Upfront is required
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sx={{ mb: 0, pl: 2 }}>
                      <FormControl>
                        <FormLabel>Visa</FormLabel>
                        <Input
                          size="sm"
                          placeholder="Visa"
                          {...register("visa", { required: true })}
                        />
                        {errors.visa && (
                          <Typography color="error">
                            Visa is required
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <CardOverflow
                    sx={{
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: 2,
                    }}
                  >
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        onClick={() => setOpen(false)}
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
            </ModalDialog>
          </Modal>

          <DataGrid
            pageSizeOptions={[5, 15, 25]}
            checkboxSelection
            cellSelection
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
            clipboardCopyCellDelimiter={"	"}
            rows={rows}
            columns={columns}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterExcludeHiddenColumns: true,
                },
              },
              columns: {
                columnVisibilityModel: {
                  id: false,
                  Branch: false,
                  followUp4: false,
                },
              },
            }}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
          <div>
            <CandidateData onDataReceived={onDataReceived} />
          </div>
        </Box>
      </React.Fragment>
    </>
  );
}
