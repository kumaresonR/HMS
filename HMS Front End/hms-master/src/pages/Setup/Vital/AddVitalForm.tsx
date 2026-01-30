import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {
    vitalName: string;
    from: string;
    to: string;
    unit: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddVitalForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        vitalName: '',
        from: '',
        to: '',
        unit: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validation logic
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.vitalName) newErrors.vitalName = 'Vital Name is required';
        if (!data.from) newErrors.from = 'From date is required';
        if (!data.to) newErrors.to = 'To date is required';
        if (!data.unit) newErrors.unit = 'Unit is required';
        return newErrors;
    };

    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));

        setErrors(validateForm({ ...formData, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

       
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Vital Form" pageTitle="Vitals" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            {/* Vital Name */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="vitalName">Vital Name</Label>
                                                    <Input
                                                        type="text"
                                                        id="vitalName"
                                                        value={formData.vitalName}
                                                        onChange={handleChange}
                                                        invalid={!!errors.vitalName}
                                                    />
                                                    {errors.vitalName && <div className="invalid-feedback">{errors.vitalName}</div>}
                                                </FormGroup>
                                            </Col>

                                            {/* From Date */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="from">From</Label>
                                                    <Input
                                                        type="date"
                                                        id="from"
                                                        value={formData.from}
                                                        onChange={handleChange}
                                                        invalid={!!errors.from}
                                                    />
                                                    {errors.from && <div className="invalid-feedback">{errors.from}</div>}
                                                </FormGroup>
                                            </Col>

                                            {/* To Date */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="to">To</Label>
                                                    <Input
                                                        type="date"
                                                        id="to"
                                                        value={formData.to}
                                                        onChange={handleChange}
                                                        invalid={!!errors.to}
                                                    />
                                                    {errors.to && <div className="invalid-feedback">{errors.to}</div>}
                                                </FormGroup>
                                            </Col>

                                            {/* Unit */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="unit">Unit</Label>
                                                    <Input
                                                        type="text"
                                                        id="unit"
                                                        value={formData.unit}
                                                        onChange={handleChange}
                                                        invalid={!!errors.unit}
                                                    />
                                                    {errors.unit && <div className="invalid-feedback">{errors.unit}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add Vital</Button>
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

export default AddVitalForm;
