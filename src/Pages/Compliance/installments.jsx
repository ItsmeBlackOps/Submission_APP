import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const InstallmentTable = ({ formData }) => {
    const [installments, setInstallments] = useState([0, 0, 0, 0]);
    const [dates, setDates] = useState([null, null, null, null]);

    useEffect(() => {
        if (!formData) return;

        const total = (formData.annualPackage * formData.agreementPercentage) / 100;
        const outstanding = total - formData.upfront;
        const installmentAmount = outstanding / 4;
        setInstallments([installmentAmount, installmentAmount, installmentAmount, installmentAmount]);

        const currentDate = new Date();
        const secondInstallmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 7);
        const thirdInstallmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 7);
        const fourthInstallmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 7);

        setDates([
            secondInstallmentDate.toLocaleDateString(),
            thirdInstallmentDate.toLocaleDateString(),
            fourthInstallmentDate.toLocaleDateString(),
        ]);
    }, [formData]);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Candidate Name:</TableCell>
                        <TableCell>{formData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Client Name:</TableCell>
                        <TableCell>{formData.company}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Annual Package:</TableCell>
                        <TableCell>${formData.annualPackage}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Agreement Percentage:</TableCell>
                        <TableCell>{formData.agreementPercentage}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total Amount:</TableCell>
                        <TableCell>${(formData.annualPackage * formData.agreementPercentage) / 100}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Upfront:</TableCell>
                        <TableCell>${formData.upfront}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>First Installment:</TableCell>
                        <TableCell>${installments[0]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Second Installment ({dates[0]}):</TableCell>
                        <TableCell>${installments[1]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Third Installment ({dates[1]}):</TableCell>
                        <TableCell>${installments[2]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Fourth Installment ({dates[2]}):</TableCell>
                        <TableCell>${installments[3]}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InstallmentTable;
