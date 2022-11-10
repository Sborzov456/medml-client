import * as React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

const BASE_URL = ''
const container = document.getElementById("root");
const root = createRoot(container)
root.render(<React.StrictMode>
    <BrowserRouter>
        <App url={BASE_URL}/>
    </BrowserRouter>
</React.StrictMode>)






