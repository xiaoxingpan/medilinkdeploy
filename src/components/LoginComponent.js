import React, { useState } from "react";
import "../styles/LoginComponent.css";
import { useNavigate } from "react-router-dom";
//import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import tw from "twin.macro";
import styled from "styled-components";
import CustomSnackbar from "./SnackBar";

const Container = styled.div`
  ${tw`relative -mx-8 bg-center bg-cover`}
  background-image: url("https://static.wixstatic.com/media/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg/v1/fill/w_640,h_236,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg");
`;
const LoginComponent = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setEmail] = useState("");
  const [visible, setVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const data = { username, password };
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const errorMsg = errorData.msg || "Unknown error";
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorMsg}`
            );
          });
        }

        return response.json();
      })
      // .then((response) => response.json())
      .then((data) => {
        alert("The token is " + data.token);
        setShowFlashMessage(true);
        setFlashMessage("Login successfully!");
        setFlashMessageType("success");
        setTimeout(() => {
          navigate("/");
        }, "1000");
      })
      .catch((error) => {
        setShowFlashMessage(true);
        setFlashMessage(error.message);
        setFlashMessageType("error");
        //console.error("user or password wrong: ", error);
      });
  };
  // flash message
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMessageType, setFlashMessageType] = useState("");
  const closeFlashMessage = () => {
    setShowFlashMessage(false);
    setFlashMessage("");
  };
  return (
    <Container>
      <div className="page">
        <div className="coverlogin">
          <h1>Login</h1>
          <input
            id="email_textfield"
            type="text"
            placeholder="username"
            className="input-username"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            id="password_textfield"
            type={visible ? "text" : "password"}
            placeholder="password"
            className="input-password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div
            onClick={() => setVisible(!visible)}
            className="password-toggle-icon-login"
          >
            {/* {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} */}
          </div>

          <div className="login-btn" onClick={handleLogin} type="submit">
            Login
          </div>

          <div className="dont-have-an-account-container">
            <p>Forgot password?</p>
            <div className="spacer"></div>
            <p
              className="sign-up-button"
              onClick={() => navigate("/ResetPassword")}
            >
              Reset password
            </p>
          </div>

          <div className="dont-have-an-account-container">
            <p>Don't have an account?</p>
            <div className="spacer"></div>
            <p className="sign-up-button" onClick={() => navigate("/Signup")}>
              Sign up
            </p>
          </div>

          <p className="text">or login using</p>

          <div className="alt-login">
            <button className="circle-btn-google" type="google"></button>
            <button className="circle-btn-facebook" type="facebook"></button>
          </div>
        </div>
        {/* add/edit/delete successfully flash message */}
        <CustomSnackbar
          type={flashMessageType}
          content={flashMessage}
          isOpen={showFlashMessage}
          isClose={closeFlashMessage}
        />
      </div>
    </Container>
  );
};
export default LoginComponent;
