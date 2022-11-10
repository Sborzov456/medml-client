import * as React from 'react';
import '@fontsource/poppins/700.css'

import {Button, FormControl, IconButton} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {Box} from "@mui/material";


import { Link} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import BasicMenu from "./MenuButton";
import axios from "axios";

function createData(id, patientName, patientPolicy, uziDate, tiradsType, uziVolume, uziDevice, projectionType) {
    return {id, patientName, patientPolicy, uziDate, tiradsType, uziVolume, uziDevice, projectionType};
}

const MyGrid = (props) => {
    const columns = [{
        field: 'id', headerName: '', width: 1, sortable: false, disableColumnMenu: true,
    }, {field: 'patientName', headerName: 'Пациент', width: 210}, {
        field: 'patientPolicy',
        headerName: 'Полис пациента',
        width: 190
    }, {field: 'uziDate', headerName: 'Дата приема', width: 130, type: 'date'}, {
        field: 'tiradsType', headerName: 'Тип узла \n по EU TI-RADS', width: 190,

    }, {
        field: 'uziVolume', headerName: 'Объём образования', width: 160,
    }, {field: 'uziDevice', headerName: 'Аппарат', width: 150}, {
        field: 'projectionType', headerName: 'Тип проекции', width: 130, sortable: false, disableColumnMenu: true,
    }, {
        field: 'button',
        headerName: '',
        width: 190,
        sortable: false,
        renderCell: (params) => renderDetailsButton(params),
        disableColumnMenu: true,
    }, {
        field: 'button_delete',
        headerName: '',
        width: 30,
        sortable: false,
        renderCell: (params) => renderDeleteButton(params),
        disableColumnMenu: true,
    },];
    const renderDetailsButton = (params) => {
        return (<strong>
                <Button
                    component={Link}
                    to={'/result/' + params.row.id}
                    variant="contained"
                    size={'small'}
                    style={{marginLeft: 16, backgroundColor: '#4FB3EAFF'}}
                >
                    Открыть результат
                </Button>
            </strong>)
    }
    const renderDeleteButton = (params) => {
        return (<strong>
                <BasicMenu props={params.row.id} rows={tableData} set={setTableData}/>
            </strong>)
    }

    var [tableData, setTableData] = useState([])

    useEffect(() => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        var tmpAr = [];
        axios.get(props.url + "/api/v2/uzi/ids/?format=json&ids=[" + storedNames + "]").then((response) => {
            console.log(response.data.results)
            for (let cur of storedNames) {
                console.log(response.data.results[cur])
                tmpAr.push(createData(response.data.results[cur].id, response.data.results[cur].patient.last_name + " " + response.data.results[cur].patient.first_name + " " + response.data.results[cur].patient.fathers_name, response.data.results[cur].patient.personal_policy, new Date(Date.parse(response.data.results[cur].acceptance_datetime)), response.data.results[cur].nodule_type, 0.479 * response.data.results[cur].nodule_height * response.data.results[cur].nodule_length * response.data.results[cur].nodule_widht, response.data.results[cur].uzi_device_name, response.data.results[cur].projection_type === "long" ? "Поперечная" : "Продольная"))
            }
            })
            .then(() => setTableData(tmpAr))

        }, [props.url])

        return (<div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={tableData}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick={true}
                    rowsPerPageOptions={[5]}
                />
            </div>)
    }

    class ShotTable extends React.Component {


        render() {
            return (<FormControl fullWidth sx={{height: '100%', width: '100%'}}>
                    <Box sx={{
                        backgroundColor: '#ffffff',
                        paddingLeft: 5,
                        paddingTop: 7,
                        borderTopLeftRadius: 130,
                        elevation: 10,
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: "#ffffff",
                        },

                    }} display={'flex'}>
                        <GlobalStyles styles={{
                            h2: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto"},
                            h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                        }}/>
                        <h2>Снимок</h2>
                        <IconButton component={Link} to={`home`}  style={{maxWidth: '30px', maxHeight: '30px'}}
                                    sx={{
                                        paddingLeft: 3, paddingTop: 5.5, '& svg': {
                                            fontSize: 30
                                        },
                                    }}>
                            <AddCircleOutlineIcon></AddCircleOutlineIcon>
                        </IconButton>
                    </Box>
                    <Box sx={{
                        minHeight:470, height: 'auto',
                        backgroundColor: '#ffffff', paddingLeft: 5, paddingTop: 1, paddingBottom: 10,

                    }} display={'flex'}>
                        <MyGrid url={this.props.url}/>
                    </Box>
                </FormControl>)
        }

    }

    export default ShotTable;