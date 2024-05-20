import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const InstallmentTable = ({ formData }) => {
  const [installments, setInstallments] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (!formData) return;

    const total = (formData.annualPackage * formData.agreementPercentage) / 100;
    const outstanding = total - formData.upfront;
    let remainingBalance = outstanding;
    const installmentDates = [];
    const newInstallments = [];

    // Calculate first installment amount
    const firstInstallment = outstanding / 4;
    newInstallments.push(firstInstallment);
    remainingBalance -= firstInstallment;

    // Calculate remaining installment amounts
    const subsequentInstallmentAmount = firstInstallment / 2;
    for (let i = 0; i < 6; i++) {
      newInstallments.push(subsequentInstallmentAmount);
      remainingBalance -= subsequentInstallmentAmount;
    }

    // Calculate installment dates based on the joining date
    if (formData.joiningDate) {
      const currentDate = new Date(formData.joiningDate);
      const day = currentDate.getDate();

      for (let i = 0; i < 7; i++) {
        const installmentDate = new Date(currentDate);
        installmentDate.setMonth(currentDate.getMonth() + i);

        if (i === 0) {
          if (day > 7) {
            installmentDate.setDate(21);
          } else {
            installmentDate.setDate(7);
          }
        } else {
          const previousDate = installmentDates[i - 1];
          const previousDay = new Date(previousDate).getDate();
          if (previousDay === 7) {
            installmentDate.setDate(21);
          } else {
            installmentDate.setDate(7);
          }
        }

        installmentDates.push(
          installmentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
        );
      }

      setDates(installmentDates);
    }

    setInstallments(newInstallments);
  }, [formData]);

  if (!installments.length || !dates.length) {
    return null; // Render nothing if installments or dates are not yet calculated
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead></TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderBottom: 0,
                borderTop: 1,
              }}
            >
              Candidate Name:
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderBottom: 0,
                borderTop: 1,
              }}
            >
              {formData.name}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>
              Client Name:
            </TableCell>
            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>
              {formData.company}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Annual Package:</TableCell>
            <TableCell>${formData.annualPackage.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Agreement Percentage:</TableCell>
            <TableCell>{formData.agreementPercentage}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Amount:</TableCell>
            <TableCell>
              $
              {(
                (formData.annualPackage * formData.agreementPercentage) /
                100
              ).toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Upfront:</TableCell>
            <TableCell>${formData.upfront.toFixed(2)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>First Installment</TableCell>
            <TableCell>${installments[0].toFixed(2)}</TableCell>
          </TableRow>

          {installments.slice(1).map((amount, index) => (
            <TableRow key={index}>
              <TableCell>{dates[index + 1]}:</TableCell>
              <TableCell>${amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InstallmentTable;
