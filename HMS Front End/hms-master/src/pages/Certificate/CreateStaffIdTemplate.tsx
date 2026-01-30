import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, CardBody, FormGroup, Input, Label, Button, CardHeader, Form } from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import StorageService from "../../helpers/storage/storage-service";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import StaffIdTemplateDataTable from "./StaffIdTemplateDataTable";

const CreateStaffIdTemplateCard = () => {
    const certificateApiService: CertificateApiService = new CertificateApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [hospitalName, setHospitalName] = useState('');
    const [templateNameValidationError, setTemplateNameValidationError] = useState(false);
    const [contactInfo, setContactInfo] = useState('');
    const [staffIdCardTitle, setStaffIdCardTitle] = useState('');
    const [headerColor, setHeaderColor] = useState('');
    const [name, setName] = useState<any>(false);
    const [staffId, setStaffId] = useState<any>(false);
    const [designation, setDesignation] = useState<any>(false);
    const [department, setDepartment] = useState<any>(false);
    const [fatherName, setFatherName] = useState<any>(false);
    const [phone, setPhone] = useState<any>(false);
    const [dateOfBirth, setDateOfBirth] = useState<any>(false);
    const [dateOfJoining, setDateOfJoining] = useState<any>(false);
    const [currentAddress, setCurrentAddress] = useState<any>(false);
    const [barcodeOrQRCode, setBarcodeOrQRCode] = useState<any>(false);
    const [motherName, setMotherName] = useState<any>(false);
    const [createdBy, setCreatedBy] = useState('');
    const [backgroundImage, setBackgroundImage] = useState<any>();
    const [selectedLogo, setSelectedLogo] = useState<any>();
    const [signature, setSignature] = useState<any>();
    const [refresh, setRefresh] = useState(false);

    const handleSignatureUpload = (value: any) => {
        const file = value.target.files[0];
        setSignature(file);
    }

    const handleLogoUpload = (value: any) => {
        const file = value.target.files[0];
        setSelectedLogo(file);
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setBackgroundImage(file);
    };

    const validateForm = () => {
        let isFormValid = true;

        // if (!certificateTemplateName) {
        //   setTemplateNameValidationError(true);
        //   isFormValid = false;
        // }

        // if (!bodyText) {
        //   setBodyTextValidationError(true);
        //   isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createTemplate();
        }
    };

    const createTemplate = async () => {
        try {
            let formData: FormData = new FormData();
            formData.append('BackgroundImage', backgroundImage);
            formData.append('Logo', selectedLogo);
            formData.append('Signature', signature);
            formData.append('HospitalName', hospitalName);
            formData.append('HospitalAddress', contactInfo);
            formData.append('StaffIdCardTitle', staffIdCardTitle);
            formData.append('HeaderColor', headerColor);
            formData.append('StaffName', name);
            formData.append('StaffId', staffId);
            formData.append('Designation', designation);
            formData.append('Department', department);
            formData.append('FatherName', fatherName);
            formData.append('MotherName', motherName);
            formData.append('DateOfJoining', dateOfJoining);
            formData.append('CurrentAddress', currentAddress);
            formData.append('Phone', phone);
            formData.append('DateOfBirth', dateOfBirth);
            formData.append('Barcode', barcodeOrQRCode);
            formData.append('CreatedBy', createdBy);
            await certificateApiService.createStaffIdTemplate(formData);
            toast.success("Template Created Successfully", { containerId: "TR" });
            setRefresh(!refresh);
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setCreatedBy(user.name);
    }, []);

    useEffect(() => {
        if (location?.state) {
            // setCertificateTemplateName(location?.state?.certificateTemplateName);
            // setCode(location?.state?.code);
            // setContactNo(location?.state?.contactNo);
            // setAddress(location?.state?.address);
            // setContactPersonName(location?.state?.contactPersonName);
            // setContactPersonPhone(location?.state?.contactPersonPhone);
            // setDocument(location?.state?.documentFile);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Staff ID Card"
                        pageTitle="Certificate"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Staff ID Card",
                            // data
                        }))} />
                    <Row>
                        <Col lg={4}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Staff ID Card </h5>
                                            </div>
                                            <Row className="d-flex justify-content-center">
                                                <Col xl={12}>
                                                    <Form onSubmit={handleSubmit}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Background Image </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('backgroundImage')?.click()}
                                                                    >
                                                                        {backgroundImage ? backgroundImage.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="backgroundImage"
                                                                        name="backgroundImage"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .png"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleFileUpload}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Logo </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('logo')?.click()}
                                                                    >
                                                                        {selectedLogo ? selectedLogo.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="logo"
                                                                        name="logo"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .png"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleLogoUpload}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Signature </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('signature')?.click()}
                                                                    >
                                                                        {signature ? signature.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="signature"
                                                                        name="signature"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .png"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleSignatureUpload}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12} className="mb-3">
                                                                <Label for="HospitalName">Hospital Name</Label>
                                                                <ReactQuill theme="snow" value={hospitalName} onChange={setHospitalName} className="custom-editor" />
                                                            </Col>
                                                            <Col md={12} className="mb-3">
                                                                <Label for="contact-info">Address/ Phone/ Email </Label>
                                                                <ReactQuill theme="snow" value={contactInfo} onChange={setContactInfo} className="custom-editor" />
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <Label for="patientID">ID Card Title <span className='text-danger'> * </span> </Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="patientID"
                                                                        value={staffIdCardTitle}
                                                                        onChange={e => setStaffIdCardTitle(e.target.value)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <Label for="HeaderColor">Header Color </Label>
                                                                    <Input
                                                                        type="color"
                                                                        id="HeaderColor"
                                                                        value={headerColor}
                                                                        onChange={e => setHeaderColor(e.target.value)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Name</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="name"
                                                                        checked={name}
                                                                        onChange={() => setName(!name)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Staff ID</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="staffId"
                                                                        checked={staffId}
                                                                        onChange={() => setStaffId(!staffId)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Designation</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="Designation"
                                                                        checked={designation}
                                                                        onChange={() => setDesignation(!designation)}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Department</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="department"
                                                                        checked={department}
                                                                        onChange={() => setDepartment(!department)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Husband Name</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="FatherName"
                                                                        checked={fatherName}
                                                                        onChange={() => setFatherName(!fatherName)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Father/ Mother Name</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="motherName"
                                                                        checked={motherName}
                                                                        onChange={() => setMotherName(!motherName)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Date Of Joining</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="dateOfJoining"
                                                                        checked={dateOfJoining}
                                                                        onChange={() => setDateOfJoining(!dateOfJoining)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Current Address</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="currentAddress"
                                                                        checked={currentAddress}
                                                                        onChange={() => setCurrentAddress(!currentAddress)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Phone</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="phone"
                                                                        checked={phone}
                                                                        onChange={() => setPhone(!phone)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Date Of Birth</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="dateOfBirth"
                                                                        checked={dateOfBirth}
                                                                        onChange={() => setDateOfBirth(!dateOfBirth)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col md={12} className='d-flex gap-3'>
                                                                <Label>Barcode / QR Code</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="BarcodeOrQRCode"
                                                                        checked={barcodeOrQRCode}
                                                                        onChange={() => setBarcodeOrQRCode(!barcodeOrQRCode)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                        </Row>
                                                        <div className='text-center'>
                                                            <Button type="submit" color="primary">Submit</Button>
                                                        </div>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={8}>
                            <Card>
                                <CardHeader>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Staff ID Card List </h5>
                                        <Button onClick={() => navigate(-1)}
                                            color="primary"
                                            className="btn btn-primary add-btn"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <StaffIdTemplateDataTable refresh={refresh} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CreateStaffIdTemplateCard