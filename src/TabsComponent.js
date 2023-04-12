import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OpenSeadragonViewer from "./components/OpenSeadragonViewer";
import UploadImage from "./components/UploadImage";

const Tab1 = () => {
    return (<div>
        Tab1 Content
    </div>)
}

const Tab2 = () => {
    return (<div>
        Tab2 Content
    </div>)
}
const categories = [
    {
        category: 'A',
        boxes: [
            {
                x: 0.5,
                y: 0.02,
                w: 100,
                h: 100,
            },
            {
                x: 0.8,
                y: 0.1,
                w: 150,
                h: 70,
            },
            {
                x: 0.01,
                y: 0.01,
                w: 100,
                h: 50,
            },
        ]
    },
    {
        category: 'B',
        boxes: [
            {
                x: 0.3,
                y: 0.2,
                w: 50,
                h: 50,
            },
            {
                x: 0.5,
                y: 0.3,
                w: 60,
                h: 100,
            },
            {
                x: 0.1,
                y: 0.1,
                w: 300,
                h: 150,
            },
        ]
    },
    {
        category: 'C',
        boxes: [
            {
                x: 0.2,
                y: 0.02,
                w: 100,
                h: 100,
            },
            {
                x: 0.08,
                y: 0.001,
                w: 200,
                h: 200,
            },
            {
                x: 0.01,
                y: 0.01,
                w: 100,
                h: 50,
            },
        ]
    },
    {
        category: 'D',
        boxes: [
            {
                x: 0.7,
                y: 0.2,
                w: 170,
                h: 150,
            },
            {
                x: 0.3,
                y: 0.3,
                w: 100,
                h: 100,
            },
            {
                x: 0.1,
                y: 0.1,
                w: 300,
                h: 250,
            },
        ]
    },
    {
        category: 'E',
        boxes: [
            {
                x: 0.4,
                y: 0.4,
                w: 100,
                h: 100,
            },
            {
                x: 0.001,
                y: 0.001,
                w: 30,
                h: 80,
            },
            {
                x: 0.6,
                y: 0.1,
                w: 200,
                h: 200,
            },
        ]
    }

]



const TabsComponent = (props) => {
    const [value, setValue] = React.useState(0);
    const [boxes, setBoxes] = React.useState(categories[0]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setBoxes(categories[newValue])
    };
    const [image, setImage] = useState(null)

    const getImage = (image) => {
        setImage(image)
    }
    const [tabIndex, setTabIndex] = useState(0);
    return(
        <div id="main-page">
            <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{sx: {backgroundColor: '#ffffff'}}}
            aria-label="scrollable prevent tabs example" sx={{width: '1000px','& button:active': {color: '#4fb3ea'}, '& button':{textTransform: 'none'}, '& button:focus': {color: '#4fb3ea'}, '& button:hover': {color: '#4fb3ea'}, '& button.Mui-selected': {color: '#4fb3ea', boxShadow: '0 10px 10px rgba(50, 50, 93, 0.3)', borderTopRightRadius: 30, borderTopLeftRadius: value !== 0? 30:0}}}>
            <Tab label="Адекватность материала" sx={{fontWeight: 'lighter'}}/>
            <Tab label="Клеточность" sx={{fontWeight: 'lighter'}}/>
            <Tab label="Лимфоцитарная инфильтрация скоплений тиреоцитов" sx={{fontWeight: 'lighter'}}/>
            <Tab label="Онкоциты" sx={{fontWeight: 'lighter'}}/>
            <Tab label="Тиреоциты" sx={{fontWeight: 'lighter'}}/>
            </Tabs>
            <OpenSeadragonViewer image={image} boxes={boxes}/>
            <UploadImage sendImage={getImage}></UploadImage>
    </div>
)
}

export default TabsComponent;