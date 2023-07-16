import React from 'react';
import {Box, Button} from '@mui/material';

const CorrectionPage = () => {
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
            <Button> Correction </Button>
        </Box>
    );
}

export default CorrectionPage;
