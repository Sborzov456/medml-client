import * as React from 'react';
import '@fontsource/poppins/700.css'
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Slide,
    styled,
    TextField,
} from "@mui/material";
import 'dayjs/locale/ru';
import Grid from '@mui/material/Grid';
import {TextFieldWrapper} from "./UploadPage";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import axios from "axios";
import {Link, useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Gallery from "./Gallery";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import Typography from "@mui/material/Typography";
import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff', display: 'flex'
    },
    russianLight: {
        fontFamily: 'Roboto-light', textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    russianMedium: {
        fontFamily: 'Roboto-medium',  textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    sectionTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2,
    },
    sectionHeader: {
        textAlign: 'right', margin: 0, paddingTop: 5, paddingRight: 5, width: 200, alignSelf: 'flex-end',
        fontSize: 10, color: '#4fb3ea',
    },
    sectionEnd: {
        textAlign: 'left', margin: 0, paddingTop: 5, paddingLeft: 10, alignSelf: 'flex-start',
        fontSize: 10,
    },
    sectionPatient: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13
    },
    sectionPatient2: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13, flexDirection: 'row'
    },
    sectionInfo: {
        textAlign: 'center', marginBlock: 0, paddingTop: 1,
        fontSize: 13, color: '#4fb3ea',
    },
    sectionPolicy: {
        textAlign: 'left', marginBlock: -10, paddingLeft: 10, justifyContent: 'auto',
        fontSize: 13, flexDirection: 'row'
    },
    sectionSubTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2, fontSize: 15,
    },
    sectionCont: {
        flexDirection: "row",
    },
});
Font.register({
    family: 'Roboto-light',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});
Font.register({
    family: 'Roboto-medium',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const MyDocument = (props) => (
    <Document language={'rus'}>
        <Page size="A4" style={styles.page}>
            <View style={styles.sectionHeader}>
                <Text style={styles.russianLight}>Результат сформирован автоматически виртуальным ассистентом</Text>
            </View>
            <View style={styles.sectionTitle}>
                <Text style={styles.russianMedium}>Результат УЗИ щитовидной железы</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Пациент: </Text>
                <Text style={styles.russianLight}>{props.patient}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Полис: </Text>
                <Text style={styles.russianLight}>{props.policy}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Дата приема: </Text>
                <Text style={styles.russianLight}>{props.date}   </Text>
                <Text style={styles.russianMedium}>Аппарат: </Text>
                <Text style={styles.russianLight}>{props.device}   </Text>
                <Text style={styles.russianMedium}>Проекция: </Text>
                <Text style={styles.russianLight}>{props.projection} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Контуры: </Text>
                <Text style={styles.russianLight}>{props.profile}   </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Общий объем щитовидной железы: </Text>
                <Text style={styles.russianLight}>{props.volume} см3</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Перешеек: </Text>
                <Text style={styles.russianLight}>{props.isthmus} см</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Правая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.right_length} см, Ширина - {props.right_width} см, Толщина  - {props.right_depth} см, Объем - {props.right_volume} см3  </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Левая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.left_length} см, Ширина - {props.left_width} см, Толщина  - {props.left_depth} см, Объем - {props.left_volume} см3  </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Васкуляризация при ЦДК: </Text>
                <Text style={styles.russianLight}>{props.cdk} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Расположение: </Text>
                <Text style={styles.russianLight}>{props.position} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Структура: </Text>
                <Text style={styles.russianLight}>{props.structure} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Эхогенность: </Text>
                <Text style={styles.russianLight}>{props.echogenicity} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Дополнительные данные: </Text>
                <Text style={styles.russianLight}>{props.additional_data} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Регионарные лимфатические узлы: </Text>
                <Text style={styles.russianLight}>{props.rln} </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Тип новообразования по мнению ассистента: </Text>
            </View>
            <View style={styles.sectionInfo}>
                <Text style={styles.russianLight}>{props.predictedTypes}</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Заключение</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianLight}>{props.result} </Text>
            </View>
            <View style={styles.sectionCont}>
            <View style={styles.sectionEnd}>
                <Text style={styles.russianMedium}>Врач:</Text>
                <Text style={styles.russianLight}>{props.doctorName} </Text>
                <Text style={styles.russianLight}>{props.medOrg} </Text>
            </View>
            <View style={styles.sectionEnd}>
                <Text style={styles.russianMedium}>Дата:</Text>
                <Text style={styles.russianLight}>{new Date().toLocaleDateString()} </Text>
            </View>
            <View style={styles.sectionEnd}>
                <Text style={styles.russianMedium}>Подпись:</Text>
                <Text style={styles.russianLight}> </Text>
                <Text style={styles.russianLight}>________________________ </Text>
            </View>
            </View>
        </Page>
    </Document>
);

