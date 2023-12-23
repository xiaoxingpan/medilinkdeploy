import { blue, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Card, FloatingLabel, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfileComponent = () => {
  const [doctor, setDoctor] = useState({});

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    //Error&Message Modal section
    const [show, setShow] = useState({ message: "", status: false });
    const handleClose = () => {
      setShow({ message: "", status: false });
      window.location.reload();
    };
    const handleShow = (message) => setShow({ message: message, status: true });

  //Get doctor info 
  useEffect(() => {
    
    Axios.get(`http://localhost:8080/users/2`)
      .then((response) => {
        setDoctor(response.data);

        //Seperate profile picture and certificate pictures
        // if (response.data.Pictures.length > 0) {
        //   for (let i = 0; i < response.data.Pictures.length; i++) {
        //     if (!response.data.Pictures[i].isCertificate) {
        //       setProfile(response.data.Pictures[i]);
        //     } else {
        //       //use array instead of setState in a loop, due to the asynchronous nature of state updates
        //       certificatePictures.push(response.data.Pictures[i]);
        //     }
        //   }
        //   // Update certificates state after the loop
        //   setCertificates(certificatePictures);
        // }
      })
      .catch((error) => {
        handleShow(error);
        if (error.response.data.message) {
          handleShow(error.response.data.message);
        } else {
          handleShow("There is an error occured while getting broker info");
        }
      });

    // Axios.get(`${process.env.REACT_APP_HOST_URL}/api/properties/byBroker`, {
    //   headers: {
    //     accessToken: localStorage.getItem("accessToken"),
    //   },
    // })
    //   .then((response) => {
    //     if (response.data.length > 0) {
    //       setProperties(response.data);
    //     }
    //   })
    //   .catch((error) => {
    //     handleShow(error);
    //   });
  }, []);


  const formik = useFormik({
    enableReinitialize: true, // Allow the form to reinitialize when initial values change
    initialValues: {
      name: doctor ? doctor.name : "",
      phone: doctor ? doctor.telephone : "",
      address: doctor ? doctor.address : "",
      email: doctor ? doctor.email : "",
      description: doctor ? doctor.description : "",
      rate: doctor ? doctor.default_price : "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(100, "Maximum length for name is 100 characters")
        .required("Please enter name"),
      address: Yup.string()
        .max(360, "Maximum length for address is 360 characters")
        .nullable(),
      phone: Yup.string()
        .matches(phoneRegExp, "Please enter a valid phone number")
        .min(10, "must be 10 digits")
        .max(10, "must be 10 digits")
        .nullable(),
      email: Yup.string().email("Please enter a valid email").required(),

    }),
    onSubmit: (values) => {
      try {
        Axios.patch(
          `${process.env.REACT_APP_HOST_URL}/api/users/byId/`,
          values,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        ).then(() => {
          handleShow("Profile info successfully updated!");
        });
      } catch (error) {
        if (error.response && error.response.data.message) {
          // TODO: Replace with modal
          handleShow(error.response.data.message);
        } else {
          handleShow("There is an error occurred while updating property");
        }
      }
    },
  });

    return (
      <Container>
        <Row>
          <h2 style={{fontSize:35}}>Profile</h2>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
              style={{
                color:  "red",
                textDecoration: "underline",
              }}
            >
              Your account is approved
            </span>
          </div>
        </Row>

        <Card className="mt-4">
          <Form onSubmit={formik.handleSubmit}>
            <Row className="px-3 py-3">
              <Col md={7} className="leftInfo">
                {/* name */}
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <FloatingLabel controlId="form.name" label="Doctor name">
                    {" "}
                    <Form.Control
                      name="name"
                      type="text"
                      className="mb-2"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                {/* phone */}
                <Form.Group>
                  <Form.Label>Phone:</Form.Label>
                  <FloatingLabel
                    controlId="form.name"
                    label="Phone number"
                  >
                    {" "}
                    <Form.Control
                      name="phone"
                      type="text"
                      className="mb-2"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                {/* address */}
                <Form.Group>
                  <Form.Label>Address:</Form.Label>
                  <FloatingLabel controlId="form.name" label="Office address">
                    {" "}
                    <Form.Control
                      name="address"
                      type="text"
                      className="mb-2"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                {/* email */}
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <FloatingLabel controlId="form.name" label="Email">
                    {" "}
                    <Form.Control
                      name="email"
                      type="text"
                      className="mb-2"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                {/* description */}
                <Form.Group>
                  <Form.Label>Description:</Form.Label>
                  <FloatingLabel controlId="form.name" label="Description">
                    {" "}
                    <Form.Control
                      name="Description"
                      type="text"
                      className="mb-2"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                {/* rate */}
                <Form.Group>
                  <Form.Label>Rate:</Form.Label>
                  <FloatingLabel controlId="form.name" label="Rate">
                    {" "}
                    <Form.Control
                      name="rate"
                      type="text"
                      className="mb-2"
                      value={formik.values.rate}
                      onChange={formik.handleChange}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>

                <Button type="submit" variant="dark">
                  Save profile changes
                </Button>
              </Col>
              <Col
                md={5}
                className="mt-5 rightProfilePic justify-content-center"
              >
                <Row className="justify-content-center">
                  <div
                    style={{
                      width: "230px",
                      height: "210px",
                      overflow: "hidden",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="profile"
                      src= "https://cdn.vectorstock.com/i/preview-1x/21/23/avatar-photo-default-user-icon-person-image-vector-47852123.jpg"
                      alt="Selected"
                    />
                  </div>
                </Row>
                <Row className="d-flex justify-content-center">
                  <div className="d-flex justify-content-center">
                      <Button className="mt-3" >
                        Add Profile
                      </Button>
                  </div>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    );
  };
  export default UserProfileComponent;