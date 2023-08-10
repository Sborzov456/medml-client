import * as React from "react";
import UTIF from 'utif';
import {Box, Button, CircularProgress} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import Canvas2image from "canvas-to-png";
import SwiperCore, {Navigation, Scrollbar, Pagination} from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css'
import axios from "axios";

SwiperCore.use([Pagination])


const TiffImageComponent = (props) => {
    const [imgArray, setArray] = useState([]);
    const [succ, setSucc] = useState(false)
    useEffect(() => {
        setSucc(false)
        if (props.img !== "" && props.img !== null) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', props.url + props.img);
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
                setSucc(true)
            };
            xhr.send();
        }
    }, [props.url, props.img])


    const handleExport = () => {
        fetch(props.url + props.img, {
            method: "GET", headers: {'Authorization': `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.tiff"); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
            });
    };
    return (<div>
        {!succ && <Box display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'} alignContent={'center'} sx={{minHeight:300}}><CircularProgress /> </Box>}
        {succ && <Box container direction={'column'} alignItems={'center'}>
            <GlobalStyles styles={{
                h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
            }}/>
            <Button onClick={handleExport} sx={{
                backgroundColor: '#ffffff', marginBlock: 0.5, marginInline: 0.5, '& svg': {
                    fontSize: 30, color: '#4fb3ea'
                }, fontStyle: {
                    fontFamily: "Roboto", color: '#4fb3ea'
                }
            }}>
                <Icon icon="fluent:save-20-filled"/>
                Сохранить
            </Button>
            <Swiper
                modules={[Navigation, Scrollbar, Pagination]}
                pagination={{
                    el: '.swiper-pagintion', type: 'fraction', renderFraction: function (swiper, current, total) {
                        return current + '/' + (total - 1);
                    }
                }}
                navigation
                effect={'slide'}
                speed={800}
                slidesPerView={1}
            >
                {imgArray.map((item) => <SwiperSlide ></SwiperSlide>)}
            </Swiper>
        </Box>
        }
        <div id={'stage'}></div>

    </div>);
}

export default TiffImageComponent;