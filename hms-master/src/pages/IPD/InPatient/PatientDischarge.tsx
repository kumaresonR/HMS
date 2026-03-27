import React, { useState } from "react"
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import { dischargeStatusData } from "../../../common/data/FakeData";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { useNavigate } from "react-router-dom";
import OPDApiService from "../../../helpers/services/opd/opd-api-service";

const PatientDischarge = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    let navigate: any = useNavigate();

    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeDateValidationError, setDischargeDateValidationError] = useState(false);
    const [dischargeStatus, setDischargeStatus] = useState('');
    const [dischargeStatusValidationError, setDischargeStatusValidationError] = useState(false);
    const [note, setNote] = useState('');
    const [operation, setOperation] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [investigation, setInvestigation] = useState('');
    const [treatmentHome, setTreatmentHome] = useState('');
    const [deathDate, setDeathDate] = useState('');
    const [deathDateValidationError, setDeathDateValidationError] = useState(false);
    const [guardianName, setGuardianName] = useState('');
    const [guardianNameValidationError, setGuardianNameValidationError] = useState(false);
    const [report, setReport] = useState('');
    const [referralDate, setReferralDate] = useState('');
    const [referralDateValidationError, setReferralDateValidationError] = useState(false);
    const [referralHospitalName, setReferralHospitalName] = useState('');
    const [referralHospitalNameValidationError, setReferralHospitalNameValidationError] = useState(false);
    const [reasonForReferral, setReasonForReferral] = useState('');
    const [documentFile, setDocument] = useState<any>();

    const handleDischargeDateChange = (value: any) => {
        setDischargeDate(value);
        setDischargeDateValidationError(false);
    }

    const handleDischargeStatusChange = (value: any) => {
        setDischargeStatus(value)
        setDischargeStatusValidationError(false);
    }

    const handleDeathDateChange = (value: any) => {
        setDeathDate(value);
        setDeathDateValidationError(false);
    }

    const handleGuardianNameChange = (value: any) => {
        setGuardianName(value)
        setGuardianNameValidationError(false);
    }

    const handleReferralDateChange = (value: any) => {
        setReferralDate(value);
        setReferralDateValidationError(false);
    }

    const handleReferralHospitalNameChange = (value: any) => {
        setReferralHospitalName(value)
        setReferralHospitalNameValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!dischargeDate) {
            setDischargeDateValidationError(true);
            isFormValid = false;
        }

        if (!dischargeStatus) {
            setDischargeStatusValidationError(true);
            isFormValid = false;
        }

        if (dischargeStatus === "Death") {
            if (!deathDate) {
                setDeathDateValidationError(true);
                isFormValid = false;
            }

            if (!guardianName) {
                setGuardianNameValidationError(true);
                isFormValid = false;
            }
        }

        if (dischargeStatus === "Referral") {
            if (!referralDate) {
                setReferralDateValidationError(true);
                isFormValid = false;
            }

            if (!referralHospitalName) {
                setReferralHospitalNameValidationError(true);
                isFormValid = false;
            }
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doDischarge();
        }
    }

    const doDischarge = async () => {
        try {
            let formData: FormData = new FormData();
            let payload: any = {
                dischargeDate: dischargeDate,
                dischargeStatus: dischargeStatus,
                dischargeSummary: note || 'NA',
                operation: operation || 'NA',
                diagnosis: diagnosis || 'NA',
                investigation: investigation || 'NA',
                treatmentHome: treatmentHome || 'NA',
                deathDate: deathDate,
                guardianName: guardianName || 'NA',
                report: report || 'NA',
                referralDate: referralDate,
                referralHospitalName: referralHospitalName || 'NA',
                reasonForReferral: reasonForReferral || 'NA'
            }
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('dischargeDetailsDTO', jsonBlob);
            formData.append('file', documentFile);
            if (props.title==="opd") {
                await opdApiService.patientDischarge(props.id, formData);
            } else {
                await iPDApiService.patientDischarge(props.id, formData);
            }

            toast.success('Discharge details updated Successfully', { containerId: 'TR' });
            if (props.title==="opd") {
                props.handleClose()
            } else {
                navigate('/main/ipd-discharged-patient-list')
            }
        } catch (error: any) {
            console.log("Discharge details updated  Failed", error);
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Alert color="warning">
                                Please note that before discharging, check patient bill.
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">Discharge Date <span className="text-danger">*</span></label>
                                <Input className={` ${dischargeDateValidationError ? 'is-invalid' : ''}`}
                                    id="dischargeDate"
                                    name="dischargeDate"
                                    type="datetime-local"
                                    value={dischargeDate}
                                    onChange={e => handleDischargeDateChange(e.target.value)}
                                />
                                {dischargeDateValidationError && <div className="invalid-feedback">Discharge Date Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label className="text-start mb-2">Discharge Status<span className="text-danger">*</span></label>
                                <select className={` ${dischargeStatusValidationError ? 'is-invalid' : ''} form-control`}
                                    value={dischargeStatus}
                                    onChange={(e) => handleDischargeStatusChange(e.target.value)}
                                >
                                    <option value="">--Select Discharge Status--</option>
                                    {dischargeStatusData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.status}>{data.status}</option>
                                    ))}
                                </select>
                                {dischargeStatusValidationError && <div className="invalid-feedback">Discharge Status Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Discharge Summary</Label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={3}
                                    value={note}
                                    className={`form-control`}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label className="form-label">Operation</Label>
                                <textarea
                                    id="Operation"
                                    name="Operation"
                                    rows={3}
                                    value={operation}
                                    className={`form-control`}
                                    onChange={e => setOperation(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label className="form-label">Diagnosis</Label>
                                <textarea
                                    id="Diagnosis"
                                    name="Diagnosis"
                                    rows={3}
                                    value={diagnosis}
                                    className={`form-control`}
                                    onChange={e => setDiagnosis(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label className="form-label">Investigation</Label>
                                <textarea
                                    id="Investigation"
                                    name="Investigation"
                                    rows={3}
                                    value={investigation}
                                    className={`form-control`}
                                    onChange={e => setInvestigation(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label className="form-label">Treatment Home</Label>
                                <textarea
                                    id="TreatmentHome"
                                    name="TreatmentHome"
                                    rows={3}
                                    value={treatmentHome}
                                    className={`form-control`}
                                    onChange={e => setTreatmentHome(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    {dischargeStatus === "Death" && (
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Death Date<span className="text-danger">*</span></label>
                                    <Input className={` ${deathDateValidationError ? 'is-invalid' : ''}`}
                                        id="deathDate"
                                        name="deathDate"
                                        type="datetime-local"
                                        value={deathDate}
                                        onChange={e => handleDeathDateChange(e.target.value)}
                                    />
                                    {deathDateValidationError && <div className="invalid-feedback">Death Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Guardian Name <span className="text-danger">*</span></label>
                                    <Input className={` ${guardianNameValidationError ? 'is-invalid' : ''}`}
                                        id="guardianName"
                                        name="guardianName"
                                        type="text"
                                        value={guardianName}
                                        onChange={e => handleGuardianNameChange(e.target.value)}
                                    />
                                    {guardianNameValidationError && <div className="invalid-feedback">Guardian Name Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Attachment</label>
                                    <Input
                                        type="file"
                                        className="form-control"
                                        id="attachment"
                                        onChange={onFileUploadListener}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <Label className="form-label">Report</Label>
                                    <textarea
                                        id="Report"
                                        name="Report"
                                        rows={3}
                                        value={report}
                                        className={`form-control`}
                                        onChange={e => setReport(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}

                    {dischargeStatus === "Referral" && (
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Referral Date<span className="text-danger">*</span></label>
                                    <Input className={` ${referralDateValidationError ? 'is-invalid' : ''}`}
                                        id="referralDate"
                                        name="referralDate"
                                        type="datetime-local"
                                        value={referralDate}
                                        onChange={e => handleReferralDateChange(e.target.value)}
                                    />
                                    {referralDateValidationError && <div className="invalid-feedback">Referral Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Referral Hospital Name <span className="text-danger">*</span></label>
                                    <Input className={` ${referralHospitalNameValidationError ? 'is-invalid' : ''}`}
                                        id="referralHospitalName"
                                        name="referralHospitalName"
                                        type="text"
                                        value={referralHospitalName}
                                        onChange={e => handleReferralHospitalNameChange(e.target.value)}
                                    />
                                    {referralHospitalNameValidationError && <div className="invalid-feedback">Referral Hospital Name Required.</div>}
                                </FormGroup>
                            </Col>

                            <Col md={12}>
                                <div className="mb-3">
                                    <Label className="form-label">Reason For Referral</Label>
                                    <textarea
                                        id="reasonForReferral"
                                        name="reasonForReferral"
                                        rows={3}
                                        value={reasonForReferral}
                                        className={`form-control`}
                                        onChange={e => setReasonForReferral(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Col className="text-end">
                        <Button  color="primary">Save</Button>
                    </Col>
                </Form>
            </Container>
        </React.Fragment>
    )
}

export default PatientDischarge