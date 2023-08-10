import React from 'react';
import { useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import '../styles/style.css'
import { useDispatch, useSelector } from 'react-redux';


const OpenSeadragonViewer = () => {
    const [viewer, setViewer] = useState(null);
    const imageFileName = useSelector(state => state.imageFileName)
    const dispatch = useDispatch()

    const initializeViewer = () => {
        viewer && viewer.destroy()
        const viewerState = OpenSeaDragon({
                id: "openseadragon",
                prefixUrl: "http://localhost:3000/home/openseadragon-images/",
                tileSources: `http://localhost:8005/api/v1/bid/${imageFileName}.dzi`,
                showNavigator: true,
                animationTime: 0.5,
                blendTime: 0.1,
                constrainDuringPan: true,
                maxZoomPixelRatio: 2,
                minZoomLevel: 1,
                visibilityRatio: 1,
                zoomPerScroll: 1.2
            })
        dispatch({type: 'SET_VIEWER', payload: viewerState})
        setViewer(viewerState)
        return viewerState
    }

    useEffect(() => {
        if (imageFileName) {
            initializeViewer()
        }
    },[imageFileName]);
    
    return (
        <div id="openseadragon"> </div> 
    );
}

export default OpenSeadragonViewer;


