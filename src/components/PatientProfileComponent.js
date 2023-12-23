import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { Card, FloatingLabel, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const PatientProfileComponent = () => {
    //const { id } = useParams();
    const id = 2;
    const [patient, setPatient] = useState();
    const [appointments, setAppointments] = useState();
    const [selectedImage, setSelectedImage] = useState(null);


    const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    //Error&Message Modal section
    const [show, setShow] = useState({ message: "", status: false });
    const handleClose = () => {
      setShow({ message: "", status: false });
      window.location.reload();
    };
    const handleShow = (message) => setShow({ message: message, status: true });

  //Get patient info 
  useEffect(() => {
    
    Axios.get(`http://localhost:8080/users/${id}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch((error) => {
        handleShow(error);
        if (error.response.data.message) {
          handleShow(error.response.data.message);
        } else {
          handleShow("There is an error occured while getting broker info");
        }
      });

    Axios.get(`http://localhost:8080/appointments/getAppointments/${id}`)
      .then((response) => {
        if (response.data.length > 0) {
            setAppointments(response.data);
        }
      })
      .catch((error) => {
        handleShow(error);
      });
  }, []);

  //S3 config
    const config = {
        bucketName: "medilinkapp",
        dirName: "userAvatar",
        region: "ca-central-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
            secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
        },
    };

    const client = new S3Client(config);

    // upload image to S3
    const saveImage = async (img) => {
        let newFileName = `${Date.now()}_${id}.${img.name
            .split(".")
            .pop()}`;
        console.log(newFileName);
        const uploadParams = {
            Bucket: config.bucketName,
            Key: `${config.dirName}/${newFileName}`,
            Body: img,
        };

        try {
            const res = await client.send(new PutObjectCommand(uploadParams));
            console.log("Success", res);
            return newFileName;
        } catch (err) {
            console.log("Error", err);
            return null;
        }
    };

    //preview image
    const previewImage = (e) => {
        console.log("previewImage");
        setSelectedImage(e.target.files[0]);
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        var preview = document.getElementById('myfile');

        reader.onloadend = function () {
            preview.src = reader.result;
            console.log("preview.src===="+preview.src)
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "https://cdn.vectorstock.com/i/preview-1x/21/23/avatar-photo-default-user-icon-person-image-vector-47852123.jpg";
        }
    }



  const formik = useFormik({
    enableReinitialize: true, // Allow the form to reinitialize when initial values change
    initialValues: {
      name: patient ? patient.name : "",
      phone: patient ? patient.telephone : "",
      address: patient ? patient.address : "",
      email: patient ? patient.email : "",
      description: patient ? patient.description : "",
      rate: patient ? patient.default_price : "",
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
            if (selectedImage !== null) {  // change image
                saveImage(selectedImage).then((res) => {
                    console.log(res);
                    if (res !== null) {
                        // delete the old image from S3
                        // deleteImage(rowToUpdate.image_url);
                        // console.log(rowToUpdate.image_url);
                        // console.log(id);
                        // console.log(departmentName);
                        // console.log(description);
                        // update data in database
                        Axios.patch(
                            `http://localhost:8080/users/${id}`,
                            values,
                            {
                                headers: { accessToken: localStorage.getItem("accessToken") },
                            }
                            ).then(() => {
                                handleShow("Profile info successfully updated!");
                            });
                    }
                });
            }
            
        }
        catch (error) {
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
                  <FloatingLabel controlId="form.name" label="Name">
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

                <Button className="text-dark" type="submit" variant="dark">
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
                        {/* <Button className="mt-3 text-dark" >
                            Add Profile
                        </Button> */}
                        <label for="myfile">Select an image:</label>
                        <input style={{display:"none"}} type="file" id="myfile" accept=".jpg, .jpeg, .png" name="myfile" onChange={previewImage}></input>
                      
                    </div>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* AppointmentList Section */}
        <Row>
          <div className="my-3">
            <h2 style={{fontSize:35}}>Appointment List</h2>
              <div>
                {/* <Button variant="dark" href="/makeAppointment">
                  Make an appointment
                </Button> */}
              </div>
          </div>
          {appointments && appointments.length > 0 && (
            <div>
                <Table responsive bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>doctor schcdule id</th>
                            <th>status</th>
                            <th>payment</th>
                            <th>medical record</th>
                            <th>Prescription</th>
                            <th>rate</th>
                            <th>comment</th>
                            <th>type</th>
                        </tr>
                        {appointments.map((appointment,key) => {
                            return (
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.doctor_schedule_id}</td>
                                    <td>{appointment.status}</td>
                                    <td>{appointment.payment_reference}</td>
                                    <td>{appointment.medical_record}</td>
                                    <td>{appointment.prescription}</td>
                                    <td>{appointment.rate}</td>
                                    <td>{appointment.comment} </td>
                                    <td>{appointment.type}</td>
                                </tr>
                            );
                        })}
                    </thead>
                </Table>
            </div>
          )}

          <hr></hr>
        </Row>
      </Container>
    );
  };
  export default PatientProfileComponent;