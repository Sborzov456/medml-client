import {Stage, Layer, Image} from 'react-konva';
import * as React from "react";
import {Box, CircularProgress, FormControl, IconButton, Slider} from "@mui/material";
import {Icon} from "@iconify/react";

import useImage from "use-image";


import GlobalStyles from "@mui/material/GlobalStyles";

import Konva from "konva";
import {useEffect, useState} from "react";



const ImageComponent = (props) => {
    let token = localStorage.getItem('access')
    const [succ, setSucc] = useState(false)
    const [image] = useImage(props.url+props.img, 'anonymous', 'origin', {
        headers: {
            Authorization: "Bearer " + token,
        }
    } )
    useEffect(() =>
    {
        if (props.img === "" || props.img === null) {
            setSucc(false)
        } else {
            setSucc(true)
        }
    }
    )
    const layerRef = React.useRef(null);
    const stageRef = React.useRef(null);
    const [orBr, setOrBr] = React.useState(0)
    const [orSat, setOrSat] = React.useState(0)

    function downloadURI(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleExport = () => {
        const tmpStage = new Konva.Stage({container: 'stage'});
        const tmpLayer = new Konva.Layer();
        tmpLayer.add(new Konva.Image({image: image}))
        tmpStage.add(tmpLayer)
        const cropped = tmpStage.size({
            width: image.naturalWidth,
            height: image.naturalHeight
        })
        const uri = cropped.toDataURL();
        downloadURI(uri, "stage.png")
        tmpStage.size({
            width: 0,
            height: 0
        })
    };
    const handleChangeBr = (event) => {
        setOrBr(event.target.value);
        layerRef.current.cache();
        layerRef.current.filters([Konva.Filters.Brighten, Konva.Filters.Contrast]);
        layerRef.current.brightness(orBr / 100)
        layerRef.current.contrast(orSat)
    }
    const handleChangeCont = (event) => {
        setOrSat(event.target.value);
        layerRef.current.cache();
        layerRef.current.filters([Konva.Filters.Contrast, Konva.Filters.Brighten]);
        layerRef.current.contrast(orSat)
        layerRef.current.brightness(orBr / 100)
    }
    return (
        <div>
            {!succ && <Box display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'} alignContent={'center'} sx={{minHeight:300}}><CircularProgress /> </Box>}
            {succ && <Box container direction={'column'}>
                <GlobalStyles styles={{
                    h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                    h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                }}/>
                <IconButton style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleExport} sx={{
                    '& svg': {
                        fontSize: 30, color: '#4FB3EAFF'
                    }
                }}>
                    <Icon icon="fluent:save-20-filled"/>
                </IconButton>
                <Stage
                    width={400}
                    height={300}
                    ref={stageRef}
                >
                    <Layer>
                        <Image ref={layerRef} width={400} height={300} mimeType={"image/png"} image={image}></Image>
                    </Layer>
                </Stage>
                <Box sx={{width: 300, paddingTop: 1}} display={'flex'} alignContent={'center'}>
                    <h2 style={{fontSize: 12, fontWeight: 'normal', paddingRight: 59, paddingLeft: 30}}>Яркость</h2>
                    <FormControl variant={'outlined'}>
                        <Slider aria-label="Яркость" defaultValue={0}
                                value={orBr}
                                size={'small'}
                                track={false}
                                min={-100}
                                max={100}
                                step={5}
                                onChange={handleChangeBr}
                                valueLabelDisplay="auto"
                                sx={{width: 150}}/>
                    </FormControl>
                </Box>
                <Box display={'flex'}>
                    <Box sx={{width: 300, paddingBottom: 1}} display={'flex'} alignContent={'center'}>
                        <h2 style={{
                            fontSize: 12,
                            fontWeight: 'normal',
                            paddingRight: 20,
                            paddingLeft: 30
                        }}>Контрастность</h2>
                        <FormControl variant={'outlined'}>
                            <Slider aria-label="Контрастность" defaultValue={0}
                                    value={orSat}
                                    step={10}
                                    track={false}
                                    size={'small'}
                                    min={-100}
                                    max={100}
                                    sx={{width: 150}}
                                    onChange={handleChangeCont}
                                    valueLabelDisplay="auto"/>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
            }
            <div id={'stage'}></div>
        </div>
    )
};
export default ImageComponent;