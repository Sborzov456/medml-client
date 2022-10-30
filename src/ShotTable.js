import * as React from 'react';
import '@fontsource/poppins/700.css'

import {Button, FormControl, IconButton} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {Box} from "@mui/material";


import axios from "axios";

import Image from 'mui-image';
import {Link, useParams} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SimpleListMenu from "./MenuButton";
import BasicMenu from "./MenuButton";

function createData(id, patientName, patientPolicy, uziDate, tiradsType, uziVolume, uziDevice, projectionType) {
    return {id, patientName, patientPolicy, uziDate, tiradsType, uziVolume, uziDevice, projectionType};
}

const MyGrid = (props) => {
    const columns = [
        {
            field: 'id', headerName: '', width: 1, sortable: false,
            disableColumnMenu: true,
        },
        {field: 'patientName', headerName: 'Пациент', width: 210},
        {field: 'patientPolicy', headerName: 'Полис пациента', width: 190},
        {field: 'uziDate', headerName: 'Дата приема', width: 130, type: 'date'},
        {
            field: 'tiradsType',
            headerName: 'Тип узла \n по EU TI-RADS',
            width: 190,

        },
        {
            field: 'uziVolume',
            headerName: 'Объём образования',
            width: 160,
        },
        {field: 'uziDevice', headerName: 'Аппарат', width: 150},
        {
            field: 'projectionType',
            headerName: 'Тип проекции',
            width: 130,
            sortable: false,
            disableColumnMenu: true,
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
        return (
            <strong>
                <Button
                    component={Link}
                    to={'/result/'+params.row.id}
                    variant="contained"
                    size={'small'}
                    style={{ marginLeft: 16, backgroundColor: '#4FB3EAFF' }}
                >
                    Открыть результат
                </Button>
            </strong>
        )
    }
    const renderDeleteButton = (params) => {
        return (
            <strong>
                <BasicMenu props={params.row.id} rows={tableData} set={setTableData}/>
            </strong>
        )
    }

    var [tableData, setTableData] = useState([])
    const fetchWhat = () => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        const data = storedNames.map(async (tmp) => {
                const res = await fetch(props.url+"/api/v2/uzi/" + tmp + "/?format=json")
                return res.json()
            }
        )
        return data;
    }

    useEffect(() => {
            const promises = fetchWhat()
            var storedNames = JSON.parse(localStorage.getItem("names"));
            var tmpAr = [];
                Promise.all(promises).then((response) => {
                    for (let cur of response) {
                        tmpAr.push(createData(cur.images.box.image_group, cur.info.patient.last_name + " " + cur.info.patient.first_name + " " + cur.info.patient.fathers_name,
                            cur.info.patient.personal_policy, new Date(Date.parse(cur.info.acceptance_datetime)),
                            cur.info.nodule_type, 0.479 * cur.info.nodule_height * cur.info.nodule_length * cur.info.nodule_widht,
                            cur.info.uzi_device_name, cur.info.projection_type === "long" ? "Поперечная" : "Продольная"))
                    }
                }).then(() => setTableData(tmpAr))


        }, []
    )
    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={tableData}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick={true}
                rowsPerPageOptions={[5]}
            />
        </div>
    )
}

class ShotTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FormControl fullWidth sx={{height: '100%', width: '100%'}}>
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
                    <IconButton component={Link} to={`/`} style={{maxWidth: '30px', maxHeight: '30px'}}
                                sx={{
                                    paddingLeft: 3, paddingTop: 5.5,
                                    '& svg': {
                                        fontSize: 30
                                    },
                                }
                                }>
                        <AddCircleOutlineIcon></AddCircleOutlineIcon>
                    </IconButton>
                </Box>
                <Box sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 5,
                    paddingTop: 1,
                    paddingBottom: 10,

                }} display={'flex'}>
                    <MyGrid url={this.props.url}/>
                </Box>
            </FormControl>
        )
    }

}

export default ShotTable;