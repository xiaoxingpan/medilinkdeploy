import React, { useState, useEffect } from 'react';
import tw from "twin.macro";
import * as Yup from "yup";
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CustomModal from './Modal';
import CustomSnackbar from './SnackBar';

function ManageMessage() {
    const columns = [
        { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 250 },
        { field: 'isread', headerName: 'Status', headerAlign: 'center', align: 'center', width: 400 },
        { field: 'description', headerName: 'Description', headerAlign: 'center', flex: 1, align: 'center', width: 500 },
        {
            field: 'image_url',
            headerName: 'Image',
            headerAlign: 'center',
            align: 'center',
            width: 400,
            renderCell: (params) => (
                <img
                    src={params.row.image_url}
                    alt="Image"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '150px', }}
                />
            ),
        },

    ];
    const rows = [
        { id: 1, status: false, type: "complaint", content: 'Department 1', From: 'Description 1', Related: 'https://picsum.photos/200/300', sentAt: '2021-10-10 10:10:10' }
    ]

    const rowHeight = 200;
    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={rows.length === 0}
                density='comfortable'
                getRowHeight={(params) => rowHeight}
                // dataProvider={(params) => {
                //     return rows;
                // }}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20]}
                disableExtendRowFullWidth={true}
                checkboxSelection
                sx={{ fontSize: '1.5rem' }}
            />
        </>
    );

}

export default ManageMessage;