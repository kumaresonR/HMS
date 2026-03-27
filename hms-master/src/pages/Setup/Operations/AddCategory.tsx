import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {
    operationCategory: string; // Updated field
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddCategory: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        operationCategory: '', // Initialize with the new field
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.operationCategory) newErrors.operationCategory = 'Operation Category is required';

        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                const response = await fetch("http://localhost:8087/category/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Category added successfully!");
                    setFormData({ operationCategory: '' }); // Reset form after submission
                    setErrors({});
                } else {
                    alert("Error adding category: " + responseText);
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
                    <FormHeader title="Add Category" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="operationCategory">Operation Category</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="operationCategory" 
                                                        value={formData.operationCategory} 
                                                        onChange={handleChange} 
                                                        invalid={!!errors.operationCategory} 
                                                    />
                                                    {errors.operationCategory && <div className="invalid-feedback">{errors.operationCategory}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button color="primary" type="submit">Add Category</Button>
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

export default AddCategory;
