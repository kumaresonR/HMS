import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';

interface FormData {
    doctor: string;
    shift: string;
    consultationDuration: string;
    chargeCategory: string;
    charge: string;
    amount: string;
    zoomApiKey: string;
    zoomApiSecret: string;
    doctorApiCredential: string;
    useZoomClientApp: string;
    defaultOpdDuration: string;
    defaultIpdDuration: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const Slots: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        doctor: '',
        shift: '',
        consultationDuration: '',
        chargeCategory: '',
        charge: '',
        amount: '',
        zoomApiKey: '',
        zoomApiSecret: '',
        doctorApiCredential: 'Disabled',
        useZoomClientApp: 'Disabled',
        defaultOpdDuration: '',
        defaultIpdDuration: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.doctor) newErrors.doctor = 'Doctor is required';
        if (!data.shift) newErrors.shift = 'Shift is required';
        if (!data.consultationDuration) newErrors.consultationDuration = 'Consultation Duration is required';
        if (!data.chargeCategory) newErrors.chargeCategory = 'Charge Category is required';
        if (!data.charge) newErrors.charge = 'Charge is required';
        if (!data.amount) newErrors.amount = 'Amount is required';
        if (!data.zoomApiKey) newErrors.zoomApiKey = 'Zoom API Key is required';
        if (!data.zoomApiSecret) newErrors.zoomApiSecret = 'Zoom API Secret is required';
        if (!data.defaultOpdDuration) newErrors.defaultOpdDuration = 'Default OPD Duration is required';
        if (!data.defaultIpdDuration) newErrors.defaultIpdDuration = 'Default IPD Duration is required';

        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                data.append(key, formData[key as keyof FormData]);
            }

            try {
                const response = await fetch("http://localhost:8087/slots/add", {
                    method: "POST",
                    body: data,
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Slot added successfully!");
                    setFormData({
                        doctor: '',
                        shift: '',
                        consultationDuration: '',
                        chargeCategory: '',
                        charge: '',
                        amount: '',
                        zoomApiKey: '',
                        zoomApiSecret: '',
                        doctorApiCredential: 'Disabled',
                        useZoomClientApp: 'Disabled',
                        defaultOpdDuration: '',
                        defaultIpdDuration: '',
                    });
                    setErrors({});
                } else {
                    alert("Error adding slot: " + responseText);
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

                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="doctor">Doctor</Label>
                                                    <Input type="select" id="doctor" value={formData.doctor} onChange={handleChange} invalid={!!errors.doctor}>
                                                        <option value="">Select Doctor</option>
                                                        {/* Add options for doctors here */}
                                                    </Input>
                                                    {errors.doctor && <div className="invalid-feedback">{errors.doctor}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="shift">Shift</Label>
                                                    <Input type="select" id="shift" value={formData.shift} onChange={handleChange} invalid={!!errors.shift}>
                                                        <option value="">Select Shift</option>
                                                        <option value="Morning">Morning</option>
                                                        <option value="Afternoon">Afternoon</option>
                                                        <option value="Evening">Evening</option>
                                                    </Input>
                                                    {errors.shift && <div className="invalid-feedback">{errors.shift}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="consultationDuration">Consultation Duration (Minutes)</Label>
                                                    <Input type="text" id="consultationDuration" value={formData.consultationDuration} onChange={handleChange} invalid={!!errors.consultationDuration} />
                                                    {errors.consultationDuration && <div className="invalid-feedback">{errors.consultationDuration}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="chargeCategory">Charge Category</Label>
                                                    <Input type="select" id="chargeCategory" value={formData.chargeCategory} onChange={handleChange} invalid={!!errors.chargeCategory}>
                                                        <option value="">Select Charge Category</option>
                                                        {/* Add options for charge categories here */}
                                                    </Input>
                                                    {errors.chargeCategory && <div className="invalid-feedback">{errors.chargeCategory}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="charge">Charge</Label>
                                                    <Input type="select" id="charge" value={formData.charge} onChange={handleChange} invalid={!!errors.charge}>
                                                        <option value="">Select Charge</option>
                                                        {/* Add options for charges here */}
                                                    </Input>
                                                    {errors.charge && <div className="invalid-feedback">{errors.charge}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="amount">Amount</Label>
                                                    <Input type="text" id="amount" value={formData.amount} onChange={handleChange} invalid={!!errors.amount} />
                                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="zoomApiKey">Zoom API Key</Label>
                                                    <Input type="text" id="zoomApiKey" value={formData.zoomApiKey} onChange={handleChange} invalid={!!errors.zoomApiKey} />
                                                    {errors.zoomApiKey && <div className="invalid-feedback">{errors.zoomApiKey}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="zoomApiSecret">Zoom API Secret</Label>
                                                    <Input type="text" id="zoomApiSecret" value={formData.zoomApiSecret} onChange={handleChange} invalid={!!errors.zoomApiSecret} />
                                                    {errors.zoomApiSecret && <div className="invalid-feedback">{errors.zoomApiSecret}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="doctorApiCredential">Doctor API Credential</Label>
                                                    <Input type="radio" id="doctorApiCredential" value="Enabled" checked={formData.doctorApiCredential === 'Enabled'} onChange={handleChange} /> Enabled
                                                    <Input type="radio" id="doctorApiCredential" value="Disabled" checked={formData.doctorApiCredential === 'Disabled'} onChange={handleChange} /> Disabled
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="useZoomClientApp">Use Zoom Client App</Label>
                                                    <Input type="radio" id="useZoomClientApp" value="Enabled" checked={formData.useZoomClientApp === 'Enabled'} onChange={handleChange} /> Enabled
                                                    <Input type="radio" id="useZoomClientApp" value="Disabled" checked={formData.useZoomClientApp === 'Disabled'} onChange={handleChange} /> Disabled
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="defaultOpdDuration">Default OPD Duration (Minutes)</Label>
                                                    <Input type="text" id="defaultOpdDuration" value={formData.defaultOpdDuration} onChange={handleChange} invalid={!!errors.defaultOpdDuration} />
                                                    {errors.defaultOpdDuration && <div className="invalid-feedback">{errors.defaultOpdDuration}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="defaultIpdDuration">Default IPD Duration (Minutes)</Label>
                                                    <Input type="text" id="defaultIpdDuration" value={formData.defaultIpdDuration} onChange={handleChange} invalid={!!errors.defaultIpdDuration} />
                                                    {errors.defaultIpdDuration && <div className="invalid-feedback">{errors.defaultIpdDuration}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" type="submit">Add Slot</Button>
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

export default Slots;
