import React from "react";

import UploadPage from "./UploadPage";
import ResultsPageInterface from "./ResultsPage";

import {
    Route,
    Routes,
    Link
} from "react-router-dom";
import MaskPageInterface from "./MaskPage";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ShotTable from "./ShotTable";

import NewPatientPageInterface from "./NewPatientPage";
import EditPatientPageInterface from "./EditPatientPage";



function App(props) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200,}}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List sx={{ paddingTop: 17}}>
                {['Снимки', 'Добавить снимок','Вопросы' ].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton component={Link} to={index === 1 ? `/` : index === 0 ? `results`: null}>
                            <ListItemIcon style={{maxWidth: '35px', maxHeight: '35px'}}
                                          sx={{
                                '& svg': {
                                    fontSize: 35,
                                    color: '#4fb3ea'
                                },
                            }
                            }>
                                {index === 0 ? <PersonIcon /> : (index === 1) ? <AddCircleOutlineIcon />: <QuestionAnswerIcon/>}
                            </ListItemIcon>
                            <ListItemText style={{fontSize: 15, fontWeight: 'lighter', color: '#595e65'}}>{text}</ListItemText>
                        </ListItemButton>
                        <Box
                            sx={{paddingTop:15}}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return(
        <div>
            <Box sx={{borderBottomRightRadius:6,borderBottomLeftRadius:6, backgroundColor: '#bae7f6'}}>
                <AppBar position="absolute" sx={{borderBottomRightRadius:6,borderBottomLeftRadius:6, backgroundColor: '#4FB3EAFF', boxShadow:5}}>
                    <Toolbar>
                        <IconButton onClick={toggleDrawer('left', true)} size={'large'} style={{maxWidth: '30px', maxHeight: '30px'}}
                                    sx={{
                                        '& svg': {
                                            fontSize: 30,
                                            color: '#ffffff'
                                        }, paddingLeft: 3
                                    }
                                    }>
                            <MenuIcon></MenuIcon>
                        </IconButton>
                </Toolbar>
                </AppBar>

            </Box>

        <Drawer
            BackdropProps={{style:{ opacity:0.3}}}
            anchor="left"
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
        >
            {list("left")}
        </Drawer>
            <Box sx={{height:40}}/>
            <Routes>
                {/*<Route exact path="results/:number" element={<ResultsPageInterface />} />*/}
                <Route exact path="new_patient" element={<NewPatientPageInterface url={props.url}/>}/>
                <Route exact path="patient/edit/:number" element={<EditPatientPageInterface url={props.url}/>}/>
                <Route exact path="results" element={<ShotTable url={props.url}/>}/>
                <Route exact path="result/:number2/mask" element={<MaskPageInterface url={props.url}/>}/>
                <Route exact path="result/:number"  element={<ResultsPageInterface url={props.url}/>} />}/>
                <Route exact path="/" element={<UploadPage url={props.url}/>}/>
            </Routes>
    </div>

);
}

export default App;