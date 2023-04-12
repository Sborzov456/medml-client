import React from 'react';
import { useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import '../styles/style.css'
import {Button} from "@mui/material";

const OpenSeadragonViewer = ({image, boxes}) => {

    const [viewer, setViewer] = useState( null);

    const initOpenseadragon = () => {
        viewer && viewer.destroy()
        setViewer(
            OpenSeaDragon({
                id: "openseadragon",
                prefixUrl: "http://localhost:3000/home/openseadragon-images/",
                tileSources: `http://localhost:8000/${image}.dzi`,
                zoomPerScroll: 1.2,
                showNavigator: true,
            })
        );
    };

    useEffect(() => {
        console.log(image)
        if (image !== null){
            initOpenseadragon()
        }
    },[image]);
    var overlay = false;
    const handleOverlay = () => {
        setTimeout(() => {
            handleNewOverlay()
        }, 0)

    }

    const handleNewOverlay = () => {
        // for (let i = viewer.overlays.length; i === 0; i--){
        //     viewer.removeOverlay(viewer.overlays[i].id);
        // }
        if(viewer){
            viewer.clearOverlays()
            const boxCategory = boxes.category
            boxes.boxes.forEach((box, index) => {
                    const elt = document.createElement("div");
                    elt.id = "category " + boxCategory + index;
                    elt.className = "highlight";
                    elt.style.border = 'solid'
                    elt.style.borderColor = 'green'
                    elt.style.position = 'static'
                    elt.style.width = box.w +'px'
                    elt.style.height = box.h+'px'
                    viewer.addOverlay({
                        element: elt,
                        location: new OpenSeaDragon.Point(box.x, box.y),
                        checkResize: false
                    });
                }
            )
        }

    }

    useEffect(() => {
        if (viewer){
            handleOverlay()
        }
    }, [viewer])

    useEffect(() => {
        if (viewer){
            handleNewOverlay()
        }
    }, [boxes])

    return (
        <div>
            <div id="openseadragon">

            </div>
        </div>

    );
}

export default OpenSeadragonViewer;


