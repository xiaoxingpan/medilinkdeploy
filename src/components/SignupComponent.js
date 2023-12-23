import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../styles/SignupComponent.css";
//import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import tw from "twin.macro";
import styled from "styled-components";
import CustomSnackbar from "./SnackBar";

const Container = styled.div`
  ${tw`relative -mx-8 bg-center bg-cover`}
  background-image: url("https://static.wixstatic.com/media/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg/v1/fill/w_640,h_236,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3b1f25_efc1908db3fa487d88c92f3e48ce0350.jpg");
`;

const SignupComponent = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authority, setAuthority] = useState("");
  const [visible, setVisible] = useState(false);

  // flash message
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMessageType, setFlashMessageType] = useState("");
  const closeFlashMessage = () => {
    setShowFlashMessage(false);
    setFlashMessage("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username,
      name,
      email,
      password,
      confirmPassword,
      authority,
    };

    if (confirmPassword != password) {
      alert("Passwords does not match.");
    } else if (email == "" || password == "") {
      alert("please input all the required fields.");
    } else {
      fetch("http://localhost:8080/register", {
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
        .then((data) => {
          console.log(data.msg);
          setShowFlashMessage(true);
          setFlashMessage(data.msg);
          setFlashMessageType("success");
          setTimeout(() => {
            navigate("/login");
          }, "1000");
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          setShowFlashMessage(true);
          setFlashMessage(error.message);
          setFlashMessageType("error");
        });
    }
  };

  return (
    <Container>
      <div className="page">
        <form>
          <div className="cover">
            <h1>Sign Up</h1>
            <input
              id="_username_textfield"
              type="text"
              placeholder="user name"
              className="input-username"
              onChange={(e) => setUsername(e.target.value)}
            ></input>

            <select
              className="select-role"
              onChange={(e) => setAuthority(e.target.value)}
            >
              <option value="role">select role</option>
              <option value="patient">PATIENT</option>
              <option value="doctor">DOCTOR</option>
            </select>

            <input
              id="_name_textfield"
              type="text"
              placeholder="name"
              className="input-username"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <input
              id="email_textfield"
              type="email"
              placeholder="email"
              className="input-email"
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
              className="password-toggle-icon"
            >
              {/* {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} */}
            </div>
            <input
              id="rePassword_textfield"
              type={visible ? "text" : "password"}
              placeholder="repeat password"
              className="input-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <div
              onClick={() => setVisible(!visible)}
              className="re-password-toggle-icon"
            >
              {/* {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} */}
            </div>
            <div onClick={handleSubmit} className="login-btn">
              Sign Up
            </div>
            <div className="dont-have-an-account-container">
              <p> Already have an account?</p>
              <div className="spacer"></div>
              <p className="sign-up-button" onClick={() => navigate("/Login")}>
                Sign in
              </p>
            </div>
            <p className="text">or sign up using</p>
            <div className="alt-login">
              <button className="circle-btn-google" type="google"></button>
              <button className="circle-btn-facebook" type="facebook"></button>
            </div>
          </div>
        </form>
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

export default SignupComponent;
