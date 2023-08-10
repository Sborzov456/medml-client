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
    const imageFileName = useSelector(state => state.imageFileName)
    const segments = useSelector(state => state.segments)
    const corrections = useSelector(state => state.annotations) 


    const getAnnotationsW3C = () => {
        return annotationCreator(segments, `api/v4/cytology/upload/${imageFileName}`)
    }

    const initializeAnnotations = (viewer) => {
        anno && anno.destroy()
        const annotateState = Annotorious(viewer, {
            locale: 'auto',
        });

        const annotationsW3C = getAnnotationsW3C()
        annotateState.setAnnotations(annotationsW3C[0])
        annotateState.setDrawingTool('polygon')

        setAnnotationW3CState(annotationsW3C)

        annotateState.on('updateAnnotation', annotation => {
            setAnnotationW3CState(annotationW3CRef.current.map((element, index) => {
                if (index == typeRef.current) {
                    const subArrayIndex = annotationIndexCaclulator(annotationW3CRef.current, annotation.id, index)
                    return element.map((element, index) => {
                        if (index == subArrayIndex) {
                            return {...annotation, target: {...annotation.target, source: `api/v4/cytology/upload/${imageFileName}`}}
                        }
                        return element
                    })
                }
                return element
            }))
        })

        annotateState.on('createAnnotation', (annotation, overrideID) => {
            const newId = annotationW3CRef.current[typeRef.current].length + 1
            annotation.id = newId
            //TODO: 2 - это число типов минус 1, надо сделать так, чтоб тут не было хардкода
            for (let i = typeRef.current.length; i < 2; i++) {
                for (let j = 0; j < annotationW3CRef.current[i].length; j++)
                annotationW3CRef.current[i][j].id += 1
            }
            annotationW3CRef.current[typeRef.current].push(annotation)
            setAnnotationW3CState(annotationW3CRef.current)
        })

        setAnno(annotateState)
       
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

    useEffect(() => {
        if (anno) {
            anno.setAnnotations(corrections[props.type])
            setAnnotationW3CState(corrections)
        }
    }, [corrections]);

    return (
        <div>
            
        </div>
    );
}

export default Corrector;
