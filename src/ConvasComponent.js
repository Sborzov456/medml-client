import {Stage, Layer, Line, Image} from 'react-konva';
import * as React from "react";
import {Box, Button, FormControl, FormControlLabel, IconButton, Slide, Slider} from "@mui/material";
import {Icon} from "@iconify/react";

import useImage from "use-image";

import Grid from "@mui/material/Grid";
import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import {Link} from "react-router-dom";
import Konva from "konva";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ConvasComponent = (props) => {
    let token = localStorage.getItem('access')
    const [image] = useImage(props.img, 'anonymous', 'origin', {
        headers: {
            Authorization: "Bearer " + token,
        }
    } )
    const [tool, setTool] = React.useState('pen');
    const [width, setWidth] = React.useState(30);
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const layerRef = React.useRef(null);
    const stageRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const backGr = React.useRef(null);
    const [type, setType] = React.useState(null);
    const [er, setEr] = React.useState(false)
    const [success, setSuc] = React.useState(false)

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



    const handleExport = () => {
        imageRef.current.cache()
        imageRef.current.filters([Konva.Filters.Brighten]);
        imageRef.current.brightness(-1)
        const cropped = stageRef.current.size({
            width: image.width,
            height: image.height
        }
        )

        cropped.toBlob().then((response) => {
            console.log(response)
            const formData = new FormData();
            const imageF = new File([response], 'uploadfile.png')
            formData.append("segmentation_image.image", imageF);
            formData.append("group.nodule_type", type);
            let token = localStorage.getItem('access')
            console.log(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
            axios.put(props.url+"/api/v2/uzi/update/seg_group/" + props.number, formData,).then(() => setSuc(true)).catch(() => {
                setEr(true)
                imageRef.current.cache()
                imageRef.current.filters([Konva.Filters.Brighten]);
                imageRef.current.brightness(0)
                }
            )
        })

    };
    const handleClear = () => {
        layerRef.current.removeChildren();
    };
    const handleChooseTirads = (e) => {
        setType(e.target.value);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setEr(false)
        setSuc(false)
    };
    return (
        <div>
            <Snackbar color={'#00d995'} sx={{ width:'auto', color: 'secondary', "& .MuiSnackbarContent-root": { backgroundColor: "#00d995" }}} open={success}  onClose={handleClose} message={'Данные сохранены!'}
                      TransitionComponent={Slide}
                      autoHideDuration={6000}
                      action={
                           <IconButton
                               aria-label="close"
                               onClick={handleClose}
                           >
                               <CloseIcon/>
                           </IconButton>}>
                <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995', marginBlock: 0}} action={
                    <Button component={Link} to={`/`} sx={{lineHeight: 1.43, marginBlock: 0, fontStyle: {color: '#ffffff'}}} onClick={handleClose}>Вернуться на главную страницу</Button>
                } onClose={handleClose}>Данные сохранены!</Alert>
            </Snackbar>
            <Snackbar  open={er} autoHideDuration={6000} onClose={handleClose}
                       TransitionComponent={Slide}
                       action={
                           <IconButton
                               aria-label="close"
                               color="inherit"
                               onClick={handleClose}
                           >
                               <CloseIcon/>
                           </IconButton>}>
                <Alert severity="error" sx={{width:'100%',backgroundColor: '#d9007b'}} onClose={handleClose}>Данные не загружены. Проверьте введен ли тип узла и нарисована ли маска.</Alert>
            </Snackbar>
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
                <IconButton  style={{maxWidth: '60px', maxHeight: '60px'}} onClick={handleExport} sx={{
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
                        defaultValue={"1"}
                    >
                        <FormControlLabel value={"1"} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="1"/>
                        <FormControlLabel value={"2"} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="2"/>
                        <FormControlLabel value={"3"} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="3"/>
                        <FormControlLabel value={"4"} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="4"/>
                        <FormControlLabel value={"5"} control={<Radio style={{color: '#4FB3EAFF'}}/>} label="5"/>
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
                <Layer ref={backGr}></Layer>
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
