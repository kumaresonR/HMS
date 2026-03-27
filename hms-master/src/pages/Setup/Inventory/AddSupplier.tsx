import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { toast } from 'react-toastify';
import ErrorHandler from '../../../helpers/ErrorHandler';

const AddSupplier = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState('');
    const [email, setEmail] = useState('');
    const [emailValidationError, setEmailValidationError] = useState('');
    const [contactPersonName,setContactPersonName] = useState('');
    const [address,setAddress] = useState('');
    const [contactPersonEmail, setContactPersonEmail] = useState('');
    const [contactPersonEmailValidationError, setContactPersonEmailValidationError] = useState('');
    const [contactPersonPhone, setContactPersonPhone] = useState('');
    const [contactPersonPhoneValidationError, setContactPersonPhoneValidationError] = useState('');
    const [description,setDescription] = useState('');
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleNameChange = (value:any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handlePhoneChange = (value: any) => {
        if (/^\d*$/.test(value) && value.length <= 10) {
            setPhone(value);

            if (value.length === 10 || value === '') {
                setPhoneValidationError('');
            } else if (value.length < 10) {
                setPhoneValidationError('Phone number must be exactly 10 digits.');
            }
        }
    };

    const handleEmailChange = (value: any) => {
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailValidationError("Invalid email format");
        } else {
            setEmailValidationError("");
        }
    }

    const handleContactPersonPhoneChange = (value: any) => {
        if (/^\d*$/.test(value) && value.length <= 10) {
            setContactPersonPhone(value);

            if (value.length === 10 || value === '') {
                setContactPersonPhoneValidationError('');
            } else if (value.length < 10) {
                setContactPersonPhoneValidationError('Phone number must be exactly 10 digits.');
            }
        }
    };

    const handleContactPersonEmailChange = (value: any) => {
        setContactPersonEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setContactPersonEmailValidationError("Invalid email format");
        } else {
            setContactPersonEmailValidationError("");
        }
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (phone && phone.length !== 10) {
            setPhoneValidationError('Phone number must be exactly 10 digits.');
            isFormValid = false;
        } else {
            setPhoneValidationError('');
        }

        if (email && email.length !== 10) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailValidationError("Invalid email format");
                isFormValid = false;
            } else {
                setEmailValidationError("");
            }
        }

        if (contactPersonPhone && contactPersonPhone.length !== 10) {
            setContactPersonPhoneValidationError('Contact Person Phone number must be exactly 10 digits.');
            isFormValid = false;
        } else {
            setContactPersonPhoneValidationError('');
        }

        if (contactPersonEmail && contactPersonEmail.length !== 10) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactPersonEmail)) {
                setContactPersonEmailValidationError("Invalid email format");
                isFormValid = false;
            } else {
                setContactPersonEmailValidationError("");
            }
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
            addItemSupplier();
        }
    }

    const addItemSupplier = async () => {
        try {
            const payload = [{
                name: name,
                phone: phone,
                email: email,
                contactPersonName: contactPersonName || 'NA',
                address: address || 'NA',
                contactPersonPhone: contactPersonPhone,
                contactPersonEmail: contactPersonEmail,
                description: description || 'NA',
                // modNo : modNo
            }]
            await setupApiService.createItemSupplier(payload);
            toast.success('Supplier Details Added Successfully', { containerId: 'TR' });
            navigate('/main/InventoryMainSetup')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Item Supplier" pageTitle="Setup" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Item Supplier </h5>

                                                <Link to="/main/InventoryMainSetup" className="text-end">
                                                    <Button
                                                        color="primary"
                                                        className="btn btn-primary add-btn"
                                                    >
                                                        <IoArrowBack /> Back
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div>
                                                <h4 className="pagetitleh2 mb-4"></h4>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="around10">
                                                        <Input type="hidden" name="ci_csrf_token" defaultValue="" />
                                                        <div className="row">
                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="name"> Name </label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="name"
                                                                        name="name"
                                                                        type="text"
                                                                        value={name}
                                                                        onChange={e => handleNameChange(e.target.value)}
                                                                        invalid={!!nameValidationError}
                                                                    />
                                                                    {nameValidationError && <span className="text-danger"> Name Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="phone">Phone</label>
                                                                    <Input
                                                                        id="phone"
                                                                        name="phone"
                                                                        type="text"
                                                                        value={phone}
                                                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                                                        invalid={!!phoneValidationError}
                                                                    />
                                                                    {phoneValidationError && (
                                                                        <span className="text-danger">{phoneValidationError}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="email">Email</label>
                                                                    <Input
                                                                        id="email"
                                                                        name="email"
                                                                        type="email"
                                                                        className={`form-control ${emailValidationError ? "is-invalid" : ""}`}
                                                                        value={email}
                                                                        onChange={e => handleEmailChange(e.target.value)}
                                                                    />
                                                                    {emailValidationError && <span className="text-danger">{emailValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="contactPersonName">Contact Person Name</label>
                                                                    <Input
                                                                        id="contactPersonName"
                                                                        name="contactPersonName"
                                                                        type="text"
                                                                        value={contactPersonName}
                                                                        onChange={e => setContactPersonName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="address">Address</label>
                                                                    <textarea
                                                                        id="address"
                                                                        name="address"
                                                                        className="form-control"
                                                                        value={address}
                                                                        onChange={e => setAddress(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="contactPersonPhone">Contact Person Phone</label>
                                                                    <Input
                                                                        id="contactPersonPhone"
                                                                        name="contactPersonPhone"
                                                                        type="text"
                                                                        value={contactPersonPhone}
                                                                        onChange={(e) => handleContactPersonPhoneChange(e.target.value)}
                                                                        invalid={!!contactPersonPhoneValidationError}
                                                                    />
                                                                    {contactPersonPhoneValidationError && (
                                                                        <span className="text-danger">{contactPersonPhoneValidationError}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="contactPersonEmail">Contact Person Email</label>
                                                                    <Input
                                                                        id="contactPersonEmail"
                                                                        name="contactPersonEmail"
                                                                        type="email"
                                                                        className={`form-control ${contactPersonEmailValidationError ? "is-invalid" : ""}`}
                                                                        value={contactPersonEmail}
                                                                        onChange={e => handleContactPersonEmailChange(e.target.value)}
                                                                    />
                                                                    {contactPersonEmailValidationError && <span className="text-danger">{contactPersonEmailValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="description">Description</label>
                                                                    <textarea
                                                                        id="description"
                                                                        name="description"
                                                                        className="form-control"
                                                                        value={description}
                                                                        onChange={e => setDescription(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="modNo">Mod No <span className='text-danger'> * </span></label>
                                                                    <Input
                                                                        id="modNo"
                                                                        name="modNo"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={modNo}
                                                                        onChange={e => handleModNoChange(e.target.value)}
                                                                        invalid={!!modNoValidationError}
                                                                    />
                                                                    {modNoValidationError && <div className="invalid-feedback">Mod No Required</div>}
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                    <Button color="primary" type="submit" >
                                                        Submit
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default AddSupplier