import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react'
import axios from "axios";
import AgoraUIKit from "agora-react-uikit";
import tw from "twin.macro";

const AgoraAppId=process.env.REACT_APP_AGORA_APP_ID

const AppointmentContainer=tw.div`w-full md:w-1/4 flex-shrink-0`;
const VideoChatContainer=tw.div`w-full md:w-3/4 flex-shrink-0`;
const PrimaryButton=tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-normal mx-5`;
const ErrorContainer = tw.div`h-96 flex flex-col items-center justify-center bg-gray-100 text-2xl font-medium`;
const ErrorText=tw.div`text-red-500 mb-8`;

function VideoChatAgora({ appointmentId }) {
  const [error, setError] = useState("");
  //authenticate
  const url = process.env.REACT_APP_API_URL;
  //   const token = localStorage.getItem("accessToken");
  const token=true;   //for test

  const Navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      setError("Please log in");
      Navigate("/login");
      throw new Error();
    } else {
      fetch(`${url}/videochat/auth?appointmentId=${appointmentId}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
            console.log(response)
            if (!response.ok){
              setError("You are not allowed to enter this video chat")
            }
        })
        .then(data => {
          console.log(data);

        })
        .catch(error => {
          console.error('Error fetching data:', error)
          setError("Error when retrieving your authorization")
        });
      
    }
  }, []);




  const [videoCall, setVideoCall] = useState(false);
  const rtcProps = {
      appId: AgoraAppId,
      channel: "2",
      token: null,
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };


    return (
      <>
        {error && (
          <div>
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
          </div>
        )}
      
        { !error &&
          (videoCall ? 
            (
              <div style={{ display: 'flex' }}>
                <AppointmentContainer>
                  TODO: show appointment information here
                </AppointmentContainer>
                <VideoChatContainer>
                  <div style={{ display: "flex", width: "75vw", height: "75vh" }}>
                    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
                  </div>
                </VideoChatContainer>
              </div>
            ) : (
              <PrimaryButton>
                <h3 onClick={() => setVideoCall(true)}>Join the meeting</h3>
              </PrimaryButton>
              
            )
          )
        }
    </>
    );
}
export default VideoChatAgora;
