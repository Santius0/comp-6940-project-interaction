import React, {useState} from 'react';
import {Box, Button, LinearProgress, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";

import TextInputComponent from "./TextInput.component";
import MusicLoader from "./MusicLoader/MusicLoader";
import PredictionSongs from "./PredictionSongs";


const Prediction = ({predictions, onNewPrediction, updateCurrentPrediction = () => {} }) => {

    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [searching, setSearching] = useState(false);


    const handleSearchChange = e => {
        setSearchString(e.target.value);
    }

    const cancelTokenSource = axios.CancelToken.source();

    const querySong = () => {
        setLoading(true);
        axios.post(process.env.REACT_APP_BACKEND_URL + "/spotify-search", {
            search_string: searchString
        })
            .then(res => {
                console.log(res.data);
                setSearchResults(res.data);
                setSearching(true);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }

    const addPrediction = (prediction) => {
        onNewPrediction(prediction);
    }

    const handleSubmitPrediction = (id, name) => {
        console.log(id);
        setPredictionLoading(true);
        axios.post(process.env.REACT_APP_BACKEND_URL + "/predict", {
            cancelToken: cancelTokenSource.token,
            song_id: id,
            song_name: name
        })
            .then(res => {
                // eslint-disable-next-line no-eval
                res = eval(res.data)
                if(Array.isArray(res)) res = res[0];
                res['song_data'] = JSON.parse(res['song_data']);
                addPrediction(res);
                // setPrediction(true);
                setSearchResults([]);
                setSearching(false);
                reset();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setPredictionLoading(false));
    }

    const reset = () => {
        setSearchResults([]);
        updateCurrentPrediction(null);
        setSearching(false);
    }

    if(predictionLoading){
        return (
            <Box>
                <Typography variant={"subtitle1"} fontWeight={"bold"} fontStyle={"italic"}>
                    Processing Song...
                </Typography>
                <MusicLoader/>
            </Box>
        );
    }

    if(loading){
        return (
            <Box>
                <LinearProgress/>
                <Box mt={3}>
                    <Button variant="outlined" color="error" type="submit" onClick={e => { e.preventDefault(); cancelTokenSource.cancel(); setLoading(false); }} fullWidth={true}>
                        Cancel <SearchIcon/>
                    </Button>
                </Box>
            </Box>
        );
    }

    if(searching) {
        return (
            <Box>
                <Box mt={8}>
                    <form>
                        <TextInputComponent label="Search For Song" name="searchString" type="text" defaultValue={searchString} onChange={handleSearchChange}/>
                        <Box mt={3}>
                            <Button type="submit" onClick={e => {e.preventDefault(); querySong(); }} variant="contained" fullWidth={true}>
                                Search <SearchIcon/>
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Box mt={8}>
                    {searchResults.length > 0 ? <Typography variant={'subtitle2'}>Select A Song From Those Below</Typography> : null}
                    {searchResults.map(item => (
                        <Button key={item.id} onClick={() => handleSubmitPrediction(item.id, item.name)}>{item.name}</Button>
                    ))}
                    <Box mt={8}>
                        <Button onClick={() => {setSearching(false); setSearchResults([]);}}>Back</Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return(
        <Box>
            <PredictionSongs rows={predictions}/>
            <Box mt={3}>
                <Button variant={"outlined"} onClick={() => setSearching(true)}>Search And Predict</Button>
            </Box>
        </Box>
    );
}

export default Prediction;