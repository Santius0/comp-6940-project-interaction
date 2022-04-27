import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useDemoData} from "@mui/x-data-grid-generator";
import {useMemo, useState} from "react";
import {Box, Typography} from "@mui/material";
import {randomUUID} from "../utils";


const columns = [
    { field: 'billboard_name', headerName: 'Title', minWidth: 150, flex: 1, headerAlign: "center", align: "center"},
    { field: 'debut_rank', headerName: 'Debut Rank', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
    { field: 'peak_rank', headerName: 'Peak Rank', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
    { field: 'avg_rank_score', headerName: 'Average Rank Score', minWidth: 150, flex: 0.8, headerAlign: "center", align: "center" },
];



const AllSongs = ({ rows=[], updateSelection = l => {}, selectionModel=[], currPage = 1, updateCurrPage = c => {} }) => {

    const dataRows = useMemo(() => {
        let final = []
        let unwrap = ({index, billboard_name, debut_rank, peak_rank, avg_rank_score}) => ({index, billboard_name,debut_rank, peak_rank, avg_rank_score});
        for(let i=0; i<rows.length; i++){
            final.push(unwrap(rows[i]))
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