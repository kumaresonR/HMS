import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {

    symptomsHead: string;
    symptomsType: string;
    description: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddSymptomsHead: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
      
        symptomsHead: '',
        symptomsType: '',
        description: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
      
        if (!data.symptomsHead) newErrors.symptomsHead = 'Symptoms Head is required';
        if (!data.symptomsType) newErrors.symptomsType = 'Symptoms Type is required';
        if (!data.description) newErrors.description = 'Description is required';
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert('Symptoms Head added successfully!');
            setFormData({

                symptomsHead: '',
                symptomsType: '',
                description: '',
            });
            setErrors({});
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Symptoms Head" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                               
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="symptomsHead">Symptoms Head</Label>
                                                    <Input
                                                        type="text"
                                                        id="symptomsHead"
                                                        value={formData.symptomsHead}
                                                        onChange={handleChange}
                                                        invalid={!!errors.symptomsHead}
                                                    />
                                                    {errors.symptomsHead && (
                                                        <div className="invalid-feedback">{errors.symptomsHead}</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="symptomsType">Symptoms Type</Label>
                                                    <Input
                                                        type="select"
                                                        id="symptomsType"
                                                        value={formData.symptomsType}
                                                        onChange={handleChange}
                                                        invalid={!!errors.symptomsType}
                                                    >
                                                        <option value="">Select Symptoms Type</option>
                                                        <option value="TypeA">TypeA</option>
                                                        <option value="TypeB">TypeB</option>
                                                    </Input>
                                                    {errors.symptomsType && (
                                                        <div className="invalid-feedback">{errors.symptomsType}</div>
                                                    )}
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
                                                    {errors.description && (
                                                        <div className="invalid-feedback">{errors.description}</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
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
            </div>
        </React.Fragment>
    );
};

export default AddSymptomsHead;
