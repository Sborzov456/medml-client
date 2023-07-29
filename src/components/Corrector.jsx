import React from 'react';
import {useState, useEffect, useRef} from 'react'
import * as Annotorious from '@recogito/annotorious-openseadragon';
import { useDispatch, useSelector } from 'react-redux';
import annotationCreator from '../utils/AnnotationCreator';
import annotationIndexCaclulator from '../utils/AnnotationIndexCalculator';
import './annotorious.min.css'


const Corrector = (props) => {
    const [anno, setAnno] = useState(null)
    const [annotationsW3CState, setAnnotationW3CState] = useState(null)

    const annotationW3CRef = useRef(annotationsW3CState)
    const typeRef = useRef(props.type)

    const viewer = useSelector(state => state.viewer)
    const image = useSelector(state => state.image)
    const segments = useSelector(state => state.segments)
    
    const dispatch = useDispatch()

    const getAnnotationsW3C = () => {
        return annotationCreator(segments, `api/v4/cytology/upload/${image}`)
    }

    const initializeAnnotations = (viewer) => {
        console.log('initialize anno')
        anno && anno.destroy()
        const annotateState = Annotorious(viewer, {
            locale: 'auto',
        });

        const annotationsW3C = getAnnotationsW3C()
        annotateState.setAnnotations(annotationsW3C[0])
        annotateState.setDrawingTool('polygon')

        // annotationW3CRef.current = annotationsW3C
        setAnnotationW3CState(annotationsW3C)

        annotateState.on('updateAnnotation', annotation => {
            setAnnotationW3CState(annotationW3CRef.current.map((element, index) => {
                if (index == typeRef.current) {
                    const subArrayIndex = annotationIndexCaclulator(annotationW3CRef.current, annotation.id, index)
                    return element.map((element, index) => {
                        if (index == subArrayIndex) {
                            return {...annotation, target: {...annotation.target, source: `api/v4/cytology/upload/${image}`}}
                        }
                        return element
                    })
                }
                return element
            }))
        })

        setAnno(annotateState)
        dispatch({type: 'SET_ANNOTATOR', payload: annotateState})
    }

    useEffect(() => {
        annotationW3CRef.current = annotationsW3CState
    }, [annotationsW3CState]);

    useEffect(() => {
        if (viewer) {
            initializeAnnotations(viewer)
        }
    }, [viewer]);

    useEffect(() => {
        if (anno) {
            typeRef.current = props.type
            anno.setAnnotations(annotationsW3CState[props.type])
        }
    }, [props.type])

    return (
        <div>
            
        </div>
    );
}

export default Corrector;
