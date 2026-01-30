import React, { useState, ChangeEvent, FormEvent } from "react";
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";

interface FormData {
    findingCategory: string;

}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddCategoryFinding: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        findingCategory: "",

    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.findingCategory) newErrors.findingCategory = "findingCategory is required";

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


    };

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add findingCategory" pageTitle="Setup" />
                <Card>
                    <CardBody>
                        <Row className="d-flex justify-content-center">
                            <Col xl={12}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="findingCategory">Finding Category</Label>
                                                <Input
                                                    type="text"
                                                    id="findingCategory"
                                                    value={formData.findingCategory}
                                                    onChange={handleChange}
                                                    invalid={!!errors.findingCategory}
                                                />
                                                {errors.findingCategory && <div className="invalid-feedback">{errors.findingCategory}</div>}
                                            </FormGroup>
                                        </Col>


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

export default AddCategoryFinding;
