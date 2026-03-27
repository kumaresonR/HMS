import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Card, CardBody, Button, Row, Col, FormGroup, Label, Input, Form } from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import Flatpickr from "react-flatpickr";

const callTypeData = [
    {
        calltype: "Incoming"
    },
    {
        calltype: "Outgoing"
    }
]

const EditCallLog = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [callType, setCallType] = useState('');
    const [callTypeValidationError, setCallTypeValidationError] = useState(false);
    const [date, setDate] = useState<any>('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [contact, setContact] = useState('');
    const [contactNoValidationError, setContactNoValidationError] = useState("");
    const [description, setDescription] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [callDuration, setCallDuration] = useState('');
    const [note, setNote] = useState('');

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleContactNo = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setContact(phoneValue);
        if (phoneValue.length !== 10) {
            setContactNoValidationError("Phone must be exactly 10 digits.");
        } else {
            setContactNoValidationError("");
        }
    }

    const handleDateChange = (dates: Date[]) => {
        if (dates[0]) {
            const formattedDate = moment(dates[0]).format("DD/MM/YYYY");
            setDate(formattedDate);
            setDateValidationError(false);
        }
    }

    const handleFollowUpDateChange = (dates: Date[]) => {
        if (dates[0]) {
            const formattedDate = moment(dates[0]).format("DD/MM/YYYY");
            setFollowUpDate(formattedDate);
        }
    }

    const handleCallTypeChange = (value: any) => {
        setCallType(value);
        setCallTypeValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (!callType) {
            setCallTypeValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        if (contact && !/^[0-9]{10}$/.test(contact)) {
            setContactNoValidationError("Phone must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setContactNoValidationError("");
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createPhoneCall();
        }
    }
    const createPhoneCall = async () => {
        try {
            const payload: any = {
                name: name,
                contact: contact,
                description: description,
                follow_up_date: followUpDate,
                call_duration: callDuration,
                note: note,
                call_type: callType,
                date: date
            }
            await frontOfficeApiService.editPhoneCall(data.id, payload);
            navigate('/main/phoneCallLogs');
            toast.success('Call Log Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data:any) => {
        setName(data.name);
        setContact(data.contact);
        setDescription(data.description);
        setFollowUpDate(data.follow_up_date);
        setCallDuration(data.call_duration);
        setNote(data.note);
        setCallType(data.call_type);
        setDate(data.date);
    }

    useEffect(() => {
        if (state?.data) {
            setData(state?.data);
        }
    }, [state?.data]);

    return (

        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Call Logs" pageTitle="Front Office " />
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Edit Call Logs</h5>

                                <Link to="/main/phoneCallLogs" className="text-end">
                                    <Button
                                        color="primary"
                                        className="btn btn-primary add-btn"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </Link>
                            </div>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Name <span className='text-danger'>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && <div className="invalid-feedback">Name Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="phone">Phone</Label>
                                                    <Input
                                                        type="text"
                                                        id="phone"
                                                        value={contact}
                                                        maxLength={10}
                                                        onChange={e => handleContactNo(e.target.value)}
                                                        invalid={!!contactNoValidationError}
                                                    />
                                                    {contactNoValidationError && <div className="invalid-feedback">{contactNoValidationError}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date">Date <span className='text-danger'>*</span></Label>
                                                    <Flatpickr id="date"
                                                        className={`${dateValidationError ? 'is-invalid' : ''} form-control`}
                                                        name="date"
                                                        value={date}
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                        }}
                                                        onChange={handleDateChange}
                                                        placeholder="DD/MM/YYYY"
                                                    />
                                                    {dateValidationError && <div className="invalid-feedback">Date Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="nextFollowUpDate">Next Follow Up Date</Label>
                                                    <Flatpickr id="nextFollowUpDate"
                                                        className={`form-control`}
                                                        name="nextFollowUpDate"
                                                        value={followUpDate}
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                        }}
                                                        onChange={handleFollowUpDateChange}
                                                        placeholder="DD/MM/YYYY"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="description"
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="callDuration">Call Duration</Label>
                                                    <Input
                                                        type="text"
                                                        id="callDuration"
                                                        value={callDuration}
                                                        onChange={e => setCallDuration(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="callType">Call Type <span className='text-danger'>*</span></Label>
                                                    <Input type="select" id="callType" value={callType}
                                                        onChange={e => handleCallTypeChange(e.target.value)}
                                                        invalid={!!callTypeValidationError}
                                                    >
                                                        <option value="">Select Call Type</option>
                                                        {callTypeData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.calltype}>{item.calltype}</option>
                                                        ))}
                                                    </Input>
                                                    {callTypeValidationError && <div className="invalid-feedback">Call Type Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="note"
                                                        value={note}
                                                        onChange={e => setNote(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Update Call Log</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditCallLog;