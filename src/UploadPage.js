import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {Autocomplete, Button, createTheme, IconButton,} from "@mui/material";
import {FormControl} from "@mui/material";

import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";

import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import axios from "axios";
import {Link} from 'react-router-dom';


const theme = createTheme()
export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 2px;
  }
`;


class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            uziDevice: null,
            projectionType: null,
            patientCard: null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            typeText: "Выберите файл в формате .png",
            imageFile: null,
            patients: [],
            patientPolicy: null,
            result: false,
            resultid: 0
        };
        this.handlePatientList()
    }

    handleUploadFile = event => {
        var imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imageFile)
        reader.addEventListener("load", () => {
            this.setState({
                originalImage: reader.result,
                typeText: imageFile.name,
                imageFile: event.target.files[0]
            });
        }, false)
    }

    handleChooseDevice = (event) => {
        this.setState({
            uziDevice: event.target.value,
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
            patientPolicy: value.personal_policy
        });
    };
    handlePatientList = () => {
        axios.get(this.props.url+"/api/v2/patient/list/?format=json")
            .then((response) => this.setState({patients: response.data.results}))
    };

    handleResult = () => {
        const formData = new FormData();

        formData.append("uzi_device", this.state.uziDevice);
        formData.append("projection_type", this.state.projectionType);
        formData.append("patient_card", this.state.patientCard);

        formData.append("original_image", this.state.imageFile);
        const response = axios.post(this.props.url+"/api/v2/uzi/create/", formData)
        const data = response.then((response) => this.setState({
            resultid: response.data.image_group_id,
        }))
        this.handleWhat();
    };

    handleWhat = () => {
        this.setState({
            result: true
        })
    };

    render() {
        return (

            <FormControl fullWidth fullHeight sx={{height: '100%', width: '100%'}}>

                <Box sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 50,
                    paddingTop: 10,
                    borderTopLeftRadius: 130,
                    elevation: 10,
                    boxShadow: 2,
                    height: 600,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid container direction={'row'} spacing={0}>
                        <Grid item xl={6} md={6} sm={12} xs={12}>
                            <GlobalStyles styles={{
                                h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                            }}/>
                            <h1>Новый снимок УЗИ</h1>
                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                <FormControl variant={'outlined'} fullWidth>
                                    <TextFieldWrapper
                                        labelId="device"
                                        value={this.state.deviceId}
                                        label="Аппарат"
                                        onChange={this.handleChooseDevice}
                                        variant='outlined'
                                        select
                                    >
                                        <MenuItem value={1}>GE Voluson E8</MenuItem>
                                        <MenuItem value={2}>Logic</MenuItem>
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box sx={{width: 300, paddingBottom: 5}}></Box>
                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                <FormControl variant={'outlined'} fullWidth>
                                    <TextFieldWrapper
                                        labelId="device"
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
                            <Box sx={{width: 300, paddingBottom: 5}}></Box>


                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                <FormControl variant={'outlined'} fullWidth>
                                    <Autocomplete
                                        id="country-select-demo"
                                        sx={{width: 300}}
                                        options={this.state.patients}
                                        autoHighlight
                                        onChange={this.handleChoosePatient}
                                        style={{whiteSpace: 'normal'}}
                                        getOptionLabel={(option) => option.last_name + ' ' + option.first_name + ' ' + option.fathers_name + ' ' + option.personal_policy}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                <GlobalStyles styles={{
                                                    h6: {
                                                        color: 'dimgray',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: "lighter"
                                                    },
                                                    h3: {
                                                        color: 'dimgray',
                                                        fontSize: 15,
                                                        fontFamily: "Roboto",
                                                        fontWeight: "medium"
                                                    }
                                                }}/>
                                                <h3>{option.last_name} {option.first_name} {option.fathers_name}</h3>
                                                <h6>{option.personal_policy}</h6>
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
                        </Grid>
                        <Grid item>

                            <Box display="flex"
                                 alignItems="center"
                                 sx={{height: 400, paddingRight: 12}}>
                                <Grid alignItems={'center'} justify={'center'} container direction={'column'}
                                      spacing={0}>
                                    <Grid item justify="center">
                                        <input type='file'
                                               ref={'fileInput'}
                                               onChange={this.handleUploadFile}
                                               style={{display: 'none'}}
                                        />
                                        <IconButton style={{maxWidth: '83px', maxHeight: '83px'}}
                                                    onClick={() => this.refs.fileInput.click()} sx={{
                                            '& svg': {
                                                fontSize: 100
                                            }, boxShadow: 10
                                        }
                                        }>
                                            <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                        </IconButton>
                                    </Grid>
                                    <Grid item justify="center">
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box display="flex"
                                             justifyContent="center"
                                             alignItems="center"

                                        >
                                            <h5 align={'right'}>{this.state.typeText}</h5>
                                        </Box>
                                    </Grid>
                                    <Grid item container direction={'column'}>
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box
                                            display={'inline-flex'}
                                        >
                                            <Button sx={{
                                                backgroundColor: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                                '&:hover': {
                                                    backgroundColor: '#2c608a'
                                                }
                                            }} onClick={this.handleResult} variant={'contained'}>
                                                Провести диагностику
                                            </Button>
                                            <Box sx={{width: 10}}></Box>
                                            <Button component={Link} to={`result/${this.state.resultid}`} sx={{
                                                backgroundColor: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                                '&:hover': {
                                                    backgroundColor: '#2c608a'
                                                }
                                            }} variant={'contained'} disabled={!this.state.result}>
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

export default UploadPage;
