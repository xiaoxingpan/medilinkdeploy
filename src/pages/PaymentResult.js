import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from "react-router-dom";
import tw from "twin.macro";

const CommonButton=tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-normal mx-20`;
const MessageContainer = tw.div`h-96 flex flex-col items-center justify-center bg-white text-2xl font-medium`;
const ErrorText=tw.div`text-red-500 mb-8`;
const MessageText=tw.div`text-green-500 mb-8`;

function PaymentResult() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    let { appointmentId } = useParams();
    const url = process.env.REACT_APP_API_URL;
    // const token = localStorage.getItem('accessToken');
    const token=true; //for test

    const Navigate = useNavigate();
    useEffect(()=>{
        if (!token) {
            setError("Please log in")
            Navigate('/login')
            return
        } 
        axios.get(
                `${url}/payment/payment-status?appointmentId=${appointmentId}`,
                null,
                {
                headers: { Authorization: `Bearer ${token}` }
                }
            )
            .then(response=>{
                const { message: resMessage } = response.data;
                console.log(response.status)
                switch (response.status) {
                    case 200:   //not paid
                        setError("Your payment has not been received yet. Payment may be delayed. Please refresh or re-enter the payment page later to check.")
                        break;
                    case 201:   //paid
                        setMessage(resMessage)
                        break;
                    case 202:   //multiple paid
                        setError(resMessage)
                        break;
                    default:
                        setError("undefined error")
                        
                }
            })
            .catch(err=>{
                const { message: resMessage } = err.response.data;
                setError(resMessage);
            });
        
    },[])
    
    return (
        <div className="Payment">
            <Header/>
            <div>
            {error &&
                (
                    <div >
                        <MessageContainer>
                        <ErrorText>{error}</ErrorText>
                        <div className="button-container flex space-x-4">
                            <CommonButton onClick={() => window.location.reload()}>
                                Refresh
                            </CommonButton>
                            <CommonButton >
                                Back to appointment
                            </CommonButton>
                        </div>
                        </MessageContainer>
                    </div>
                )}
            {!error && message &&
                (
                    <div>
                    <MessageContainer>
                        <MessageText>
                            {message}
                        </MessageText>
                        <CommonButton >
                            Back to appointment
                        </CommonButton>
                    </MessageContainer>
                    </div>
                )}
            </div>
            <Footer fixBottom={true} />
        </div>
    );
}

export default PaymentResult;