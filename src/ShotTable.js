import * as React from 'react';
import DataTable from 'react-data-table-component';

import {Button, Chip, FormControl, IconButton, TextField} from "@mui/material";

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
const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <TextField
	    id="search"
        type="text"	    placeholder="Filter By Name"
		aria-label="Search Input"
        value={filterText}
		onChange={onFilter}
	/></>
);

const MyGrid = (props) => {
    const [filterText, setFilterText] = React.useState('');
    var [tableData, setTableData] = useState([])
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = tableData.filter(item => item['Дата приема'] && item['Дата приема'].toLowerCase().includes(filterText.toLowerCase()),);
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
                <BasicMenu props={params} rows={tableData} set={setTableData}/>
            </strong>)
    }

    const subHeaderComponentMemo = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
			setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
			}
		};
	return (
        <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />);
    }, [filterText, resetPaginationToggle]);

    useEffect(() => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        var tmpAr = [];
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/api/v2/patient/shots/"+ props.number + "?format=json").then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.shots) {
                if(cur.id !== null) {
                    tmpAr.push(createData(cur.id, new Date(Date.parse(cur.acceptance_datetime)), cur.nodule_type, 0.479 * cur.nodule_height * cur.nodule_length * cur.nodule_widht, cur.uzi_device, cur.projection_type === "long" ? "Поперечная" : "Продольная"))
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
                docEmail: ""
            }
            this.handlePatient()
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

                    }} display={'column'}>
                        <Chip
                            style={{marginLeft: 16, borderColor: this.state.isActive === 'Активен' ? '#4FB3EAFF': '#a6bac4'}}
                            label={this.state.isActive}
                            sx={{color: this.state.isActive === 'Активен'? '#4FB3EAFF': '#a6bac4'}}
                            variant={'outlined'}
                        >
                        </Chip>
                        <GlobalStyles styles={{
                            h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto"},
                            h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", marginBlock:0},
                            h5: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto",fontWeight:'semi-bold',marginBlock:5},
                            h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'normal', marginBlock:-1},
                            h4: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'normal', marginBlock:5, marginInline:4}
                        }}/>
                        <Grid container direction={'column'} sx={{paddingLeft: 2}}>
                            <Grid item container direction={'row'}>
                        <h1>{this.state.lastName+" "+this.state.firstName+" "+this.state.fathersName}</h1>
                        <IconButton component={Link} to={`/patient/edit/${this.props.props}`} style={{maxWidth: '30px', maxHeight: '30px'}}
                                    sx={{
                                        paddingLeft: 3, paddingTop: 5, '& svg': {
                                            fontSize: 30
                                        },
                                    }}>
                            <EditIcon/>
                        </IconButton>
                            </Grid>
                            <Grid item container direction={'row'}>
                                <h3>{this.state.policy} <b>  ~  </b> {this.state.email}</h3>
                            </Grid>
                            <Grid item container direction={'row'}>
                                <h5>Диагноз:</h5>
                                <h4>{ this.state.diagnosis}</h4>
                            </Grid>
                            <Grid item container direction={'row'} justifyItems={'center'}>
                        <h2>Снимки</h2>
                        <IconButton component={Link} to={`/home`}  style={{maxWidth: '20px', maxHeight: '20px'}}
                                    sx={{
                                        paddingLeft: 2,paddingTop: 1.7, '& svg': {
                                            fontSize: 20
                                        },
                                    }}>
                            <AddCircleOutlineIcon></AddCircleOutlineIcon>
                        </IconButton>
                            </Grid>

                        </Grid>
                    </Box>

                    <Box sx={{
                        minHeight:470, height: 'auto',
                        backgroundColor: '#ffffff', paddingLeft: 5, paddingTop: 1, paddingBottom: 10,

                    }} display={'flex'}>
                        <MyGrid url={this.props.url} number={this.props.props}/>
                    </Box>
                </FormControl>)
        }

    }

    export default PatientInterface;