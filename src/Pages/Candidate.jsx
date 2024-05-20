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
import { display, textAlign, width } from "@mui/system";
import { alignProperty } from "@mui/material/styles/cssUtils";

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
      display: 'flex',
      editable: false,
      renderCell: (params) => (
        <Avatar alt="Avatar" src={params.value} />
      ),
  
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
      width: '200',
      editable: false,
    },
    {
      field: "Recruiter",
      headerName: "Recruiter",
      display: 'flex',
      width: '200',
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
    if (
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
  );
}
