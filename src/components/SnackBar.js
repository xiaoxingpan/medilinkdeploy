import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomSnackbar({ type, content, isOpen, isClose }) {


    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={isOpen} autoHideDuration={6000} onClose={isClose} sx={{ mt: 10 }}>
                <Alert
                    onClose={isClose} severity={type} sx={{ width: '100%' }}>
                    {content}
                </Alert>
            </Snackbar>
            {/* <Alert severity="error">This is an error message!</Alert>
            <Alert severity="warning">This is a warning message!</Alert>
            <Alert severity="info">This is an information message!</Alert>
            <Alert severity="success">This is a success message!</Alert> */}
        </>
    );
}

export default CustomSnackbar;