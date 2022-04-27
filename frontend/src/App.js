import './App.css';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';

import {Container} from "@mui/material";

// import {FileUpload} from "./components/FileUpload/FileUpload";
// import LineChart from "./components/LineChart";
// import LinePlot from "./components/LinePlot";
// import ScatterPlot from "./components/ScatterPlot";
// import axios from "axios";
// import {useEffect} from "react";
// import InputPage from "./components/InputPage";
// import DataGridDemo from "./components/AllSongs";
// import ResponsiveAppBar from "./components/NavBar";
import MainPage from "./components/MainPage";

let data = [
    { date: 20220101, impressions: 100 },
    { date: 20210102, impressions: 121 },
    { date: 20220103, impressions: 122 },
    { date: 20220104, impressions: 123 },
    { date: 20220105, impressions: 124 },
    { date: 20220106, impressions: 125 },
    { date: 20220107, impressions: 123 },
    { date: 20220108, impressions: 123 },
    { date: 20220109, impressions: 122 },
    { date: 20220110, impressions: 122 },
    { date: 20220112, impressions: 121 },
    { date: 20220102, impressions: 121 },
    { date: 20220102, impressions: 122 },
];

const App = () => {

    // useEffect(() => {
    //     axios.post("http://127.0.0.1:8000/api/predict", {
    //         inputType: 'spotifyId', //spotifyId or byteArray
    //         data: null
    //       })
    //       .then(function (response) {
    //         console.log(response.data);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    // }, []);

    return (
        <div className="App">
            <Container>
                <MainPage/>
                {/*<Main/>*/}
            </Container>
        </div>
  );
}

export default App;
