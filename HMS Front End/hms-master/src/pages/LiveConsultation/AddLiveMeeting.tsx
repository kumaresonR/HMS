import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface LiveMeetingData {
    meeting_title: string;
    meeting_date: string;
    meeting_duration: string;
    host_video: string;
    client_video: string;
    staff_list: string;
    description: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddLiveMeeting: React.FC = () => {
    const [formData, setFormData] = useState<LiveMeetingData>({
        meeting_title: '',
        meeting_date: '',
        meeting_duration: '',
        host_video: '',
        client_video: '',
        staff_list: '',
        description: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: LiveMeetingData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.meeting_title) newErrors.meeting_title = 'Meeting Title is required';
        if (!data.meeting_date) newErrors.meeting_date = 'Meeting Date is required';
        if (!data.meeting_duration) newErrors.meeting_duration = 'Meeting Duration is required';
        if (!data.host_video) newErrors.host_video = 'Host Video is required';
        if (!data.client_video) newErrors.client_video = 'Client Video is required';
        if (!data.staff_list) newErrors.staff_list = 'Staff List is required';
        if (!data.description) newErrors.description = 'Description is required';

        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));

        setErrors(validateForm({ ...formData, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key as keyof LiveMeetingData]);
            }

            try {
                const response = await fetch("http://localhost:8087/live-meeting/add", {
                    method: "POST",
                    body: data,
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Live Meeting added successfully!");
                    setFormData({
                        meeting_title: '',
                        meeting_date: '',
                        meeting_duration: '',
                        host_video: '',
                        client_video: '',
                        staff_list: '',
                        description: '',
                    });
                    setErrors({});
                } else {
                    alert("Error adding live meeting: " + responseText);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Live Meeting" pageTitle="Setup" />
                    <Card>
                        <CardBody>


                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Add Live Meeting </h5>

                                <Link to="/main/liveMeetings" className="text-end">
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
                                                    <Label for="meeting_title">Meeting Title</Label>
                                                    <Input type="text" id="meeting_title" value={formData.meeting_title} onChange={handleChange} invalid={!!errors.meeting_title} />
                                                    {errors.meeting_title && <div className="invalid-feedback">{errors.meeting_title}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="meeting_date">Meeting Date</Label>
                                                    <Input type="date" id="meeting_date" value={formData.meeting_date} onChange={handleChange} invalid={!!errors.meeting_date} />
                                                    {errors.meeting_date && <div className="invalid-feedback">{errors.meeting_date}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="meeting_duration">Meeting Duration</Label>
                                                    <Input type="text" id="meeting_duration" value={formData.meeting_duration} onChange={handleChange} invalid={!!errors.meeting_duration} />
                                                    {errors.meeting_duration && <div className="invalid-feedback">{errors.meeting_duration}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="host_video">Host Video</Label>
                                                    <Input type="select" id="host_video" value={formData.host_video} onChange={handleChange} invalid={!!errors.host_video}>
                                                        <option value="">Select Host Video</option>
                                                        <option value="Host1">Host 1</option>
                                                        <option value="Host2">Host 2</option>
                                                        <option value="Host3">Host 3</option>
                                                    </Input>
                                                    {errors.host_video && <div className="invalid-feedback">{errors.host_video}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="client_video">Client Video</Label>
                                                    <Input type="select" id="client_video" value={formData.client_video} onChange={handleChange} invalid={!!errors.client_video}>
                                                        <option value="">Select Client Video</option>
                                                        <option value="Client1">Client 1</option>
                                                        <option value="Client2">Client 2</option>
                                                        <option value="Client3">Client 3</option>
                                                    </Input>
                                                    {errors.client_video && <div className="invalid-feedback">{errors.client_video}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="staff_list">Staff List</Label>
                                                    <Input type="select" id="staff_list" value={formData.staff_list} onChange={handleChange} invalid={!!errors.staff_list}>
                                                        <option value="">Select Staff</option>
                                                        <option value="Staff1">Staff 1</option>
                                                        <option value="Staff2">Staff 2</option>
                                                        <option value="Staff3">Staff 3</option>
                                                    </Input>
                                                    {errors.staff_list && <div className="invalid-feedback">{errors.staff_list}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <Input type="textarea" id="description" value={formData.description} onChange={handleChange} invalid={!!errors.description} />
                                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add Live Meeting</Button>
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

export default AddLiveMeeting;
