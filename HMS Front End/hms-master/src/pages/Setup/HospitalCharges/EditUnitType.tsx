import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const EditUnitType = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [unit, setUnit] = useState('');
    const [unitValidationError, setUnitValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleUnitChange = (value: any) => {
        setUnit(value);
        setUnitValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!unit) {
            setUnitValidationError(true);
            isFormValid = false;
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
            editUnitType();
        }
    }
    const editUnitType = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                unitType: unit,
            }
            await setupApiService.editUnitType(data.id, payload);
            navigate('/main/hospitalMain');
            toast.success('Unit Type Update Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        // setModNo(data.modNo);
        setUnit(data.unitType);
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
                    <FormHeader title="Edit Unit Type" pageTitle="Setup" />
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
                                                    <Label for="unit">Unit <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="unit"
                                                        value={unit}
                                                        onChange={e => handleUnitChange(e.target.value)}
                                                        invalid={!!unitValidationError}
                                                    />
                                                    {unitValidationError && <div className="invalid-feedback">Unit Required </div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Version <span className='text-danger'> * </span></Label>
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
                                        </Row>
                                        <Button color="primary" type="submit">Submit</Button>
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

export default EditUnitType;