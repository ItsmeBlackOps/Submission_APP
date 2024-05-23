import React, { useState, useEffect } from "react";
import { Portal } from "@mui/base/Portal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useAuth } from "../utils/AuthContent";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
  GridActionsCellItem
} from "@mui/x-data-grid";
import TaskList from "./DataSources/TasksData";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
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

export default function Interview_List() {
  const { user } = useAuth();
  const mutateRow = useFakeMutation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedData, setCopiedData] = React.useState("");
  const [snackbar, setSnackbar] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenSnackbar = (message, severity) => {
    setSnackbar({ children: message, severity: severity });
    setSnackbarOpen(true);
  };
  const onDataReceived = (data) => {
    const filteredData = data.filter((row) => {
      return row.InterviewOrSubmission === "Interview";
    });
    
    setRows(filteredData);
    setLoading(false);
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

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
      })
      .catch((error) => {
        handleOpenSnackbar("Error deleting row: " + error.message, "error");
      });
    } else {
      // Handle the case where the user doesn't have permission
      handleOpenSnackbar("You do not have permission to delete this row.", "error");
    }
  };

  const handleRowEdit = (newRow, oldRow) => {
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
    {
      field: "InterviewSchedule",
      headerName: "Interview Schedule",
      width: 200,
      editable: true,
    },
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
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(params.id)}
          color="inherit"
        />,
      ],
    }
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
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', mt: '64px', boxSizing: 'border-box', padding: 2 }}>
      <DataGrid
        pageSizeOptions={[5, 25, 100]}
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
          open
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
    </Box>
  );
}