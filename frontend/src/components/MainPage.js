import React, {useEffect, useMemo, useState} from 'react';
import {Box, LinearProgress} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TabPanel from "./TabPanel";
import Toolbar from "@mui/material/Toolbar";
import MetricComparison from "./MetricComparison";
import SelectInputComponent from "./SelectInput.component";
import axios from "axios";
import Prediction from "./Prediction";
import {Grid} from "@mui/material";
import AllSongs from "./AllSongs";

const PREDICTED_VARIABLE = "debut_rank";
const PREDICTED_VARIABLE2 = "top_50";

const MainPage = () => {

    const theme = useTheme();
    const [currentTab, setCurrentTab] = useState(0);
    const [xCols, setXCols] = useState([]);
    const [yCols, setYCols] = useState([]);
    const [selectedInputs, setSelectedInputs] = useState({
        selectedXCol: {name: "", value: 0},
        selectedYCol: {name: "", value: 0},
    });
    const [songData, setSongData] = useState([]);
    const [selectedSubset, setSelectedSubset] = useState([]);
    const [songDataList, setSongDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSongPage, setCurrentSongPage] = useState(8);
    const [currentPrediction, setCurrentPrediction] = useState(null);
    const [predictions, setPredictions] = useState([]);
    // const [includePredicted, setIncludePredicted] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + "/fetch-all-songs")
            .then(res => {
                // eslint-disable-next-line no-eval
                const data = eval(res.data);
                setXCols(data['x_columns']);
                setYCols(data['y_columns']);
                setSongData(data['all_songs']);
                setSongDataList(JSON.parse(data['all_songs_list']));
                // console.log(data);
                // console.log(JSON.parse(data['all_songs_list']));
                // console.log(data['x_columns'])
                // console.log(data['y_columns'])
                // console.log(data['all_songs'])
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }, [])


    const dataPoints = useMemo(() => {
        if(selectedInputs.selectedXCol.name === "" || selectedInputs.selectedYCol.name === "") return []
        // console.log("memo x", selectedInputs.selectedXCol.name);
        // console.log("memo y", selectedInputs.selectedYCol.name);
        // console.log(songData[selectedInputs.selectedXCol.name]);
        // console.log(songData[selectedInputs.selectedYCol.name]);

        const x_data = songData[selectedInputs.selectedXCol.name];
        const y_data = songData[selectedInputs.selectedYCol.name];
        const billboard_names = songData['billboard_name']

        if(x_data === undefined || y_data === undefined) return []

        let x_keys = [];
        let y_keys = [];
        // console.log('selected subset', selectedSubset);
        if(selectedSubset.length > 0){
            x_keys = selectedSubset;
            y_keys = selectedSubset;
        } else {
            x_keys = Object.keys(x_data);
            y_keys = Object.keys(y_data);
        }

        let scatter_data = [];
        // console.log('x_keys', x_keys);

        for(let i=0; i<x_keys.length; i++){
            // console.log(x_data[x_keys[i]]);
            scatter_data.push({
                scatter_x_1: x_data[x_keys[i]],
                scatter_y_1: y_data[y_keys[i]],
                billboard_name: billboard_names[i],
                x_display: x_data[x_keys[i]],
                y_display: y_data[y_keys[i]],
            });
        }

        // console.log(selectedInputs.selectedXCol.name)
        // console.log(PREDICTED_VARIABLE)

        if(selectedInputs.selectedYCol.name === PREDICTED_VARIABLE || selectedInputs.selectedYCol.name === PREDICTED_VARIABLE2) {
            // console.log('CALLED')
            for (let i = 0; i < predictions.length; i++) {
                // console.log(x_data[x_keys[i]]);
                let sd = predictions[i]['song_data'];
                sd = sd[i];
                // console.log('traverse0', sd['billboard_name']);
                // console.log('traverse0.5', selectedInputs.selectedXCol.name);
                // console.log('traverse1', sd[0][selectedInputs.selectedYCol.name]);
                // console.log('traverse2', (predictions[i]['prediction'])[0]);
                scatter_data.push({
                    scatter_x_2: sd[selectedInputs.selectedXCol.name],
                    scatter_y_2: selectedInputs.selectedYCol.name === PREDICTED_VARIABLE ? (predictions[i]['regr_prediction'])[0] : (predictions[i]['svm_prediction'])[0],
                    billboard_name: sd['billboard_name'],
                    x_display: sd[selectedInputs.selectedXCol.name],
                    y_display: selectedInputs.selectedYCol.name === PREDICTED_VARIABLE ? (predictions[i]['regr_prediction'])[0] : (predictions[i]['svm_prediction'])[0],
                });
            }
        }

        return scatter_data;
    }, [selectedInputs.selectedXCol.name, selectedInputs.selectedYCol.name, songData, selectedSubset, predictions]);

    const updateCurrentPredication = (prediction) => {
        setCurrentPrediction(prediction);
    }

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleChangeIndex = (index) => {
        setCurrentTab(index);
    };

    const handleSelectInput = e => {
        const {name, value} = e.target;
        // console.log(name, value);
        setSelectedInputs(prevState => ({
            ...prevState,
            [name]: {name: value, value: value}
        }))
    }

    const generateTabProps = index => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    const onSelectionChange = (selectedList) => {
        setSelectedSubset(selectedList);
    }

    const onUpdateCurrentPage = (page) => {
        setCurrentSongPage(page);
    }

    const addPrediction = prediction => {
        setCurrentPrediction(prediction);
        const tmp = predictions.concat([prediction])
        setPredictions(tmp);
        console.log("add prediction", predictions);
    }

    // const onToggleIncludePredicted = () => {
    //     setIncludePredicted(!includePredicted);
    // }

    return(
        <Box sx={{ bgcolor: 'background.paper', width: "100%" }}>
            <AppBar position="fixed">
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Songs" {...generateTabProps(0)} />
                    <Tab label="Plots" {...generateTabProps(1)} />
                    <Tab label="Predictions" {...generateTabProps(2)} />
                </Tabs>
            </AppBar>
            <Toolbar> </Toolbar>
            {loading ?
                <Grid container spacing={0} align="center" justify="center" direction="column" style={{ backgroundColor: 'teal' }}>
                    <Grid item style={{ backgroundColor: 'yellow' }}>
                        {/*<MusicLoader/>*/}
                        <LinearProgress/>
                    </Grid>
                </Grid>
                :
                <div>
                    {
                        currentTab === 1 ?
                            <Box mb={2}>
                                <form>
                                    <SelectInputComponent label="Music Characteristic" name="selectedXCol"
                                                          options={xCols.map((item, index) => ({
                                                              name: item,
                                                              value: item
                                                          }))}
                                                          defaultOption={{name: "", value: ""}}
                                                          onChange={handleSelectInput}
                                                          helperText={'X-Axis'}
                                    />
                                    <SelectInputComponent label="Popularity Metric" name="selectedYCol"
                                                          options={yCols.map((item, index) => ({
                                                              name: item,
                                                              value: item
                                                          }))}
                                                          defaultOption={{name: "", value: ""}}
                                                          onChange={handleSelectInput}
                                                          helperText={'Y-Axis'}
                                    />
                                </form>
                                <Typography variant="caption">Note: Predicated Comparison Only Available For Debut Rank</Typography>
                            </Box>
                            :
                            null
                    }
                    <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={currentTab}
                    onChangeIndex={handleChangeIndex}>
                    <TabPanel value={currentTab} index={0} dir={theme.direction}>
                        <AllSongs
                            rows={songDataList}
                            updateSelection={onSelectionChange}
                            selectionModel={selectedSubset}
                            currPage={currentSongPage}
                            updateCurrPage={onUpdateCurrentPage}
                        />
                    </TabPanel>
                    <TabPanel value={currentTab} index={1} dir={theme.direction}>
                        <MetricComparison
                            data={dataPoints}
                            title={selectedInputs.selectedXCol.name !== "" && selectedInputs.selectedYCol.name !== "" ?
                                `${selectedInputs.selectedXCol.name} vs. ${selectedInputs.selectedYCol.name}` :
                                'Select A Song Characteristic And A Performance Metric'}
                            numSeries={2}
                        />
                    </TabPanel>
                    <TabPanel value={currentTab} index={2} dir={theme.direction}>
                    <Prediction
                        data={songData}
                        predictions={predictions}
                        currentPrediction={currentPrediction}
                        onNewPrediction={addPrediction}
                        updateCurrentPrediction={updateCurrentPredication}
                    />
                    </TabPanel>
                    </SwipeableViews>
                </div>
            }
        </Box>

    );
}
export default MainPage;

