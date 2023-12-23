import React, { useEffect } from 'react';
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";
import PayFormComponent from "../components/PayForm";
// import { useParams } from 'react-router-dom';

function Pay() {
    return (
        <>
            <HeaderComponent />
            <PayFormComponent appointmentId={2} />
            <FooterComponent fixBottom={true} />
        </>

    )
}

export default Pay;