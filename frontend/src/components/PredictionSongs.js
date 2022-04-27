import React, {useMemo} from 'react';
import {Box, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {randomUUID} from "../utils";


const columns = [
    { field: 'billboard_name', headerName: 'Title', minWidth: 150, flex: 0.7, headerAlign: "center", align: "center"},
    { field: 'debut_rank', headerName: 'Estimated Debut Rank Score', minWidth: 150, flex: 1, headerAlign: "center", align: "center" },
    { field: 'top_50', headerName: 'Estimated Top 50', minWidth: 150, flex: 1, headerAlign: "center", align: "center", type: "boolean"},
]

const PredictionSongs = ({ rows=[], updateSelection = l => {}, selectionModel=[], currPage = 1, updateCurrPage = c => {} }) => {

    const dataRows = useMemo(() => {
        // const cols = columns.map(item => item.field);
        // console.log(rowss);
        let final = []
        let unwrap = ({billboard_name, debut_rank, top_50}) => ({billboard_name, debut_rank, top_50});
        for(let i=0; i<rows.length; i++){
            let r = (rows[i])['song_data']
            r = r[0]
            console.log(r)
            final.push(unwrap(r))
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

    console.log(dataRows);
    return(
        <Box>
            <Typography variant={"h6"} fontWeight={"bold"} fontStyle={"italic"}>Predictions</Typography>
            <Typography variant={"subtitle1"} fontWeight={"bold"} fontStyle={"italic"}>Predict a song's debut rank and compare it to others via the 'Plot' tab.</Typography>
            {/*<div style={{ height: 400, width: '100%' }}>*/}
            <div style={{ width: '100%' }}>
                <DataGrid
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

export default PredictionSongs;