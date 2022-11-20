import * as React from 'react';
import '@fontsource/poppins/700.css'

import {Button, Chip, FormControl, IconButton} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {Box} from "@mui/material";


import {Link, Navigate} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import PatientMenu from "./PatientMenu";
import axios from "axios";

function createData(id, patientName, patientPolicy, email, uziDate, hasNodules, isActive) {
    return {id, patientName, patientPolicy,email, uziDate, hasNodules,isActive};
}

const MyGrid = (props) => {
    const columns = [{
        field: 'id', headerName: '', width: 1, sortable: false, disableColumnMenu: true,
    }, {field: 'patientName', headerName: 'Пациент', width: 230}, {
        field: 'patientPolicy',
        headerName: 'Полис пациента',
        width: 210
    }, {
        field: 'email', headerName: 'Эл. почта', width: 230,
    },
        {field: 'uziDate', headerName: 'Дата приема', width: 130, type: 'date'},
        {
            field: 'hasNodules', headerName: 'Диагноз', width: 160, renderCell: (params) => renderChip2(params),
        },
        {
        field: 'isActive', headerName: 'Статус', width: 160, sortable: false, renderCell: (params) => renderChip(params),
    },
        {
            field: 'button',
            headerName: '',
            width: 190,
            sortable: false,
            renderCell: (params) => renderDetailsButton(params),
            disableColumnMenu: true,
        },
        {
        field: 'button_delete',
        headerName: '',
        width: 30,
        sortable: false,
        renderCell: (params) => renderDeleteButton(params),
        disableColumnMenu: true,
    },
        ];
    const renderDetailsButton = (params) => {
        return (<strong>
            <Button
                component={Link}
                to={'/patient/' + params.row.id}
                variant="contained"
                size={'small'}
                style={{marginLeft: 16, backgroundColor: '#4FB3EAFF'}}
            >
                Открыть карту
            </Button>
        </strong>)
    }
    const renderChip = (params) => {
        return (<strong>
            <Chip
                size={'small'}
                style={{marginLeft: 16, borderColor: params.row.isActive? '#4FB3EAFF': '#a6bac4'}}
                label={params.row.isActive ? "Активен" : "Не активен"}
                sx={{color: params.row.isActive? '#4FB3EAFF': '#a6bac4'}}
                variant={'outlined'}
            >
            </Chip>
        </strong>)
    }
    const handlePatientCard = (params ) => {
        return <Navigate to={"/patient/"+params.row.id} replace />
    }
    const renderChip2 = (params) => {
        return (<strong>
            <Chip
                size={'small'}
                style={{marginLeft: 16, borderColor: params.row.hasNodules? '#4FB3EAFF': '#a6bac4'}}
                label={params.row.hasNodules ? "Обнаружено" : "Не Обнаружено"}
                sx={{color: params.row.hasNodules? '#4FB3EAFF': '#a6bac4'}}
                variant={'outlined'}
            >
            </Chip>
        </strong>)
    }
    const renderDeleteButton = (params) => {
        return (<strong>
            <PatientMenu props={params.row.id} rows={tableData} set={setTableData}/>
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + '/api/v2/med_worker/patients/1').then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.cards) {
                console.log(response.data.results[cur])
                tmpAr.push(createData(cur.id, cur.patient.last_name + " " + cur.patient.first_name + " " + cur.patient.fathers_name, cur.patient.personal_policy, cur.patient.email,  new Date(Date.parse(cur.acceptance_datetime)), cur.has_nodules === "T", cur.patient.is_active))
            }
        })
            .then(() => setTableData(tmpAr))

    }, [props.url])

    return (<div style={{height: 400, width: '100%'}}>
        <DataGrid
            rows={tableData}
            columns={columns}
            pageSize={5}
            onRowClick={handlePatientCard}
            disableSelectionOnClick={true}
            rowsPerPageOptions={[5]}
        />
    </div>)
}

class PatientTable extends React.Component {


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
                <h2>Пациенты</h2>
                <IconButton component={Link} to={`/patient/create`}  style={{maxWidth: '30px', maxHeight: '30px'}}
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

export default PatientTable;