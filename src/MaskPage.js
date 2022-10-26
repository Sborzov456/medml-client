
import {Box, FormControl, FormControlLabel, FormLabel, MenuItem, Select} from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {TextFieldResult} from "./ResultsPage";
import ConvasComponent from "./ConvasComponent";
import {useParams} from "react-router-dom";
import axios from "axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import GlobalStyles from "@mui/material/GlobalStyles";

const MaskPageInterface = () => {
    const {number2} = useParams();
    return (
        <MaskPage props={number2}></MaskPage>
    )
}



class MaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: '',
            segmentedImage:"",
            boxImage:"",
            uziDevice: null,
            projectionType: null,
            patientCard: null,
            uziDate: null,
            tiradsType:null,
            predictedTypes: {0: '3 - 77.43%',   1: '4 - 44.22%',   2: '2 - 7.84%'},
            shortResult: false,
            uziWidth: 0,
            uziLength: 0,
            uziDepth: 0,
            uziVolume: null,
            longResult:null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
        };
        this.handleStartPage()
    }
    handleStartPage = () => {
        axios.get("http://localhost:8000/api/v2/uzi/"+this.props.props+"/?format=json")
            .then((response) => {
                this.setState({ startData: response.data.info})
                this.setState({
                    originalImage: response.data.images.original.image,
                })
            });

    }

    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
    };


    render() {
        return (
            <FormControl fullWidth fullHeight sx={{height: '100%', width:'100%'}}>
                <Box sx={{backgroundColor: '#ffffff', paddingLeft: 15,paddingTop: 3,paddingBottom: 10,borderTopLeftRadius:130, elevation:10, boxShadow: 2, '&:hover': {
                        backgroundColor: "#ffffff",
                    },}} >
            <Grid container={true} direction={'row'} justify = "center">
                <Grid item>
                    <ConvasComponent img={this.state.originalImage} number={this.props.props} type={this.state.projectionType} />
                </Grid>
                <Grid item>
                    <Box sx={{ width: 300, borderRadius:3}} >
                    </Box>
                </Grid>
            </Grid>
        </Box>
            </FormControl>
        );
    }
}

export default MaskPageInterface;

