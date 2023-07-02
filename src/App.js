import React, {useEffect} from "react";
import jwt_decode from "jwt-decode";
import UploadPage from "./UploadPage";
import ResultsPageInterface from "./ResultsPage";
import FAQPage from "./FAQPage";
import Fab from '@mui/material/Fab';
import {Link, Route, Routes, Navigate} from "react-router-dom";
import MaskPageInterface from "./MaskPage";
import {
    AppBar, Badge,
    Box, Button,
    Toolbar
} from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Typography from '@mui/material/Typography';

import NewPatientPageInterface from "./NewPatientPage";
import EditPatientPageInterface from "./EditPatientPage";
import SignUpPageInterface from "./SingUpPage";
import SignInPageInterface from "./SignInPage";

import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import Grid from "@mui/material/Grid";
import PatientsPage from "./PatientsPage";
import PatientInterface from "./ShotTable";
import ExpertPageInterface from "./ExpertChoosePage";
import EditProfileInterface from "./EditProfilePage";
import NotificationsPageInterface from "./NotificationsPage";
import ChatPageInterface from "./ChatPage";

function NoMatch() {
    let location = document.location.href;
    return (
        <div className='center' style={{display: 'block',paddingLeft: 300, paddingTop: 70}}>
        <GlobalStyles styles={{
            h1: {color: 'white', fontSize: 90, marginBlock: 20, marginInline: 10},
            h5: {color: '#1e83b6', fontSize: 70, marginBlock: 20, marginInline: 10},
            h3: {color: 'white', fontSize: 100,marginBlock: 20, marginInline: 15 }
        }}/>
            <div className='center'  style={{display: 'block'}}>
                <Typography component={""} variant={'h1'} sx={{fontSize: 190, color: '#2292cb', paddingTop: 10}} >Упс!</Typography>
            </div>
            <div className='center' style={{display: 'block'}}>
            <Typography component={""} variant={'h1'} sx={{fontSize: 70, marginBlockStart: 5, color: '#3880bd'}}>404 - Страница не найдена</Typography>
                <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, color: 'dimgray'}}>
                    Невозможно загрузить {location}
                </Typography>
                <div className='center' style={{display: 'flex'}}>
                <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7, color: 'dimgray'}}>
                    Перейти на
                </Typography>
                    <Button component={Link} to={`home`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            главную страницу
                        </Typography>
                    </Button>
                    <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7, color: 'dimgray'}}>
                        или
                    </Typography>
                    <Button component={Link} to={`/faq`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            страницу инструкции
                        </Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function App(props) {
    const [showSignIn, setSignIn] = React.useState(false)
    const [mesAm, setMesAm] = React.useState(0)
    useEffect(() => {
        if (localStorage.getItem('access') === null) {
            setSignIn(true)
        } else {
            const formData = new FormData()
            formData.append('refresh', localStorage.getItem('refresh'))
            axios.post(props.url + "/api/v3/auth/token/refresh/?format=json", formData).then((response) => {
                localStorage.setItem('access', response.data.access.toString())
                setSignIn(false)
                localStorage.setItem('id', jwt_decode(response.data.access.toString()).user_id)
                axios.get(props.url+'/api/v3/inner_mail/notifications/all/'+ localStorage.getItem('id')+'/?status=0').then((response) => {
                    setMesAm(response.data.count)
                })
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
    const ChPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ChatPageInterface url={props.url}/>;
    };
    const ExpertPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ExpertPageInterface url={props.url}/>;
    };
    const NotifPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <NotificationsPageInterface url={props.url}/>;
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
    const EditProfile = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <EditProfileInterface url={props.url}/>;
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
                    <Box component={""} hidden={showSignIn} sx={{ borderBottomRightRadius: 6, borderBottomLeftRadius: 6, backgroundColor: '#bae7f6', marginBlock:0, marginInline:0, minWidth: 500, width: 'auto'}} >
                        <AppBar elevation={0} hidden={showSignIn} position="absolute" sx={{
                            borderBottomRightRadius: 6,
                            borderBottomLeftRadius: 6,
                            backgroundColor: '#4FB3EAFF', minWidth: 600
                        }}>
                            <Toolbar sx={{minWidth: 600, width: 'auto', backgroundColor: '#fdfdfd',boxShadow: "0px 10px 20px gainsboro", marginBlock: 0, marginInline:0,}} >
                                <Grid component={""} hidden={showSignIn} container direction={'row'} sx={{paddingLeft:5}} spacing={1}  justifyItems={'center'} justifyContent={'center'}>
                                    {['Пациенты', 'Добавить снимок','Почта', 'Выйти'].map((text, index) => (
                                        <Grid component={""} item key={text} xs={index === 3? 1: index===1? 3: index===2? 3: 3} sm={index === 3? 1: index===1? 3: index===2? 3: 3}  sx={{ alignItems:'center', justifyItems:'center', alignContent:'center', width: '100%'}}>
                                            <Button variant={'outlined'} component={Link} sx={{ height: 65, marginBlock:0, fontFamily: 'Roboto', borderColor: 'white', borderRadius: 0,borderBottomColor: "white", borderBottomWidth: 0,fontWeight: 'lighter', color: 'dimgray', textTransform: 'none', boxShadow: 0, '&:hover': {
                                                     color: "#4FB3EAFF", borderColor: 'white', borderBottomColor: "#4FB3EAFF", borderRadius: 0, borderBottomWidth: 5, backgroundColor: 'white'
                                                }, '&:active': {
                                                color: "#4FB3EAFF", borderColor: 'white', borderBottomColor: "#4FB3EAFF", borderRadius: 0, borderBottomWidth: 5, backgroundColor: 'white'
                                            }, }}
                                                            to={index === 1 ? `home` : index === 0 ? `patients` : index === 2 ? `inbox`: `sign_in`} onClick={index === 3 ? handleExit : null }>
                                                {index === 0 ? null : (index === 1) ? null : (index === 2) ? null :
                                                        <ExitToAppIcon style={{maxWidth: '20px', maxHeight: '20px'}}
                                                                       sx={{
                                                                           '& svg': {
                                                                               fontSize: 20,
                                                                               color: "dimgray"
                                                                           },
                                                                           '&:hover': {
                                                                               fontSize: 20,
                                                                               color: "#4FB3EAFF"
                                                                           },
                                                                       }
                                                                       }/>
                                                }
                                                <Badge badgeContent={mesAm}  invisible={index !== 2 || mesAm === 0} sx={{ "& .MuiBadge-badge": {
                                                        color: "white",
                                                        backgroundColor: "#4FB3EAFF",
                                                    }}} >
                                                {text}
                                                </Badge>
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Fab sx={{position: 'fixed', bottom:60, right:30, backgroundColor: "#4FB3EAFF", color: '#FFFFFF', width:60, height:60}} component={Link} to={`/faq`}>
                        <QuestionMarkIcon></QuestionMarkIcon>
                    </Fab>
                    <Routes>
                        <Route exact path="sign_in" element={<SignInPageInterface setSignIn={setSignIn} url={props.url}/>}/>
                        <Route exact path="sign_up" element={<SignUpPageInterface url={props.url}/>}/>
                        <Route exact path="patient/create" element={NewPatient(showSignIn, props)}/>
                        <Route exact path="patient/edit/:number" element={EditPatient(showSignIn, props)}/>
                        <Route exact path="profile/edit" element={EditProfile(showSignIn, props)}/>
                        <Route exact path="patients" element={ Patients(showSignIn, props)}/>
                        <Route exact path="patient/:number" element={ Shot(showSignIn, props)}/>
                        <Route exact path="result/:number2/mask" element={Mask(showSignIn, props)}/>
                        <Route exact path="result/:number" element={ Result(showSignIn, props)}/>}/>
                        <Route exact path="faq" element={ <FAQPage/>}/>}/>
                        <Route exact path="inbox" element={ NotifPage(showSignIn, props)}/>
                        <Route exact path="inbox/msg/:number" element={ ChPage(showSignIn, props)}/>
                        <Route exact path="result/:number/expert" element={ ExpertPage(showSignIn, props)}/>
                        <Route path="home" element={Home(showSignIn, props)}/>
                        <Route exact path={'*'} element={<NoMatch />}/>
                    </Routes>
                </div>

        </div>
    );
}


export default App;