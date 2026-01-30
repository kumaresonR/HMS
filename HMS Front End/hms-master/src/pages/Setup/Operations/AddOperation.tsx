import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {
    operationName: string;
    category: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddOperation: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        operationName: '',
        category: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.operationName) newErrors.operationName = 'Operation Name is required';
        if (!data.category) newErrors.category = 'Category is required';

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
            // Submit the form data to the server
            try {
                const response = await fetch("http://localhost:8087/operation/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Operation added successfully!");
                    setFormData({
                        operationName: '',
                        category: '',
                    });
                    setErrors({});
                } else {
                    alert("Error adding operation: " + responseText);
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
                    <FormHeader title="Add Operation" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="operationName">Operation Name</Label>
                                                    <Input type="text" id="operationName" value={formData.operationName} onChange={handleChange} invalid={!!errors.operationName} />
                                                    {errors.operationName && <div className="invalid-feedback">{errors.operationName}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="category">Category</Label>
                                                    <Input type="select" id="category" value={formData.category} onChange={handleChange} invalid={!!errors.category}>
                                                        <option value="">Select Category</option>
                                                        <option value="Surgery">Surgery</option>
                                                        <option value="Therapy">Therapy</option>
                                                        <option value="Diagnostic">Diagnostic</option>
                                                        <option value="Rehabilitation">Rehabilitation</option>
                                                    </Input>
                                                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" type="submit">Add Operation</Button>
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

export default AddOperation;
