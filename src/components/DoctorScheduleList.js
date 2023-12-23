import React, { useState, Fragment } from "react";
import axios from "axios";

import "../styles/DoctorScheduleList.css";
import { Table, Button, Rate, Modal, Form, Input, Checkbox, ConfigProvider, Alert, Calendar, Radio, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.min.css'
import enUS from 'antd/es/locale/en_US';
import moment from 'moment';
import tw from "twin.macro";
import styled from "styled-components";
// import { bubble } from '../assets/images/bubble.png'
import { click } from "@testing-library/user-event/dist/click";


const { TextArea } = Input;

const Container = styled.div`
  ${tw`relative -mx-8 bg-center bg-cover`}
`;
const ContainerBox = styled.div`
  ${tw` w-9/12 overflow-y-hidden flex items-center justify-items-center flex-nowrap border-4 border-black `}
`;
const TitleContainer = styled.div`
  ${tw` w-full h-8 text-2xl font-semibold text-center mb-5 `}
`;
const ContainerLeft = styled.div`
  ${tw` w-3/12 h-full bg-yellow-300 p-5 `}
`;
const ContainerLeftYear = styled.div`
  ${tw` w-full h-10 leading-10 text-4xl font-bold `}
`;
const ContainerRight = styled.div`
  ${tw` w-9/12 h-full `}
`;
const TimeContainer = styled.div`
  ${tw`w-9/12 h-8 text-2xl font-semibold text-left mb-5 my-5 `}
`;
const TimeBoxContainer = styled.div`
  ${tw`w-11/12 text-base font-semibold mb-5`}
`;
const TimeShowContainer = styled.div`
  ${tw`w-1/5  `}
`;
const TypeCheckContainer = styled.div`
  ${tw`w-full h-10 leading-10 flex text-center justify-center my-6  `}
`;

const DoctorScheduleList = () => {
  //The current date is selected by default
  const [value, setValue] = useState(() => moment(new Date));
  //The current date is selected by default
  const [selectedValue, setSelectedValue] = useState(() => moment(new Date));
  //Display Time List Fixed Data
  const [timeList, setTimeList] = useState([
    { label: '9:00', value: '9:00:00' },
    { label: '10:00', value: '10:00:00' },
    { label: '11:00', value: '11:00:00' },
    { label: '12:00', value: '12:00:00' },
    { label: '13:00', value: '13:00:00' },
    { label: '14:00', value: '14:00:00' },
    { label: '15:00', value: '15:00:00' },
    { label: '16:00', value: '16:00:00' },
  ]);
  //The currently selected time
  const [selectTime, setSelectTimeList] = useState(null);
  //The currently selected type
  const [checkCon, setCheckCon] = useState(null);
  //Select Date
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
    setSelectTimeList(null)
  };
  //Select Date
  const onPanelChange = (newValue) => {
    setValue(newValue);
    setSelectTimeList(null)
  };
  //Select Date
  const handleSelectTime = (value) => {
    setSelectTimeList(value)
  }
  const url = process.env.REACT_APP_API_URL;

  //Submit
  const handleSubmit = () => {
    //Is the verification time selected
    if (!selectTime) {
      warning('Date and time are mandatory')
      return
    }
    //Is the verification type selected
    else if (!checkCon) {
      warning('Appointment type is mandatory')
      return
    }
    //Secondary confirmation
    confirm()
  }
  //Prompt for mandatory information
  const warning = (data) => {
    Modal.warning({
      title: 'This is a warning message',
      content: data,
    });
  };
  //Confirm callback event
  const confirm = () => {
    const token = true;
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to make an appointment',
      okText: 'confirm',
      cancelText: 'cancel',
      onOk: () => {
        axios
          .post(
            url+'/appointments/schedule', {
            patientId: 1,
            doctorId: 1,
            date: moment(selectedValue)?.format('YYYY-MM-DD'),
            startTime: selectTime,
            type: checkCon,
          })
          .then((res) => {
            console.log(res, 'res')
            //Success prompt
            if (res.data.status == '200') {
              message.success(res.data.message)
            }
            //Error prompt
            else {
              message.error(res.data.message)
            }
          })
          .catch((err) => {
            //Error prompt
            message.error('failed')
          });
      }
    });
  };
  //Type Select
  const onChange = (e) => {
    console.log(e, 'e')
    setCheckCon(e.target.value)
  }
  return (
    <Container>
      <ConfigProvider locale={enUS} >
        <div className="doctorSchedulePage">
          <TitleContainer>Doctor Schedule List</TitleContainer>
          <ContainerBox style={{ height: '325px' }}>
            <ContainerLeft >
              <ContainerLeftYear>
                {moment(selectedValue)?.locale('en')?.format('YYYY')}
              </ContainerLeftYear>
              <ContainerLeftYear>
                {moment(selectedValue)?.locale('en')?.format('ddd')}
              </ContainerLeftYear>
              <ContainerLeftYear>
                {moment(selectedValue)?.locale('en')?.format('MMM')}&nbsp;&nbsp;&nbsp;{moment(selectedValue)?.locale('en')?.format('DD')}
              </ContainerLeftYear>
            </ContainerLeft>
            <ContainerRight>
              <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} fullscreen={false} style={{ width: '100%' }} />
            </ContainerRight>

          </ContainerBox>
          <TimeContainer>Available start times</TimeContainer>
          <TimeBoxContainer className="timeBox">
            {
              timeList && timeList.map((item, index) => {
                return (
                  <div className="timeShow" key={item.value} style={{ color: selectTime == item.value ? '#1890ff' : 'black' }} onClick={e => handleSelectTime(item.value)} >{item.label}</div>
                )
              })
            }

          </TimeBoxContainer>
          <TypeCheckContainer>
            <Radio.Group onChange={onChange} value={checkCon} className="doctorCheck">
              <Radio value={"Online"}>Online&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
              <Radio value={"In-person"}>In-person&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
            </Radio.Group>
          </TypeCheckContainer>
          <Button style={{ width: '75%', backgroundColor: '#1890ff', height: '50px', fontSize: '24px' }} type="primary" onClick={handleSubmit} >Confirm</Button>
        </div>

      </ConfigProvider>

    </Container>
  );
};
export default DoctorScheduleList;
