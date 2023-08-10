// MUI Компоненты
import {React, useState, useRef} from 'react';
import { Box, Button, Grid, Dialog, TextField, DialogTitle, DialogActions, DialogContent, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';

//Пользовательские
import TabsComponent from '../TabsComponent';
import Corrector from '../components/Corrector'

import axios from 'axios';
// Иконки
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// Redux
import { useDispatch, useSelector } from 'react-redux';


const CorrectionPage = () => {

    // Состояния и ссылки для импорта
    const [importActivateState, setImportActivateState] = useState(false)
    const [importMenuState, setImportMenuState] = useState(false)
    const [importTableRows, setImportTableRows] = useState([])

    const importTableColumns = useRef([
        { field: 'id', headerName: 'ID', width: 52},
        { field: 'creation_date', headerName: 'Дата', width: 200 },
        { field: 'name', headerName: 'Имя Файла', width: 200 },
        { field: 'description', headerName: 'Описание', width: 300 },
        { 
            field: 'importAction', 
            headerName: '', 
            width: 100, 
            cellClassName: 'actions-column--cell',
            renderCell: (params) => {
                return (
                  <IconButton onClick={() => handleApplyImportedCorrection(params)}>
                    <AddCircleOutlineRoundedIcon/>
                  </IconButton>
                );
            },
        }
    ]); 


    // Состояния и ссылки для экспорта
    const [exportActivateState, setExportActivateState] = useState(false)
    const [exportSuccessState, setExportSuccessState] = useState(false)
    const [exportMenuState, setExportMenuState] = useState(false)

    const fileNameRef = useRef(null)
    const descriptionRef = useRef(null)

    // Глобальные состояния из redux-хранилища
    const annotations = useSelector(state => state.annotations)
    const imageID = useSelector(state => state.imageID)
    const dispatch = useDispatch()

    // Обработчики
    const handleImportCorrection = async (event) => {
        const newImportTableRows = []
        const response = await axios.get(`http://localhost:8000/api/v4/cytology/correction?image_id=${imageID}`)
        response.data.results.forEach(element => {
            newImportTableRows.push(element)
        });
        setImportTableRows(newImportTableRows)
    }

    const handleApplyImportedCorrection = (params) => {
        dispatch({type: 'SET_ANNOTATIONS', payload: JSON.parse(params.row.correction)})
    }

    const handleExportCorrection = async (event) => {
        setExportActivateState(true)
        if (annotations) {
            try {
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
                <DialogActions sx={{justifyContent: 'center'}}>
                    <LoadingButton 
                    loading={exportActivateState}
                    loadingIndicator="Loading…" 
                    variant="outlined"
                    startIcon={<FileUploadIcon/>}
                    color={exportSuccessState ? 'success' : 'primary'}
                    onClick={handleExportCorrection}>
                        {exportSuccessState ? 'Успешно' : 'Экспортировать'}
                    </LoadingButton>
                </DialogActions>
            </Dialog>  
            

            {/* Диалог окна импорта */}
            <Dialog
            open={importMenuState} 
            onClose={() => {
                setImportMenuState(false)
            }}
            fullWidth={true}
            maxWidth={"md"}>
                <DialogTitle>Импорт коррекции</DialogTitle>
                <DialogContent>
                    <Box sx={
                        {
                            height: "400px",
                            '& .actions-column--cell': {
                                justifyContent: 'center'
                                }
                        }
                    }>
                        <DataGrid
                        rows={importTableRows}
                        columns={importTableColumns.current}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    
                </DialogActions>
            </Dialog>  
        </Box>
    );
}

export default CorrectionPage;
