
import {Box, FormControl, MenuItem} from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {TextFieldResult} from "./ResultsPage";
import ConvasComponent from "./ConvasComponent";



class MaskPage extends React.Component {
    constructor() {
        super();
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
            typeText: "Выберите файл в формате .tiff",
        };
    }

    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
    };


    render() {
        return (
            <FormControl fullWidth fullHeight sx={{height: '100%', width:'100%'}}>
            <Box sx={{paddingLeft:10, paddingTop:5}}>
            <Grid container={'row'} justify = "center">
                <Box sx={{ width: 300, borderRadius:3, boxShadow:4}} >
                    <FormControl variant={'outlined'} fullWidth  >
                    <TextFieldResult
                        labelId="device"
                        value={this.state.tiradsType}
                        label="Тип узла по EU TI-RADS"
                        onChange= {this.handleChooseTirads}
                        variant='outlined'
                        defaultValue = {1}
                        select
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
                <Box sx={{ height: 50}} />
        <ConvasComponent img={this.state.originalImage}/>
        </Box>
            </FormControl>
        );
    }
}

export default MaskPage;

