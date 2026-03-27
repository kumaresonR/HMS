import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, FormText, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';

interface FormData {
    name: string;
    guardianName: string;
    gender: string;
    dateOfBirth: string;
    bloodGroup: string;
    maritalStatus: string;
    patientPhoto: File | null;
    phone: string;
    email: string;
    address: string;
    remarks: string;
    knownAllergies: string;
    tpa: string;
    tpaId: string;
    tpaValidity: string;
    nationalId: string;
    alternateNumber: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const AddPatient: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        guardianName: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        maritalStatus: '',
        patientPhoto: null,
        phone: '',
        email: '',
        address: '',
        remarks: '',
        knownAllergies: '',
        tpa: '',
        tpaId: '',
        tpaValidity: '',
        nationalId: '',
        alternateNumber: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.name) newErrors.name = 'Name is required';
        if (!data.guardianName) newErrors.guardianName = 'Guardian Name is required';
        if (!data.gender) newErrors.gender = 'Gender is required';
        if (!data.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!data.phone) newErrors.phone = 'Phone is required';
        if (!data.email) newErrors.email = 'Email is required';
        if (!data.address) newErrors.address = 'Address is required';
        if (!data.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
        if (!data.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
        if (!data.tpa) newErrors.tpa = 'TPA is required';
        if (!data.tpaId) newErrors.tpaId = 'TPA ID is required';
        if (!data.tpaValidity) newErrors.tpaValidity = 'TPA Validity is required';
        if (!data.nationalId) newErrors.nationalId = 'National ID is required';
        if (!data.alternateNumber) newErrors.alternateNumber = 'Alternate Number is required';

        // Validate Patient Photo
        if (data.patientPhoto && data.patientPhoto.size > 2 * 1024 * 1024) {
            newErrors.patientPhoto = 'File size must be less than 2MB';
        } else if (!data.patientPhoto) {
            newErrors.patientPhoto = 'Patient Photo is required';
        }

        // Validate Remarks
        if (data.remarks && data.remarks.length < 10) {
            newErrors.remarks = 'Remarks must be at least 10 characters long';
        } else if (!data.remarks) {
            newErrors.remarks = 'Remarks are required';
        }

        // Validate Known Allergies
        if (data.knownAllergies && data.knownAllergies.length < 10) {
            newErrors.knownAllergies = 'Known Allergies must be at least 10 characters long';
        } else if (!data.knownAllergies) {
            newErrors.knownAllergies = 'Known Allergies are required';
        }

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData(prevData => ({ ...prevData, patientPhoto: file }));
            setErrors(prevErrors => ({
                ...prevErrors,
                patientPhoto: file.size > 2 * 1024 * 1024 ? 'File size must be less than 2MB' : undefined,
            }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, patientPhoto: 'Patient Photo is required' }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = new FormData();
            for (const key in formData) {
                if (formData[key as keyof FormData] instanceof File) {
                    data.append(key, formData[key as keyof FormData] as Blob);
                } else {
                    data.append(key, formData[key as keyof FormData] as string);
                }
            }

            try {
                const response = await fetch("http://localhost:8087/patient/add", {
                    method: "POST",
                    body: data,
                });

                const responseText = await response.text();
                if (response.ok) {
                    alert("Patient added successfully!");
                    setFormData({
                        name: '',
                        guardianName: '',
                        gender: '',
                        dateOfBirth: '',
                        bloodGroup: '',
                        maritalStatus: '',
                        patientPhoto: null,
                        phone: '',
                        email: '',
                        address: '',
                        remarks: '',
                        knownAllergies: '',
                        tpa: '',
                        tpaId: '',
                        tpaValidity: '',
                        nationalId: '',
                        alternateNumber: '',
                    });
                    setErrors({});
                } else {
                    alert("Error adding patient: " + responseText);
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
                    <FormHeader title="Add Patient" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>


                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Name</Label>
                                                    <Input type="text" id="name" value={formData.name} onChange={handleChange} invalid={!!errors.name} />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="guardianName">Guardian Name</Label>
                                                    <Input type="text" id="guardianName" value={formData.guardianName} onChange={handleChange} invalid={!!errors.guardianName} />
                                                    {errors.guardianName && <div className="invalid-feedback">{errors.guardianName}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="gender">Gender</Label>
                                                    <Input type="select" id="gender" value={formData.gender} onChange={handleChange} invalid={!!errors.gender}>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </Input>
                                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="dateOfBirth">Date of Birth</Label>
                                                    <Input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} invalid={!!errors.dateOfBirth} />
                                                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="bloodGroup">Blood Group</Label>
                                                    <Input type="select" id="bloodGroup" value={formData.bloodGroup} onChange={handleChange} invalid={!!errors.bloodGroup}>
                                                        <option value="">Select Blood Group</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                    </Input>
                                                    {errors.bloodGroup && <div className="invalid-feedback">{errors.bloodGroup}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="maritalStatus">Marital Status</Label>
                                                    <Input type="select" id="maritalStatus" value={formData.maritalStatus} onChange={handleChange} invalid={!!errors.maritalStatus}>
                                                        <option value="">Select Marital Status</option>
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                        <option value="Divorced">Divorced</option>
                                                        <option value="Widowed">Widowed</option>
                                                    </Input>
                                                    {errors.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="patientPhoto">Patient Photo</Label>
                                                    <Input type="file" id="patientPhoto" accept="image/*" onChange={handleFileChange} invalid={!!errors.patientPhoto} />
                                                    {errors.patientPhoto && <div className="invalid-feedback">{errors.patientPhoto}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="phone">Phone</Label>
                                                    <Input type="text" id="phone" value={formData.phone} onChange={handleChange} invalid={!!errors.phone} />
                                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="email">Email</Label>
                                                    <Input type="email" id="email" value={formData.email} onChange={handleChange} invalid={!!errors.email} />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="address">Address</Label>
                                                    <Input type="text" id="address" value={formData.address} onChange={handleChange} invalid={!!errors.address} />
                                                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="remarks">Remarks</Label>
                                                    <Input type="textarea" id="remarks" value={formData.remarks} onChange={handleChange} invalid={!!errors.remarks} />
                                                    {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="knownAllergies">Known Allergies</Label>
                                                    <Input type="textarea" id="knownAllergies" value={formData.knownAllergies} onChange={handleChange} invalid={!!errors.knownAllergies} />
                                                    {errors.knownAllergies && <div className="invalid-feedback">{errors.knownAllergies}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="tpa">TPA</Label>
                                                    <Input type="text" id="tpa" value={formData.tpa} onChange={handleChange} invalid={!!errors.tpa} />
                                                    {errors.tpa && <div className="invalid-feedback">{errors.tpa}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="tpaId">TPA ID</Label>
                                                    <Input type="text" id="tpaId" value={formData.tpaId} onChange={handleChange} invalid={!!errors.tpaId} />
                                                    {errors.tpaId && <div className="invalid-feedback">{errors.tpaId}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="tpaValidity">TPA Validity</Label>
                                                    <Input type="date" id="tpaValidity" value={formData.tpaValidity} onChange={handleChange} invalid={!!errors.tpaValidity} />
                                                    {errors.tpaValidity && <div className="invalid-feedback">{errors.tpaValidity}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="nationalId">National ID</Label>
                                                    <Input type="text" id="nationalId" value={formData.nationalId} onChange={handleChange} invalid={!!errors.nationalId} />
                                                    {errors.nationalId && <div className="invalid-feedback">{errors.nationalId}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="alternateNumber">Alternate Number</Label>
                                                    <Input type="text" id="alternateNumber" value={formData.alternateNumber} onChange={handleChange} invalid={!!errors.alternateNumber} />
                                                    {errors.alternateNumber && <div className="invalid-feedback">{errors.alternateNumber}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" type="submit">Add Patient</Button>
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

export default AddPatient;
