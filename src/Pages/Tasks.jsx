import React, { useState, useEffect } from "react";
import { Portal } from "@mui/base/Portal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useAuth } from "../utils/AuthContent";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import TaskList from "./DataSources/TasksData";
import Snackbar from "@mui/material/Snackbar";
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

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

export default function QuickFilterOutsideOfGrid() {
  const { user } = useAuth();
  const mutateRow = useFakeMutation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedData, setCopiedData] = useState("");
  const [snackbar, setSnackbar] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [intSchedule, setSchedule] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [round, setRound] = useState("");
  const [rowswithINT, setIntRows] = useState([]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenSnackbar = (message, severity) => {
    setSnackbar({ children: message, severity: severity });
    setSnackbarOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRowId(null);
    setInterviewDate("");
  };

  const handleDialogSubmit = () => {
    const rowToDuplicate = rows.find((row) => row.id === selectedRowId);
    if (rowToDuplicate) {
      rowToDuplicate["InterviewOrSubmission"] = "Interview";
      rowToDuplicate["SubmissionDate"] = rowToDuplicate["date"];
      rowToDuplicate["InterviewSchedule"] = interviewDate;
      rowToDuplicate["date"] = new Date().toISOString().substr(0, 10);
      rowToDuplicate["RoundOfInterview"] = round;
      delete rowToDuplicate["id"];
      console.log(rowToDuplicate);
      const existingEntry = rowswithINT.find((item) => {
        delete item["id"];
        const keys1 = Object.keys(item);
        const keys2 = Object.keys(rowToDuplicate);
        for (let key of keys1) {
          console.log(item[key], rowToDuplicate[key]);
          if (
            typeof item[key] === "object" &&
            typeof rowToDuplicate[key] === "object"
          ) {
            if (!areObjectsEqual(item[key], rowToDuplicate[key])) {
              console.log("Objects not equal:", item[key], rowToDuplicate[key]);
              return false;
            }
          } else if (item[key] !== rowToDuplicate[key]) {
            return false;
          }
        }

        return true;
      });

      if (existingEntry) {
        handleOpenSnackbar("Duplicate entry detected.", "warning");
        handleDialogClose();
      } else {
        fetch("https://reportcraft-backend.onrender.com/addData", {
          method: "POST",
          body: JSON.stringify(rowToDuplicate),
          headers: {
            "Content-Type": "application/json",
            "user-id": user.name,
            "user-label": user.labels[0],
          },
        })
        .then((response) => response.json())
        .then(() => {
          handleOpenSnackbar("Interview converted successfully.", "success");
          window.location.reload()
        })
        .catch((error) => {
          handleOpenSnackbar("Error converting interview: " + error.message, "error");
        });

        handleDialogClose();
      }
    }
  };

  const convertInterview = React.useCallback(
    (id) => () => {
      setSelectedRowId(id);
      setDialogOpen(true);
    },
    []
  );

  const handleDeleteClick = (id) => () => {
    const row = rows.find((row) => row.id === id);

    if (row.recruiterName === user.name || user.labels[0] === 'Manager' || user.labels[0] === 'admin') {
      // Update state to remove the row
      setRows(rows.filter((row) => row.id !== id));
  
      // Make the API call to delete the data
      fetch(`https://reportcraft-backend.onrender.com/data/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.name,
        },
      })
      .then((response) => response.json())
      .then(() => {
        handleOpenSnackbar("Row deleted successfully.", "success");
        window.location.reload()
      })
      .catch((error) => {
        handleOpenSnackbar("Error deleting row: " + error.message, "error");
      });
    } else {
      // Handle the case where the user doesn't have permission
      handleOpenSnackbar("You do not have permission to delete this row.", "error");
    }
  };

  const onDataReceived = (data) => {
    const filteredData = data.filter((row) => {
      return row.InterviewOrSubmission === "Submission";
    });
    const interviewData = data.filter((row) => {
      return row.InterviewOrSubmission === "Interview";
    });
    setIntRows(interviewData);
    setRows(filteredData);
    setLoading(false);
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    handleOpenSnackbar(error.message, "error");
  }, []);

  const handleRowEdit = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    console.log(updatedRows);

    // Check if the current user is allowed to edit this row
    if (user.labels[0] === "admin" || newRow.recruiterName === user.name) {
      // Send updated row data to backend
      axios
        .post(
          `https://reportcraft-backend.onrender.com/updateRow/${newRow.id}`,
          newRow
        )
        .then(() => {
          handleOpenSnackbar("Row successfully saved", "success");
        })
        .catch((error) => {
          console.error("Error updating row in backend:", error);
          handleOpenSnackbar("Error updating row: " + error.message, "error");
        });
    } else {
      // Show a popup indicating that the user cannot edit this row
      handleOpenSnackbar("You cannot edit this user's data", "warning");
    }

    console.log("Updated rows:", updatedRows); // Log the updated rows

    return updatedRows;
  };

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      const response = await mutateRow(newRow);
      handleRowEdit(newRow);
      handleOpenSnackbar("User successfully saved", "success");
      return response;
    },
    [mutateRow]
  );

  let columns = [
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "candidateName",
      headerName: "Candidate Name",
      width: 200,
      editable: false,
    },
    {
      field: "recruiterName",
      headerName: "Recruiter Name",
      width: 200,
      editable: false,
    },
    { field: "company", headerName: "Company", width: 200, editable: true },
    {
      field: "employmentType",
      headerName: "Employment Type",
      width: 150,
      editable: true,
    },
    {
      field: "InterviewOrSubmission",
      headerName: "InterviewOrSubmission",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Submission", "Interview"],
    },
    // {
    //   field: "InterviewSchedule",
    //   headerName: "Interview Schedule",
    //   width: 200,
    //   editable: true,
    // },
    { field: "location", headerName: "Location", width: 150, editable: true },
    { field: "position", headerName: "Position", width: 200, editable: true },
    {
      field: "rate",
      headerName: "Rate",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "sourceOfSubmission",
      headerName: "Source Of Submission",
      width: 200,
      editable: true,
    },
    { field: "status", headerName: "Status", width: 150, editable: true },
    {
      field: "vendorContact",
      headerName: "Vendor Contact",
      width: 200,
      editable: true,
    },
    {
      field: "vendorName",
      headerName: "Vendor Name",
      width: 200,
      editable: true,
    },
    { field: "comments", headerName: "Comments", width: 200, editable: true },
    {
      field: "qcStatus",
      headerName: "QC Status",
      width: 150,
      editable: false,
      type: "boolean",
    },
    {
      field: "followUp2",
      headerName: "Follow Up 2",
      width: 200,
      editable: true,
      hide: true,
    },
    {
      field: "followUp3",
      headerName: "Follow Up 3",
      width: 200,
      editable: true,
      hide: true,
    },
    {
      field: "followUp4",
      headerName: "Follow Up 4",
      width: 200,
      editable: true,
      hide: true,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="Convert To Interview"
          onClick={convertInterview(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(params.id)}
          color="inherit"
        />,
      ],
    },
  ];

  columns = columns.map((column) => {
    if (
      column.field === "qcStatus" &&
      (user.labels[0] === "admin" || user.labels[0] === "Manager")
    ) {
      return { ...column, editable: true };
    }
    return column;
  });

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        width: "100%",
        mt: "64px",
        boxSizing: "border-box",
        padding: 2,
      }}
    >
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
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
          filter: {
            filterModel: {
              items: [],
              quickFilterExcludeHiddenColumns: true,
            },
          },
          columns: {
            columnVisibilityModel: {
              followUp2: false,
              followUp3: false,
              followUp4: false,
            },
          },
        }}
      />

      {!!snackbar && (
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      <div>
        <TaskList onDataReceived={onDataReceived} />
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Convert to Interview</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Interview Date"
            type="date"
            fullWidth
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Round"
            type="string"
            fullWidth
            value={round}
            onChange={(e) => setRound(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
