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
    FormGroup,
    Switch
} from "@mui/material";
import {FormControl} from "@mui/material";
import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";

import Grid from '@mui/material/Grid';
import {TextFieldWrapper} from "./UploadPage";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {Checkbox} from "@mui/material";
import TiffImageComponent from "./TiffImageComponent";

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


class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            segmentedImage: "",
            boxImage: "",
            uziDevice: 1,
            projectionType: "long",
            patientCard: 1,
            uziDate: null,
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
            brightness: 0,
            sharpness: 0,
            contrast: 0,
            imageParams: {'original': [0, 0, 0], 'segmented': [0, 0, 0], 'box': [0, 0, 0]},
        };
        this.handlePatientList();
        this.handleStartPage();


    }

    handleResponse = () => {
        this.handleExport()
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        var tmp = null;
        for (tmp of storedNames){
            if (tmp === this.props.props){
                return;
            }
        }
        storedNames.push(this.props.props)
        console.log(storedNames)
        localStorage.setItem("names", JSON.stringify(storedNames));
    };
    handleClickImageOr = () => {
        this.setState({
            imageChoosen: !this.state.imageChoosen,
            linkEditingImage: this.state.originalImage,
            brightness: this.state.imageParams['original'][0],
            sharpness: this.state.imageParams['original'][1],
            contrast: this.state.imageParams['original'][2]
        });

    }
    handleClickImageS = () => {
        this.setState({
            imageChoosen: !this.state.imageChoosen,
            linkEditingImage: this.state.segmentedImage,
            brightness: this.state.imageParams['segmented'][0],
            sharpness: this.state.imageParams['segmented'][1],
            contrast: this.state.imageParams['segmented'][2]
        })
    }
    handleClickImageB = () => {
        this.setState({
            imageChoosen: !this.state.imageChoosen,
            linkEditingImage: this.state.boxImage,
            brightness: this.state.imageParams['box'][0],
            sharpness: this.state.imageParams['box'][1],
            contrast: this.state.imageParams['box'][2]
        })
    }
    handleStartPage = () => {
        axios.get(this.props.url+"/api/v2/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info})
                var tmpTirads = [];
                tmpTirads.push(response.data.info.nodule_1 + ' - 1',
                    response.data.info.nodule_2 + ' - 2',
                    response.data.info.nodule_3 + ' - 3',
                    response.data.info.nodule_4 + ' - 4',
                    response.data.info.nodule_5 + ' - 5');
                tmpTirads.sort()
                tmpTirads.reverse()
                this.setState({
                    predictedTypes: tmpTirads,
                    patientCard: response.data.info.patient.id,
                    patientPolicy: response.data.info.patient.personal_policy,
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    uziDevice: response.data.info.uzi_device_name === 'GE Voluson E8' ? 1 : 2,
                    projectionType: response.data.info.projection_type,
                    longResult: response.data.info.diagnosis,
                    uziLength: response.data.info.nodule_length,
                    uziWidth: response.data.info.nodule_widht,
                    uziDepth: response.data.info.nodule_height,
                    originalImage: response.data.images.original.image,
                    segmentedImage: response.data.images.segmentation.image,
                    boxImage: response.data.images.box.image,
                    tiradsType: response.data.info.nodule_type,

                })
            });

    }

    handlePatientList = () => {
        axios.get(this.props.url+"/api/v2/patient/list/?format=json")
            .then((response) => this.setState({patients: response.data.results}))
    };
    handleExport = () => {
        axios.get(this.props.url+this.state.segmentedImage, {responseType: 'blob'}).then( res => {
            const formData = new FormData();
            const image = new File([res.data], 'uploadfile.png')
            formData.append("segmentation_image.image", image);
            formData.append("group.nodule_type", this.state.tiradsType);
            axios.put(this.props.url+"/api/v2/uzi/update/seg_group/" + this.props.props, formData)
        }
    )
    };

    handleChooseDate = (event) => {
        this.setState({
            uziDate: event.target.value,
        });
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
            patientPolicy: value.personal_policy,
            patientLastName: value.last_name,
            patientFirstName: value.first_name,
            patientFathersName: value.fathers_name,
        });
    };


    render() {
        const styles = getStyles();
        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
                <Box sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 15,
                    paddingTop: 5,
                    paddingBottom: 10,
                    borderTopLeftRadius: 130,
                    elevation: 10,
                    boxShadow: 2,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid direction={'column'} spacing={4} alignContent={'center'} justifyContent={'center'}>
                        <Grid item>
                            <Grid container direction={'row'} spacing={2}>
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
                                    <Box sx={{width: 300}}></Box>
                                </Grid>
                                <Grid item>
                                    <Box sx={{width: 350, borderRadius: 3, boxShadow: 1}}>
                                        <FormControl variant={'outlined'} fullWidth>
                                            <Autocomplete
                                                id="country-select-demo"
                                                sx={{width: 350}}
                                                options={this.state.patients}
                                                autoHighlight
                                                onChange={this.handleChoosePatient}
                                                style={{whiteSpace: 'normal'}}
                                                value={{
                                                    last_name: this.state.patientLastName,
                                                    first_name: this.state.patientFirstName,
                                                    fathers_name: this.state.patientFathersName,
                                                    personal_policy: this.state.patientPolicy
                                                }}
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
                            </Grid>
                        </Grid>
                        <Grid item fullWidth alignItems={'ceneter'} justifyContent={'center'} sx={{paddingTop:5}}>
                            <Grid container direction={'row'} spacing={6}>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400}}
                                            containerStyle={Object.assign(styles.cardStyle.containerStyle, this.props.containerStyle)}>
                                            {(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif') && <TiffImageComponent url={this.props.url} img={this.state.originalImage}/>}
                                            {this.state.originalImage.split('.')[1] === 'png' && <ImageComponent url={this.props.url} img={this.state.originalImage} number={this.props.props} type={this.state.projectionType} choosen={this.state.imageChoosen}/>}
                                        </Card>
                                </Grid>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400}}
                                            containerStyle={Object.assign(styles.cardStyle.containerStyle, this.props.containerStyle)}>
                                            {(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif') &&<TiffImageComponent url={this.props.url} img={this.state.segmentedImage}/>}
                                            {this.state.originalImage.split('.')[1] === 'png' &&<ImageComponent url={this.props.url} img={this.state.segmentedImage} number={this.props.props} type={this.state.projectionType} choosen={this.state.imageChoosen}/>}
                                        </Card>
                                </Grid>
                                <Grid item>
                                        <Card
                                            className={this.props.className}
                                            style={styles.cardStyle.style}
                                            sx={{boxShadow:3, width:400}}
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
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        select
                                                        value={this.state.uziDevice}
                                                        label="Аппарат"
                                                        onChange={this.handleChooseDevice}
                                                        variant='outlined'
                                                        SelectProps={{defaultValue: this.state.uziDevice}}
                                                    >
                                                        <MenuItem value={1}>GE Voluson E8</MenuItem>
                                                        <MenuItem value={2}>Logic</MenuItem>
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{width: 300, borderRadius: 3, boxShadow: 1}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                                <FormControlLabel control={<Checkbox sx={{color: '#4fb3ea', '&.Mui-checked': {
                                                        color: '#4fb3ea',}}} name={'Обнаружено новообразование'}
                                                                                   onChange={this.handleChooseShortResult}
                                                                                   value={this.state.shortResult}/>}/>
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
                                                            h6: {color: '#4FB3EAFF', fontSize: 20, fontFamily: "Roboto"}
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