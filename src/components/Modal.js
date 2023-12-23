import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SaveButton, CancelButton } from './ManageDepart';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function CustomModal({ title, content, isOpen, isClose, proceed, confirm }) {
    return (
        <Modal
            open={isOpen}
            onClose={isClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={5} align='center'>
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                {confirm ?
                    <><Grid container spacing={4} alignItems="center" mt={5} >
                        <Grid item xs={6} sx={{ textAlign: "center" }}>
                            <SaveButton onClick={proceed}>Ok</SaveButton>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "center" }}>
                            <CancelButton onClick={isClose}>Cancel</CancelButton>
                        </Grid>
                    </Grid>
                    </> :
                    <>
                        <Grid container alignItems="center" mt={5}>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <CancelButton onClick={isClose}>Ok</CancelButton>
                            </Grid>
                        </Grid>
                    </>}
            </Box>
        </Modal>);
}

export default CustomModal;