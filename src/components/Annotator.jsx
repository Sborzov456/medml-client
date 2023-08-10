import React from 'react';
import {useState, useEffect} from 'react'
import * as Annotorious from '@recogito/annotorious-openseadragon';
import { useSelector } from 'react-redux';
import annotationCreator from '../utils/AnnotationCreator';
import './annotorious.min.css'

const Annotator = (props) => {
    const [anno, setAnno] = useState(null)
    const [annotationsW3CState, setAnnotationW3CState] = useState(null)
    
    const viewer = useSelector(state => state.viewer)
    const imageFileName = useSelector(state => state.imageFileName)
    const segments = useSelector(state => state.segments)

    const getAnnotationsW3C = () => {
        return annotationCreator(segments, `api/v4/cytology/upload/${imageFileName}`)
    }

    const initializeAnnotations = (viewer) => {
        anno && anno.destroy()
        const annotateState = Annotorious(viewer, {
            locale: 'auto',
            readOnly: true
        });

        const annotationsW3C = getAnnotationsW3C()
        setAnnotationW3CState(getAnnotationsW3C())
        annotateState.setAnnotations(annotationsW3C[0])
        setAnno(annotateState)
    }
    useEffect(() => {
        if (viewer) {
            initializeAnnotations(viewer)
        }
    }, [viewer]);

    useEffect(() => {
        if (anno) {
            anno.setAnnotations(annotationsW3CState[props.type])
        }
    }, [props.type])

    return (
        <div>
            
        </div>
    );
}

export default Annotator;
