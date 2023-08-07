import {React, useState, useEffect, useRef} from 'react';
import { Box, Button, Grid, Dialog, TextField, FormControl, DialogTitle, DialogActions, DialogContent, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import TabsComponent from '../TabsComponent';
import Corrector from '../components/Corrector'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { useDispatch, useSelector } from 'react-redux';


const CorrectionPage = () => {
    const [importActivateState, setImportActivateState] = useState(false)
    const [importMenuState, setImportMenuState] = useState(false)

    const [exportActivateState, setExportActivateState] = useState(false)
    const [exportSuccessState, setExportSuccessState] = useState(false)
    const [exportMenuState, setExportMenuState] = useState(false)

    const fileNameRef = useRef(null)
    const descriptionRef = useRef(null)

    const annotations = useSelector(state => state.annotations)
    const imageID = useSelector(state => state.imageID)

    const handleImportCorrection = async (event) => {
        console.log('in handle')

    }

    const handleExportCorrection = async (event) => {
        setExportActivateState(true)
        if (annotations) {
            try {
                console.log(annotations)
                console.log(fileNameRef.current.value)
                await axios.post('http://localhost:8000/api/v4/cytology/correction/', 
                {
                    correction: JSON.stringify(annotations), 
                    image: imageID,
                    name: fileNameRef.current.value,
                    description: descriptionRef.current.value,
                    creation_date: new Date().toJSON().slice(0, 10)
                })
                setExportActivateState(false)
                setExportSuccessState(true)
            }
            catch(error) {
                console.log('ошибка', error)
                //TODO: что-то выводить в случае ошибки
            }
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
                            <Button 
                            variant="outlined"
                            startIcon={<ImportExportOutlinedIcon/>}
                            onClick={() => {
                                setImportMenuState(true)
                                handleImportCorrection()
                            }}>
                                Импорт
                            </Button>
                        </div>
                    </Grid>
                    <Grid item={true}>
                        <div style={{marginLeft: "50px", marginTop: "10px"}}>
                            <Button 
                            variant="outlined"
                            startIcon={<ImportExportOutlinedIcon/>}
                            onClick={() => setExportMenuState(true)}> 
                                Экспорт
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid> 

            {/* Диалог окна экспорта */}
            <Box sx={{width: "1000px"}}>
                <Dialog
                open={exportMenuState} 
                onClose={() => {
                    setExportMenuState(false)
                    setExportSuccessState(false)
                }}
                fullWidth={true}>
                    <DialogTitle>Экспорт коррекции</DialogTitle>
                    <DialogContent>
                        <Grid container={true} direction={'column'}>
                            <Box sx={{width: "300px"}}>
                                <TextField
                                    fullWidth={true}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Имя Файла"
                                    variant="outlined"
                                    inputRef={fileNameRef}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    fullWidth={true}
                                    margin="dense"
                                    id="description"
                                    label="Описание"
                                    variant="outlined"
                                    multiline
                                    maxRows={10}
                                    rows={7}
                                    inputRef={descriptionRef}
                                />
                            </Box>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{textAlign: 'center'}}>
                            <LoadingButton 
                            loading={exportActivateState}
                            loadingIndicator="Loading…" 
                            variant="outlined"
                            startIcon={<FileUploadIcon/>}
                            color={exportSuccessState ? 'success' : 'primary'}
                            onClick={handleExportCorrection}>
                                {exportSuccessState ? 'Успешно' : 'Экспортировать'}
                            </LoadingButton>
                        </Box>
                    </DialogActions>
                </Dialog>  
            </Box>
            

            {/* Диалог окна импорта */}
            <Box sx={{width: "1000px"}}>
                <Dialog
                open={importMenuState} 
                onClose={() => {
                    setImportMenuState(false)
                }}
                fullWidth={true}>
                    <DialogTitle>Импорт коррекции</DialogTitle>
                    <DialogContent>
                        <Grid container={true} direction={'column'}>
                            
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        
                    </DialogActions>
                </Dialog>  
            </Box>


        </Box>
    );
}

export default CorrectionPage;
