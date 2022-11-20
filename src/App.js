import React, {useEffect} from "react";

import UploadPage from "./UploadPage";
import ResultsPageInterface from "./ResultsPage";
import FAQPage from "./FAQPage";
import Fab from '@mui/material/Fab';
import {Link, Route, Routes, Navigate} from "react-router-dom";
import MaskPageInterface from "./MaskPage";
import {
    AppBar,
    Box, Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShotTable from "./ShotTable";
import Typography from '@mui/material/Typography';

import NewPatientPageInterface from "./NewPatientPage";
import EditPatientPageInterface from "./EditPatientPage";
import SignUpPageInterface from "./SingUpPage";
import SignInPageInterface from "./SignInPage";
import FilterIcon from '@mui/icons-material/Filter';
import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import Grid from "@mui/material/Grid";
import PatientsPage from "./PatientsPage";
import PatientInterface from "./ShotTable";

function NoMatch() {
    let location = document.location.href;
    console.log(location)
    return (
        <div className='center' style={{display: 'block',paddingLeft: 300, paddingTop: 50}}>
        <GlobalStyles styles={{
            h1: {color: 'white', fontSize: 90, marginBlock: 20, marginInline: 10},
            h5: {color: '#1e83b6', fontSize: 70, marginBlock: 20, marginInline: 10},
            h3: {color: 'white', fontSize: 100,marginBlock: 20, marginInline: 15 }
        }}/>
            <div className='center'  style={{display: 'block'}}>
                <Typography variant={'h1'} sx={{fontSize: 190, color: '#2292cb'}} >Упс!</Typography>
            </div>
            <div className='center' style={{display: 'block'}}>
            <Typography variant={'h1'} sx={{fontSize: 70, marginBlockStart: 5}}>404 - Страница не найдена</Typography>
                <Typography variant={'h1'} sx={{fontSize: 40, marginBlock: 2}}>
                    Невозможно загрузить {location}
                </Typography>
                <div className='center' style={{display: 'flex'}}>
                <Typography variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7}}>
                    Перейти на
                </Typography>
                    <Button component={Link} to={`home`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            главную страницу
                        </Typography>
                    </Button>
                    <Typography variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7}}>
                        или
                    </Typography>
                    <Button component={Link} to={`/faq`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            страницу инструкции
                        </Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}
const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

