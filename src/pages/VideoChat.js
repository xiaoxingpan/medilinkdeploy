import React, { useEffect } from 'react';
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";
import VideoChatComponent from "../components/VideoChatAgora";
import { useParams } from "react-router-dom";

function VideoChat() {
    let { appointmentId } = useParams();

    return (
        <>
            <HeaderComponent />
            <VideoChatComponent appointmentId={appointmentId}/>
            <FooterComponent fixBottom={true} />
        </>

    )
}

export default VideoChat;