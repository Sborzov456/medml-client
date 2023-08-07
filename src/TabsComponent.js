import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OpenSeadragonViewer from "./components/OpenSeadragonViewer";

const TabsComponent = (props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <div>
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
            <OpenSeadragonViewer/>
            {props.drawerComponent && props.drawerComponent({type: value})}
        </div>
)
}

export default TabsComponent;