function App(props) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [showSignIn, setSignIn] = React.useState(false)
    useEffect(() => {
        if (localStorage.getItem('access') === null) {
            setSignIn(true)
        } else {
            const formData = new FormData()
            formData.append('refresh', localStorage.getItem('refresh'))
            axios.post(props.url + "/api/v2/auth/token/refresh/?format=json", formData).then((response) => {
                localStorage.setItem('access', response.data.access.toString())
                setSignIn(false)
            }).catch(() => {
                setSignIn(true)
            })
        }

    }, [props.url])
    const handleExit = () => {
        localStorage.setItem('access', null)
        localStorage.setItem('refresh', null)
        setSignIn(true)
    }
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };
    const list = (anchor) => (
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200}}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
             <List sx={{paddingTop: 28}}>
                {['Пациенты', 'Добавить снимок', 'Выйти'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton component={Link}
                                        to={index === 1 ? `home` : index === 0 ? `results` : `sign_in`} onClick={index === 3 ? handleExit : null }>
                            <ListItemIcon style={{maxWidth: '35px', maxHeight: '35px'}}
                                          sx={{
                                              '& svg': {
                                                  fontSize: 35,
                                                  color: '#4fb3ea'
                                              },
                                          }
                                          }>
                                {index === 0 ? <PersonIcon/> : (index === 1) ? <AddCircleOutlineIcon/> :  <ExitToAppIcon/>}
                            </ListItemIcon>
                            <ListItemText
                                style={{fontSize: 15, fontWeight: 'lighter', color: '#595e65'}}>{text}</ListItemText>
                        </ListItemButton>
                        <Box
                            sx={{paddingTop: (index !== 2) ? 15 : 50}}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    const Home = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <UploadPage url={props.url}/>;
    };
    const Result = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ResultsPageInterface url={props.url}/>;
    };
    const Mask = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <MaskPageInterface url={props.url}/>;
    };
    const Shot = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }

        return <PatientInterface url={props.url}/>;
    };
    const EditPatient = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <EditPatientPageInterface url={props.url}/>;
    };
    const NewPatient = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <NewPatientPageInterface url={props.url}/>;
    };
    const Patients = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <PatientsPage url={props.url}/>;
    };

    return (
        <div>
                <div>
                    <Box hidden={showSignIn} sx={{ borderBottomRightRadius: 6, borderBottomLeftRadius: 6, backgroundColor: '#bae7f6', minWidth: 500, width: 'auto'}} >
                        <AppBar hidden={showSignIn}  position="absolute" sx={{
                            borderBottomRightRadius: 6,
                            borderBottomLeftRadius: 6,
                            backgroundColor: '#4FB3EAFF', minWidth: 600,
                            boxShadow: 5

                        }}>
                            <Toolbar sx={{minWidth: 600, width: 'auto'}}>
                                {/*<IconButton onClick={toggleDrawer('left', true)} size={'large'}*/}
                                {/*            style={{maxWidth: '30px', maxHeight: '30px'}}*/}
                                {/*            sx={{*/}
                                {/*                '& svg': {*/}
                                {/*                    fontSize: 30,*/}
                                {/*                    color: '#ffffff'*/}
                                {/*                }, paddingLeft: 5,*/}
                                {/*            }*/}
                                {/*            }>*/}
                                {/*    <MenuIcon></MenuIcon>*/}
                                {/*</IconButton>*/}
                                <Grid hidden={showSignIn} container direction={'row'} sx={{paddingLeft:5}} xs sm spacing={1}  justifyItems={'center'} justifyContent={'center'}>
                                    {['Пациенты', 'Добавить снимок', 'Выйти'].map((text, index) => (
                                        <Grid item key={text} xs={index === 2? 1: index===1? 6: 5} sm={index === 2? 1: index===1? 6: 5}  sx={{ alignItems:'center', justifyItems:'center', alignContent:'center'}}>
                                            <Button variant={'contained'} component={Link} sx={{ height: 30, backgroundColor: "#4FB3EAFF", color: '#FFFFFF', textTransform: 'none', boxShadow: 0, '&:hover': {
                                                    backgroundColor: '#3880bd'
                                                } }}
                                                            to={index === 1 ? `home` : index === 0 ? `patients` : `sign_in`} onClick={index === 2 ? handleExit : null }>
                                                {index === 0 ? null : (index === 1) ? null :
                                                    <ListItemIcon style={{maxWidth: '20px', maxHeight: '20px'}}
                                                                  sx={{
                                                                      marginInlineEnd: -4,
                                                                      '& svg': {
                                                                          fontSize: 20,
                                                                          color: '#FFFFFF'
                                                                      },
                                                                  }
                                                                  }>
                                                        {/*{index === 0 ? <PersonIcon/> : (index === 1) ? <AddCircleOutlineIcon/> :  <ExitToAppIcon/>}*/}
                                                        <ExitToAppIcon/>
                                                    </ListItemIcon>
                                                }
                                                <ListItemText sx={{}}
                                                    style={{fontSize: 15, fontWeight: 'lighter', color: '#FFFFFF'}}>{text}</ListItemText>
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    {/*<Drawer*/}
                    {/*    BackdropProps={{style: {opacity: 0.3}}}*/}
                    {/*    anchor="left"*/}
                    {/*    open={state["left"]}*/}
                    {/*    onClose={toggleDrawer("left", false)}*/}
                    {/*>*/}
                    {/*    {list("left")}*/}
                    {/*</Drawer>*/}
                    <Box sx={{height: 40}}/>
                    <Fab sx={{position: 'fixed', bottom:60, right:30, backgroundColor: "#4FB3EAFF", color: '#FFFFFF', width:60, height:60}} component={Link} to={`/faq`}>
                        <QuestionMarkIcon></QuestionMarkIcon>
                    </Fab>
                    <Routes>
                        <Route exact path="sign_in" element={<SignInPageInterface setSignIn={setSignIn} url={props.url}/>}/>
                        <Route exact path="sign_up" element={<SignUpPageInterface url={props.url}/>}/>
                        <Route exact path="patient/create" element={NewPatient(showSignIn, props)}/>
                        <Route exact path="patient/edit/:number" element={EditPatient(showSignIn, props)}/>
                        <Route exact path="patients" element={ Patients(showSignIn, props)}/>
                        <Route exact path="patient/:number" element={ Shot(showSignIn, props)}/>
                        <Route exact path="result/:number2/mask" element={Mask(showSignIn, props)}/>
                        <Route exact path="result/:number" element={ Result(showSignIn, props)}/>}/>
                        <Route exact path="faq" element={ <FAQPage/>}/>}/>
                        <Route path="home" element={Home(showSignIn, props)}/>
                        <Route exact path={'*'} element={<NoMatch />}/>
                    </Routes>
                </div>

        </div>
    );
}


export default App;