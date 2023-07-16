import React from 'react';
import {useState, useEffect} from 'react'
import * as Annotorious from '@recogito/annotorious-openseadragon';
import { useSelector } from 'react-redux';
import annotationCreator from '../utils/AnnotationCreator';
import './annotorious.min.css'

const Drawer = (props) => {
    const [anno, setAnno] = useState(null)
    const viewer = useSelector(state => state.viewer)
    const image = useSelector(state => state.image)
    const segments = useSelector(state => state.segments)

    const drawSegmentations = (annotator) => {
      
        const imageURL = `api/v4/cytology/upload/${image}`
        const annotations = annotationCreator(segments, props.type, imageURL)
        annotator.setAnnotations(annotations)
    }

    const initializeAnnotations = (viewer) => {
        anno && anno.destroy()
        const annotateState = Annotorious(viewer, {
            locale: 'auto'
        });
        console.log('VIEWEEEER', viewer)
        annotateState.setDrawingTool('polygon')
        drawSegmentations(annotateState)
        setAnno(annotateState)
    }
    useEffect(() => {
        if (viewer) {
            initializeAnnotations(viewer)
        }
    }, [viewer]);

    useEffect(() => {
        console.log('CHANGE TYPE')
        if (anno) {
            drawSegmentations(anno)
        }
    }, [props.type])

    return (
        <div>
            
        </div>
    );
}

export default Drawer;
