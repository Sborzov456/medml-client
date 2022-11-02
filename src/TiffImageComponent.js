import * as React from "react";
import UTIF from 'utif';
import {Image, Layer, Shape, Stage} from "react-konva";
import {Box, FormControl, IconButton, Slider} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import Konva from "konva";
import { Swiper, SwiperSlide } from 'swiper/react';
import Canvas2image from "canvas-to-png";
import { Navigation, EffectFade, Scrollbar } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css'
import styles from './Swiper.module.scss'
function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const TiffImageComponent = (props) =>{
        const [image, setImage] = useState(null)
        const layerRef = React.useRef(null);
        const stageRef = React.useRef(null);
        const [orBr, setOrBr] = React.useState(0)
        const [orSat, setOrSat] = React.useState(0)
        const [imgArray, setArray] =useState([]);
    useEffect(() =>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET',props.url + props.img);
        xhr.responseType = 'arraybuffer';
        xhr.onload = e => {
            const ifds = UTIF.decode(e.target.response);
            const firstPageOfTif = ifds[0];
            const tmp_ar = [];
            var index = 0;
            for (let tmp of ifds) {
                UTIF.decodeImage(e.target.response, ifds[index], ifds);
                const rgba = UTIF.toRGBA8(tmp);
                const imageWidth = firstPageOfTif.width;
                const imageHeight = firstPageOfTif.height;
                const cnv = document.createElement('canvas');
                cnv.width = imageWidth;
                cnv.height = imageHeight;
                const ctx = cnv.getContext('2d');
                const imageData = ctx.createImageData(imageWidth, imageHeight);
                for (let i = 0; i < rgba.length; i++) {
                    imageData.data[i] = rgba[i];
                }
                ctx.putImageData(imageData, 0, 0);
                const cur = Canvas2image.convertToPNG(cnv, 400, 300)
                tmp_ar.push(<img src={cur.src} alt={""}/>)
                index += 1;
            }
            setArray(tmp_ar);
            // const rgba = UTIF.toRGBA8(ifds[0]);
            // const imageWidth = firstPageOfTif.width;
            // const imageHeight = firstPageOfTif.height;
            // const cnv = document.createElement('canvas');
            // cnv.width = imageWidth;
            // cnv.height = imageHeight;
            // const ctx = cnv.getContext('2d');
            // const imageData = ctx.createImageData(imageWidth, imageHeight);
            // for (let i = 0; i < rgba.length; i++) {
            //     imageData.data[i] = rgba[i];
            // }
            // ctx.putImageData(imageData, 0, 0);
            // setImage(cnv)
        };
        xhr.send();})


    console.log(imgArray)
    const handleExport = () => {
            fetch(props.url+props.img, {
                method: "GET",
                headers: {}
            })
                .then(response => {
                    response.arrayBuffer().then(function(buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", "image.tiff"); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                    });
                })
                .catch(err => {
                    console.log(err);
                });
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
                <Swiper
                    // install Swiper modules
                    modules={[Navigation, EffectFade]}
                    navigation
                    effect={'slide'}
                    speed={800}
                    slidesPerView={1}
                    className={styles.myswiper}
                >
                    { imgArray.map((item) => <SwiperSlide className={styles.swiperslide}>{item}</SwiperSlide>
                    )}
                </Swiper>
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
        );
}

export default TiffImageComponent;