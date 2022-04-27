import React from 'react';
import Paper from '@mui/material/Paper';
import {
    Animation,
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
} from '@devexpress/dx-react-chart-material-ui';


const preloadedData = [
    { argument: 1, value: 10 },
    { argument: 2, value: 20 },
    { argument: 3, value: 34 },
    { argument: 4, value: 10 },
    { argument: 5, value: 13 },
    { argument: 6, value: 31 },
    { argument: 7, value: 20 },
    { argument: 8, value: 33 },
    { argument: 9, value: 31 },
    { argument: 10, value: 50 },
];

const LinePlot = ({data=preloadedData}) => {
    return(
        <Paper>
            <Chart data={data}>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="value" argumentField="argument"/>
            </Chart>
        </Paper>
    );
}

export default LinePlot;
