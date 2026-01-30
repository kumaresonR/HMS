import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface ZoomSettingsData {
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

const ZoomSettings: React.FC = () => {
    const [formData, setFormData] = useState<ZoomSettingsData>({
        zoomApiKey: '',
        zoomApiSecret: '',
        doctorApiCredential: 'Disabled',
        useZoomClientApp: 'Disabled',
        defaultOpdDuration: '',
        defaultIpdDuration: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: ZoomSettingsData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.zoomApiKey) newErrors.zoomApiKey = 'Zoom API Key is required';
        if (!data.zoomApiSecret) newErrors.zoomApiSecret = 'Zoom API Secret is required';
        if (!data.defaultOpdDuration) newErrors.defaultOpdDuration = 'Default OPD Duration is required';
        if (!data.defaultIpdDuration) newErrors.defaultIpdDuration = 'Default IPD Duration is required';
        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert('Zoom Settings saved successfully!');
        }
    };

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Zoom Settings" pageTitle="Setup" />
                <Card>
                    <CardBody>
                        <Row className="d-flex justify-content-center">
                            <Col xl={12}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="zoomApiKey">Zoom API Key</Label>
                                                <Input
                                                    type="text"
                                                    id="zoomApiKey"
                                                    value={formData.zoomApiKey}
                                                    onChange={handleChange}
                                                    invalid={!!errors.zoomApiKey}
                                                />
                                                {errors.zoomApiKey && (
                                                    <div className="invalid-feedback">{errors.zoomApiKey}</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="zoomApiSecret">Zoom API Secret</Label>
                                                <Input
                                                    type="text"
                                                    id="zoomApiSecret"
                                                    value={formData.zoomApiSecret}
                                                    onChange={handleChange}
                                                    invalid={!!errors.zoomApiSecret}
                                                />
                                                {errors.zoomApiSecret && (
                                                    <div className="invalid-feedback">{errors.zoomApiSecret}</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Doctor API Credential</Label>
                                                <div>
                                                    <Input
                                                        type="radio"
                                                        name="doctorApiCredential"
                                                        value="Disabled"
                                                        checked={formData.doctorApiCredential === 'Disabled'}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <span className='ms-2'>Disabled</span>
                                                    <Input
                                                        type="radio"
                                                        name="doctorApiCredential"
                                                        value="Enabled"
                                                        checked={formData.doctorApiCredential === 'Enabled'}
                                                        onChange={handleRadioChange}
                                                       className='ms-3'
                                                    />
                                                    <span className='ms-2'>Enabled</span>

                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Use Zoom Client App</Label>
                                                <div>
                                                    <Input
                                                        type="radio"
                                                        name="useZoomClientApp"
                                                        value="Disabled" 
                                                        checked={formData.useZoomClientApp === 'Disabled'}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <span className='ms-2'>Disabled</span>


                                                    <Input
                                                        type="radio"
                                                        name="useZoomClientApp"
                                                        value="Enabled" className='ms-3'
                                                        checked={formData.useZoomClientApp === 'Enabled'}
                                                        onChange={handleRadioChange}
                                                      
                                                    />
                                                    <span className='ms-2'>Enabled</span>



                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="defaultOpdDuration">Default OPD Duration</Label>
                                                <Input
                                                    type="text"
                                                    id="defaultOpdDuration"
                                                    value={formData.defaultOpdDuration}
                                                    onChange={handleChange}
                                                    invalid={!!errors.defaultOpdDuration}
                                                />
                                                {errors.defaultOpdDuration && (
                                                    <div className="invalid-feedback">
                                                        {errors.defaultOpdDuration}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="defaultIpdDuration">Default IPD Duration</Label>
                                                <Input
                                                    type="text"
                                                    id="defaultIpdDuration"
                                                    value={formData.defaultIpdDuration}
                                                    onChange={handleChange}
                                                    invalid={!!errors.defaultIpdDuration}
                                                />
                                                {errors.defaultIpdDuration && (
                                                    <div className="invalid-feedback">
                                                        {errors.defaultIpdDuration}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button color="primary" type="submit">
                                        Save Settings
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default ZoomSettings;
