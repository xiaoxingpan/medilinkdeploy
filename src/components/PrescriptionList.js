import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";

import "../styles/PrescriptionList.css";
import { Table, Button, Rate, Modal, Form, Input, Checkbox, message, Row, Col } from "antd";
import "antd/dist/antd.min.css";
 
import tw from "twin.macro";
import styled from "styled-components";
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const { TextArea } = Input;

const Container = styled.div`
  ${tw`relative -mx-8 bg-center bg-cover`}
`;
const TitleContainer = styled.div`
  ${tw` w-full h-8 text-2xl font-semibold text-center mb-5 `}
`;
const ModalButtonContainer = styled.div`
  ${tw` w-full flex text-center justify-center mt-6 `}
`;
const TableContainer = styled.table`
  ${tw` border border-spacing-1 border-separate  `}
`;
const CaptionContainer = styled.caption`
  ${tw`caption-top`}
`;
const ThContainer = styled.td`
  ${tw`border`}
`;
const TdContainer = styled.td`
  ${tw`border`}
`;
const ButtondContainer = styled.button`
  ${tw`bg-indigo-500 rounded-lg text-base h-8 text-xl/8 mr-2 ml-2 px-2`}
`;

const PrescriptionList = () => {
  const url = process.env.REACT_APP_API_URL;
  console.log('url',url)
  //Bind form
  const [form] = Form.useForm();
  //Do you want to open the evaluation pop-up window
  const [visible, setVisible] = useState(false);
  //Docter Name Modal Show
  const [doctor, setDoctor] = useState(null);
  //ID Modal Submit Usage 
  const [id, setId] = useState(null);
  //Initialize List data
  const [dataSource, setDataSource] = useState([]);
  //Number of entries per page
  const [pageSize, setPageSize] = useState(10);
  //Current number of pages
  const [pageNumber, setPageNumber] = useState(1);
  const [total, setTotal] = useState(null);
  //Do you want to open the evaluation pop-up window
  const [caseVisible, setCaseVisible] = useState(false);
  //Select Data
  const [selectData, setSelectData] = useState({});
  //Medical window
  const [medicalVisible, setMedicalVisible] = useState(false);
  //Default query list data during initialization
  useEffect(() => {
    getList(10, 0)
  }, []);
  //View prescription methods online
  const handleShow = (record, type) => {
    // window.open(
    //   "/ShowPdf?file=" +
    //   "https://gsop.oss-ap-southeast-1.aliyuncs.com/GSOP/20231204/a1a0445c2e337ce8704117e8feb79b82.pdf"
    // );
    setSelectData(record)
    if (type == 2) {
      setCaseVisible(true)
    } else {
      setMedicalVisible(true)
    }
  };
  // Download prescription method
  const handleDown = (type) => {
    // var elemIF = document.createElement("iframe");
    // elemIF.src =
    //   "https://gsop.oss-ap-southeast-1.aliyuncs.com/GSOP/20231204/a1a0445c2e337ce8704117e8feb79b82.pdf";
    // elemIF.style.display = "none";
    // document.body.appendChild(elemIF);
    // setTimeout(() => {
    //   document.body.removeChild(elemIF);
    // }, 1500);
    let dom
    let ele
    if (type == 1) {
      dom = document.querySelector('#medicalRecordBox');
      ele = document.querySelector('#medicalRecordBox');
    } else {
      dom = document.querySelector('#prescriptionBox');
      ele = document.querySelector('#prescriptionBox');
    }
    window.scrollTo(0, 0);
    const eleW = ele.offsetWidth; // container width
    const eleH = ele.offsetHeight; // container height
    const eleOffsetTop = ele.offsetTop; // container offset top
    const eleOffsetLeft = ele.offsetLeft; // container offset left

    const canvas = document.createElement('canvas');
    let abs = 0;

    const win_in = document.documentElement.clientWidth || document.body.clientWidth;
    const win_out = window.innerWidth;

    if (win_out > win_in) {
      // abs = (win_o - win_i)/2;    
      abs = (win_out - win_in) / 2;
    }
    canvas.width = eleW * 2;
    canvas.height = eleH * 2;

    const context = canvas.getContext('2d');
    (context).scale(2, 2);
    (context).translate(-eleOffsetLeft - abs, -eleOffsetTop);
    html2canvas(dom, {
      useCORS: true,
      allowTaint: false,
      logging: true,
      dpi: window.devicePixelRatio * 4,
      scale: 4,
    }).then((canvas) => {
      // eslint-disable-next-line new-cap
      const pdf = new JsPDF('p', 'pt', 'a4');
      const ctx = canvas.getContext('2d');
      const a4w = 563.28; const a4h = 819.89;
      const imgHeight = Math.floor(a4h * canvas.width / a4w);
      let renderedHeight = 0;

      while (renderedHeight < canvas.height) {
        const page = document.createElement('canvas');
        page.width = canvas.width;
        page.height = Math.min(imgHeight, canvas.height - renderedHeight);


        (page).getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 16, 16, a4w, Math.min(a4h, a4w * page.height / page.width));
        // const str = `${pdf.getNumberOfPages()}`;
        // pdf.setFontSize(10);

        // // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        // const pageSize = pdf.internal.pageSize;
        // const pageHeight = pageSize.height
        //   ? pageSize.height
        //   : pageSize.getHeight();
        // pdf.text('Footer text', 0, pageHeight - 10);
        // pdf.text(str, 100, pageHeight - 10);
        renderedHeight += imgHeight;
        if (renderedHeight < canvas.height) {
          pdf.addPage();
        }

        // this$EventBus.$emit('open-pdf', canvas);
      }
      // save file
      if (type == 1) {
        pdf.save(`Medical Record.pdf`);
      } else {
        pdf.save(`Prescription.pdf`);
      }

    });
  };
  //Do you want to open the evaluation pop-up window
  const handleShowEvaluate = (text, record, index) => {
    console.log(1111, text, record, index);
    setDoctor(record.doctorName);
    setId(record.id);
    setVisible(true);
  };
  //submit 
  const handleOk = () => {
    const token = true;
    // setVisible(false)
    form
      .validateFields()
      .then((values) => {
        axios
          .post(
            url+'/appointments/review', {
            id: id,
            comment: values.comment,
            rate: values.rate
          })
          .then((res) => {
            console.log(res, 'res')
            if (res.status == '200') {
              message.success('Success')
              form.resetFields();
              setVisible(false);
              setDoctor(null);
              setId(null);
              getList(10, 0)
            } else {
              message.error('failed')
            }

          })
          .catch((err) => {
            message.error('failed')
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  //cancel Modal
  const handleCancel = () => {
    setVisible(false);
  };
  //Event when pagination changes
  const handlePageChg = (page, pageSize) => {
    console.log(page, pageSize)
    //Update the number of entries
    setPageSize(pageSize)
    //Update page numbers
    setPageNumber(page)
    //Update list data
    getList(pageSize, page - 1)
  }
  const getList = (pageSize, page) => {
    // const token = true;
    axios
      .get(
        url + '/appointments/page?pageSize='+
        pageSize +
        "&pageNumber=" +
        (page) +
        "&patientld=" +
        1,
      )
      .then((res) => {
        console.log(res, "res");
        setDataSource(res.data.content || []);
        setTotal(res.data.totalElements)
      })
      .catch((err) => {
        message.error('failed')
      });
  }
  //Close case pop-up window
  const handleModalCancel = (type) => {
    setSelectData({})
    if (type == 1) {
      setCaseVisible(false)
    } else {
      setMedicalVisible(false)
    }
  }


  const columns = [
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "visit time",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Prescription",
      dataIndex: "prescription",
      key: "prescription",
      render: (text, record, index) => {
        return (
          <Fragment>
            <Button
              type="primary"
              style={{ backgroundColor: "#1890ff" }}
              onClick={(e) => handleShow(record, 2)}
            >
              view
            </Button>

          </Fragment>
        );
      },
    },
    {
      title: "Medical Record",
      dataIndex: "medicalRecord",
      key: "medicalRecord",
      render: (text, record, index) => {
        return (
          <Fragment>
            <Button
              type="primary"
              style={{ backgroundColor: "#1890ff" }}
              onClick={(e) => handleShow(record, 1)}
            >
              view
            </Button>

          </Fragment>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        return (
          <Fragment>
            {record.status == "DONE"&&!record.rate ? (
              <Button
                type="primary"
                style={{ backgroundColor: "#1890ff" }}
                onClick={(e) => handleShowEvaluate(text, record, index)}
              >
                Evaluate
              </Button>
            ) : (
              <Button
                type="primary"
                disabled
                style={{ backgroundColor: "#bbb" }}
                onClick={(e) => handleShowEvaluate(text, record, index)}
              >
                Evaluate
              </Button>
            )}
          </Fragment>
        );
      },
    },
  ];

  return (
    <Container>
      <div className="prescriptionPage">
        {/* List */}
        <div>
          <TitleContainer>Prescription List</TitleContainer>
          {/* <div className="prescriptionListTitle"></div> */}
          {/* Prescription List */}
          <Table
            bordered
            className="tableBox"
            dataSource={dataSource}
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              pageSize: pageSize,
              current: pageNumber,
              showSizeChanger: true,
              // pageSizeOptions: [1, 2, 3, 4, 5],
              onChange: handlePageChg,
              total: total,
              showTitle: true,
            }}
          />
        </div>
        {/* Evaluation */}
        <Modal
          open={visible}
          title="Doctor's evaluation"
          onCancel={handleCancel}
          footer={null}
        // footer={[
        //   <Button key="back" onClick={handleCancel}>
        //     Cancel
        //   </Button>,
        //   <Button key="submit" type="primary" style={{ backgroundColor: '#1890ff' }} onClick={handleOk}>
        //     Ok
        //   </Button>,
        // ]}
        >
          <Form
            name="basic"
            form={form}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item
              label="Docter"
              name="docter"
              initialValue={doctor}
              rules={[
                {
                  required: false,
                  message: "Please input doctername!",
                },
              ]}
            >
              <Input value={doctor} disabled />
            </Form.Item>

            <Form.Item
              label="Rate"
              name="rate"
              rules={[
                {
                  required: true,
                  message: "Please input your Rate!",
                },
              ]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
              rules={[
                {
                  required: true,
                  message: "Please input your Comment!",
                },
              ]}
            >
              <TextArea rows={4} showCount maxLength={500} />
            </Form.Item>
            <ModalButtonContainer>
              <Button
                key="submit"
                type="primary"
                style={{ backgroundColor: "#1890ff" }}
                onClick={handleOk}
              >
                Submit
              </Button>
            </ModalButtonContainer>
          </Form>
        </Modal>
        <Modal
          open={medicalVisible}
          title="Medical Record Info"
          onCancel={e => handleModalCancel(2)}
          footer={null}
        // footer={[
        //   <Button key="back" onClick={handleCancel}>
        //     Cancel
        //   </Button>,
        //   <Button key="submit" type="primary" style={{ backgroundColor: '#1890ff' }} onClick={handleOk}>
        //     Ok
        //   </Button>,
        // ]}
        >
          <div id="medicalRecordBox" style={{ fontSize: '18px', width: '100%', height: '100%' }}>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>visit time:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.date}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>Doctor:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.doctorName}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>User:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.patientName}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>Medical Record:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.medicalRecord}</Col>
            </Row>
          </div>
          <ModalButtonContainer>
            <Button
              key="cancel"
              onClick={e => handleModalCancel(2)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#1890ff", marginLeft: '20px' }}
              onClick={(e) => handleDown(1)}
            >
              Download
            </Button>
          </ModalButtonContainer>
        </Modal>
        <Modal
          open={caseVisible}
          title="Prescription Info"
          onCancel={e => handleModalCancel(1)}
          footer={null}
        // footer={[
        //   <Button key="back" onClick={handleCancel}>
        //     Cancel
        //   </Button>,
        //   <Button key="submit" type="primary" style={{ backgroundColor: '#1890ff' }} onClick={handleOk}>
        //     Ok
        //   </Button>,
        // ]}
        >
          <div id="prescriptionBox" style={{ fontSize: '18px', width: '100%', height: '100%' }}>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>visit time:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.date}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>Doctor:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.doctorName}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>User:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.patientName}</Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: 'right' }}>Prescription:&nbsp;&nbsp;</Col>
              <Col span={16} style={{ textAlign: 'left' }}>{selectData.prescription}</Col>
            </Row>
          </div>
          <ModalButtonContainer>
            <Button
              key="cancel"
              onClick={e => handleModalCancel(1)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#1890ff", marginLeft: '20px' }}
              onClick={(e) => handleDown(2)}
            >
              Download
            </Button>
          </ModalButtonContainer>
        </Modal>
        {/* <TableContainer className="tableBox">
          <CaptionContainer className="prescriptionCap">
            <h2>Prescription List</h2>
          </CaptionContainer>
          <thead className="prescriptionThead">
            <tr>
              <ThContainer className="prescriptionBorderColor">Doctor</ThContainer>
              <ThContainer className="prescriptionBorderColor">Prescript</ThContainer>
              <ThContainer className="prescriptionBorderColor">Edit</ThContainer>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TdContainer className="prescriptionBorderColor">Indiana</TdContainer>
              <TdContainer className="prescriptionBorderColor">Indianapolis</TdContainer>
              <TdContainer className="prescriptionBorderColor"><ButtondContainer onClick={() => handleShow(!visible)}>view</ButtondContainer><ButtondContainer onClick={() => handleDown()}>download</ButtondContainer></TdContainer>
            </tr>
            <tr>
              <TdContainer className="prescriptionBorderColor">Ohio</TdContainer>
              <TdContainer className="prescriptionBorderColor">Columbus</TdContainer>
              <TdContainer className="prescriptionBorderColor"><ButtondContainer onClick={() => setVisible(!visible)}>view</ButtondContainer><ButtondContainer>download</ButtondContainer><ButtondContainer>print</ButtondContainer></TdContainer>
            </tr>
            <tr>
              <TdContainer className="prescriptionBorderColor">Michigan</TdContainer>
              <TdContainer className="prescriptionBorderColor">Detroit</TdContainer>
              <TdContainer className="prescriptionBorderColor"><ButtondContainer onClick={() => setVisible(!visible)}>view</ButtondContainer><ButtondContainer>download</ButtondContainer><ButtondContainer>print</ButtondContainer></TdContainer>
            </tr>
          </tbody>
        </TableContainer> */}
      </div>
    </Container >
  );
};
export default PrescriptionList;