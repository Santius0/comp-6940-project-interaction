import './App.css';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import {Container} from "@mui/material";

import MainPage from "./components/MainPage";

const App = () => {
    return (
        <div className="App">
            <Container>
                <MainPage/>
            </Container>
        </div>
  );
}

export default App;
