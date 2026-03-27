import { Container, Row, Col, Card, Form, FormGroup, Input, Button, CardBody, Spinner } from "reactstrap"
import FormHeader from "../../common/FormHeader/FormHeader"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input'
import axios, { AxiosError } from "axios";
import ErrorHandler from "../../helpers/ErrorHandler";
import { bloodGroupDetails } from "../../common/data/FakeData";
import TpaApiService from "../../helpers/services/tpa/tpa-api-service";

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
const CreatePatient = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const tpaApiService: TpaApiService = new TpaApiService();

    let navigate: any = useNavigate();

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
    const [relationShip, setRelationShip] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [insuranceData, setInsuranceData] = useState<any>([]);
    const [pincode, setPincode] = useState('');
    const [pincodeValidationError, setPincodeValidationError] = useState(false);
    const [country, setCountry] = useState("India");
    const [countryValidationError, setCountryValidationError] = useState(false);
    const [region, setRegion] = useState('Tamil Nadu');
    const [stateValidationError, setStateValidationError] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
    const [value, setValue] = useState<any>('');
    const [nationalIdType, setNationalIdType] = useState('');
    const [nationalIdNumber, setNationalIdNumber] = useState('');
    const [age, setAge] = useState('');
    const [tpaId, setTPAId] = useState('');
    const [tpaValidity, setTPAValidity] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailValidationError("Invalid email format");
            isFormValid = false;
        } else {
            setEmailValidationError("");
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
            doCreatePatient();
        }
    };

    const doCreatePatient = async () => {
        setLoading(true);
        try {
            let payload: any = {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dob,
                gender: gender,
                contactNumber: phoneNumber,
                address: address,
                pinCode: pincode,
                state: region,
                bloodType: bloodType,
                allergies: allergies || 'NA',
                insuranceProviders: {
                    insuranceId: insuranceId || null,
                },
                nationality: country,
                emergencyContacts: emergencyContacts,
                idProof: nationalIdType,
                idNumber: nationalIdNumber,
                age: age,
            }
            if (email) {
                payload.email = email;
            }
            await patientApiService.createPatient(payload);
            toast.success('Patient Created Successfully', { containerId: 'TR' });
            // navigate('/patient-datatable');
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInsuranceData();
        addEmergencyContact();
    }, []);

    return (
        <React.Fragment>

            {/* <FormHeader title="Create Patient" pageTitle="Patient" /> */}
            <Row>
                <Col lg={12}>
                    <div>
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
                                                    className={`${firstNameValidationError ? 'is-invalid' : ''}`}
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
                                                    onChange={handlePhoneNumberChange}
                                                />
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
                                        <Col md={6}>
                                            <FormGroup className={`input  ${countryValidationError ? 'is-invalid' : ''}`}>
                                                <label className="text-start mb-2">Country <span className="text-danger">*</span></label>
                                                <CountryDropdown value={country} onChange={(val) => handCountryChange(val)} />
                                            </FormGroup>
                                            {countryValidationError && <div className="invalid-feedback">Country Required.</div>}
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className={`input  ${stateValidationError ? 'is-invalid' : ''}`}>
                                                <label className="text-start mb-2">State <span className="text-danger">*</span></label>
                                                <RegionDropdown country={country} value={region} onChange={(val) => handleStateChange(val)} />
                                            </FormGroup>
                                            {stateValidationError && <div className="invalid-feedback">State Required.</div>}
                                        </Col>
                                    </div>
                                    <Row>


                                        <Col md={6}>
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

                                        <Col md={6}>
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
                                        <Col md={6}>
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
                                        <Col md={6}>
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
                                        <Col>  <hr /></Col>

                                        <Col md={12} className="mx-auto">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h4 className="text-start mb-2">Emergency Contacts</h4>
                                                <Button color="primary" onClick={addEmergencyContact} className="mx-3">
                                                    Add New &nbsp; <FontAwesomeIcon icon={faCirclePlus} /></Button>
                                            </div>
                                            {/* EmergencyContacts */}
                                            {emergencyContacts.map((emergencyContact: any, index: any) => (
                                                <Row key={index} className="align-items-center">
                                                    <Col >
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
                                                    <Col >
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
                                                    <Col >
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

                                                    {index !== 0 && (
                                                        <Col xs="auto pt-2">
                                                            <button onClick={() => removeEmergencyContact(index)} className="btn btn-soft-danger">
                                                                <FontAwesomeIcon
                                                                    className="mx-2"
                                                                    icon={faXmark}
                                                                />
                                                            </button>
                                                        </Col>
                                                    )}



                                                </Row>
                                            ))}
                                        </Col>

                                        <Col className="text-center" >
                                            <Button color="primary" disabled={loading}>
                                                 {loading ? <Spinner size="sm" className="me-2" /> : 'Submit'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}
export default CreatePatient