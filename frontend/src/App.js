import './App.css';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import {Container} from "@mui/material";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import MainPage from "./components/MainPage";

const App = () => {
    return (
        <div className="App">
            <Container>
                <MainPage/>
            </Container>
            <ToastContainer/>
        </div>
  );
}

export default App;
