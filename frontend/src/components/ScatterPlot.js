import React, {useMemo, useState} from "react";
import Paper from '@mui/material/Paper';
import {
    ArgumentAxis,
    Chart,
    ScatterSeries,
    ValueAxis,
    Legend, Title, LineSeries, Tooltip
} from '@devexpress/dx-react-chart-material-ui';
// import {dataGenerator} from "../utils";
import {EventTracker,
    HoverState,
    // SelectionState,
} from '@devexpress/dx-react-chart';
import * as d3Format from 'd3-format';



// const StyledDiv = styled('div')(() => ({
//     [`&.${classes.text}`]: {
//         display: 'flex',
//         flexDirection: 'row',
//     },
//     [`&.${classes.group}`]: {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     [`&.${classes.hoverGroup}`]: {
//         width: '300px',
//     },
// }));


const ScatterPlot = ({data=[], title='', numScatterSeries=0,
                         scatterSeriesNames=null, numLineSeries=0,
                         lineSeriesNames=null, XName='', YName=''}) => {

    const tooltipContentTitleStyle = {
        fontWeight: 'bold',
        paddingBottom: 0,
    };
    const tooltipContentBodyStyle = {
        paddingTop: 0,
    };
    const formatTooltip = d3Format.format(',.2r');

    const TooltipContent = (props) => {
        const { targetItem, text, ...restProps } = props;
        return (
            <div>
                <div>
                    <Tooltip.Content
                        {...restProps}
                        style={tooltipContentTitleStyle}
                        text={data[targetItem.point]['billboard_name']}
                    />
                </div>
                <div>
                    <Tooltip.Content
                        {...restProps}
                        style={tooltipContentBodyStyle}
                        text={"("+formatTooltip(data[targetItem.point]['x_display']) + "," + formatTooltip(data[targetItem.point]['x_display'])+")"}
                    />
                </div>
            </div>
        );
    };

    // const [chartData] = useState(data === null ? dataGenerator(100) : data);
    const [hoverState, setHoverState] = useState(undefined);
    const [selectionState, setSelectionState] = useState([]);
    const [targetItem, setTargetItem] = useState(undefined);

    const changeHover = (hover) => {
        setHoverState(hover);
        // console.log('hover', hover);
    }

    const changeSelection = (selection) => {
        // selectionState(selection);
        // console.log('selection', selection);
        if(selectionState[0] && compare(selectionState[0], selection.targets[0])){
            setSelectionState([]);
        } else if(selectionState[0]) {
          setSelectionState([selection.targets[0]]);
        }
    }

    const compare = (
        { series, point }, { series: targetSeries, point: targetPoint },
    ) => series === targetSeries && point === targetPoint;


    const scatterSeries = useMemo(() => {
        // console.log("chartData", data);
        let charts = []
        for(let i = 0; i < numScatterSeries; i++){
           charts.push(
               <ScatterSeries
                   key={i}
                   name={scatterSeriesNames.length >= i ? scatterSeriesNames[i] : ''}
                   valueField={`scatter_y_${i+1}`}
                   argumentField={`scatter_x_${i+1}`}
               />
           );
        }
        return charts;
    }, [data, numScatterSeries, scatterSeriesNames]);

    const lineSeries = useMemo(() => {
        let charts = []
        for(let i = 0; i < numLineSeries; i++){
           charts.push(
               <LineSeries
                   key={i}
                   name={lineSeriesNames.length >= i ? lineSeriesNames[i] : ''}
                   valueField={`line_y_${i+1}`}
                   argumentField={`line_x_${i+1}`}
               />
           );
        }
        return charts;
    }, [numLineSeries, lineSeriesNames]);

    const handleTargetItemChange = (target) => {
        setTargetItem(target);
        // console.log(target);
    }

    return(
        <Paper>
            <Chart data={data}>
                <ArgumentAxis />
                <ValueAxis />
                {scatterSeries}
                {lineSeries}
                <Legend />
                <Title text={title} />
                <EventTracker onClick={changeSelection}/>
                <HoverState hover={hoverState} onHoverChange={changeHover}/>
                {/*<SelectionState selection={selectionState}/>*/}
                <Tooltip
                    targetItem={targetItem}
                    onTargetItemChange={handleTargetItemChange}
                    contentComponent={TooltipContent}
                />
            </Chart>
        </Paper>
    );
}

export default ScatterPlot;