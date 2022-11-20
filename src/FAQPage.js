import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {Autocomplete, Button, createTheme, IconButton, Slide,} from "@mui/material";
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



const theme = createTheme()
export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 2px;
  }
`;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class FAQPage extends React.Component {
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
            typeText: "Выберите файл в формате .png или .tiff",
            imageFile: null,
            patients: [],
            patientPolicy: null,
            result: false,
            resultid: 0,
            devices: [],
            openSuccess: false,
            openError: false,
        };
        this.handlePatientList()
        this.handleDevicesList()
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
    handleChooseDevice = (object, value) => {
        object.preventDefault()
        var device1 = 0;
        for (let device of this.state.devices) {
            if (device.name === value.name) {
                device1 = device.id;
            }
        }
        this.setState({
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
            patientPolicy: value.personal_policy
        });
    };
    handlePatientList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/api/v2/patient/list/?format=json")
            .then((response) => {
                    this.setState({patients: response.data.results})
                    console.log(response.data.results)
                }
            )
    };
    handleDevicesList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/api/v2/uzi/devices/?format=json")
            .then((response) => this.setState({devices: response.data.results}))
    };

    handleResult = () => {
        const formData = new FormData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        formData.append("uzi_device", this.state.uziDevice);
        formData.append("projection_type", this.state.projectionType);
        formData.append("patient_card", this.state.patientCard);

        formData.append("original_image", this.state.imageFile);
        const response = axios.post(this.props.url + "/api/v2/uzi/create/", formData).catch( () => {
                this.setState({
                    openError: true
                })
            }
        )
        response.then((response) => {
            this.setState({
                resultid: response.data.image_group_id,
            })

            var storedNames = JSON.parse(localStorage.getItem("names"));
            if (storedNames === null) {
                storedNames = []
            }
            for (let tmp of storedNames) {
                if (tmp === response.data.image_group_id) {
                    return;
                }
            }
            if (response.data.image_group_id !== 0){
                storedNames.push(response.data.image_group_id)
                console.log(storedNames)
                localStorage.setItem("names", JSON.stringify(storedNames))
                this.handleWhat();
            }

        })
    };

    handleWhat = () => {
        this.setState({
            result: true,
            openSuccess: true
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
                <Box sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 40,
                    paddingTop: 10,
                    borderTopLeftRadius: 130,
                    elevation: 10,
                    boxShadow: 2,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    }
                }} display={'flex'} color={theme.palette.secondary.contrastText}>
                    </Box>
            </FormControl>
        )

    }
}

export default FAQPage;
