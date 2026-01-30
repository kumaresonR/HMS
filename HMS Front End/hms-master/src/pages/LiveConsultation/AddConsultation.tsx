import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface FormData {
    consultationTitle: string;
    consultationDate: string;
    consultationDuration: string;
    opdIpd: string;
    opdIpdNo: string;
    consultantDoctor: string;
    description: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddConsultation: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        consultationTitle: '',
        consultationDate: '',
        consultationDuration: '',
        opdIpd: '',
        opdIpdNo: '',
        consultantDoctor: '',
        description: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.consultationTitle) newErrors.consultationTitle = 'Consultation Title is required';
        if (!data.consultationDate) newErrors.consultationDate = 'Consultation Date is required';
        if (!data.consultationDuration) newErrors.consultationDuration = 'Consultation Duration is required';
        if (!data.opdIpd) newErrors.opdIpd = 'Select OPD or IPD';
        if (!data.opdIpdNo) newErrors.opdIpdNo = 'OPD/IPD Number is required';
        if (!data.consultantDoctor) newErrors.consultantDoctor = 'Consultant Doctor is required';
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
            try {
                const response = await fetch("http://localhost:8087/consultation/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Consultation added successfully!");
                    setFormData({
                        consultationTitle: '',
                        consultationDate: '',
                        consultationDuration: '',
                        opdIpd: '',
                        opdIpdNo: '',
                        consultantDoctor: '',
                        description: '',
                    });
                    setErrors({});
                } else {
                    alert("Error adding consultation: " + responseText);
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
                    <FormHeader title="Add Consultation" pageTitle="Setup" />
                    <Card>
                        <CardBody>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Add Consultation</h5>

                                        <Link to="/main/liveConsultation" className="text-end">
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
                                                    <Label for="consultationTitle">Consultation Title</Label>
                                                    <Input type="text" id="consultationTitle" value={formData.consultationTitle} onChange={handleChange} invalid={!!errors.consultationTitle} />
                                                    {errors.consultationTitle && <div className="invalid-feedback">{errors.consultationTitle}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="consultationDate">Consultation Date</Label>
                                                    <Input type="date" id="consultationDate" value={formData.consultationDate} onChange={handleChange} invalid={!!errors.consultationDate} />
                                                    {errors.consultationDate && <div className="invalid-feedback">{errors.consultationDate}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="consultationDuration">Consultation Duration</Label>
                                                    <Input type="text" id="consultationDuration" value={formData.consultationDuration} onChange={handleChange} invalid={!!errors.consultationDuration} />
                                                    {errors.consultationDuration && <div className="invalid-feedback">{errors.consultationDuration}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="opdIpd">OPD/IPD</Label>
                                                    <Input type="select" id="opdIpd" value={formData.opdIpd} onChange={handleChange} invalid={!!errors.opdIpd}>
                                                        <option value="">Select OPD or IPD</option>
                                                        <option value="OPD">OPD</option>
                                                        <option value="IPD">IPD</option>
                                                    </Input>
                                                    {errors.opdIpd && <div className="invalid-feedback">{errors.opdIpd}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="opdIpdNo">OPD/IPD Number</Label>
                                                    <Input type="text" id="opdIpdNo" value={formData.opdIpdNo} onChange={handleChange} invalid={!!errors.opdIpdNo} />
                                                    {errors.opdIpdNo && <div className="invalid-feedback">{errors.opdIpdNo}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="consultantDoctor">Consultant Doctor</Label>
                                                    <Input type="select" id="consultantDoctor" value={formData.consultantDoctor} onChange={handleChange} invalid={!!errors.consultantDoctor}>
                                                        <option value="">Select Consultant</option>
                                                        <option value="Dr. Smith">Dr. Smith</option>
                                                        <option value="Dr. Jones">Dr. Jones</option>
                                                        <option value="Dr. Brown">Dr. Brown</option>
                                                        {/* Add more doctors as necessary */}
                                                    </Input>
                                                    {errors.consultantDoctor && <div className="invalid-feedback">{errors.consultantDoctor}</div>}
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

                                        <Button type="submit" color="primary">Add Consultation</Button>
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

export default AddConsultation;
