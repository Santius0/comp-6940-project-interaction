import React from 'react';
import ScatterPlot from "./ScatterPlot";
import {Box} from "@material-ui/core";
// import {Stack} from "@mui/material";
// import Container from "@mui/material/Container";

const MetricComparison = ({data, title='', numSeries=1}, XName='', YName='') => {

    return (
        <Box mb={4}>
            <ScatterPlot
                title={title}
                data={data}
                numScatterSeries={2}
                scatterSeriesNames={['Songs', 'Predicted Songs']}
                XName={XName}
                YName={YName}
            />
        </Box>
    );
}

export default MetricComparison;