
import { Container, Row, Col, Card, CardBody, FormGroup, Input, Button, Form, CardHeader, Spinner } from "reactstrap"
import FormHeader from "../../common/FormHeader/FormHeader"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"
import PatientApiService from "../../helpers/services/patient/patient-api-service"
import PhoneInput from 'react-phone-number-input'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import React from "react"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import ErrorHandler from "../../helpers/ErrorHandler"
import { bloodGroupDetails } from "../../common/data/FakeData"
import TpaApiService from "../../helpers/services/tpa/tpa-api-service"
import { IoArrowBack } from "react-icons/io5"
import { minimizePage } from "../../slices/pageResizer/uiSlice"
import { useDispatch } from "react-redux"

const genderData = [
    {
        name: "Male",
    },
    {
        name: "Female",
    },
    {
        name: "Other",
    },
]

const NationalIdentificationData = [
    {
        name: "Aadhaar card",
        code: "aadhaarCard"
    },
    {
        name: "PAN card",
        code: "PANcard"
    }
]
const EditPatient = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    const tpaApiService: TpaApiService = new TpaApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();
    const { state } = location;
    const id = state?.id || location?.state?.id;
    const patientId = state?.patientId || location?.state?.patientId;
    const [firstName, setFirstName] = useState('');
    const [firstNameValidationError, setFirstNameValidationError] = useState(false);
    const [lastName, setLastName] = useState('');
    const [lastNameValidationError, setLastNameValidationError] = useState(false);
    const [dob, setDob] = useState('');
    const [dobValidationError, setDobValidationError] = useState(false);
    const [gender, setGender] = useState('');
    const [genderValidationError, setGenderValidationError] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<any>('');
    const [phoneNumberValidationError, setPhoneNumberValidationError] = useState('');
    const [email, setEmail] = useState('');
    const [emailValidationError, setEmailValidationError] = useState('');
    const [address, setAddress] = useState('');
    const [addressValidationError, setAddressValidationError] = useState(false);
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [insuranceId, setInsuranceId] = useState('');
    const [insuranceData, setInsuranceData] = useState<any>([]);
    const [tpaId, setTPAId] = useState('');
    const [tpaValidity, setTPAValidity] = useState('');
    const [pincode, setPincode] = useState('');
    const [pincodeValidationError, setPincodeValidationError] = useState(false);
    const [country, setCountry] = useState('');
    const [countryValidationError, setCountryValidationError] = useState(false);
    const [region, setRegion] = useState('');
    const [stateValidationError, setStateValidationError] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
    const [nationalIdType, setNationalIdType] = useState('');
    const [nationalIdNumber, setNationalIdNumber] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const data = { firstName, lastName, dob, gender, phoneNumber, email, id, address, pincode, region, bloodType, allergies, insuranceId, country, emergencyContacts, nationalIdType, nationalIdNumber, age, patientId }
    const handleFirstNameChange = (value: any) => {
        setFirstName(value);
        setFirstNameValidationError(false);
    };

    const handleLastNameChange = (value: any) => {
        setLastName(value);
        setLastNameValidationError(false);
    }

    const handleInsuranceChange = (id: any) => {
        setInsuranceId(id);
    };

    const handleGenderChange = (id: any) => {
        setGender(id);
        setGenderValidationError(false);
    }

    const handleDobChange = (value: any) => {
        setDob(value);
        setDobValidationError(false);
        if (value) {
            const calculatedAge: any = calculateAge(value);
            setAge(calculatedAge);
        } else {
            setAge("");
        }
    }

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust for negative month or day differences
        if (months < 0) {
            months += 12;
            years--;
        }

        if (days < 0) {
            const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0); // last day of previous month
            days += previousMonth.getDate();
            months--;
        }

        return `${years} Years ${months} Months ${days} Days`;
    };

    const handlePhoneNumberChange = (value: any | undefined) => {
        if (!value) {
            setPhoneNumber('');
            setPhoneNumberValidationError('Phone number is required');
            return;
        }

        const countryCodeRegex = /^\+\d+/; // Match the country code
        const countryCodeMatch = value.match(countryCodeRegex);
        const countryCode = countryCodeMatch ? countryCodeMatch[0] : '';

        // Remove the country code and keep only the remaining digits
        const phoneNumberWithoutCode = value.replace(countryCode, '').replace(/\D/g, '');

        // Limit the phone number to 12 digits (country code + 10 digits)
        if (phoneNumberWithoutCode.length > 10) {
            const trimmedPhoneNumber = phoneNumberWithoutCode.substring(0, 10);
            setPhoneNumber(`${countryCode}${trimmedPhoneNumber}`);
        } else {
            setPhoneNumber(value);
        }

        // Set validation error message based on phone number length
        if (!value.replace(/\D/g, '')) {
            setPhoneNumberValidationError('Phone number is required');
        } else if (value.replace(/\D/g, '').length !== 12) {
            setPhoneNumberValidationError('Enter a valid phone number with the correct length');
        } else {
            setPhoneNumberValidationError('');
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

    const handAddressChange = (value: any) => {
        setAddress(value);
        setAddressValidationError(false);
    }

    const handlePincodeChange = (value: any) => {
        setPincode(value);
        setPincodeValidationError(false);
    }

    const handCountryChange = (value: any) => {
        setCountry(value);
        setCountryValidationError(false);
    }

    const handleStateChange = (value: any) => {
        setRegion(value);
        setStateValidationError(false);
    }

    const addEmergencyContact = () => {
        setEmergencyContacts([...emergencyContacts, { contactName: '', relationShip: '', contactNumber: '' }]);
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const newEmergencyContacts = [...emergencyContacts];
        newEmergencyContacts[index] = {
            ...newEmergencyContacts[index],
            [field]: value,
        };
        setEmergencyContacts(newEmergencyContacts);
    };

    const removeEmergencyContact = (index: any) => {
        const newEmergencyContacts = [...emergencyContacts];
        newEmergencyContacts.splice(index, 1);
        setEmergencyContacts(newEmergencyContacts);
    };

    const getPatientDataById = async () => {
        try {
            let data = await patientApiService.getPatientById(patientId);
            setData(data);
            console.log('getPatientDataById data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: any) => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dateOfBirth || data.dob);
        setGender(data.gender);
        setPhoneNumber(data.contactNumber || data.phoneNumber);
        setEmail(data.email);
        setAddress(data.address);
        setPincode(data.pinCode || data.pincode);
        setRegion(data.state || data.region);
        setCountry(data.nationality || data.country);
        setBloodType(data.bloodType);
        setAllergies(data.allergies);
        if (data.insuranceProviders || data.insuranceId) {
            setInsuranceId(data.insuranceProviders.insuranceId || data.insuranceId);
        }
        setNationalIdType(data.idProof || data.nationalIdType);
        setNationalIdNumber(data.idNumber || data.nationalIdNumber);
        if (data.emergencyContacts) {
            setEmergencyContacts(data.emergencyContacts)
        }
        setAge(data.age);
    }

    const fetchInsuranceData = async () => {
        try {
            let res: any = await tpaApiService.getAllTpa();
            setInsuranceData(res);
        } catch (error: any) {
            console.log("Insurance Data error");
            return ErrorHandler(error)
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!firstName) {
            setFirstNameValidationError(true);
            isFormValid = false;
        }

        if (!lastName) {
            setLastNameValidationError(true);
            isFormValid = false;
        }

        if (!dob) {
            setDobValidationError(true);
            isFormValid = false;
        }

        if (!gender) {
            setGenderValidationError(true);
            isFormValid = false;
        }

        if (!phoneNumber) {
            setPhoneNumberValidationError('Phone number is required');
            isFormValid = false;
        }

        // Check if the phone number length is exactly 13 (12 digits for the number + 1 for the country code)
        else if (phoneNumber.replace(/\D/g, '').length !== 12) {
            setPhoneNumberValidationError('Enter a valid phone number with the correct length');
            isFormValid = false;
        } else {
            setPhoneNumberValidationError('');
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailValidationError("Invalid email format");
            isFormValid = false;
        } else {
            setEmailValidationError("");
        }

        if (!address) {
            setAddressValidationError(true);
            isFormValid = false;
        }

        if (!pincode) {
            setPincodeValidationError(true);
            isFormValid = false;
        }

        if (!country) {
            setCountryValidationError(true);
            isFormValid = false;
        }

        if (!region) {
            setStateValidationError(true);
            isFormValid = false;
        }
        return isFormValid;
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doUpdate();
        }
    };

    const doUpdate = async () => {
        setLoading(true);
        try {
            let payload: any = {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dob,
                gender: gender,
                contactNumber: phoneNumber,
                email: email,
                address: address,
                pinCode: pincode,
                state: region,
                bloodType: bloodType,
                allergies: allergies,
                insuranceProviders: {
                    insuranceId: insuranceId || null,
                },
                nationality: country,
                emergencyContacts: emergencyContacts,
                idProof: nationalIdType,
                idNumber: nationalIdNumber,
                age: age
            }
            await patientApiService.editPatient(id, payload);
            toast.success('Patient Record Updated Successfully', { containerId: 'TR' });
            navigate('/main/patient-datatable');
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInsuranceData();
        if (location?.state && Object.keys(location?.state).length > 2) {
            setData(location?.state);
        } else {
            getPatientDataById();
        }
    }, [location?.state]);

    return <>
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Edit Patient"
                    pageTitle="Patient"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Edit Patient",
                        data
                    }))} />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody className="card-body">
                                <div className='text-end'>
                                    <Button
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                        className="btn btn-primary add-btn mx-2"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </div>
                                <Row>
                                    <Col >
                                        <Form onSubmit={handleSubmit}>
                                            <Row className="justify-content-around">
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">First Name <span className="text-danger">*</span></label>
                                                        <Input
                                                            id="firstName"
                                                            name="firstName"
                                                            type="text"
                                                            value={firstName}
                                                            className={`input  ${firstNameValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handleFirstNameChange(e.target.value)}
                                                        />
                                                        {firstNameValidationError && <div className="invalid-feedback">First Name Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Last Name <span className="text-danger">*</span></label>
                                                        <Input
                                                            id="lastName"
                                                            name="lastName"
                                                            type="text"
                                                            value={lastName}
                                                            className={`input  ${lastNameValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handleLastNameChange(e.target.value)}
                                                        />
                                                        {lastNameValidationError && <div className="invalid-feedback">Last Name Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Date Of Birth <span className="text-danger">*</span></label>
                                                        <Input
                                                            id="dateOfBirth"
                                                            name="dateOfBirth"
                                                            type="date"
                                                            value={dob}
                                                            className={`input  ${dobValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handleDobChange(e.target.value)}
                                                        />
                                                        {dobValidationError && <div className="invalid-feedback">Date Of Birth Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Age</label>
                                                        <Input
                                                            id="age"
                                                            name="age"
                                                            value={age}
                                                            readOnly
                                                            onChange={e => setAge(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Gender <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-control  ${genderValidationError ? 'is-invalid' : ''}`}
                                                            value={gender} onChange={(e) => { handleGenderChange(e.target.value) }}
                                                        >
                                                            <option value="">--Select Gender--</option>
                                                            {genderData.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.name}>{data.name}</option>
                                                            ))}
                                                        </select>
                                                        {genderValidationError && <div className="invalid-feedback">Gender Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">
                                                            Contact Number <span className="text-danger">*</span>
                                                        </label>
                                                        <PhoneInput
                                                            id="contactNumber"
                                                            name="contactNumber"
                                                            placeholder="Enter phone number"
                                                            value={phoneNumber}
                                                            defaultCountry="IN"
                                                            className={`input ${phoneNumberValidationError ? 'is-invalid' : ''}`}
                                                            onChange={handlePhoneNumberChange} />
                                                        {phoneNumberValidationError && (
                                                            <div className="invalid-feedback">
                                                                {phoneNumberValidationError}
                                                            </div>
                                                        )}
                                                    </FormGroup>

                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Email</label>
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={e => handleEmailChange(e.target.value)}
                                                            invalid={!!emailValidationError}
                                                        />
                                                        {emailValidationError && <span className="text-danger">{emailValidationError}</span>}
                                                    </FormGroup>
                                                </Col>

                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Blood Group</label>
                                                        <select
                                                            className={`form-control`}
                                                            value={bloodType}
                                                            onChange={(e) => { setBloodType(e.target.value) }}
                                                        >
                                                            <option value="">--Select--</option>
                                                            {bloodGroupDetails.map((data, idx) => (
                                                                <option key={idx} value={data.type}>{data.type}</option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <div className="country-list row justify-content-around" >
                                                <Col md={4}>
                                                    <FormGroup className={`input  ${countryValidationError ? 'is-invalid' : ''}`}>
                                                        <label className="text-start mb-2">Country <span className="text-danger">*</span></label>
                                                        <CountryDropdown value={country} onChange={(val) => handCountryChange(val)} />
                                                    </FormGroup>
                                                    {countryValidationError && <div className="invalid-feedback">Country Required.</div>}
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup className={`input  ${stateValidationError ? 'is-invalid' : ''}`}>
                                                        <label className="text-start mb-2">State <span className="text-danger">*</span></label>
                                                        <RegionDropdown country={country} value={region} onChange={(val) => handleStateChange(val)} />
                                                    </FormGroup>
                                                    {stateValidationError && <div className="invalid-feedback">State Required.</div>}
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Pincode <span className="text-danger">*</span></label>
                                                        <Input
                                                            id="pincode"
                                                            name="pincode"
                                                            type="number"
                                                            value={pincode}
                                                            className={`input  ${pincodeValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handlePincodeChange(e.target.value)}
                                                        />
                                                        {pincodeValidationError && <div className="invalid-feedback">Pincode Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                            </div>
                                            <Row className="justify-content-around">

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label>National Identification</label>
                                                        <select className="form-control" value={nationalIdType}
                                                            onChange={(e) => { setNationalIdType(e.target.value) }} >
                                                            <option value="">--Select Id Type--</option>
                                                            {NationalIdentificationData.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.name}>{data.name}</option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">National Identification Number</label>
                                                        <Input
                                                            id="nationalIdentificationNumber"
                                                            name="nationalIdentificationNumber"
                                                            type="text"
                                                            value={nationalIdNumber}
                                                            onChange={e => setNationalIdNumber(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Insurance </label>
                                                        <select className="form-control" value={insuranceId}
                                                            onChange={(e) => { handleInsuranceChange(e.target.value) }} >
                                                            <option value="">--Select Insurance--</option>
                                                            {insuranceData.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.id}>{data.tpaName}</option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">TPA ID</label>
                                                        <Input
                                                            id="TPAID"
                                                            name="tpaId"
                                                            value={tpaId}
                                                            onChange={e => setTPAId(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">TPA Validity</label>
                                                        <Input
                                                            id="tpaValidity"
                                                            name="tpaValidity"
                                                            type="date"
                                                            value={tpaValidity}
                                                            onChange={e => setTPAValidity(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col> */}
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Address <span className="text-danger">*</span></label>
                                                        <textarea
                                                            id="address"
                                                            name="address"
                                                            rows={3}
                                                            value={address}
                                                            className={`form-control  ${addressValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handAddressChange(e.target.value)}
                                                        />
                                                        {addressValidationError && <div className="invalid-feedback">Address Required.</div>}
                                                    </FormGroup>
                                                </Col>


                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Allergies</label>
                                                        <textarea className="form-control"
                                                            id="allergies"
                                                            name="allergies"
                                                            rows={3}
                                                            value={allergies}
                                                            onChange={e => setAllergies(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <CardHeader className="border-0">
                                                <Row className="  align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h4 className="card-title mb-3">Emergency Contacts</h4>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Button onClick={addEmergencyContact} className="mx-3" color="primary"><FontAwesomeIcon icon={faCirclePlus} />
                                                                &nbsp;Add New</Button>

                                                        </div>
                                                    </div>

                                                    {emergencyContacts.map((emergencyContact: any, index: any) => (
                                                        <Row key={index} className="align-items-center">
                                                            <Col md >
                                                                <FormGroup>
                                                                    <label className="text-start mb-2">Name</label>
                                                                    <Input
                                                                        id="contactName"
                                                                        name="contactName"
                                                                        type="text"
                                                                        value={emergencyContact.contactName}
                                                                        onChange={(e) => handleInputChange(index, 'contactName', e.target.value)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md >
                                                                <FormGroup>
                                                                    <label className="text-start mb-2">Relationship</label>
                                                                    <Input
                                                                        id="relationShip"
                                                                        name="relationShip"
                                                                        type="text"
                                                                        value={emergencyContact.relationShip}
                                                                        onChange={(e) => handleInputChange(index, 'relationShip', e.target.value)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md >
                                                                <FormGroup>
                                                                    <label className="text-start mb-2">Contact Number</label>
                                                                    <Input
                                                                        id="contactNumber"
                                                                        name="contactNumber"
                                                                        type="number"
                                                                        value={emergencyContact.contactNumber}
                                                                        onChange={(e) => handleInputChange(index, 'contactNumber', e.target.value)}
                                                                        onWheel={(e: any) => e.target.blur()}
                                                                        step="any"
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={1}>
                                                                {!emergencyContact.emergencyContactId && index !== 0 && (
                                                                    <button onClick={() => removeEmergencyContact(index)} className="btn btn-soft-danger">
                                                                        <FontAwesomeIcon
                                                                            className="mx-2"
                                                                            icon={faXmark}
                                                                        />
                                                                    </button>
                                                                )}
                                                            </Col>

                                                        </Row>
                                                    ))}
                                                </Row>
                                            </CardHeader>

                                            <Col className="text-center">
                                                <Button color="primary" disabled={loading}>
                                                    {loading ? <Spinner size="sm" className="me-2" /> : 'Submit'}
                                                </Button>
                                            </Col>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    </>
}
export default EditPatient