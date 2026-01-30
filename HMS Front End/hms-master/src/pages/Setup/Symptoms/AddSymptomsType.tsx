import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {
    symptomsType: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddSymptomsType: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        symptomsType: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.symptomsType) newErrors.symptomsType = 'symptoms Type is required';
        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
                const symptomsApiUrl = process.env.REACT_APP_SYMPTOMS_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8087';
                const response = await fetch(`${symptomsApiUrl}/symptoms/add`, {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    alert("symptoms added successfully!");
                    setFormData({
                        symptomsType: '',
                    });
                    setErrors({});
                } else {
                    const responseText = await response.text();
                    alert("Error adding symptoms: " + responseText);
                }
            } catch (error) {
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add symptoms" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="symptomsType">Symptoms Name</Label>
                                                    <Input
                                                        type="text"
                                                        id="symptomsType"
                                                        value={formData.symptomsType}
                                                        onChange={handleChange}
                                                        invalid={!!errors.symptomsType}
                                                    />
                                                    {errors.symptomsType && <div className="invalid-feedback">{errors.symptomsType}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add symptoms</Button>
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

export default AddSymptomsType;
