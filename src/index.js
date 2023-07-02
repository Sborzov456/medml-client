import * as React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import { createStore } from 'redux'
import { Provider, combineReducers } from 'react-redux'
import imageReducer from './redux/ImageReducer';

const store = createStore(imageReducer)


const BASE_URL = 'http://localhost:49118'
const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App url={BASE_URL}/>
        </Provider>
    </BrowserRouter>)






