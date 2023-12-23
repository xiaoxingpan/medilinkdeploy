import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import tw from "twin.macro";
import CheckoutForm from "../components/CheckoutForm";
// console.log(process.env);
const stripeKey = process.env.REACT_APP_STRIPE_API_KEY;
const stripePromise = loadStripe(stripeKey);
const ErrorContainer = tw.div`h-96 flex flex-col items-center justify-center bg-gray-100 text-2xl font-medium`;
const MessageContainer = tw.div`h-96 flex flex-col items-center justify-center bg-white text-2xl font-medium`;
const ErrorText=tw.div`text-red-500 mb-8`;
const MessageText=tw.div`text-green-500 mb-8`;
const BackButton=tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-normal`;
const PaymentContainer=tw.div`bg-white border p-4 rounded shadow-md mb-4 md:flex md:flex-row md:items-center md:space-x-4 md:space-y-0 md:mb-0`;
const AppointmentContainer=tw.div`w-full md:w-1/2`;
const CheckoutFormContainer=tw.div`w-full md:w-1/2`;


function Payment(props) {
  const appointmentId = props.appointmentId;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const url = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem("accessToken");
    const token=true;   //for test

  const Navigate = useNavigate();

  const checkPaymentStatus = async () => {
    if (!token) {
      setError("Please log in");
      Navigate("/login");
      throw new Error();
    } else {
      try {
        const response = await axios.get(
          `${url}/payment/payment-status?appointmentId=${appointmentId}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { message: resMessage } = response.data;
        console.log(response.status);
        switch (response.status) {
          case 200: //not paid, show payment form without message
            break;
          case 201: //paid
            setMessage(resMessage);
            throw new Error();
          case 202: //multiple paid
            setError(resMessage);
            throw new Error();
          default:
            setError("undefined error");
            throw new Error();
        }
      } catch (err) {
        // order not found
        const { message: resMessage } = err.response.data;
        setError(resMessage);
        throw new Error();
      }
    }
  };
  useEffect(() => {
    // check if is_paid
    //apply payment
    const fetchClientSecret = async () => {
      try {
        await checkPaymentStatus();
      } catch (err) {
        return;
      }

      // not paid(no message or error), apply payment intent
      try {
        const response = await axios.get(
            `${url}/payment/payment-intent?appointmentId=${appointmentId}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setClientSecret(data.clientSecret);
      } catch (err) {
        const { message: resMessage } = err.response.data;
        setError(resMessage);
      }
    };

    fetchClientSecret();
  }, []);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#9ee656",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Payment">
      {error && (
        <div>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <BackButton>Back to my appointment</BackButton>
        </ErrorContainer>
        </div>
      )}
      {!error && message && (
        <div>
        <MessageContainer>
          <MessageText>{message}</MessageText>
          <BackButton>Back to my appointment</BackButton>
          </MessageContainer>
        </div>
      )}
      {!error && !message && clientSecret && (
        <div>
        <PaymentContainer>
          <AppointmentContainer>
            <p className="text-xl font-bold bg-gray-500">
              Appointment ID: {appointmentId}
            </p>
            <p className="text-lg">
              Price: 20
            </p>
          </AppointmentContainer>
          <CheckoutFormContainer>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm appointmentId={appointmentId} />
            </Elements>
            </CheckoutFormContainer>
        </PaymentContainer>
        </div>
      )}
    </div>
  );
}

export default Payment;
