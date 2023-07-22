import React from 'react';
import {Box, Button} from '@mui/material';
import OpenSeadragonViewer from '../components/OpenSeadragonViewer';
import TabsComponent from '../TabsComponent';
import Corrector from '../components/Corrector'

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
            <TabsComponent drawerComponent={Corrector}> </TabsComponent>
        </Box>
    );
}

export default CorrectionPage;
