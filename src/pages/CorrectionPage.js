import {React, useState} from 'react';
import { Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import TabsComponent from '../TabsComponent';
import Corrector from '../components/Corrector'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import { useDispatch, useSelector } from 'react-redux';

const CorrectionPage = () => {
    const [importActivateState, setImportActivateState] = useState(false)
    const [exportActivateState, setExportActivateState] = useState(false)
    const annotator = useSelector(state => state.annotator)


    const handleImportCorrection = (event) => {
        setImportActivateState(true)
        console.log('in handle')
    }

    const handleExportCorrection = () => {
        if (annotator) {
            setExportActivateState(true)
            console.log(annotator.getAnnotations())
        }
        
    }

    return (
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
        }}>
            <Grid container={true} direction={'row'}>
                {/* Контейнер, где содержится холст отображения */}
                <Grid item={true} xs={9}>
                    <TabsComponent drawerComponent={Corrector}> </TabsComponent>
                </Grid>
                {/* Контейнер, где содержатся кнопки IMPORT и EXPORT */}
                <Grid container={true} direction={'column'} xs={1}>
                    <Grid item={true}>
                        <div style={{marginLeft: "50px", marginTop: "100px"}}>
                            <LoadingButton 
                            loading={importActivateState}
                            loadingIndicator="Loading…" 
                            variant="outlined"
                            startIcon={<ImportExportOutlinedIcon/>}
                            onClick={handleImportCorrection}>
                            IMPORT
                            </LoadingButton>
                        </div>
                    </Grid>
                    <Grid item={true}>
                        <div style={{marginLeft: "50px", marginTop: "10px"}}>
                            <LoadingButton 
                            loading={exportActivateState}
                            loadingIndicator="Loading…" 
                            variant="outlined"
                            startIcon={<ImportExportOutlinedIcon/>}
                            onClick={handleExportCorrection}> 
                            EXPORT
                            </LoadingButton>
                        </div>
                    </Grid>
                </Grid>
            </Grid>   
        </Box>
    );
}

export default CorrectionPage;
