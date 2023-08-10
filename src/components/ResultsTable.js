import React, { useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const ResultsTable = () => {
    const columns = useRef([
        {field: 'characteristics', headerName: 'Характеристики', width: 500},
        {field: 'result', headerName: 'Результат', width: 200},
        {field: 'assessment', headerName: 'Оценка', width: 300}
    ])
    const rows =[{
        id: 1,
        characteristics: 'Характеристика 1', 
        result: '50%',
        assessment: 'Нормально'
    }]

    return (
        <Box sx={{
            marginTop: "40px"
        }}>
            <h3>Результаты оценки</h3>
            <DataGrid 
            sx={{
                height: "400px",
                width: "1000px"
            }}
            columns={columns.current}
            rows={rows}
            >

            </DataGrid>
        </Box>
    );
}

export default ResultsTable;
