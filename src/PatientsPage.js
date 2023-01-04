import * as React from 'react';
import '@fontsource/poppins/700.css'

import {Autocomplete, Button, Chip, FormControl, IconButton, Paper, styled, TextField} from "@mui/material";
import {Box} from "@mui/material";
import DataTable from 'react-data-table-component';

import ClearIcon from '@mui/icons-material/Clear';
import {Link, Navigate} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import PatientMenu from "./PatientMenu";
import axios from "axios";

function createData(id, patientName, patientPolicy, email, uziDate, hasNodules, isActive) {
    return {id: id, patientName: patientName,patientPolicy: patientPolicy, email: email,uziDate: uziDate.toLocaleDateString(),hasNodules: hasNodules,isActive: isActive};
}



const MyGrid = (props) => {
    const [filterText, setFilterText] = React.useState('');
    var [tableData, setTableData] = useState([])
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = tableData.filter(item => ((item.patientName && item.patientName.toLowerCase().includes(filterText.toLowerCase())) || (item.patientPolicy && item.patientPolicy.toLowerCase().includes(filterText.toLowerCase()))), );
    const FilterComponent = ({ filterText, onFilter, onClear }) => (
        <Paper elevation={0} sx={{justifyContent: 'center', alignContent:'center', alignItems: 'center', justifyItems: 'center', display: 'flex'}}>
            <TextField
                id="search"
                type="text"
                placeholder="Поиск по имени или номеру полиса"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                sx={{width:350, borderColor: '#4FB3EAFF',"& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                            borderColor: '#4FB3EAFF'
                        }
                    }, 'fieldset':{borderRadius: 5}}} style={{borderRadius: '10 px'}}
            />
            <IconButton onClick={setFilterText('')}> <ClearIcon>

            </ClearIcon>
            </IconButton>
        </Paper>
    );
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
    const columns = [{name: 'Пациент', width: '230px', sortable: true, selector: row => row.patientName}, {
        name: 'Полис пациента',
        width: '210px',sortable: true, selector: row => row.patientPolicy
    }, {
        name: 'Эл. почта', width: '230px',sortable: true, selector: row => row.email
    },
        {name: 'Дата приема', width: '130px', sortable: true, selector: row => row.uziDate},
        {
            name: 'Диагноз', width: '160px', cell: (row) => renderChip2(row.hasNodules),
        },
        {
        name: 'Статус', width: '160px', sortable: false, cell: (row) => renderChip(row.isActive),
    },
        {
            name: '',
            width: '190px',
            sortable: false,
            cell: (row) => renderDetailsButton(row.id),
            disableColumnMenu: true,
        },
        {
        name: '',
        width: '30px',
        sortable: false,
        cell: (row) => renderDeleteButton(row.id),
        disableColumnMenu: true,
    },
        ];
    const renderDetailsButton = (params) => {
        return (<strong>
            <Button
                component={Link}
                to={'/patient/' + params}
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
                style={{marginLeft: 16, borderColor: params? '#4FB3EAFF': '#a6bac4'}}
                label={params ? "Активен" : "Не активен"}
                sx={{color: params? '#4FB3EAFF': '#a6bac4'}}
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
                style={{marginLeft: 16, borderColor: params? '#4FB3EAFF': '#a6bac4'}}
                label={params ? "Обнаружено" : "Не Обнаружено"}
                sx={{color: params? '#4FB3EAFF': '#a6bac4'}}
                variant={'outlined'}
            >
            </Chip>
        </strong>)
    }
    const renderDeleteButton = (params) => {
        return (<strong>
            <PatientMenu props={params} rows={tableData} set={setTableData}/>
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
        axios.get(props.url + '/api/v2/med_worker/patients/1').then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.cards) {
                console.log(response.data.results[cur])
                tmpAr.push(createData(cur.id, cur.patient.last_name + " " + cur.patient.first_name + " " + cur.patient.fathers_name, cur.patient.personal_policy, cur.patient.email,  new Date(Date.parse(cur.acceptance_datetime)), cur.has_nodules === "T", cur.patient.is_active))
            }
        })
            .then(() => setTableData(tmpAr))

    }, [props.url])

    return (<div style={{width:'100%' }}>
        <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
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