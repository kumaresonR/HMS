import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap"
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import BillingApiService from "../../helpers/services/billing/billing-api-service";
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service";

const AddSampleCollection = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [personName, setPersonName] = useState('');
    const [personNameValidationError, setPersonNameValidationError] = useState(false);
    const [pathologyCenter, setPathologyCenter] = useState('');
    const [collectedDateValidationError, setCollectedDateValidationError] = useState(false);
    const [collectedDate, setCollectedDate] = useState('');
    const [pathologyCenterValidationError, setPathologyCenterValidationError] = useState(false);
    const [employeData, setEmployeData] = useState([]);
    const [radiologydata, setRadiologydata] = useState('');

    const handlePersonNameChange = (value: any) => {
        setPersonName(value);
        setPersonNameValidationError(false);
    }

    const handleCollectedDateChange = (value: any) => {
        setCollectedDate(value);
        setCollectedDateValidationError(false);
    }

    const handlePathologyCenterChange = (value: any) => {
        setPathologyCenter(value);
        setPathologyCenterValidationError(false);
    }

    const getEmployeData = async () => {
        try {
            const url = props.title === "radiology" ? "role=RADIOLOGIST" : "role=PATHOLOGIST";
            let result = await appointmentApiServic.searchAllEmployee(url);
            setEmployeData(result);
        } catch (error: any) {
            console.log("getEmployeData error");
            return ErrorHandler(error)
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!personName) {
            setPersonNameValidationError(true);
            isFormValid = false;
        }

        if (!collectedDate) {
            setCollectedDateValidationError(true);
            isFormValid = false;
        }

        if (!pathologyCenter) {
            setPathologyCenterValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateAppointment();
        }
    };
    const doCreateAppointment = async () => {
        try {
            const isRadiology = props.title === "radiology";

            const payload = {
                sampleCollected: personName,
                collectedDate: collectedDate,
                ...(isRadiology
                    ? { radiologyCenter: pathologyCenter }
                    : { pathologyCenter: pathologyCenter }),
            };

            const apiService = isRadiology
                ? billingApiService.editRadiologySampleCollection
                : billingApiService.editPathologySampleCollection;

            await apiService(props.data, payload);
            toast.success('Sample Collected Successfully', { containerId: 'TR' });
            props.handleClose();
            props.close();
        } catch (error: any) {
            console.error("Sample Collection Failed", error);
            return ErrorHandler(error);
        }
    };

    useEffect(() => {
        getEmployeData();
    }, [])

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Form onSubmit={handleSubmit}>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Sample Collected Person Name <span className="text-danger">*</span></label>
                                <select
                                    className={`${personNameValidationError ? 'is-invalid' : ''} form-control`}
                                    value={personName}
                                    onChange={(e) => { handlePersonNameChange(e.target.value) }}
                                >
                                    <option value="">--Select--</option>
                                    {employeData?.map((data: any, idx: any) => (
                                        <option key={idx} value={data.fullName}>{data.fullName}</option>
                                    ))}
                                </select>
                                {personNameValidationError && <div className="invalid-feedback">Sample Collected Person Name Required.</div>}
                            </FormGroup>
                            <FormGroup>
                                <label className="text-start mb-2">Collected Date <span className="text-danger">*</span></label>
                                <Input className={`${collectedDateValidationError ? 'is-invalid' : ''}`}
                                    id="collectedDate"
                                    name="collectedDate"
                                    type="date"
                                    value={collectedDate}
                                    onChange={e => handleCollectedDateChange(e.target.value)}
                                />
                                {collectedDateValidationError && <div className="invalid-feedback">Collected Date Required.</div>}
                            </FormGroup>
                            <FormGroup>
                                <label className="text-start mb-2">Pathology Center <span className="text-danger">*</span></label>
                                <Input className={`${pathologyCenterValidationError ? 'is-invalid' : ''}`}
                                    id="pathologyCenter"
                                    name="pathologyCenter"
                                    type="text"
                                    value={pathologyCenter}
                                    onChange={e => handlePathologyCenterChange(e.target.value)}
                                />
                                {pathologyCenterValidationError && <div className="invalid-feedback">Pathology Center Required.</div>}
                            </FormGroup>
                            <Col className="text-end">
                                <Button
                                    color="primary"
                                    className="btn btn-primary ms-3" >Save</Button>
                            </Col>
                        </Col>
                    </Form>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddSampleCollection