import * as React from 'react';
import '@fontsource/poppins/700.css'
import ImageComponent from "./ImageComponent";
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Autocomplete,
    Button,
    Card,
    createTheme,
    FormControlLabel,
    FormGroup, IconButton, Slide,
} from "@mui/material";
import {FormControl} from "@mui/material";
import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";
import 'dayjs/locale/ru';
import Grid from '@mui/material/Grid';
import {TextFieldWrapper} from "./UploadPage";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {Checkbox} from "@mui/material";
import TiffImageComponent from "./TiffImageComponent";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const theme = createTheme()
export const TextFieldResult = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 2px;

  }

,
'& label': marginLeft: "100%",
`;


const getStyles = () => ({
    clickableCard: {
        style: {
            height: 'auto',
            width: '400',
            margin: '0px',
            padding: '0px'
        }
    },
    cardStyle: {
        style: {
            width: '400',
            height: 'auto',
            boxShadow: 50,
            shadowBlur:20
        },
        containerStyle: {
            width:400,
            height: '100%',
            flexDirection: 'column'
        }
    },
});
const ResultsPageInterface = (props) => {
    const {number} = useParams();
    return (

        <ResultsPage props={number} url={props.url}></ResultsPage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            segmentedImage: "",
            boxImage: "",
            uziDevice: {id: 2, name: 'Logic'},
            projectionType: "long",
            patientCard: 1,
            uziDate: new Date(),
            tiradsType: 1,
            predictedTypes: [],
            shortResult: false,
            uziWidth: 0,
            uziLength: 0,
            uziDepth: 0,
            uziVolume: null,
            longResult: null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            patients: [],
            patientPolicy: null,
            startData: null,
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            imageChoosen: false,
            linkEditingImage: "",
            openSuccess: false,
            devices: []
        };
        this.handlePatientList();
        this.handleStartPage();
    }

    handleResponse = () => {
        this.setState({
            openSuccess: true,
        })
        console.log(this.state.openSuccess)
        this.handleExport()
    };
    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+"/api/v2/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info})
                console.log(response.data)
                var tmpTirads = [];
                var secondTmpTirads = []
                secondTmpTirads.push(parseFloat(response.data.info.nodule_1), parseFloat(response.data.info.nodule_2), parseFloat(response.data.info.nodule_3), parseFloat(response.data.info.nodule_4), parseFloat(response.data.info.nodule_5))
                secondTmpTirads.sort(function(a, b) {
                    return a - b;
                })
                secondTmpTirads.reverse()
                for (let a of secondTmpTirads){
                    if(a === parseFloat(response.data.info.nodule_1)){
                        tmpTirads.push(a+ '% - EU-TIRADS 1')
                    }
                    if(a === parseFloat(response.data.info.nodule_2)){
                        tmpTirads.push(a+ '% - EU-TIRADS 2')
                    }
                    if(a === parseFloat(response.data.info.nodule_3)){
                        tmpTirads.push(a+ '% - EU-TIRADS 3')
                    }
                    if(a === parseFloat(response.data.info.nodule_4)){
                        tmpTirads.push(a+ '% - EU-TIRADS 4')
                    }
                    if(a === parseFloat(response.data.info.nodule_5)){
                        tmpTirads.push(a+ '% - EU-TIRADS 5')
                    }
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                axios.get(this.props.url + "/api/v2/uzi/devices/?format=json")
                    .then((res) => {
                        this.setState({devices: res.data.results})
                        const tmp = res.data.results
                        for (let cur of tmp){
                            if (cur.name === response.data.info.uzi_device_name){
                                this.setState({
                                    uziDevice : cur
                                })
                                console.log(cur)
                            }
                        }})

                this.setState({
                    uziDate: response.data.info.acceptance_datetime,
                    predictedTypes: tmpTirads,
                    patientCard: response.data.info.patient.id,
                    patientPolicy: response.data.info.patient.personal_policy,
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    projectionType: response.data.info.projection_type,
                    longResult: response.data.info.echo_descr,
                    uziLength: response.data.info.nodule_length,
                    uziWidth: response.data.info.nodule_widht,
                    uziDepth: response.data.info.nodule_height,
                    originalImage: response.data.images.original.image,
                    segmentedImage: response.data.images.segmentation.image,
                    boxImage: response.data.images.box.image,
                    tiradsType: response.data.info.nodule_type,
                    shortResult: response.data.info.has_nodules === 'T'

                })
            })

    }

    handlePatientList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+"/api/v2/patient/list/?format=json")
            .then((response) => this.setState({patients: response.data.results}))
    };
    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+"/api/v2/uzi/" + this.props.props+"/?format=json").then((response) => {
            console.log(response.data)
            const formData = new FormData();
            formData.append("id", response.data.images.box.image_group);
            formData.append("patient_card.patient", parseInt(response.data.info.patient.id));
            formData.append("patient_card.acceptance_datetime", this.state.uziDate);
            formData.append("patient_card.has_nodules", this.state.shortResult? 'T' : 'F');
            formData.append("patient_card.diagnosis", response.data.info.patient.diagnosis);
            formData.append("projection_type", this.state.projectionType);
            formData.append("nodule_type", this.state.tiradsType);
            formData.append("echo_descr", this.state.longResult);
            formData.append("nodule_widht", this.state.uziWidth);
            formData.append("nodule_height", this.state.uziDepth);
            formData.append("nodule_length", this.state.uziLength);
            formData.append("uzi_device", this.state.uziDevice.id);
            console.log(formData.get('id'))
            axios.put(this.props.url+"/api/v2/uzi/" + this.props.props +'/update', formData).then((response) => {

            })
        })

    };



    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
    };

    handleChooseShortResult = () => {
        this.setState({
            shortResult: !this.state.shortResult,
        });
    };
    handleChooseLongResult = (event) => {
        this.setState({
            longResult: event.target.value,
        });
    };
    handleChooseWidth = (event) => {
        this.setState({
            uziWidth: event.target.value,
        });
    };
    handleChooseLength = (event) => {
        this.setState({
            uziLength: event.target.value,
        });
    };
    handleChooseDepth = (event) => {
        this.setState({
            uziDepth: event.target.value,
        });
    };
    handleChooseVolume = () => {
        var num = 0.479 * this.state.uziWidth * this.state.uziLength * this.state.uziDepth
        this.setState({
            uziVolume: num,
        });
    };
    handleChooseDevice = (event) => {
        console.log(event.target.value)
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

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
        })
    };
    render() {
        const styles = getStyles();
        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
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
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Результат сохранен!</Alert>
                </Snackbar>
                <Box sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 15,
                    paddingTop: 5,
                    paddingBottom: 10,
                    borderTopLeftRadius: 130,
                    elevation: 10,
                    boxShadow: 2,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid direction={'column'} spacing={0} alignContent={'center'} justifyContent={'center'}>
                        <Grid item>
                            <Grid container spacing={2} direction={'row'}>
                                <Grid item>
                                    <GlobalStyles styles={{
                                        h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                                        h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                                    }}/>
                                    <h2>Определенный тип узла: </h2>
                                </Grid>
                                <Grid item>
                                    <h2 style={{color: '#4FB3EAFF'}}>{this.state.predictedTypes[0]}</h2>
                                </Grid>
                                <Grid item>
                                    <GlobalStyles styles={{
                                        h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                                        h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                                    }}/>
                                    <h2 color={'#417bbe'}>{this.state.predictedTypes[1]} </h2>
                                </Grid>
                                <Grid item>
                                    <GlobalStyles styles={{
                                        h2: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto"},
                                        h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                                    }}/>
                                    <h2>{this.state.predictedTypes[2]} </h2>
                                </Grid>
                                <Grid item>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Box sx={{width: 500}} display={'flex'}>
                                        <GlobalStyles styles={{
                                            h6: {
                                                color: '#4fb3ea',
                                                fontSize: 20,
                                                fontFamily: "Roboto",
                                                fontWeight: 'normal',
                                                whiteSpace: 'normal',
                                                marginBlockStart: 0,
                                                marginBlockEnd:0,
                                                marginInlineEnd:5,
                                            },
                                            h3: {
                                                color: 'dimgray',
                                                fontSize: 20,
                                                fontFamily: "Roboto",
                                                fontWeight: "lighter",
                                                whiteSpace: 'normal',
                                                marginBlockStart: 0,
                                                marginBlockEnd:0,
                                            }
                                        }}/>
                                        <h6>Пациент:  </h6>
                                        <h3>  {this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h3>
                                        )}
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: '#4fb3ea',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd:0,
                                            marginInlineEnd:5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd:0,
                                        }
                                    }}/>
                                    <h6>Полис:  </h6>
                                    <h3>  {this.state.patientPolicy}</h3>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item fullWidth alignItems={'ceneter'} justifyContent={'center'} sx={{paddingTop:5}}>
                            <Grid container direction={'row'} spacing={6}>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400, minHeight:300}}
                                            containerStyle={Object.assign(styles.cardStyle.containerStyle, this.props.containerStyle)}>
                                            {(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif') && <TiffImageComponent url={this.props.url} img={this.state.originalImage}/>}
                                            {this.state.originalImage.split('.')[1] === 'png' && <ImageComponent url={this.props.url} img={this.state.originalImage} number={this.props.props} type={this.state.projectionType} choosen={this.state.imageChoosen}/>}
                                        </Card>
                                </Grid>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400, minHeight:300}}
                                            containerStyle={Object.assign(styles.cardStyle.containerStyle, this.props.containerStyle)}>
                                            {(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif') &&<TiffImageComponent url={this.props.url} img={this.state.segmentedImage}/>}
                                            {this.state.originalImage.split('.')[1] === 'png' &&<ImageComponent url={this.props.url} img={this.state.segmentedImage} number={this.props.props} type={this.state.projectionType} choosen={this.state.imageChoosen}/>}
                                        </Card>
                                </Grid>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400, minHeight:300}}
                                            containerStyle={Object.assign(styles.cardStyle.containerStyle, this.props.containerStyle)}>
                                            {(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif') && <TiffImageComponent url={this.props.url} img={this.state.boxImage}/>}
                                            {this.state.originalImage.split('.')[1] === 'png' &&<ImageComponent url={this.props.url} img={this.state.boxImage} number={this.props.props} type={this.state.projectionType} choosen={this.state.imageChoosen}/>}
                                        </Card>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item fullWidth alignItems={''} justifyContent={'center'}>
                            <Box sx={{height: 15}}/>
                            <Grid container direction={'row'} spacing={2}>
                                <Grid item>
                                    <Grid container direction={'column'} spacing={2}>
                                        <Grid item>
                                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <Autocomplete
                                                        id="devices"
                                                        sx={{width: 300}}
                                                        options={this.state.devices}
                                                        autoHighlight
                                                        value={this.state.uziDevice}
                                                        defaultValue={{id: this.state.uziDevice.id, name: this.state.uziDevice.name}}
                                                        onChange={this.handleChooseDevice}
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
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <LocalizationProvider adapterLocale={'ru'} dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Дата приема"
                                                            value={this.state.uziDate}
                                                            onChange={(newValue) => {
                                                                this.setState({uziDate: newValue});
                                                            }}
                                                            renderInput={(params) => <TextFieldResult {...params}
                                                                                                      InputLabelProps={{shrink: true}}/>}
                                                        />
                                                    </LocalizationProvider>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.projectionType}
                                                        label="Тип проекции"
                                                        onChange={this.handleChooseProjection}
                                                        variant='outlined'
                                                        defaultValue={this.state.projectionType}
                                                        select
                                                    >
                                                        <MenuItem value={'long'}>Поперечная</MenuItem>
                                                        <MenuItem value={'cross'}>Продольная</MenuItem>
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        value={this.state.tiradsType}
                                                        label="Тип узла по EU TI-RADS"
                                                        onChange={this.handleChooseTirads}
                                                        variant='outlined'
                                                        defaultValue={1}
                                                        select
                                                        InputLabelProps={{shrink: true}}
                                                    >
                                                        <MenuItem value={'1'}>1</MenuItem>
                                                        <MenuItem value={'2'}>2</MenuItem>
                                                        <MenuItem value={'3'}>3</MenuItem>
                                                        <MenuItem value={'4'}>4</MenuItem>
                                                        <MenuItem value={'5'}>5</MenuItem>
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <FormGroup>
                                                <h2 style={{fontSize: 15, fontWeight: 'normal'}}>Обнаружено
                                                    новообразование</h2>
                                                <FormControlLabel control={<Checkbox checked={this.state.shortResult} sx={{color: '#4fb3ea', '&.Mui-checked': {
                                                        color: '#4fb3ea',}}} label={'Обнаружено новообразование'}
                                                                                   onChange={this.handleChooseShortResult}
                                                                                   />}/>
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction={'column'} spacing={1}>
                                        <Grid item>
                                            <Grid container direction={'row'} spacing={4}>
                                                <Grid item>
                                                    <Grid container direction={'column'} spacing={2}>
                                                        <Grid item>
                                                            <Box sx={{width: 100, borderRadius: 3, boxShadow: 1}}>
                                                                <FormControl variant={'outlined'} fullWidth>
                                                                    <TextFieldResult
                                                                        value={this.state.uziWidth}
                                                                        label="Ширина"
                                                                        onChange={this.handleChooseWidth}
                                                                        variant='outlined'
                                                                        InputLabelProps={{shrink: true}}
                                                                    >
                                                                    </TextFieldResult>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item>
                                                            <Box sx={{width: 100, borderRadius: 3, boxShadow: 1}}>
                                                                <FormControl variant={'outlined'} fullWidth>
                                                                    <TextFieldResult
                                                                        value={this.state.uziLength}
                                                                        label="Длина"
                                                                        onChange={this.handleChooseLength}
                                                                        variant='outlined'
                                                                        InputLabelProps={{shrink: true}}
                                                                    >
                                                                    </TextFieldResult>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item>
                                                            <Box sx={{width: 100, borderRadius: 3, boxShadow: 1}}>
                                                                <FormControl variant={'outlined'} fullWidth>
                                                                    <TextFieldResult
                                                                        value={this.state.uziDepth}
                                                                        label="Толщина"
                                                                        onChange={this.handleChooseDepth}
                                                                        variant='outlined'
                                                                        InputLabelProps={{shrink: true}}
                                                                    >
                                                                    </TextFieldResult>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container direction={'column'} spacing={0}>
                                                        <Button onClick={this.handleChooseVolume} sx={{
                                                            backgroundColor: '#4fb3ea',
                                                            '&:focus': {backgroundColor: '#4fb3ea'},
                                                            '&:hover': {
                                                                backgroundColor: '#2c608a'
                                                            },
                                                            fontFamily: 'Roboto'
                                                        }} variant={'contained'}>
                                                            Вычислить объём
                                                        </Button>
                                                        <GlobalStyles styles={{
                                                            h2: {
                                                                color: 'dimgray',
                                                                fontSize: 25,
                                                                fontFamily: "Roboto"
                                                            },
                                                            h4: {color: '#5e6379', fontSize: 20, fontFamily: "Roboto"},
                                                        }}/>
                                                        <h4>Объём: {this.state.uziVolume}</h4>

                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Box display={'flex'} sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                multiline
                                                                value={this.state.longResult}
                                                                label="Эхографические признаки"
                                                                onChange={this.handleChooseLongResult}
                                                                variant='outlined'
                                                                inputProps={{
                                                                    style: {
                                                                        width: 398,
                                                                        borderRadius: 3
                                                                    }
                                                                }}
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container direction={'column'} spacing={2} alignItems={'center'}>
                                                        <Grid item> <Box alignContent={'bottom'} justify={'center'}
                                                                         ><Button sx={{
                                                            backgroundColor: '#4fb3ea',
                                                            '&:focus': {backgroundColor: '#4fb3ea'},
                                                            '&:hover': {
                                                                backgroundColor: '#2c608a'
                                                            },
                                                            fontFamily: 'Roboto'
                                                        }} variant={'contained'} onClick={this.handleResponse}>
                                                            Сохранить результат
                                                        </Button>
                                                        </Box>
                                                        </Grid>
                                                        <Grid item>
                                                            <Box  alignContent={'bottom'}
                                                                 justify={'center'} ><Button component={Link} to={`mask/`} disabled={(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif')} sx={{
                                                                backgroundColor: '#3083a9',
                                                                '&:focus': {backgroundColor: '#3083a9'},
                                                                '&:hover': {
                                                                    backgroundColor: '#2c608a'
                                                                },
                                                                fontFamily: 'Roboto'
                                                            }} variant={'contained'}>
                                                                Добавить результат на ресурс
                                                            </Button>
                                                            </Box>
                                                        </Grid>


                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                        </Grid>


                                    </Grid>
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>
                </Box>
            </FormControl>
        )

    }
}

export default ResultsPageInterface;