const theme = createTheme()
export const TextFieldResult = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 1px;
  }

,
'& label': marginLeft: "100%",
`;

function BootstrapDialogTitle(props) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{width: 2000}}{...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}


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
            cdk: "не измена",
            diagnosis: "",
            echogenicity: "средняя",
            isthmus: 0,
            left_depth: 0,
            left_length: 0,
            left_width: 0,
            position: "обычное",
            profile: "чёткие, ровные",
            projection_type: "long",
            result: "без динамики",
            right_depth: 0,
            right_length: 0,
            right_width: 0,
            rln: "нет",
            structure: "однородная",
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
            devices: [],
            open: false,
            left_volume: 0,
            right_volume: 0,
            volume: 0,
            additional_data: "",
            openError: false,
            doctorName: '',
            medOrg: '',
            date: new Date()
        };
        this.handleStartPage();
        this.handleDoctor()
    }
    handleDoctor = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+ '/api/v2/med_worker/update/' + localStorage.getItem('id')).then((response) => {
            console.log(response.data)
            this.setState({
                doctorName: response.data.last_name+" "+ response.data.first_name+" "+response.data.fathers_name,
                medOrg: response.data.med_organization+", "+response.data.job
            })
        })
    };
    handleResponse = () => {
        this.handleExport()
    };
    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/api/v2/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info})
                console.log(response.data)
                var tmpTirads = [];
                var secondTmpTirads = []
                secondTmpTirads.push(parseFloat(response.data.info.details.nodule_1), parseFloat(response.data.info.details.nodule_2), parseFloat(response.data.info.details.nodule_3), parseFloat(response.data.info.details.nodule_4), parseFloat(response.data.info.details.nodule_5))
                secondTmpTirads.sort(function (a, b) {
                    return a - b;
                })
                const indexes = {1: true, 2: true, 3: true, 4: true, 5: true}
                secondTmpTirads.reverse()
                for (let a of secondTmpTirads) {
                    if ((a === parseFloat(response.data.info.details.nodule_1)) && indexes[1]) {
                        tmpTirads.push(a + '% - EU-TIRADS 1')
                        indexes[1] = false
                    } else if ((a === parseFloat(response.data.info.details.nodule_2)) && indexes[2]) {
                        tmpTirads.push(a + '% - EU-TIRADS 2')
                        indexes[2] = false
                    } else if ((a === parseFloat(response.data.info.details.nodule_3)) && indexes[3]) {
                        tmpTirads.push(a + '% - EU-TIRADS 3')
                        indexes[3] = false
                    } else if ((a === parseFloat(response.data.info.details.nodule_4)) && indexes[4]) {
                        tmpTirads.push(a + '% - EU-TIRADS 4')
                        indexes[4] = false
                    } else if ((a === parseFloat(response.data.info.details.nodule_5)) && indexes[5]) {
                        tmpTirads.push(a + '% - EU-TIRADS 5')
                        indexes[5] = false
                    }
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                axios.get(this.props.url + "/api/v2/uzi/devices/?format=json")
                    .then((res) => {
                        this.setState({devices: res.data.results})
                        const tmp = res.data.results
                        for (let cur of tmp) {
                            if (cur.name === response.data.info.uzi_device_name) {
                                this.setState({
                                    uziDevice: cur
                                })
                                console.log(cur)
                            }
                        }
                    })
                this.setState({
                    uziDate: response.data.info.acceptance_datetime,
                    predictedTypes: tmpTirads,
                    patientCard: response.data.info.patient.id,
                    patientPolicy: response.data.info.patient.personal_policy,
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    projectionType: response.data.info.details.projection_type,
                    longResult: response.data.info.echo_descr,
                    originalImage: response.data.images.original.image,
                    segmentedImage: response.data.images.segmentation.image,
                    boxImage: response.data.images.box.image,
                    tiradsType: response.data.info.details.nodule_type,
                    shortResult: response.data.info.has_nodules === 'T',
                    cdk: response.data.info.details.cdk,
                    diagnosis: response.data.info.diagnosis,
                    echogenicity: response.data.info.details.echogenicity,
                    isthmus: response.data.info.details.isthmus,
                    left_depth: response.data.info.details.left_depth,
                    left_length: response.data.info.details.left_length,
                    left_width: response.data.info.details.left_width,
                    position: response.data.info.details.position,
                    profile: response.data.info.details.profile,
                    result: response.data.info.details.result,
                    right_depth: response.data.info.details.right_depth,
                    right_length: response.data.info.details.right_length,
                    right_width: response.data.info.details.right_width,
                    rln: response.data.info.details.rln,
                    structure: response.data.info.details.structure,
                    additional_data: response.data.info.details.additional_data,
                    right_volume: !isNaN(0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width)? (0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width) : 0,
                    left_volume: !isNaN(0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width)? (0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width) : 0,
                    volume: !isNaN(0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width + 0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width)? (0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width + 0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width):0,
                })
            })

    }

    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        console.log(this.state)
        axios.get(this.props.url + "/api/v2/uzi/" + this.props.props + "/?format=json").then((response) => {
            console.log(response.data)
            const formData = {patient_card: {}, details: {}}
            formData.id = response.data.images.box.image_group
            formData.patient_card.patient = response.data.info.patient.id
            formData.acceptance_datetime = this.state.uziDate
            formData.patient_card.has_nodules = this.state.shortResult ? 'T' : 'F'
            formData.patient_card.diagnosis = this.state.diagnosis
            formData.details.projection_type = this.state.projectionType
            formData.details.nodule_type = this.state.tiradsType
            formData.uzi_device = this.state.uziDevice.id
            formData.details.cdk = this.state.cdk
            formData.details.echogenicity = this.state.echogenicity
            formData.details.isthmus = this.state.isthmus
            formData.details.left_depth = this.state.left_depth
            formData.details.left_length = this.state.left_length
            formData.details.left_width = this.state.left_width
            formData.details.position = this.state.position
            formData.details.profile = this.state.profile
            formData.details.result = this.state.result
            formData.details.right_depth = this.state.right_depth
            formData.details.right_length = this.state.right_length
            formData.details.right_width = this.state.right_width
            formData.details.rln = this.state.rln
            formData.details.structure = this.state.structure
            formData.details.additional_data = this.state.additional_data
            console.log(formData)
            axios.put(this.props.url + "/api/v2/uzi/" + this.props.props + '/update/', formData).then(() => {
                this.setState({
                    openSuccess: true,
                })
                console.log(this.state.openSuccess)
            }).catch(() => {
                this.setState({
                    openError: true,
                })
                console.log(this.state.openError)
            })
        })

    };
    handleCdk = (event) => {
        this.setState({
            cdk: event.target.value
        })
    }
    handleDiagnosis = (event) => {
        this.setState({
            diagnosis: event.target.value
        })
    }

    handleEchogenicity = (event) => {
        this.setState({
            echogenicity: event.target.value
        })
    }
    handleIsthmus = (event) => {
        this.setState({
            isthmus: event.target.value
        })
    }

    handleLeft_depth = (event) => {
        this.setState({
            left_depth: event.target.value,
            left_volume: 0.479 * event.target.value * this.state.left_length * this.state.left_width,
            volume: 0.479 * event.target.value * this.state.left_length * this.state.left_width + this.state.right_volume,
        })
    }

    handleLeft_length = (event) => {
        this.setState({
            left_length: event.target.value,
            left_volume: 0.479 * this.state.left_depth * event.target.value * this.state.left_width,
            volume: 0.479 * this.state.left_depth * event.target.value * this.state.left_width + this.state.right_volume,
        })
    }

    handleLeft_width = (event) => {
        this.setState({
            left_width: event.target.value,
            left_volume: 0.479 * this.state.left_depth * this.state.left_length * event.target.value,
            volume: 0.479 * this.state.left_depth * this.state.left_length * event.target.value + this.state.right_volume,
        })
    }

    handleRight_depth = (event) => {
        this.setState({
            right_depth: event.target.value,
            right_volume: 0.479 * event.target.value * this.state.right_length * this.state.right_width,
            volume: 0.479 * event.target.value * this.state.right_length * this.state.right_width + this.state.left_volume,
        })
    }

    handleRight_length = (event) => {
        this.setState({
            right_length: event.target.value,
            right_volume: 0.479 * this.state.right_depth * event.target.value * this.state.right_width,
            volume: 0.479 * this.state.right_depth * event.target.value * this.state.right_width + this.state.left_volume

        })
    }

    handleRight_width = (event) => {
        this.setState({
            right_width: event.target.value,
            right_volume: 0.479 * this.state.right_depth * this.state.right_length * event.target.value,
            volume: 0.479 * this.state.right_depth * this.state.right_length * event.target.value + this.state.left_volume

        })
    }

    handlePosition = (event) => {
        this.setState({
            position: event.target.value
        })
    }

    handleProfile = (event) => {
        this.setState({
            profile: event.target.value
        })
    }
    handleAdditional_data = (event) => {
        this.setState({
            additional_data: event.target.value
        })
    }
    handleResult = (event) => {
        this.setState({
            result: event.target.value
        })
    }

    handleRln = (event) => {
        this.setState({
            rln: event.target.value
        })
    }

    handleStructure = (event) => {
        this.setState({
            structure: event.target.value
        })
    }

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
    handleCloseDialog = () => {
        this.setState({
            open: false
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
    handleDialog = () => {
        this.setState({
            open: true
        })
    };

    render() {
        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
                <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Результат сохранен!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}}
                           onClose={this.handleClose}>Возникла ошибка при сохранении</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 15,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid component={""} direction={'column'} alignContent={'center'} justifyContent={'center'} sx={{marginBlock: -1}}>
                        <Grid component={""} item>
                            <Grid component={""} item>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Пациент: </h3>
                                    <h3>  {this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h3>
                                    )}
                                </Box>
                            </Grid>
                            <Grid component={""} item>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Полис: </h3>
                                    <h3>  {this.state.patientPolicy}</h3>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid component={""} item alignItems={'center'} justifyContent={'center'} sx={{paddingTop: 0}}>
                            <Gallery url={this.props.url} props={this.props.props} link1={this.state.originalImage}
                                     link2={this.state.segmentedImage} link3={this.state.boxImage}
                                     number={this.props.props} type={this.state.tiradsType}></Gallery>
                        </Grid>
                        <Box component={""} sx={{display: 'flex', flexDirection: 'row', paddingTop: 2}}>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <Autocomplete
                                            id="devices"
                                            sx={{width: 300}}
                                            options={this.state.devices}
                                            autoHighlight
                                            value={this.state.uziDevice}
                                            defaultValue={{
                                                id: this.state.uziDevice.id,
                                                name: this.state.uziDevice.name
                                            }}
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
                                <Box component={""} sx={{width: 300, borderRadius: 3}}>
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
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
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
                                <Box component={""} sx={{width: 300, borderRadius: 3}}>
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
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 1, paddingLeft: 2}}>
                                <FormGroup>

                                    <FormControlLabel label={"Обнаружено новообразование"}
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.shortResult} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<DoneSharpIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                                         onChange={this.handleChooseShortResult}
                                                      />}/>
                                </FormGroup>
                                <Box component={""} sx={{
                                    width: 300,
                                    borderRadius: 3,
                                    paddingTop: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}>
                                    <Button sx={{
                                    color: '#4fb3ea',
                                    '&:focus': {},
                                    '&:hover': {},
                                    fontFamily: 'Roboto'
                                }} variant={'outlined'} onClick={this.handleDialog}>
                                    Эхографические признаки
                                </Button>
                                </Box>
                                <Dialog PaperProps={{sx: {borderRadius: 3, width: 2000}}}
                                        open={this.state.open}
                                        keepMounted
                                        onClose={this.handleCloseDialog}
                                        aria-describedby="alert-dialog-slide-description"
                                        BackdropProps={{style: {opacity: 0.3}}}
                                >

                                    <BootstrapDialogTitle color={'#4fb3ea'} fontWeight={'lighter'} fontSize={25}
                                                          sx={{marginBottom: -2}} onClose={this.handleCloseDialog}>Результаты
                                        диагностики</BootstrapDialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description" fontFamily={'Roboto'}
                                                           fontWeight={'lighter'} color={'dimgray'} fontSize={10}
                                                           sx={{marginBlock: 0}}>
                                            Заполните необходимые поля
                                        </DialogContentText>
                                        <Box component={""} sx={{display: 'flex', flexDirection: 'column'}}>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.profile}
                                                        label="Контуры"
                                                        onChange={this.handleProfile}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{display: 'flex', flexDirection: 'row'}}>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column', paddingRight: 2}}>
                                                    <Grid component={""} item>
                                                        <Typography component={""} sx={{
                                                            paddingTop: 2,
                                                            color: 'dimgray',
                                                            fontWeight: 'lighter'
                                                        }} variant={'body1'}>Левая доля</Typography>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_length}
                                                                    label="Длина"
                                                                    onChange={this.handleLeft_length}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_width}
                                                                    label="Ширина"
                                                                    onChange={this.handleLeft_width}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>

                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_depth}
                                                                    label="Толщина"
                                                                    onChange={this.handleLeft_depth}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_volume}
                                                                    label="Объем"
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                </Box>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column'}}>
                                                    <Grid component={""} item>
                                                        <Typography component={""} sx={{
                                                            paddingTop: 2,
                                                            color: 'dimgray',
                                                            fontWeight: 'lighter'
                                                        }} variant={'body1'}>Правая доля</Typography>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_length}
                                                                    label="Длина"
                                                                    onChange={this.handleRight_length}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_width}
                                                                    label="Ширина"
                                                                    onChange={this.handleRight_width}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>

                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_depth}
                                                                    label="Толщина"
                                                                    onChange={this.handleRight_depth}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.right_volume}
                                                                label="Объем"
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box component={""} sx={{width: 215, borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        value={this.state.volume}
                                                        label="Объем железы"
                                                        variant='outlined'
                                                        InputLabelProps={{shrink: true}}
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: 215, borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.isthmus}
                                                        label="Перешеек"
                                                        onChange={this.handleIsthmus}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.structure}
                                                        label="Структура"
                                                        onChange={this.handleStructure}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.echogenicity}
                                                        label="Эхогенность"
                                                        onChange={this.handleEchogenicity}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.rln}
                                                        label="Регионарные лимфатические узлы"
                                                        onChange={this.handleRln}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.cdk}
                                                        label="Васкуляризация по ЦДК"
                                                        onChange={this.handleCdk}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.position}
                                                        label="Расположение"
                                                        onChange={this.handlePosition}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.additional_data}
                                                        label="Дополнительные данные"
                                                        onChange={this.handleAdditional_data}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.diagnosis}
                                                        label="Заключение"
                                                        onChange={this.handleDiagnosis}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>


                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <Box component={""} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignContent: 'center', alignItems: 'center'
                                    }}
                                    >
                                        <Box component={""} sx={{
                                            width: 300,
                                            borderRadius: 3,
                                            paddingBottom: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}><Button sx={{
                                            width: '100%',
                                            color: '#4fb3ea',
                                            '&:focus': {},
                                            '&:hover': {},
                                            fontFamily: 'Roboto'
                                        }} variant={'outlined'} onClick={this.handleResponse}>
                                            Сохранить результат
                                        </Button>
                                        </Box>
                                        <Box component={""} sx={{
                                            width: 300,
                                            borderRadius: 3,
                                            paddingBottom: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            <PDFDownloadLink document={<MyDocument patient={this.state.patientLastName + " " + this.state.patientFirstName + " " + this.state.patientFathersName}
                                                                                   policy={this.state.patientPolicy}
                                                                                   date={new Date(Date.parse(this.state.uziDate)).toLocaleDateString()}
                                                                                   projection={this.state.projectionType === 'long' ? 'Поперечная' : "Продольная"}
                                                                                   device={this.state.uziDevice.name.toString()}
                                                                                   tiradsType={this.state.tiradsType}
                                                                                   predictedTypes={this.state.predictedTypes.toString().replaceAll(',', ", ")}
                                                                                   cdk={this.state.cdk}
                                                                                   diagnosis={this.state.diagnosis}
                                                                                   echogenicity={this.state.echogenicity}
                                                                                   isthmus={this.state.isthmus}
                                                                                   left_depth={this.state.left_depth}
                                                                                   left_length={this.state.left_length}
                                                                                   left_width={this.state.left_width}
                                                                                   position={this.state.position}
                                                                                   profile={this.state.profile}
                                                                                   result={this.state.result}
                                                                                   right_depth={this.state.right_depth}
                                                                                   right_length={this.state.right_length}
                                                                                   right_width={this.state.right_width}
                                                                                   rln={this.state.rln}
                                                                                   structure={this.state.structure}
                                                                                   left_volume={this.state.left_volume}
                                                                                   right_volume={this.state.right_volume}
                                                                                   volume={this.state.volume}
                                                                                   additional_data={this.state.additional_data}
                                                                                   doctorName={this.state.doctorName}
                                                                                   medOrg={this.state.medOrg}
                                            />} fileName={"Result_"+this.state.date.toLocaleDateString().replaceAll(".", "_")+"_"+this.state.patientLastName+".pdf"}
                                                             style={{textDecoration: 'none'}}>
                                                {({ loading}) =>
                                                    (loading ? "loading" : <Button sx={{
                                                        width: '100%',
                                                        color: '#4fb3ea',
                                                        '&:focus': {},
                                                        '&:hover': {},
                                                        fontFamily: 'Roboto'
                                                    }} variant={'outlined'}>Скачать заключение</Button>)}
                                            </PDFDownloadLink>
                                        </Box>
                                        <Box component={""} sx={{
                                            width: 300, borderRadius: 3, display: 'flex', justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            <Button component={Link} to={`mask/`}
                                                    disabled={(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif')}
                                                    sx={{
                                                        width: '100%',
                                                        color: '#3083a9',
                                                        '&:focus': {backgroundColor: '#3083a9'},
                                                        '&:hover': {},
                                                        fontFamily: 'Roboto'
                                                    }} variant={'outlined'}>
                                                Указать ошибку
                                            </Button>
                                        </Box>

                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Box>

            </FormControl>
        )

    }
}

export default ResultsPageInterface;