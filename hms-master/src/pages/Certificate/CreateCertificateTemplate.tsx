import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../common/FormHeader/FormHeader";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { toast } from "react-toastify";
import ErrorHandler from "../../helpers/ErrorHandler";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import StorageService from "../../helpers/storage/storage-service";

const CreateCertificateTemplate = () => {
    const certificateApiService: CertificateApiService = new CertificateApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [certificateTemplateName, setCertificateTemplateName] = useState('');
    const [templateNameValidationError, setTemplateNameValidationError] = useState(false);
    const [headerLeftText, setHeaderLeftText] = useState('');
    const [headerCenterText, setHeaderCenterText] = useState('');
    const [headerRightText, setHeaderRightText] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [bodyTextValidationError, setBodyTextValidationError] = useState(false);
    const [footerLeftText, setFooterLeftText] = useState('');
    const [footerCenterText, setFooterCenterText] = useState('');
    const [footerRightText, setFooterRightText] = useState('');
    const [headerHeight, setHeaderHeight] = useState('');
    const [footerHeight, setFooterHeight] = useState('');
    const [contentHeight, setContentHeight] = useState('');
    const [contentWidth, setContentWidth] = useState('');
    const [isActivePatientImage, setIsActivePatientImage] = useState<any>(false);
    const [photoHeight, setPhotoHeight] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [backgroundImage, setBackgroundImage] = useState<any>();

    const handleTemplateNameChange = (value: any) => {
        setCertificateTemplateName(value);
        setTemplateNameValidationError(false);
    }

    const handleBodyTextChange = (value: any) => {
        setBodyText(value);
        setBodyTextValidationError(false);
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setBackgroundImage(file);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!certificateTemplateName) {
            setTemplateNameValidationError(true);
            isFormValid = false;
        }

        if (!bodyText) {
            setBodyTextValidationError(true);
            isFormValid = false;
        }

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
            formData.append('CertificateTemplateName', certificateTemplateName);
            formData.append('HeaderLeftText', headerLeftText);
            formData.append('HeaderCenterText', headerCenterText);
            formData.append('HeaderRightText', headerRightText);
            formData.append('BodyText', bodyText);
            formData.append('FooterLeftText', footerLeftText);
            formData.append('FooterRightText', footerRightText);
            formData.append('FooterCenterText', footerCenterText);
            formData.append('HeaderHeight', headerHeight);
            formData.append('FooterHeight', footerHeight);
            formData.append('ContentHeight', contentHeight);
            formData.append('ContentWidth', contentWidth);
            formData.append('IsActivePatientImage', isActivePatientImage);
            formData.append('PhotoHeight', photoHeight);
            formData.append('BackgroundImage', backgroundImage);
            formData.append('CreatedBy', createdBy);
            await certificateApiService.createCertificateTemplate(formData);
            toast.success("Template Created Successfully", { containerId: "TR" });
            navigate("/main/CertificateTemplateDataTable");
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
            setCertificateTemplateName(location?.state?.certificateTemplateName);
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
                    <FormHeader title="Add Certificate Template"
                        pageTitle="Certificate"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Certificate Template",
                            // data
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Certificate Template</h5>
                                                <Button onClick={() => navigate(-1)}
                                                    color="primary"
                                                    className="btn btn-primary add-btn"
                                                >
                                                    <IoArrowBack /> Back
                                                </Button>
                                            </div>
                                            <Row className="d-flex justify-content-center">
                                                <Col xl={12}>
                                                    <Form onSubmit={handleSubmit}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <Label for="certificateTemplateName">Certificate Template Name <span className='text-danger'> * </span></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="certificateTemplateName"
                                                                        value={certificateTemplateName}
                                                                        onChange={e => handleTemplateNameChange(e.target.value)}
                                                                        invalid={!!templateNameValidationError}
                                                                    />
                                                                    {templateNameValidationError && (
                                                                        <div className="invalid-feedback">Certificate Template Name Required</div>
                                                                    )}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="headerLeftText">Header Left Text</Label>
                                                                <ReactQuill theme="snow" value={headerLeftText} onChange={setHeaderLeftText} className="custom-editor" />
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="headerCenterText">Header Center Text</Label>
                                                                <ReactQuill theme="snow" value={headerCenterText} onChange={setHeaderCenterText} className="custom-editor" />
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="headerRightText">Header Right Text</Label>
                                                                <ReactQuill theme="snow" value={headerRightText} onChange={setHeaderRightText} className="custom-editor" />
                                                            </Col>
                                                            <Col md={12} className="mb-3">
                                                                <Label for="bodyText">Body Text <span className='text-danger'> * </span></Label>
                                                                <ReactQuill theme="snow" value={bodyText} onChange={handleBodyTextChange} className="custom-editor" />
                                                                <span className="text-primary">[patient_name] [patient_id] [dob] [age] [gender] [email] [phone] [address] [opd_ipd_no] [guardian_name] [consultant_doctor]</span>
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="footerLeftText">Footer Left Text </Label>
                                                                <ReactQuill theme="snow" value={footerLeftText} onChange={setFooterLeftText} className="custom-editor" />
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="footerCenterText">Footer Center Text </Label>
                                                                <ReactQuill theme="snow" value={footerCenterText} onChange={setFooterCenterText} className="custom-editor" />
                                                            </Col>
                                                            <Col md={4} className="mb-3">
                                                                <Label for="footerRightText">Footer Right Text </Label>
                                                                <ReactQuill theme="snow" value={footerRightText} onChange={setFooterRightText} className="custom-editor" />
                                                            </Col>
                                                            <Row>
                                                                <h5>Certificate Design</h5>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="headerHeight">Header Height </Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="headerHeight"
                                                                            value={headerHeight}
                                                                            onChange={e => setHeaderHeight(e.target.value)}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="footerHeight">Footer Height </Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="footerHeight"
                                                                            value={footerHeight}
                                                                            onChange={e => setFooterHeight(e.target.value)}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="bodyHeight">Body Height</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="bodyHeight"
                                                                            value={contentHeight}
                                                                            onChange={e => setContentHeight(e.target.value)}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="bodyWidth">Body Width</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="bodyWidth"
                                                                            value={contentWidth}
                                                                            onChange={e => setContentWidth(e.target.value)}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Col>
                                                                <Label>Patient Photo</Label>
                                                                <div className="form-check form-switch mb-3">
                                                                    <Input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="SwitchCheck1"
                                                                        checked={isActivePatientImage}
                                                                        onChange={() => setIsActivePatientImage(!isActivePatientImage)}
                                                                    />
                                                                    <Label>Patient Photo</Label>
                                                                </div>
                                                            </Col>
                                                            {isActivePatientImage && (
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="photoHeight">Photo Height</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="photoHeight"
                                                                            value={photoHeight}
                                                                            onChange={e => setPhotoHeight(e.target.value)}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            )}
                                                            <Col md={6}>
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
                                                                        onClick={() => document.getElementById('fileInput')?.click()}
                                                                    >
                                                                        {backgroundImage ? backgroundImage.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="fileInput"
                                                                        name="backgroundImage"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .png"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleFileUpload}
                                                                    />
                                                                </FormGroup>
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
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CreateCertificateTemplate