import React from "react";

import UploadPage from "./UploadPage";
import ResultsPageInterface from "./ResultsPage";
import MaskPage from "./MaskPage";
import {
    Route,
    Routes
} from "react-router-dom";


function App() {
    return(
            <Routes>
                <Route path="/mask/:id" element={<MaskPage />}/>
                <Route exact path="result/:number"  element={<ResultsPageInterface />} />}/>
                <Route exact path="/" element={<UploadPage />}/>
            </Routes>
);
}

export default App;