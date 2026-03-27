import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddSupplier = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [supplierName, setSupplierName] = useState('');
    const [supplierNameValidationError, setSupplierNameValidationError] = useState(false);
    const [supplierContact, setSupplierContact] = useState('');
    const [supplierContactValidationError, setSupplierContactValidationError] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [contactPersonPhone, setContactPersonPhone] = useState('');
    const [contactPersonNoValidationError, setContactPersonNoValidationError] = useState('');
    const [drugLicenseNumber, setDrugLicenseNumber] = useState('');
    const [address, setAddress] = useState('');
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleSupplierNameChange = (value: any) => {
        setSupplierName(value);
        setSupplierNameValidationError(false);
    }

    const handleSupplierContactChange = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setSupplierContact(phoneValue);
        if (phoneValue.length !== 10) {
            setSupplierContactValidationError("Supplier Contact must be exactly 10 digits.");
        } else {
            setSupplierContactValidationError("");
        }
    }

    const handleContactPersonNumberChange = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setContactPersonPhone(phoneValue);
        if (phoneValue.length !== 10) {
            setContactPersonNoValidationError("Contact Person Phone must be exactly 10 digits.");
        } else {
            setContactPersonNoValidationError("");
        }
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!supplierName) {
            setSupplierNameValidationError(true);
            isFormValid = false;
        }

        if (!supplierContact) {
            setSupplierContactValidationError('Supplier Contact Required');
            isFormValid = false;
        } else {
            if (supplierContact && !/^[0-9]{10}$/.test(supplierContact)) {
                setSupplierContactValidationError("Supplier Contact must be exactly 10 digits.");
                isFormValid = false;
            } else {
                setSupplierContactValidationError("");
            }
        }

        if (contactPersonPhone && !/^[0-9]{10}$/.test(contactPersonPhone)) {
            setContactPersonNoValidationError("Contact Person Phone must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setContactPersonNoValidationError("");
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createSupplier();
        }
    }
    const createSupplier = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                supplierName: supplierName,
                supplierContact: supplierContact,
                contactPersonName: contactPersonName,
                contactPersonPhone: contactPersonPhone,
                drugLicenceNumber: drugLicenseNumber,
                address: address
            }
            await setupApiService.createSupplier(payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Supplier Details Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Supplier" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <div className='text-end'>
                                <Button
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-primary add-btn mx-2"
                                >
                                    <IoArrowBack /> Back
                                </Button>
                            </div>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="supplierName">Supplier Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="supplierName"
                                                        value={supplierName}
                                                        onChange={e => handleSupplierNameChange(e.target.value)}
                                                        invalid={!!supplierNameValidationError}
                                                    />
                                                    {supplierNameValidationError && (
                                                        <div className="invalid-feedback">Supplier Name Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="supplierContact">Supplier Contact <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        maxLength={10}
                                                        id="supplierContact"
                                                        value={supplierContact}
                                                        onChange={e => handleSupplierContactChange(e.target.value)}
                                                        invalid={!!supplierContactValidationError}
                                                    />
                                                    {supplierContactValidationError && (
                                                        <div className="invalid-feedback">{supplierContactValidationError}</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="contactPersonName">Contact Person Name</Label>
                                                    <Input
                                                        type="text"
                                                        id="contactPersonName"
                                                        value={contactPersonName}
                                                        onChange={e => setContactPersonName(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="contactPersonPhone">Contact Person Phone</Label>
                                                    <Input
                                                        type="text"
                                                        id="contactPersonPhone"
                                                        value={contactPersonPhone}
                                                        onChange={e => handleContactPersonNumberChange(e.target.value)}
                                                        maxLength={10}
                                                        invalid={!!contactPersonNoValidationError}
                                                    />
                                                    {contactPersonNoValidationError && <div className="invalid-feedback">{contactPersonNoValidationError}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="drugLicenseNumber">Drug License Number</Label>
                                                    <Input
                                                        type="text"
                                                        id="drugLicenseNumber"
                                                        value={drugLicenseNumber}
                                                        onChange={e => setDrugLicenseNumber(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="address">Address</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="address"
                                                        value={address}
                                                        onChange={e => setAddress(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            {/* <Col>
                                                <FormGroup>
                                                    <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={modNo}
                                                        onChange={e => handleModNoChange(e.target.value)}
                                                        invalid={!!modNoValidationError}
                                                    />
                                                    {modNoValidationError && (
                                                        <div className="invalid-feedback">Version Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col> */}
                                        </Row>
                                        <Button type="submit" color="primary">
                                            Submit
                                        </Button>
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

export default AddSupplier;
