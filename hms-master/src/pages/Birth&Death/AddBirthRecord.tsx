import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupText, Row, Spinner } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BirthDeathRecordApiService from '../../helpers/services/birthDeathRecord/birth-death-record-api-service';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import PatientApiService from '../../helpers/services/patient/patient-api-service';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';


const genderData = [
    {
        name: "Male",
    },
    {
        name: "Female",
    },
]
const AddBirthRecord = () => {
    const birthDeathRecordApiService: BirthDeathRecordApiService = new BirthDeathRecordApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [childName, setChildName] = useState('');
    const [childNameValidationError, setChildNameValidationError] = useState(false)
    const [gender, setGender] = useState('');
    const [genderValidationError, setGenderValidationError] = useState(false)
    const [weight, setWeight] = useState<any>('');
    const [weightValidationError, setWeightValidationError] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBirthValidationError, setDateOfBirthValidationError] = useState(false)
    const [phone, setPhone] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState('');
    const [address, setAddress] = useState('');
    const [addressValidationError, setAddressValidationError] = useState<any>();
    const [caseId, setCaseId] = useState('');
    const [caseIdValidationError, setCaseIdValidationError] = useState('')
    const [motherName, setMotherName] = useState('');
    const [motherNameValidationError, setMotherNameValidationError] = useState('')
    const [fatherName, setFatherName] = useState('');
    const [fatherNameValidationError, setFatherNameValidationError] = useState<any>();
    const [report, setReport] = useState('');
    const [reportValidationError, setReportValidationError] = useState<any>();
    const [motherPhoto, setMotherPhoto] = useState<any>();
    const [motherPhotoValidationError, setMotherPhotoValidationError] = useState<any>();
    const [fatherPhoto, setFatherPhoto] = useState<any>();
    const [fatherPhotoValidationError, setFatherPhotoValidationError] = useState<any>();
    const [childPhoto, setChildPhoto] = useState<any>();
    const [childPhotoValidationError, setChildPhotoValidationError] = useState<any>();

    const [selectedFile, setSelectedFile] = useState<any>();
    const [documentValidationError, setDocumentValidationError] = useState<any>();
    const [loading, setLoading] = useState(false);
    
    const data = {
        childName, gender, weight, dateOfBirth, motherName, fatherName, report,
        address, phone, caseId, motherPhoto, fatherPhoto, childPhoto, selectedFile
    }

    const handleChildNameChange = (value: any) => {
        setChildName(value);
        setChildNameValidationError(false);
    }

    const handleGenderChange = (value: any) => {
        setGender(value);
        setGenderValidationError(false);
    }

    const uploadChildPhoto = (event: any) => {
        const file = event.target.files[0];
        setChildPhoto(file);
        setChildPhotoValidationError(false);
    };

    const handleWeightChange = (value: any) => {
        setWeight(value);
        if (!value) {
            setWeightValidationError('Weight is required.');
        } else if (isNaN(value)) {
            setWeightValidationError('Weight must be a number.');
        } else if (parseFloat(value) <= 0) {
            setWeightValidationError('Weight must be greater than zero.');
        } else {
            setWeightValidationError('');
        }
    }

    const handleDateOfBirtChange = (value: any) => {
        setDateOfBirth(value);
        setDateOfBirthValidationError(false);
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

    const handleCaseIdChange = (value: any) => {
        setCaseId(value);
        setCaseIdValidationError('');
    }

    const handleAddressChange = (value: any) => {
        setAddress(value);
        setAddressValidationError(false);
    }

    const handleFatherNameChange = (value: any) => {
        setFatherName(value);
        setFatherNameValidationError(false);
    }

    const handleReportChange = (value: any) => {
        setReport(value);
        setReportValidationError(false);
    }

    const handelSearch = () => {
        if (!caseId) {
            setCaseIdValidationError("OPD/IPD Id Required");
        } else {
            getAllPatientName(caseId);
        }
    }

    const getAllPatientName = async (id: any) => {
        try {
            let result = await patientApiService.getAllAntenatalPatientByIpdOrOpdId(id);
            console.log("getAllPatientName", result);
            if (result && result.patientName) {
                setMotherName(result.patientName);
                setMotherNameValidationError('');
            } else {
                setMotherNameValidationError('Patient not found');
                setMotherName('')
            }
        } catch (error: any) {
            setMotherName('');
            setCaseIdValidationError('This patient is not an antenatal patient. Please verify the IPD or OPD ID and try again.');
        }
    }

    const handleMotherNameChange = (value: any) => {
        setMotherName(value);
        setMotherNameValidationError('');
    }

    const uploadMotherPhoto = (event: any) => {
        const file = event.target.files[0];
        setMotherPhoto(file);
        setMotherPhotoValidationError(false);
    };

    const uploadFatherPhoto = (event: any) => {
        const file = event.target.files[0];
        setFatherPhoto(file);
        setFatherPhotoValidationError(false);
    };

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setDocumentValidationError(false);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!childName) {
            setChildNameValidationError(true);
            isFormValid = false;
        }

        if (!gender) {
            setGenderValidationError(true);
            isFormValid = false;
        }

        if (!weight) {
            setWeightValidationError("Weight is required.");
            isFormValid = false;
        } else if (isNaN(weight) || parseFloat(weight) <= 0) {
            setWeightValidationError("Weight must be a positive number.");
            isFormValid = false;
        } else {
            setWeightValidationError("");
        }

        if (!phone) {
            setPhoneValidationError('Phone number is required.');
            isFormValid = false;
        } else if (phone.length !== 10) {
            setPhoneValidationError('Phone number must be exactly 10 digits.');
            isFormValid = false;
        } else {
            setPhoneValidationError('');
        }

        if (!dateOfBirth) {
            setDateOfBirthValidationError(true);
            isFormValid = false;
        }

        if (!address) {
            setAddressValidationError(true);
            isFormValid = false;
        }

        if (!motherName) {
            setMotherNameValidationError('Mother Name Required');
            isFormValid = false;
        } else {
            setMotherNameValidationError('');
        }

        if (!fatherName) {
            setFatherNameValidationError(true);
            isFormValid = false;
        }

        if (!report) {
            setReportValidationError(true);
            isFormValid = false;
        }

        // if (!selectedFile) {
        //     setDocumentValidationError(true);
        //     isFormValid = false;
        // }
        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addBirthRecord();
        }
    }

    const addBirthRecord = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                childName: childName,
                gender: gender,
                weight: weight,
                dateOfBirth: dateOfBirth,
                motherName: motherName,
                fatherName: fatherName || 'NA',
                report: report || 'NA',
                address: address || 'NA',
                phone: phone,
                // caseId: caseId,
                ipdOrOpdId: caseId,
            };
            console.log("birtRecord", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('birthRecordData', jsonBlob);
            formData.append('motherPhoto', motherPhoto);
            formData.append('fatherPhoto', fatherPhoto);
            formData.append('childPhoto', childPhoto);
            formData.append('documentPhoto', selectedFile);
            await birthDeathRecordApiService.createBirthRecord(formData);
            toast.success('Birth Record Added Successfully', { containerId: 'TR' });
            navigate('/main/birthRecord')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (location?.state) {
            setChildName(location?.state?.childName);
            setGender(location?.state?.gender);
            setWeight(location?.state?.weight);
            setDateOfBirth(location?.state?.dateOfBirth);
            setMotherName(location?.state?.motherName);
            setFatherName(location?.state?.fatherName);
            setReport(location?.state?.report);
            setAddress(location?.state?.address);
            setPhone(location?.state?.phone);
            setCaseId(location?.state?.caseId);
            setMotherPhoto(location?.state?.motherPhoto);
            setFatherPhoto(location?.state?.fatherPhoto);
            setChildPhoto(location?.state?.childPhoto);
            setSelectedFile(location?.state?.selectedFile)
        }
    }, [location?.state]);
    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Birth Details"
                        pageTitle="Birth Record"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Birth Details",
                            data
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Child Details  </h5>

                                                <Link to="/main/birthRecord" className="text-end">
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
                                                                    <label htmlFor="child_name">Child Name </label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="child_name"
                                                                        name="child_name"
                                                                        type="text"
                                                                        value={childName}
                                                                        onChange={e => handleChildNameChange(e.target.value)}
                                                                        invalid={!!childNameValidationError}
                                                                    />
                                                                    {childNameValidationError && <span className="text-danger">Child Name Required</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="gender">Gender</label>
                                                                    <small className="req"> *</small>
                                                                    <select
                                                                        className={`${genderValidationError ? 'is-invalid' : ''} form-control`}
                                                                        value={gender}
                                                                        onChange={(e) => { handleGenderChange(e.target.value) }}
                                                                    >
                                                                        <option value="">--Select--</option>
                                                                        {genderData.map((data: any, idx: any) => (
                                                                            <option key={idx} value={data.name}>{data.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    {genderValidationError && <span className="text-danger">Gender Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="child_photo">Child Photo</label>
                                                                    <Input
                                                                        id="child_photo"
                                                                        name="child_photo"
                                                                        type="file"
                                                                        onChange={uploadChildPhoto}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="weight">Weight</label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="weight"
                                                                        name="weight"
                                                                        type="text"
                                                                        value={weight}
                                                                        onChange={e => handleWeightChange(e.target.value)}
                                                                        invalid={!!weightValidationError}
                                                                    />
                                                                    {weightValidationError && <span className="text-danger">{weightValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="birth_date">Birth Date</label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="birth_date"
                                                                        name="birth_date"
                                                                        type="date"
                                                                        value={dateOfBirth}
                                                                        onChange={e => handleDateOfBirtChange(e.target.value)}
                                                                        invalid={!!dateOfBirthValidationError}
                                                                    />
                                                                    {dateOfBirthValidationError && <span className="text-danger">Date Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="phone">Phone</label>
                                                                    <small className="req"> *</small>
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
                                                            <div className="col-md-6">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="address">Address</label>
                                                                    <small className="req"> *</small>
                                                                    <Input type='textarea'
                                                                        id="address"
                                                                        name="address"
                                                                        className="form-control"
                                                                        value={address}
                                                                        onChange={e => handleAddressChange(e.target.value)}
                                                                        invalid={!!addressValidationError}
                                                                    />
                                                                    {addressValidationError && <span className="text-danger">Address Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="caseId">OPD/IPD Id <span className='text-danger'> * </span></label>
                                                                    <InputGroup>
                                                                        <Input
                                                                            id="caseId"
                                                                            name="caseId"
                                                                            type="text"
                                                                            value={caseId}
                                                                            invalid={!!caseIdValidationError}
                                                                            onChange={e => handleCaseIdChange(e.target.value.toUpperCase())}
                                                                        />
                                                                        <InputGroupText>
                                                                            <Button onClick={handelSearch}>Search</Button>
                                                                        </InputGroupText>
                                                                    </InputGroup>
                                                                    {caseIdValidationError && <span className="text-danger">{caseIdValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="mother_name">Mother Name <span className='text-danger'> * </span></label>
                                                                    <Input
                                                                        id="mother_name"
                                                                        name="mother_name"
                                                                        type="text"
                                                                        value={motherName}
                                                                        disabled
                                                                        onChange={e => handleMotherNameChange(e.target.value)}
                                                                        invalid={!!motherNameValidationError}
                                                                    />
                                                                    {motherNameValidationError && <span className="text-danger">{motherNameValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="mother_photo">Mother ID Proof</label>
                                                                    <Input
                                                                        id="mother_photo"
                                                                        name="mother_photo"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={uploadMotherPhoto}
                                                                    // invalid={!!motherPhotoValidationError}
                                                                    />
                                                                    {/* {motherPhotoValidationError && <span className="text-danger">Mother Photo Required</span>} */}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="father_name">Father Name</label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="father_name"
                                                                        name="father_name"
                                                                        type="text"
                                                                        value={fatherName}
                                                                        onChange={e => handleFatherNameChange(e.target.value)}
                                                                        invalid={!!fatherNameValidationError}
                                                                    />
                                                                    {fatherNameValidationError && <span className="text-danger">Father Name Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="father_photo">Father  ID Proof</label>
                                                                    <Input
                                                                        id="father_photo"
                                                                        name="father_photo"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={uploadFatherPhoto}
                                                                    // invalid={!!fatherPhotoValidationError}
                                                                    />
                                                                    {/* {fatherPhotoValidationError && <span className="text-danger">Father Photo Required</span>} */}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="report">Report</label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="report"
                                                                        name="report"
                                                                        type="text"
                                                                        value={report}
                                                                        onChange={e => handleReportChange(e.target.value)}
                                                                        invalid={!!reportValidationError}
                                                                    />
                                                                    {reportValidationError && <span className="text-danger">Report Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="document_file">Document</label>
                                                                    {/* <small className="req"> *</small> */}
                                                                    <Input
                                                                        id="document_file"
                                                                        name="document_file"
                                                                        type="file"
                                                                        accept="application/pdf"
                                                                        onChange={handleFileUpload}
                                                                    // invalid={!!documentValidationError}
                                                                    />
                                                                    {/* {documentValidationError && <span className="text-danger">Document Required</span>} */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <Button color="primary" type="submit" >
                                                        Submit
                                                    </Button> */}
                                                    <Button color='primary' disabled={loading}>
                                                        {loading ? <Spinner size="sm" className="me-2" /> : 'Submit'}
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
    );
};

export default AddBirthRecord;
