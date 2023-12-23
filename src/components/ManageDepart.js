import React, { useState, useEffect } from 'react';
import tw from "twin.macro";
import * as Yup from "yup";
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CustomModal from './Modal';
import CustomSnackbar from './SnackBar';
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

//S3 config
const config = {
    bucketName: "medilinkapp",
    dirName: "department",
    region: "ca-central-1",
    credentials: {
        accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
        secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
    },
};

const client = new S3Client(config);

// modal style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const SaveButton = tw.a`font-medium my-2 font-semibold px-8 py-3 rounded bg-primary-500 text-gray-100 hover:bg-primary-300`;
export const CancelButton = tw(SaveButton)`bg-gray-500 hover:bg-gray-300`;




export default function ManageDepart() {
    const columns = [
        { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 250 },
        { field: 'department_name', headerName: 'Department', headerAlign: 'center', align: 'center', width: 400 },
        { field: 'description', headerName: 'Description', headerAlign: 'center', flex: 1, align: 'center', width: 500 },
        {
            field: 'image_url',
            headerName: 'Image',
            headerAlign: 'center',
            align: 'center',
            width: 400,
            renderCell: (params) => (
                <img
                    src={params.row.image_url}
                    alt="Image"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '150px', }}
                />
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 400,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Grid container spacing={3}>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <EditIcon sx={{ color: "#742cff", fontSize: "2rem" }} onClick={() => handleEditBtnClick(params.row)} /></Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                        <DeleteForeverIcon sx={{ color: "#c53030", fontSize: "2rem" }} onClick={() => handleDeleteBtnClick(params.row)} /></Grid>
                </Grid>
            ),
        },
    ];

    const rowHeight = 200;
    // retrieve data from database and send to the table
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/departments')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setRows(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleEditBtnClick = (rowToEdit) => {
        console.log(rowToEdit);
        setIsAdd(false);
        setOpenAddEditModal(true);
        setId(rowToEdit.id);
        setDepartmentName(rowToEdit.department_name);
        setDescription(rowToEdit.description);
    }


    const handleDeleteBtnClick = (rowToDelete) => {
        setShowDeleteConfirmModal(true);
        setRowToDelete(rowToDelete);
    }
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const closeDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setRowToDelete(null);
    }
    const deleteDepartment = (rowToDelete) => {
        console.log(rowToDelete);
        // delete image from S3
        deleteImage(rowToDelete.image_url);
        // delete data from database
        fetch(`http://localhost:8080/api/departments/${rowToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                let updatedRows = [...rows].filter((row) => row.id !== rowToDelete.id);
                setRows(updatedRows);
                setShowFlashMessage(true);
                setFlashMessage("Department deleted successfully!");
            })
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    }


    // upload image to S3
    const saveImage = async (img) => {
        let newFileName = `${Date.now()}_${departmentName}.${img.name
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


    // delete image from S3
    const deleteImage = async (imageUrl) => {
        // get the file name
        const parts = imageUrl.split(".com/");
        const deleteImageName = parts.pop();
        // delete the file
        const deleteParams = {
            Bucket: config.bucketName,
            Key: deleteImageName,
        };
        client
            .send(new DeleteObjectCommand(deleteParams))
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }


    // form validation
    const validationSchema = Yup.object().shape({
        departmentName: Yup.string()
            .min(5, "Deparment name must be at least 5 Characters.")
            .max(50, "Deparment name must not exceed 50 characters.")
            .matches(/^[a-zA-Z ]*$/, "Only letters and spaces are allowed.")
            .required("Deparment name is required"),
        description: Yup.string()
            .min(5, "Description must be at least 5 characters.")
            .max(100, "Description must not exceed 100 characters.")
            .matches(
                /^[a-zA-Z0-9 ./,_()-]*$/,
                "Item name must only contain uppercase, lowercase, digits, spaces, and: ./,_()-"
            )
            .required("Description is required"),
        selectedImage: Yup.mixed()
            .test(
                "fileSize",
                "Image must be less than 5MB",
                (value) => value && value.size <= 5000000
            )
            .test(
                "fileFormat",
                "Unsupported Format",
                (value) => value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
            )
            .required("Image is required"),
    });


    // add/edit modal open/close
    const [openAddEditModal, setOpenAddEditModal] = useState(false);
    const handleAddBtnClick = () => {
        setOpenAddEditModal(true);
    };
    const handleCloseBtnClick = () => {
        setOpenAddEditModal(false);
    }
    const handleCancelBtnClick = () => {
        setOpenAddEditModal(false);
        setId(0);
        setDepartmentName('');
        setDescription('');
        setIsAdd(true);
    }
    // image error modal open/close
    const [showImageErrorModal, setShowImageErrorModal] = useState(false);
    const closeImageErrorModal = () => {
        setShowImageErrorModal(false);
    }
    const handleSaveBtnClick = (event) => {
        event.preventDefault();
        validationSchema
            .validate({ departmentName, description, selectedImage }, { abortEarly: false })
            .then(() => {
                if (isAdd) {
                    if (
                        selectedImage === null ||
                        selectedImage === undefined ||
                        selectedImage.size > 5000000
                    ) {
                        setShowImageErrorModal(true);
                        return;
                    }
                    saveImage(selectedImage).then((res) => {
                        console.log(res);
                        if (res !== null) {
                            //         // save data to database
                            fetch('http://localhost:8080/api/departments', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    department_name: departmentName,
                                    description: description,
                                    image_url: `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${config.dirName}/${res}`,
                                }),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log("Data just added:", data);
                                    // add new row to the table
                                    setRows((prev) => [
                                        ...prev,
                                        {
                                            id: data.id,
                                            department_name: departmentName,
                                            description: description,
                                            image_url: `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${config.dirName}/${res}`,
                                        },
                                    ]);
                                    // clear the modal input
                                    setId(0);
                                    setDepartmentName('');
                                    setDescription('');
                                    setOpenAddEditModal(false);
                                    setIsAdd(true);
                                    setShowFlashMessage(true);
                                    setFlashMessage("Department added successfully!");
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                }
                                );
                        }
                    });
                } else { // edit
                    if (
                        selectedImage === undefined ||
                        selectedImage.size > 5000000
                    ) {
                        setShowImageErrorModal(true);
                        return;
                    } else {
                        let rowToUpdate = rows.find((item) => item.id === id);
                        if (selectedImage !== null) {  // change image
                            saveImage(selectedImage).then((res) => {
                                console.log(res);
                                if (res !== null) {
                                    // delete the old image from S3
                                    deleteImage(rowToUpdate.image_url);
                                    console.log(rowToUpdate.image_url);
                                    console.log(id);
                                    console.log(departmentName);
                                    console.log(description);
                                    // update data in database
                                    fetch(`http://localhost:8080/api/departments/${id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            department_name: departmentName,
                                            description: description,
                                            image_url: `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${config.dirName}/${res}`,
                                        }),
                                    })
                                        .then(response => {
                                            console.log(response.json());
                                            // update the row in the table
                                            let updatedRows = [...rows];
                                            let index = updatedRows.findIndex((item) => item.id === id);
                                            updatedRows[index].department_name = departmentName;
                                            updatedRows[index].description = description;
                                            updatedRows[index].image_url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${config.dirName}/${res}`;
                                        })
                                        .catch((error) => {
                                            console.error('Error:', error);
                                        });
                                }
                            });
                        } else { // no change to image
                            // update data in database
                            fetch(`http://localhost:8080/api/departments/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    department_name: departmentName,
                                    description: description,
                                    image_url: rowToUpdate.image_url,
                                }),
                            })
                                .then(response => {
                                    console.log(response.json());
                                    setOpenAddEditModal(false);
                                    // update the row in the table
                                    let updatedRows = [...rows];
                                    let index = updatedRows.findIndex((item) => item.id === id);
                                    updatedRows[index].department_name = departmentName;
                                    updatedRows[index].description = description;
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                }
                                );
                        }
                        // clear the modal input
                        setId(0);
                        setDepartmentName('');
                        setDescription('');
                        setOpenAddEditModal(false);
                        setIsAdd(true);
                        setShowFlashMessage(true);
                        setFlashMessage("Department updated successfully!");
                    }
                }
            })
            .catch((validationErrors) => {
                console.error("Validation errors:", validationErrors);
                setValidationErrors(validationErrors.errors.join("\n"));
                setShowValidationErrorModal(true);
            });

    }
    const [validationErrors, setValidationErrors] = useState('');
    const [showValidationErrorModal, setShowValidationErrorModal] = useState(false);
    const closeValidationErrorModal = () => {
        setShowValidationErrorModal(false);
        setValidationErrors('');
    }

    const [isAdd, setIsAdd] = useState(true);
    const [id, setId] = useState(0);
    const [departmentName, setDepartmentName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);

    // flash message
    const [showFlashMessage, setShowFlashMessage] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const closeFlashMessage = () => {
        setShowFlashMessage(false);
        setFlashMessage('');
    }

    return (
        <div>
            <Box sx={{ textAlign: "right", mb: 3 }}>
                <Fab size="medium" aria-label="add" onClick={handleAddBtnClick}><AddIcon /></Fab>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={rows.length === 0}
                density='comfortable'
                getRowHeight={(params) => rowHeight}
                // dataProvider={(params) => {
                //     return rows;
                // }}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20]}
                disableExtendRowFullWidth={true}
                checkboxSelection
                sx={{ fontSize: '1.5rem' }}
            />

            {openAddEditModal && <Modal
                open={openAddEditModal}
                onClose={handleCloseBtnClick}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" mb={5} align='center'>
                        {isAdd ? (<>Add a Department</>) : (<>Edit a Department</>)}
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                                ID
                            </Grid>
                            <Grid item xs={8} sx={{ textAlign: "center" }}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Read Only"
                                    defaultValue={isAdd ? "-" : id}
                                    value={isAdd ? "-" : undefined}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                                Department
                            </Grid>
                            <Grid item xs={8} sx={{ textAlign: "center" }}>
                                <TextField
                                    label="Department Name"
                                    variant='outlined'
                                    type='text'
                                    required
                                    color='secondary'
                                    helperText={!departmentName && isAdd ? "Please enter a department name." : "Department name must be unique."}
                                    defaultValue={isAdd ? "" : departmentName}
                                    value={isAdd ? departmentName : undefined}
                                    error={
                                        !departmentName ||
                                        (isAdd && rows.some((item) => item.department_name === departmentName)) ||
                                        (!isAdd && rows.some((item) => item.department_name === departmentName && item.id !== id))
                                    }
                                    onChange={(e) => setDepartmentName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                                Description
                            </Grid>
                            <Grid item xs={8} sx={{ textAlign: "center" }}>
                                <TextField
                                    label="Description"
                                    variant='outlined'
                                    type='text'
                                    required
                                    color='secondary'
                                    helperText="Please enter a department description."
                                    error={!description && isAdd}
                                    defaultValue={isAdd ? "" : description}
                                    value={isAdd ? description : undefined}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                                Image
                            </Grid>
                            <Grid item xs={8} sx={{ textAlign: "center" }}>
                                <TextField
                                    // error
                                    type="file"
                                    label="Select a File"
                                    accept=".jpg, .jpeg, .png"
                                    required={isAdd}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    helperText="Please select a jpg/jpeg/png less than 5MB."
                                    error={!selectedImage && isAdd}
                                    multiple={false}
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <SaveButton onClick={handleSaveBtnClick}>Save</SaveButton>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "center" }}>
                                <CancelButton onClick={handleCancelBtnClick}>Cancel</CancelButton>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
            </Modal>}

            {/* modal for confirm delete */}
            <CustomModal
                title="Warning"
                content="Are you sure you want to delete this?"
                isOpen={showDeleteConfirmModal}
                isClose={closeDeleteConfirmModal}
                proceed={() => {
                    deleteDepartment(rowToDelete);
                    closeDeleteConfirmModal();
                }}
                confirm={true} />

            {/* modal for image >5Mb/null/undefind/format error */}
            <CustomModal
                title="Error"
                content="Please select a jpg/jpeg/png less than 5MB!"
                isOpen={showImageErrorModal}
                isClose={closeImageErrorModal}
                confirm={false} />

            {/* modal for validation error */}
            <CustomModal
                title="Error"
                content={validationErrors}
                isOpen={showValidationErrorModal}
                isClose={closeValidationErrorModal}
                confirm={false} />

            {/* add/edit/delete successfully flash message */}
            <CustomSnackbar
                type="success"
                content={flashMessage}
                isOpen={showFlashMessage}
                isClose={closeFlashMessage}
            />
        </div>
    );

}

