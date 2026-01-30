import React, { useState, ChangeEvent, FormEvent } from "react";
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";

interface FormData {
    finding: string;
    category: string;
    description: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddFinding: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        finding: "",
        category: "",
        description: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.finding) newErrors.finding = "Finding is required";
        if (!data.category) newErrors.category = "Category is required";
        if (!data.description) newErrors.description = "Description is required";
        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
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
                const response = await fetch("http://localhost:8087/finding/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert("Finding added successfully!");
                    setFormData({
                        finding: "",
                        category: "",
                        description: "",
                    });
                    setErrors({});
                } else {
                    const responseText = await response.text();
                    alert("Error adding finding: " + responseText);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Finding" pageTitle="Setup" />
                <Card>
                    <CardBody>
                        <Row className="d-flex justify-content-center">
                            <Col xl={12}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="finding">Finding</Label>
                                                <Input
                                                    type="text"
                                                    id="finding"
                                                    value={formData.finding}
                                                    onChange={handleChange}
                                                    invalid={!!errors.finding}
                                                />
                                                {errors.finding && <div className="invalid-feedback">{errors.finding}</div>}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="category">Category</Label>
                                                <Input
                                                    type="select"
                                                    id="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    invalid={!!errors.category}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="General">General</option>
                                                    <option value="Specific">Specific</option>
                                                </Input>
                                                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
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
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    invalid={!!errors.description}
                                                />
                                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col md={12} className="text-center">
                                            <Button type="submit" color="primary">
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default AddFinding;
