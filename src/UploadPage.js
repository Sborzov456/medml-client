import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {Autocomplete, Button, CircularProgress, createTheme, IconButton, Slide,} from "@mui/material";
import {FormControl} from "@mui/material";

import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";

import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import axios from "axios";
import {Link} from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { connect } from 'react-redux';



const theme = createTheme()
export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 1px;
  }
`;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            uziDevice: "",
            deviceName:{id: 0, name: ""},
            projectionType: "",
            patientCard: "",
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            typeText: "Выберите файл в формате .png или .tiff",
            imageFile: "",
            imageChoosen: false,
            patients: [],
            patientPolicy: null,
            result: false,
            resultid: 0,
            devices: [],
            openSuccess: false,
            openError: false,
            loading: false,
            patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""}
        };
        this.handlePatientList()
        this.handleDevicesList()
    }

    handleUploadFile = event => {
        // var imageFile = event.target.files[0];
        // const reader = new FileReader();
        // reader.readAsDataURL(imageFile)
        // reader.addEventListener("load", () => {
        //     this.setState({
        //         originalImage: reader.result,
        //         typeText: imageFile.name,
        //         imageFile: event.target.files[0],
        //         imageChoosen: true
        //     });
        // }, false)
        console.log('UPLOADING.......')
        const file = event.target.files[0]
        const formData = new FormData()
        formData.append('image_file', file)
        formData.append('image_file_name', file.name)
        fetch('http://localhost:49118/api/v4/cytology/upload/', {
            method: 'POST',
            "Content-Type": "multipart/form-data",
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log('RESULT: ', result)
            this.props.updateImageFileName(result['image_file_name'])
            this.props.updateImageID(result['id'])
            this.props.updateSegments(result['segmentations'])
            this.setState({...this.state, resultid: result.id})
        })
    }
    handleChooseDevice = (object, value) => {
        object.preventDefault()
        var device1 = 0;
        for (let device of this.state.devices) {
            if (device.name === value.name) {
                device1 = device.id;
            }
        }
        this.setState({
            deviceName: {id: value.id, name: value.name},
            uziDevice: device1,
            deviceChosen: true
        });
    };


    handleChooseProjection = (event) => {
        this.setState({
            projectionType: event.target.value,
            projectionChosen: true,
        });
    };

    handleChoosePatient = (object, value) => {
        object.preventDefault()
        var patient1 = 0;
        var patient = null;
        for (patient of this.state.patients) {
            if (patient.personal_policy === value.personal_policy) {
                patient1 = patient.id;
            }
        }
        this.setState({
            patientCard: patient1,
            patientChosen: true,
            patientPolicy: value.personal_policy,
            patient:{id: value.id, last_name: value.last_name, first_name: value.first_name, fathers_name: value.fathers_name, personal_policy: value.personal_policy}
        });
    };
    handlePatientList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + '/api/v3/med_worker/patients/'+localStorage.getItem('id'))
            .then((response) => {
                const tmp = []
                for (let cur of response.data.results.cards){
                    tmp.push(cur.patient)
                }
                this.setState({
                    patients: tmp
                })

                }
            )
    };
    handleDevicesList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/api/v3/uzi/devices/?format=json")
            .then((response) => this.setState({devices: response.data.results}))
    };

    handleResult = () => {
        this.setState({
            loading: true
        })
        const formData = new FormData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        formData.append("uzi_device", this.state.uziDevice);
        formData.append("projection_type", this.state.projectionType);
        formData.append("patient_card", this.state.patientCard);
        this.handleWhat()
        // formData.append("original_image", this.state.imageFile);
        // const response = axios.post(this.props.url + "/api/v3/uzi/create/", formData).catch( () => {
        //         this.setState({
        //             openError: true,
        //             loading: false
        //         })
        // }
        // )
        // response.then((response) => {
        //     this.setState({
        //         resultid: response.data.image_group_id,
        //     })

        //     var storedNames = JSON.parse(localStorage.getItem("names"));
        //     if (storedNames === null) {
        //         storedNames = []
        //     }
        //     for (let tmp of storedNames) {
        //         if (tmp === response.data.image_group_id) {
        //             return;
        //         }
        //     }
        //     if (response.data.image_group_id !== 0){
        //         storedNames.push(response.data.image_group_id)
        //     console.log(storedNames)
        //     localStorage.setItem("names", JSON.stringify(storedNames))
        //     this.handleWhat();
        //         this.setState({
        //             uziDevice: null,
        //             projectionType: null,
        //             patientCard: null,
        //             imageFile: null,
        //             typeText: "Выберите файл в формате .png или .tiff",
        //             deviceName: {id: 0, name: ""},
        //             patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""},
        //             deviceChosen: false,
        //             projectionChosen: false,
        //             patientChosen: false,
        //             imageChoosen: false
        //         })
        // }

        // })
    };

    handleWhat = () => {
        this.setState({
            result: true,
            openSuccess: true,
            loading: false
        })
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
        })
    };
    render() {
        return (

            <FormControl fullWidth fullHeight sx={{height: '100%', width: '100%'}}>
                <Snackbar  open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Снимок загружен!</Alert>
                </Snackbar>
                <Snackbar  open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   onClick={this.handleClose}
                               >
                                   <CloseIcon/>
                               </IconButton>}>
                    <Alert severity="error" sx={{width:'100%',backgroundColor: '#d9007b'}} onClose={this.handleClose}>Снимок не загружен. Проверьте формат загружаемого файла.</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 20,
                    paddingTop: 15,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    }
                }} display={'flex'} color={theme.palette.secondary.contrastText}>
                    <Grid component={""} container direction={'row'} spacing={5}>
                        <Grid component={""} item  xs justifyItems={'center'}>
                            <Box component={""} sx={{display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
                            <GlobalStyles styles={{
                                h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto", fontWeight: 'lighter',},
                                h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                            }}/>
                            <h1>Новый снимок УЗИ</h1>
                            <Box component={""} sx={{width: 400, borderRadius: 3}}>
                                <FormControl variant={'outlined'} fullWidth >
                                    <Autocomplete
                                        id="devices"
                                        sx={{width: 400}}
                                        options={this.state.devices}
                                        autoHighlight
                                        onChange={this.handleChooseDevice}
                                        value={this.state.deviceName}
                                        style={{whiteSpace: 'normal'}}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props} sx={{maxHeight: 40}}>
                                                <GlobalStyles styles={{
                                                    h6: {
                                                        color: 'dimgray',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: "lighter"
                                                    },
                                                    h7: {
                                                        color: 'dimgray',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: "bolder"
                                                    }
                                                }}/>
                                                {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextFieldWrapper
                                                {...params}
                                                multiline
                                                label="Аппарат"
                                                variant='outlined'
                                                inputProps={{
                                                    ...params.inputProps,
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 300, paddingBottom: 5}}></Box>
                            <Box component={""} sx={{width: 400, borderRadius: 3}}>
                                <FormControl variant={'outlined'} fullWidth>
                                    <TextFieldWrapper
                                        value={this.state.projectionType}
                                        label="Тип проекции"
                                        onChange={this.handleChooseProjection}
                                        variant='outlined'
                                        select
                                    >
                                        <MenuItem value={"long"}>Поперечная</MenuItem>
                                        <MenuItem value={"cross"}>Продольная</MenuItem>
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 300, paddingBottom: 5}}></Box>


                            <Box component={""} sx={{width: 400, borderRadius: 3}}>
                                <FormControl variant={'outlined'} fullWidth>
                                    <Autocomplete
                                        id="country-select-demo"
                                        sx={{width: 400}}
                                        options={this.state.patients}
                                        value={this.state.patient}
                                        autoHighlight
                                        disableClearable
                                        onChange={this.handleChoosePatient}
                                        style={{whiteSpace: 'normal'}}
                                        getOptionLabel={(option) => this.state.patient.personal_policy === ""? "" : option.last_name + ' ' + option.first_name + ' ' + option.fathers_name + ' ' + option.personal_policy}
                                        renderOption={(props, option) => (
                                            <Box sx={{width:400}} component="li" {...props} display={'flex'}>
                                                <GlobalStyles styles={{
                                                    h6: {
                                                        color: 'black',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: "lighter",
                                                        display: 'inline',
                                                        minWidth: 150
                                                    },
                                                    h3: {
                                                        color: 'black',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: 'normal',
                                                        marginInline: 5,
                                                        minWidth: 170
                                                    }
                                                }}/>
                                                <h3>{option.last_name} {option.first_name} {option.fathers_name}</h3>
                                                <h6>{option.personal_policy}</h6>
                                                <IconButton component={Link} to={`/patient/edit/${option.id}`}
                                                    aria-label="close"
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextFieldWrapper
                                                {...params}
                                                multiline
                                                label="Пациент"
                                                variant='outlined'
                                                inputProps={{
                                                    ...params.inputProps,
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 400, paddingTop: 3}}>
                                <FormControl fullWidth>
                                    <Button component={Link} to={`/patient/create`}
                                            sx={{color: '#4fb3ea',
                                                backgroundColor: '#ffffff',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                                fontStyle: {fontFamily: 'Roboto', fontColor: '#4fb3ea'}
                                            }} variant={'text'} onClick={this.handleResponse}>
                                        Добавить нового пациента
                                    </Button>
                                </FormControl>
                            </Box>
                            </Box>
                        </Grid>
                        <Grid component={""} item xs container direction={'column'}
                              alignItems="center" sx={{paddingRight: 10}}>

                            <Box component={""} display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{height: 400}}>
                                <Grid component={""} alignItems={'center'} justify={'center'} container direction={'column'}
                                      spacing={0}>
                                    <Grid component={""} item xs justify="center">
                                        <input type='file'
                                               ref={'fileInput'}
                                               onChange={this.handleUploadFile}
                                               style={{display: 'none'}}
                                        />
                                        <IconButton style={{maxWidth: '83px', maxHeight: '83px'}}
                                                    onClick={() => this.refs.fileInput.click()} sx={{
                                            '& svg': {
                                                fontSize: 100
                                            }, '&:hover': {
                                                color: '#4fb3ea'
                                            }
                                        }
                                        }>
                                            {this.state.loading && (
                                                <CircularProgress
                                                    size={70}
                                                    sx={{ marginInline: 1, position: 'absolute', top: '50%',
                                                        left: '50%',
                                                        marginTop: '-34px',
                                                        marginLeft: '-34px',
                                                        zIndex: 1,
                                                        color: '#4FB3EAFF',
                                                    }}
                                                />
                                            )}
                                            <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                        </IconButton>
                                    </Grid>
                                    <Grid component={""} item justify="center">
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box component={""} display="flex"
                                             justifyContent="center"
                                             alignItems="center"

                                        >
                                            <h5 style={{fontWeight: 'lighter'}} align={'right'}>{this.state.typeText}</h5>
                                        </Box>
                                    </Grid>
                                    <Grid component={""} item container direction={'column'}>
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box component={""}
                                            display={'inline-flex'}
                                        >
                                            <Button sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                            }} onClick={this.handleResult} variant={'outlined'} >
                                                {/* disabled={!this.state.deviceChosen||!this.state.patientChosen||!this.state.projectionChosen||!this.state.imageChoosen} */}
                                                Провести диагностику
                                            </Button>
                                            <Box component={""} sx={{width: 10}}></Box>
                                            {/* TODO: Переходить на страницу по номеру изображения */}
                                            <Button component={Link} to={`/result/${this.state.resultid}`} sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},

                                            }} variant={'outlined'} disabled={!this.state.result}>
                                                {this.state.loading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{ marginInline: 1, position: 'absolute', top: '50%',
                                                            left: '50%',
                                                            marginTop: '-12px',
                                                            marginLeft: '-12px',
                                                            zIndex: 1,
                                                            color: '#4FB3EAFF',
                                                        }}
                                                    />
                                                )}
                                                Посмотреть результат
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </FormControl>
        )

    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateImageFileName: (imageFileName) => dispatch({type: 'UPDATE_IMAGE_FILENAME', payload: imageFileName}),
        updateImageID: (imageID) => dispatch({type: 'UPDATE_IMAGE_ID', payload: imageID}),
        updateSegments: (segments) => dispatch({type: 'UPDATE_SEGMENTS', payload: segments})
    }
}

const mapStateToProps = state => {
    return {
        imageID: state.imageID
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);
