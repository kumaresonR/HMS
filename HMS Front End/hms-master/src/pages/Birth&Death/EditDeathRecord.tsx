import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupText, Row, Spinner } from "reactstrap";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BirthDeathRecordApiService from "../../helpers/services/birthDeathRecord/birth-death-record-api-service";
import moment from "moment";
import PatientApiService from "../../helpers/services/patient/patient-api-service";

const EditDeathRecord = () => {
    const birthDeathRecordApiService: BirthDeathRecordApiService = new BirthDeathRecordApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.id;

    const [caseId, setCaseId] = useState('');
    const [caseIdValidationError, setCaseIdValidationError] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientNameValidationError, setPatientNameValidationError] = useState('');
    const [deathDate, setDeathDate] = useState('');
    const [deathDateValidationError, setDeathDateValidationError] = useState(false);
    const [guardianName, setGuardianName] = useState('');
    const [guardianNameValidationError, setGuardianNameValidationError] = useState(false);
    const [report, setReport] = useState('');
    const [reportValidationError, setReportValidationError] = useState<any>();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [documentValidationError, setDocumentValidationError] = useState<any>();
    const [loading, setLoading] = useState(false);

    const handleCaseIdChange = (value: any) => {
        setCaseId(value);
        setCaseIdValidationError('');
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
            let result = await patientApiService.getPatientByIpdOrOpdId(id);
            console.log("getAllPatientName", result);
            if (result && result.patientName) {
                setPatientName(result.patientName);
                setPatientNameValidationError('');
            } else {
                setPatientNameValidationError('Patient not found');
                setPatientName('')
            }
        } catch (error: any) {
            console.log("getAllPatientName Error");
            console.log(error);
            setPatientName('');
            setCaseIdValidationError('This patient is not marked as deceased. Please verify the IPD or OPD ID and try again.');
        }
    }

    const handlePatientNameChange = (value: any) => {
        setPatientName(value);
        setPatientNameValidationError('');
    }

    const handleDeathDateChange = (value: any) => {
        setDeathDate(value);
        setDeathDateValidationError(false);
    }

    const handleGuardianNameChange = (value: any) => {
        setGuardianName(value);
        setGuardianNameValidationError(false);
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setDocumentValidationError(false);
    };

    const handleReportChange = (value: any) => {
        setReport(value);
        setReportValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!caseId) {
            setCaseIdValidationError('OPD/IPD Id Required');
            isFormValid = false;
        } else {
            setCaseIdValidationError('');
        }

        if (!patientName) {
            setPatientNameValidationError('Patient Name Required');
            isFormValid = false;
        } else {
            setPatientNameValidationError('');
        }

        if (!deathDate) {
            setDeathDateValidationError(true);
            isFormValid = false;
        }

        if (!guardianName) {
            setGuardianNameValidationError(true);
            isFormValid = false;
        }

        // if (!selectedFile) {
        //     setDocumentValidationError(true);
        //     isFormValid = false;
        // }

        if (!report) {
            setReportValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            editDeathRecord();
        }
    }

    const editDeathRecord = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                // caseId: caseId,
                patientName: patientName,
                dateOfDeath: deathDate,
                guardianName: guardianName || 'NA',
                report: report || 'NA',
                ipdOrOpdId: caseId,
            };
            console.log("deathRecord", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('deathRecordData', jsonBlob);
            formData.append('attachment', selectedFile);
            await birthDeathRecordApiService.editDeathRecord(id, formData);
            toast.success('Death Record Updated Successfully', { containerId: 'TR' });
            navigate('/main/deathRecord')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getDeathRecordById = async () => {
        try {
            let data = await birthDeathRecordApiService.getDeathRecordById(id);
            setData(data);
            console.log('getAllIpd data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: any) => {
        setPatientName(data.patientName);
        setDeathDate(moment(data.dateOfDeath).format('YYYY-MM-DDTHH:mm'));
        setGuardianName(data.guardianName);
        setReport(data.report);
        setCaseId(data.ipdOrOpdId);
        setSelectedFile(data.attachment);
    }

    useEffect(() => {
        getDeathRecordById();
    }, [])

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Death Details" pageTitle="Human Resource" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">  <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">

                                                Edit  Death Details</h5>
                                            <Link to="/main/deathRecord" className="text-end">
                                                <Button
                                                    color="primary"
                                                    className="btn btn-primary add-btn"
                                                >
                                                    <IoArrowBack /> Back
                                                </Button>
                                            </Link>
                                        </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="around10">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="case_id">OPD/IPD Id</label>
                                                                <small className="req"> *</small>
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
                                                                <label htmlFor="patient_name">Patient Name</label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    id="patient_name"
                                                                    name="patient_name"
                                                                    type="text"
                                                                    value={patientName}
                                                                    onChange={e => handlePatientNameChange(e.target.value)}
                                                                    invalid={!!patientNameValidationError}
                                                                    disabled
                                                                />
                                                                {patientNameValidationError && <span className="text-danger">{patientNameValidationError}</span>}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="death_date">Death Date</label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    id="death_date"
                                                                    name="death_date"
                                                                    type="datetime-local"
                                                                    value={deathDate}
                                                                    onChange={e => handleDeathDateChange(e.target.value)}
                                                                    invalid={!!deathDateValidationError}
                                                                />
                                                                {deathDateValidationError && <span className="text-danger">Death Date Required</span>}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="guardian_name">Guardian Name</label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    id="guardian_name"
                                                                    name="guardian_name"
                                                                    type="text"
                                                                    value={guardianName}
                                                                    onChange={e => handleGuardianNameChange(e.target.value)}
                                                                    invalid={!!guardianNameValidationError}
                                                                />
                                                                {guardianNameValidationError && <span className="text-danger">Guardian Name Required</span>}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="attachment">Attachment</label>
                                                                <Input
                                                                    id="attachment"
                                                                    name="attachment"
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    onChange={handleFileUpload}
                                                                // invalid={!!documentValidationError}
                                                                />
                                                                {/* {documentValidationError && <span className="text-danger">Attachment Required</span>} */}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="report">Report</label>
                                                                <Input
                                                                    id="report"
                                                                    name="report"
                                                                    className="form-control"
                                                                    value={report}
                                                                    onChange={e => handleReportChange(e.target.value)}
                                                                    invalid={!!reportValidationError}
                                                                />
                                                                {reportValidationError && <span className="text-danger">Report Required</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <Button color="primary" type="submit">
                                                    Submit
                                                </Button> */}
                                                <Button color="primary" disabled={loading}>
                                                    {loading ? <Spinner size="sm" className="me-2" /> : 'submit'}
                                                </Button>
                                            </form>
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

export default EditDeathRecord