import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditChargeType = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [chargeType, setChargeType] = useState('');
    const [chargeTypeValidationError, setChargeTypeValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [appointment, setAppointment] = useState(false);
    const [opd, setOpd] = useState(false);
    const [ipd, setIpd] = useState(false);
    const [pathology, setPathology] = useState(false);
    const [radiology, setRadiology] = useState(false);
    const [bloodBank, setBloodBank] = useState(false);
    const [ambulance, setAmbulance] = useState(false);
    const [moduleValidationError, setModuleValidationError] = useState(false);

    const handleChargeTypeChange = (value: any) => {
        setChargeType(value);
        setChargeTypeValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!chargeType) {
            setChargeTypeValidationError(true);
            isFormValid = false;
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        const isAnyModuleSelected =
            appointment || opd || ipd || pathology || radiology || bloodBank || ambulance;

        if (!isAnyModuleSelected) {
            setModuleValidationError(true);
            isFormValid = false;
        } else {
            setModuleValidationError(false);
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            editChargesType();
        }
    }
    const editChargesType = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                chargeType: chargeType,
                appointment: appointment,
                opd: opd,
                ipd: ipd,
                pathology: pathology,
                radiology: radiology,
                bloodBank: bloodBank,
                ambulance: ambulance
            }
            await setupApiService.editChargesType(data.chargeTypeId, payload);
            navigate('/main/hospitalMain');
            toast.success('Charge Type Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        // setModNo(data.modNo);
        setChargeType(data.chargeType);
        setAppointment(data.appointment);
        setOpd(data.opd);
        setIpd(data.ipd);
        setPathology(data.pathology);
        setRadiology(data.radiology);
        setBloodBank(data.bloodBank);
        setAmbulance(data.ambulance);
    }

    useEffect(() => {
        if (state?.data) {
            setData(state?.data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Charge Type" pageTitle="Setup" />
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
                                                    <Label for="chargeType">Charge Type <span className='text-danger'>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="chargeType"
                                                        value={chargeType}
                                                        onChange={e => handleChargeTypeChange(e.target.value)}
                                                        invalid={!!chargeTypeValidationError}
                                                    />
                                                    {chargeTypeValidationError && <div className="invalid-feedback">Charge Type Required </div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Version <span className='text-danger'>*</span></Label>
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
                                            <Col md={6}>
                                                <Label>Module <span className='text-danger'>*</span></Label>
                                                {moduleValidationError && (
                                                    <span className="text-danger mx-3">
                                                        Select at least one module.
                                                    </span>
                                                )}
                                                <div>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="appointment"
                                                                checked={appointment}
                                                                onChange={(e) => setAppointment(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">Appointment </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="OPD"
                                                                checked={opd}
                                                                onChange={(e) => setOpd(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">OPD </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="IPD"
                                                                checked={ipd}
                                                                onChange={(e) => setIpd(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">IPD </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="Pathology"
                                                                checked={pathology}
                                                                onChange={(e) => setPathology(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">Pathology </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="Radiology"
                                                                checked={radiology}
                                                                onChange={(e) => setRadiology(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">Radiology </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="bloodBank"
                                                                checked={bloodBank}
                                                                onChange={(e) => setBloodBank(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">Blood Bank </Label>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="form-check mb-3">
                                                            <Input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="ambulance"
                                                                checked={ambulance}
                                                                onChange={(e) => setAmbulance(e.target.checked)}
                                                            />
                                                            <Label className="form-check-label">Ambulance </Label>
                                                        </div>
                                                    </Col>
                                                </div>

                                            </Col>
                                        </Row>
                                        <Button type="submit" color="primary">Submit</Button>
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

export default EditChargeType;