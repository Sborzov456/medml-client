import {Stage, Layer, Line, Image} from 'react-konva';
import * as React from "react";
import {Box, FormControl, IconButton,Slider} from "@mui/material";
import {Icon} from "@iconify/react";

import useImage from "use-image";

import Grid from "@mui/material/Grid";

const ConvasComponent = (props) => {
        const [image] = useImage(props.img)
        const [tool, setTool] = React.useState('pen');
        const [width, setWidth] = React.useState(30);
        const [lines, setLines] = React.useState([]);
        const isDrawing = React.useRef(false);
        const layerRef = React.useRef(null);
        const stageRef = React.useRef(null);
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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
    const handleExport = () => {
        const uri = layerRef.current.toDataURL();
    };
    const handleClear = () => {
        layerRef.current.removeChildren();
    };
    return (
        <div>
            <Grid container={'row'} >
            <IconButton style={{maxWidth:'60px',maxHeight:'60px'}} onClick={handleChoice} value='pen'  sx={{'& svg': {
                    fontSize: 50} }}>
                <Icon icon="eva:brush-fill" />
            </IconButton>
            <IconButton style={{maxWidth:'60px',maxHeight:'60px'}} onClick={handleChoice} value='eraser' sx={{'& svg': {
                    fontSize: 50} }
            }>
                <Icon icon="mdi:eraser" />
            </IconButton>
                <IconButton style={{maxWidth:'60px',maxHeight:'60px'}} onClick={handleClear} sx={{'& svg': {
                        fontSize: 50} }}>
                    <Icon icon="mdi:clear" />
                </IconButton>
                <IconButton style={{maxWidth:'60px',maxHeight:'60px'}} onClick={handleExport} sx={{'& svg': {
                            fontSize: 50} }}>
                    <Icon icon="fluent:save-20-filled" />
                </IconButton>
            </Grid>
            <Box sx={{ width: 300}}>
            <FormControl variant={'outlined'} fullWidth >
                <Slider aria-label="Width" value={width} onChange={handleChangeWidth}  defaultValue={30}
                        step={10}
                        marks
                        min={10}
                        max={110}
                        valueLabelDisplay="auto"/>
            </FormControl>
            </Box>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    <Image image={image} width={window.innerWidth}
                           height={window.innerHeight}></Image>
                </Layer>
                <Layer ref={layerRef}>
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
