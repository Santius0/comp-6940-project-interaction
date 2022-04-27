import React, {useState} from 'react';
import {Box, Button, LinearProgress, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";

import TextInputComponent from "./TextInput.component";
import MusicLoader from "./MusicLoader/MusicLoader";
import {getRandomInt, traverse} from "../utils";
import ScoreIndicator from "./ScoreIndicator";
import ImageComponent from "./Image.component";

import success1 from "../assets/images/love-song.png";
import success2 from "../assets/images/romantic-music.png";
import fail1 from "../assets/images/drop-down.png";
import fail2 from "../assets/images/fail.png";
import PredictionSongs from "./PredictionSongs";

const clfPassImages = [success1, success2];
const clfFailImages = [fail1, fail2];

const Prediction = ({data, currentPrediction, predictions, onNewPrediction, updateCurrentPrediction = () => {} }) => {

    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [searching, setSearching] = useState(false);

    const [currentPredictionResults, setCurrentPredictionResults] = useState(null);
    // const [predictions, setPredictions] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);

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
        // setPredictions(prediction.concat([prediction]));
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
                setResults(true);
                // setPrediction(true);
                setSearchResults([]);
                setSearching(false);
                setCurrentPredictionResults(res);
                reset();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setPredictionLoading(false));
    }

    const reset = () => {
        // setPrediction(false);
        setSearchResults([]);
        updateCurrentPrediction(null);
        setSearching(false);
        setResults(false);
    }

    const onUpdateCurrentPage = (page) => {
      setCurrentPage(page);
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

    // if(results){
    //     return (
    //         <div style={{ width: '100%' }}>
    //             <Box component="div" sx={{ display: 'inline' }}>
    //                 {/*<h1>Prediction Successful - {currentPrediction['song_data'].billboard_name}</h1>*/}
    //                 {/*<h1>Prediction Score = Estimated Debut Rank {roundTwoDecimalPlaces(currentPrediction['prediction'])}</h1>*/}
    //                 <Button onClick={reset}>New Prediction</Button>
    //             </Box>
    //             <Box mt={10} component="div" sx={{ display: 'inline' }}>
    //                 {
    //                     currentPrediction['prediction_type'] === 'regression'
    //                         ?
    //                         <div>
    //                             <ScoreIndicator value={Math.round(currentPrediction['prediction'])} maxValue={100} lineWidth={5} lineSpacing={3}/>
    //                             <Typography variant="caption" fontWeight="bold" fontStyle="italic">
    //                                 Estimated Debut Rank Of {traverse(currentPrediction, ['billboard_name'])['billboard_name']}
    //                             </Typography>
    //                         </div>
    //                         :
    //                         <Box>
    //                             {
    //                                 currentPrediction['prediction'] === true
    //                                     ?
    //                                     <ImageComponent src={clfPassImages[getRandomInt(0, clfPassImages.length)]} maxWidth={400} maxHeight={500}/>
    //                                     :
    //                                     <ImageComponent src={clfFailImages[getRandomInt(0, clfPassImages.length)]} maxWidth={400} maxHeight={500}/>
    //                             }
    //                         </Box>
    //                 }
    //                 {/*     grid with all past predictions here  */}
    //             </Box>
    //         </div>
    //     );
    // }

    return(
        <Box>
            <PredictionSongs
                rows={predictions}
                // updateSelection={onSelectionChange}
                // selectionModel={selectedSubset}
                // currPage={currentPage}
                // updateCurrPage={onUpdateCurrentPage}
            />
            <Box mt={3}>
                <Button variant={"outlined"} onClick={() => setSearching(true)}>Search And Predict</Button>
            </Box>
        </Box>
    );
}

export default Prediction;