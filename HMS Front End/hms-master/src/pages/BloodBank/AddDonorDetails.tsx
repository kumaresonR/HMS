import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, Row, Spinner } from 'reactstrap'
import ErrorHandler from '../../helpers/ErrorHandler';
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import { bloodGroupDetails, genderData } from '../../common/data/FakeData';

const AddDonorDetails = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();

    const [donorName, setDonorName] = useState('');
    const [donorNameValidationError, setDonorNameValidationError] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBirthValidationError, setDateOfBirthValidationError] = useState(false);
    const [bloodGroup, setBloodGroup] = useState('');
    const [bloodGroupValidationError, setBloodGroupValidationError] = useState(false);
    const [gender, setGender] = useState('');
    const [genderValidationError, setGenderValidationError] = useState(false);
    const [fatherName, setFatherName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [contactNoValidationError, setContactNoValidationError] = useState("");
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddress = (value: any) => {
        setAddress(value);
    }

    const handleFatherName = (value: any) => {
        setFatherName(value);
    }

    const handleContactNo = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setContactNo(phoneValue);
        if (phoneValue.length !== 10) {
            setContactNoValidationError("Contact No must be exactly 10 digits.");
        } else {
            setContactNoValidationError("");
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateDonorlist();
        }
    }
    const doCreateDonorlist = async () => {
        try {
            let payload: any = {
                donorName: donorName,
                dateOfBirth: dateOfBirth,
                bloodGroup: bloodGroup,
                gender: gender,
                fatherName: fatherName,
                contactNo: contactNo,
                address: address
            }
            await bloodBankApiService.createDonor(payload);
            toast.success('Donor Created Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            console.log("Donor Created Failed", error);
            return ErrorHandler(error)
        }
    }

    function handleDonorNameChange(value: any): void {
        setDonorName(value);
        setDonorNameValidationError(false);
    }


    function handleDateOfBirthChange(value: any): void {
        setDateOfBirth(value);
        setDateOfBirthValidationError(false);
    }


    const validateForm = () => {
        let isFormValid = true;

        if (!donorName) {
            setDonorNameValidationError(true);
            isFormValid = false;
        }

        if (!dateOfBirth) {
            setDateOfBirthValidationError(true);
            isFormValid = false;
        }
        if (!bloodGroup) {
            setBloodGroupValidationError(true);
            isFormValid = false;
        }
        if (!gender) {
            setGenderValidationError(true);
            isFormValid = false;
        }

        if (contactNo && !/^[0-9]{10}$/.test(contactNo)) {
            setContactNoValidationError("Contact No must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setContactNoValidationError("");
        }

        return isFormValid;
    };

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Donor Name <span className="text-danger">*</span></label>
                                        <Input
                                            id="donorName"
                                            name="donorName"
                                            type="text"
                                            value={donorName}
                                            className={`${donorNameValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleDonorNameChange(e.target.value)}
                                        />
                                        {donorNameValidationError && <div className="invalid-feedback">Donor Name Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Date Of Birth<span className="text-danger">*</span></label>
                                        <Input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            value={dateOfBirth}
                                            className={`${dateOfBirthValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleDateOfBirthChange(e.target.value)}
                                        />
                                        {dateOfBirthValidationError && <div className="invalid-feedback">Date Of Birth Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Blood Group <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${bloodGroupValidationError ? 'is-invalid' : ''}`}
                                            value={bloodGroup}
                                            onChange={(e) => { setBloodGroup(e.target.value) }}
                                        >
                                            <option value="">--Select--</option>
                                            {bloodGroupDetails.map((data, idx) => (
                                                <option key={idx} value={data.type}>{data.type}</option>
                                            ))}
                                        </select>
                                        {bloodGroupValidationError && <div className="invalid-feedback">Blood Group Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Gender <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${genderValidationError ? 'is-invalid' : ''}`}
                                            value={gender}
                                            onChange={(e) => { setGender(e.target.value) }}
                                        >
                                            <option value="">--Select--</option>
                                            {genderData.map((data, idx) => (
                                                <option key={idx} value={data.name}>{data.name}</option>
                                            ))}
                                        </select>
                                        {genderValidationError && <div className="invalid-feedback">Gender Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Father Name</label>
                                        <Input
                                            id="fatherName"
                                            name="fatherName"
                                            type="text"
                                            value={fatherName}
                                            onChange={e => handleFatherName(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col sm={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Contact No</label>
                                        <Input
                                            id="contactNo"
                                            name="contactNo"
                                            type="text"
                                            value={contactNo}
                                            maxLength={10}
                                            onChange={e => handleContactNo(e.target.value)}
                                            invalid={!!contactNoValidationError}
                                        />
                                        {contactNoValidationError && <div className="invalid-feedback">{contactNoValidationError}</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Address</label>
                                        <textarea className='form-control'
                                            id="address"
                                            name="address"
                                            value={address}
                                            onChange={e => handleAddress(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col className="text-end">
                                    {/* <Button
                                        size="sm"
                                        color="primary"
                                        className="btn btn-primary ms-3" type="submit">Save</Button> */}
                                        <Button color='primary' disabled={loading}>
                                            {loading ? <Spinner size='sm' className='me-2'/> : 'Save' }
                                        </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddDonorDetails