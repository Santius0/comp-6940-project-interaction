import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useDemoData} from "@mui/x-data-grid-generator";
import {useMemo, useState} from "react";
import {Box, Typography} from "@mui/material";
import {randomUUID} from "../utils";


// const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'firstName',
//         headerName: 'First name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'lastName',
//         headerName: 'Last name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 110,
//         editable: true,
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 160,
//         valueGetter: (params) =>
//             `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//     },
// ];

const columns = [
    { field: 'billboard_name', headerName: 'Title', minWidth: 150, flex: 1, headerAlign: "center", align: "center"},
    { field: 'debut_rank', headerName: 'Debut Rank', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
    { field: 'peak_rank', headerName: 'Peak Rank', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
    { field: 'avg_rank_score', headerName: 'Average Rank Score', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 5,
//     maxColumns: 6,
// });

const AllSongs = ({ rows=[], updateSelection = l => {}, selectionModel=[], currPage = 1, updateCurrPage = c => {} }) => {

    const dataRows = useMemo(() => {
        // const cols = columns.map(item => item.field);
        // console.log(rowss);
        let final = []
        let unwrap = ({index, billboard_name, debut_rank, peak_rank, avg_rank_score}) => ({index, billboard_name,debut_rank, peak_rank, avg_rank_score});
        for(let i=0; i<rows.length; i++){
            final.push(unwrap(rows[i]))
            // console.log(final[i])
        }
        return final
    }, [rows])

    const onSelectionChange = (selectionModel) => {
      updateSelection(selectionModel);
    }

    const onPageChange = (page) => {
        updateCurrPage(page);
    }

    return (
        <Box>
            <Typography variant={"h6"} fontWeight={"bold"} fontStyle={"italic"}>Select Songs</Typography>
            <Typography variant={"subtitle1"} fontWeight={"bold"} fontStyle={"italic"}>View Song Data Here. See Selected Song Plots On The 'Plots' Tab</Typography>
        {/*<div style={{ height: 400, width: '100%' }}>*/}
            <div style={{ width: '100%' }}>
                <DataGrid
                    initialState={{
                        pagination: {
                            page: currPage,
                        }
                    }}
                    autoHeight
                    getRowId={(row) => randomUUID()}
                    rows={dataRows}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    checkboxSelection
                    disableSelectionOnClick
                    selectionModel={selectionModel}
                    onSelectionModelChange={onSelectionChange}
                    onPageChange={onPageChange}
                />
            </div>
        </Box>
    );
}

export default AllSongs;