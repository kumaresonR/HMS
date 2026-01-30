import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';

interface FormData {
    staffName: string;
    role: string;
    entryTime: string;
    exitTime: string;
    breakTime: string;
    overtime: string;
    note: string;
    date: string;
    SelectStatus: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddAttendance: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        staffName: '',
        role: '',
        entryTime: '',
        exitTime: '',
        breakTime: '',
        overtime: '',
        note: '',
        date: '',
        SelectStatus: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.staffName) newErrors.staffName = 'Staff Name is required';
        if (!data.role) newErrors.role = 'Role is required';
        if (!data.entryTime) newErrors.entryTime = 'Entry Time is required';
        if (!data.exitTime) newErrors.exitTime = 'Exit Time is required';
        if (!data.breakTime) newErrors.breakTime = 'Break Time is required';
        if (!data.overtime) newErrors.overtime = 'Overtime is required';
        if (!data.note) newErrors.note = 'Note is required';
        if (!data.date) newErrors.date = 'Date is required';
        if (!data.SelectStatus) newErrors.SelectStatus = 'Select Status is required'; // Validation for status
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

        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Attendance" pageTitle="Attendance" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="staffName">Staff Name</Label>
                                                    <Input type="text" id="staffName" value={formData.staffName} onChange={handleChange} invalid={!!errors.staffName} />
                                                    {errors.staffName && <div className="invalid-feedback">{errors.staffName}</div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md={6}>
                                                <FormGroup>
                                                    <Label for="role">Role</Label>
                                                    <Input type="text" id="role" value={formData.role} onChange={handleChange} invalid={!!errors.role} />
                                                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                                </FormGroup>
                                            </Col> */}
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="entryTime">Entry Time</Label>
                                                    <Input type="time" id="entryTime" value={formData.entryTime} onChange={handleChange} invalid={!!errors.entryTime} />
                                                    {errors.entryTime && <div className="invalid-feedback">{errors.entryTime}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="exitTime">Exit Time</Label>
                                                    <Input type="time" id="exitTime" value={formData.exitTime} onChange={handleChange} invalid={!!errors.exitTime} />
                                                    {errors.exitTime && <div className="invalid-feedback">{errors.exitTime}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="breakTime">Break Time</Label>
                                                    <Input type="text" id="breakTime" value={formData.breakTime} onChange={handleChange} invalid={!!errors.breakTime} />
                                                    {errors.breakTime && <div className="invalid-feedback">{errors.breakTime}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="overtime">Overtime</Label>
                                                    <Input type="text" id="overtime" value={formData.overtime} onChange={handleChange} invalid={!!errors.overtime} />
                                                    {errors.overtime && <div className="invalid-feedback">{errors.overtime}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>
                                                    <Input type="textarea" id="note" value={formData.note} onChange={handleChange} invalid={!!errors.note} />
                                                    {errors.note && <div className="invalid-feedback">{errors.note}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date">Date</Label>
                                                    <Input type="date" id="date" value={formData.date} onChange={handleChange} invalid={!!errors.date} />
                                                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        id="SelectStatus"
                                                        value={formData.SelectStatus}
                                                        onChange={handleChange}
                                                        invalid={!!errors.SelectStatus} >
                                                        <option value="">Select Status</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" type="submit">Submit</Button>
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

export default AddAttendance;
