import {Stage, Layer, Line, Image} from 'react-konva';
import * as React from "react";
import {Box, FormControl, FormControlLabel, IconButton, Slider} from "@mui/material";
import {Icon} from "@iconify/react";
import toImage from 'konva'

import useImage from "use-image";

import Grid from "@mui/material/Grid";
import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import {Link} from "react-router-dom";

const ConvasComponent = (props) => {
    const [image] = useImage(props.img, 'anonymous', 'origin')
    const [tool, setTool] = React.useState('pen');
    const [width, setWidth] = React.useState(30);
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const layerRef = React.useRef(null);
    const stageRef = React.useRef(null);
    const imageRef = React.useRef();
    const [number, setNumber] = React.useState(props.number);
    const [srcImage] = React.useState(props.img);
    const [type, setType] = React.useState(props.type);

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
    const handleChoice = (event) => {
        setTool(event.currentTarget.value)
    };
    const handleChangeWidth = (event, newValue) => {
        stageRef.current.clip()
        layerRef.current.clip()
        setWidth(newValue);
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
        const imageform = new FormData();
        imageRef.current.destroy();
        const cropped = stageRef.current.size({
            width: image.width,
            height: image.height
        })
        // const uri = cropped.toDataURL();
        // downloadURI(uri, "stage.png")
        const img = stageRef.current.toImage();
        imageform.append("image", layerRef.current.toImage({mimeType: "image/png"}))
        const nodule = new FormData();
        nodule.append("nodule_type", type)
        const formData = new FormData();
        formData.append("segmentation_image", imageform)
        formData.append("group", nodule)

        axios.put("http://localhost:8000/api/v2/uzi/update/seg_group/"+number, formData)
    };
    const handleClear = () => {
        layerRef.current.removeChildren();
    };
    const handleChooseTirads = (e) => {
        setType(e.target.value);
    };
    return (
        <div>
            <Grid container direction={'row'}>
                <IconButton style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleChoice} value='pen' sx={{
                    '& svg': {
                        fontSize: 50
                    }
                }}>
                    <Icon icon="eva:brush-fill"/>
                </IconButton>
                <IconButton style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleChoice} value='eraser' sx={{
                    '& svg': {
                        fontSize: 50
                    }
                }
                }>
                    <Icon icon="mdi:eraser"/>
                </IconButton>
                <IconButton style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleClear} sx={{
                    '& svg': {
                        fontSize: 50
                    }
                }}>
                    <Icon icon="mdi:clear"/>
                </IconButton>
                <IconButton component={Link} to={`/`} style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleExport} sx={{
                    '& svg': {
                        fontSize: 50
                    }
                }}>
                    <Icon icon="fluent:save-20-filled"/>
                </IconButton>
            </Grid>
            <Box item container direction={'row'} display={'flex'}>
                <Box sx={{width: 300, paddingBottom: 3}}>
                    <FormControl variant={'outlined'} fullWidth>
                        <GlobalStyles styles={{
                            h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                            h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                        }}/>
                        <h2 style={{fontSize: 15, fontWeight: 'normal'}}>Толщина кисти</h2>
                        <Box sx={{height: 7}}/>
                        <Slider aria-label="Width" value={width} onChange={handleChangeWidth} defaultValue={30}
                                step={10}
                                marks
                                min={10}
                                max={110}
                                style={{color: '#4FB3EAFF'}}
                                valueLabelDisplay="auto"/>
                    </FormControl>
                </Box>
                <Box sx={{width: 30, paddingBottom: 3}}/>
                <FormControl variant={'outlined'} fullWidth>
                    <GlobalStyles styles={{
                        h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                        h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                    }}/>
                    <h2 style={{fontSize: 15, fontWeight: 'normal'}}>Тип узла по EU TI-RADS</h2>
                    <RadioGroup
                        labelId="device"
                        row
                        value={type}
                        label="Тип узла по EU TI-RADS"
                        onChange={handleChooseTirads}
                        variant='outlined'
                        defaultValue={1}
                    >
                        <FormControlLabel value={1} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="1"/>
                        <FormControlLabel value={2} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="2"/>
                        <FormControlLabel value={3} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="3"/>
                        <FormControlLabel value={4} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="4"/>
                        <FormControlLabel value={5} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="5"/>
                    </RadioGroup>
                </FormControl>
            </Box>
            <Stage
                width={window.innerWidth - 300}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer ref={imageRef}>
                    <Image mimeType={"image/png"} image={image}></Image>
                </Layer>
                <Layer
                    ref={layerRef}>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={width}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                            strokeScaleEnabled={false}
                        />
                    ))
                    }
                </Layer>
            </Stage>
        </div>
    );
};
export default ConvasComponent;
