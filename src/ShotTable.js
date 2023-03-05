import * as React from 'react';
import DataTable from 'react-data-table-component';

import {Button, Chip, FormControl, IconButton,} from "@mui/material";

import {Box} from "@mui/material";


import {Link, useParams} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import BasicMenu from "./MenuButton";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";


const PatientInterface = (props) => {
    const {number} = useParams();
    return (

        <ShotTable props={number} url={props.url}></ShotTable>

    )
}
function createData(id,  uziDate, tiradsType, uziVolume, uziDevice, projectionType) {
    return {id: id, uziDate: uziDate.toLocaleDateString(), tiradsType: tiradsType.toString(), uziVolume: uziVolume.toString(),uziDevice: uziDevice.toString(), projectionType: projectionType.toString()};
}


const MyGrid = (props) => {
    var [tableData, setTableData] = useState([])
    const columns = [ { name: 'Дата приема', selector: row => row.uziDate, width: '200px', sortable:true}, {
        name: 'Тип узла \n по EU TI-RADS', selector: row => row.tiradsType, width: '200px', sortable:true
    }, {
        name: 'Объём образования', selector: row => row.uziVolume, width: '220px', sortable:true
    }, {name: 'Аппарат', selector: row => row.uziDevice, width: '220px', sortable:true}, {
        name: 'Тип проекции', selector: row => row.projectionType, width: '220px', sortable:true
        }, {
            name: '',
            cell: (row) => renderDetailsButton(row.id), width: '220px'
        }, {
            key: 'button_delete',
            name: '',
            cell: (row) => renderDeleteButton(row.id),
        },];
    const renderDetailsButton = (params) => {
        return (<strong>
                <Button
                    component={Link}
                    to={'/result/' + params}
                    variant="outlined"
                    size={'small'}
                    style={{marginLeft: 16, color: '#4FB3EAFF'}}
                >
                    Результат
                </Button>
            </strong>)
    }
    const renderDeleteButton = (params) => {
        return (<strong>
                <BasicMenu props={params} rows={tableData} set={setTableData}/>
            </strong>)
    }

    useEffect(() => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        var tmpAr = [];
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/api/v2/patient/shots/"+ props.number + "/2/?format=json").then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.shots) {
                if(cur.id !== null) {
                    tmpAr.push(createData(cur.id, new Date(Date.parse(cur.acceptance_datetime)), cur.nodule_type, 0.479 * cur.left_depth * cur.left_length * cur.left_width + 0.479 * cur.right_depth * cur.right_length * cur.right_width, cur.uzi_device, cur.projection_type === "long" ? "Поперечная" : "Продольная"))
                }
                }
            })
            .then(() => setTableData(tmpAr))

        }, [props.url])

        return (
            <div>
                <DataTable
                    data={tableData}
                    columns={columns} pagination defaultSortFieldId={1}
                />
            </div>)
    }

    class ShotTable extends React.Component {
        constructor(props) {
            super(props);
            this.state= {
                lastName: "",
                firstName: "",
                fathersName: "",
                policy: "",
                email: "",
                isActive: "",
                diagnosis: "",
                doctor: "",
                spetialicy: '',
                docEmail: "",
                filterText:''
            }
            this.handlePatient()
        }
        handleFilterText = (e) => {
            this.setState({
                filterText: e
            })
        }
        handlePatient = () => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
            axios.get(this.props.url + "/api/v2/patient/update/"+ this.props.props + "?format=json").then((response) => {
                console.log(response)
                this.setState({
                    lastName: response.data.patient.last_name,
                    firstName: response.data.patient.first_name,
                    fathersName: response.data.patient.fathers_name,
                    policy: response.data.patient.personal_policy,
                    email: response.data.patient.email,
                    isActive: response.data.patient.is_active? 'Активен': "Не активен",
                    diagnosis: response.data.card.diagnosis
                })
            })
        }
        render() {
            return (
                <FormControl fullWidth sx={{height: '100%', width: '100%'}}>
                    <Box component={""} sx={{
                        backgroundColor: '#ffffff',
                        paddingLeft: 5,
                        paddingTop: 10,
                        borderTopLeftRadius: 130,
                        '&:hover': {
                            backgroundColor: "#ffffff",
                        },

                    }} display={'column'}>
                        <Chip
                            style={{marginLeft: 16, borderColor: this.state.isActive === 'Активен' ? '#4FB3EAFF': '#a6bac4'}}
                            label={this.state.isActive}
                            sx={{color: this.state.isActive === 'Активен'? '#4FB3EAFF': '#a6bac4'}}
                            variant={'outlined'}
                        >
                        </Chip>
                        <GlobalStyles styles={{
                            h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", fontWeight: 'normal'},
                            h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", marginBlock:0, fontWeight: 'normal'},
                            h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'lighter', marginBlock:-1},
                            h4: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'lighter', marginBlock:0,}
                        }}/>
                        <Grid component={""} container direction={'column'} sx={{paddingLeft: 2, paddingTop: 2}}>
                            <Grid component={""} item container direction={'row'}>
                        <h2>{this.state.lastName+" "+this.state.firstName+" "+this.state.fathersName}</h2>
                        <IconButton component={Link} to={`/patient/edit/${this.props.props}`} style={{maxWidth: '20px', maxHeight: '20px'}}
                                    sx={{
                                        paddingLeft: 3, '& svg': {
                                            fontSize: 20
                                        },
                                    }}>
                            <EditIcon/>
                        </IconButton>
                            </Grid>
                            <Grid component={""} item container direction={'row'}>
                                <h3>{this.state.policy} ~ {this.state.email}</h3>
                            </Grid>
                            <Grid component={""} item container direction={'row'}>
                                <h4><b style={{fontWeight: 'normal'}}>Диагноз:</b> { this.state.diagnosis}</h4>
                            </Grid>
                            <Grid component={""} item container direction={'row'}>
                                <Box component={""} display={'flex'}>
                                    <h1>Снимки</h1>
                                    <IconButton component={Link} to={`/home`}  style={{maxWidth: '30px', maxHeight: '30px'}}
                                                sx={{
                                                    paddingLeft: 3, paddingTop: 5, '& svg': {
                                                        fontSize: 30
                                                    },
                                                }}>
                                        <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                    </IconButton>
                                </Box>
                            </Grid>

                        </Grid>
                    </Box>

                    <Box component={""} sx={{
                        minHeight:470, height: 'auto',
                        backgroundColor: '#ffffff', paddingLeft: 5, paddingTop: 1, paddingBottom: 10,

                    }}>
                        <MyGrid url={this.props.url} number={this.props.props}/>
                    </Box>
                </FormControl>)
        }

    }

    export default PatientInterface;