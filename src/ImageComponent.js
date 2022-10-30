import {Stage, Layer, Line, Image} from 'react-konva';
import * as React from "react";
import {Box, FormControl, FormControlLabel, IconButton, Slider, styled, TextField} from "@mui/material";
import {Icon} from "@iconify/react";
import ImageGallery from 'react-image-gallery';

import useImage from "use-image";

import Grid from "@mui/material/Grid";
import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Konva from "konva";
import {Link} from "react-router-dom";
import {useEffect} from "react";

const CustomSlider = styled(Slider)(() => ({
            '& .MuiSlider-thumb': {
                height: 27,
                width: 27,
                backgroundColor: '#fff',
                border: '1px solid currentColor',
                '&:hover': {
                    boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                },
            }
        }
    )
)

const ImageComponent = (props) => {
    const [image] = useImage(props.url+props.img, 'anonymous', 'origin')
    const [tool, setTool] = React.useState('pen');
    const [width, setWidth] = React.useState(30);
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const layerRef = React.useRef(null);
    const stageRef = React.useRef(null);
    const [number, setNumber] = React.useState(props.number);
    const [srcImage] = React.useState(props.img)
    const [type, setType] = React.useState(props.type)
    const [imgChoosen, setChosen] = React.useState(props.choosen)
    const [orBr, setOrBr] = React.useState(0)
    const [orSh, setOrSh] = React.useState(0)
    const [orSat, setOrSat] = React.useState(0)
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, {tool, points: [pos.x, pos.y]}]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([point.x, point.y]);


        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

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
            <Box container direction={'column'}>
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
            <div id={'stage'}></div>
        </div>
    )
};
export default ImageComponent;