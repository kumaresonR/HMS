import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditPathologyUnit = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [unitsName, setUnitsName] = useState('');
    const [unitsNameValidationError, setUnitsNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleUnitsNameChange = (value: any) => {
        setUnitsName(value);
        setUnitsNameValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!unitsName) {
            setUnitsNameValidationError(true);
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
            editPathalogyUnit();
        }
    }
    const editPathalogyUnit = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                unitName: unitsName,
            }
            await setupApiService.editPathalogyUnit(data.id,payload);
            navigate('/main/PathologyMainSetup');
            toast.success('Unit Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setUnitsName(data.unitName);
        // setModNo(data.modNo);
    }

    useEffect(() => {
        if (state?.data) {
            setData(data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Units" pageTitle="Setup" />
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
                                            <Col>
                                                <FormGroup>
                                                    <Label for="unitsName">units Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="unitsName"
                                                        value={unitsName}
                                                        onChange={e => handleUnitsNameChange(e.target.value)}
                                                        invalid={!!unitsNameValidationError}
                                                    />
                                                    {unitsNameValidationError && <div className="invalid-feedback">Unit Name Required</div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col>
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

export default EditPathologyUnit;