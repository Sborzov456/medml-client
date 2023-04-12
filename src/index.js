import * as React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

const BASE_URL = 'http://85.143.115.145:49118'
const container = document.getElementById("root");
const root = createRoot(container)
root.render(<React.StrictMode>
    <BrowserRouter>
        <App url={BASE_URL}/>
    </BrowserRouter>
</React.StrictMode>)






