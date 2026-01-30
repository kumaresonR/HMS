import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import React from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";

const statusData = [
    {
        status: "Pending"
    },
    {
        status: "Approved"
    }
]
const EditReferralCategory = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [name, setName] = useState<any>('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [status, setStatus] = useState('');
    const [statusValidationError, setStatusValidationError] = useState(false);
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    // const handleStatusChange = (value: any) => {
    //     setStatus(value);
    //     setStatusValidationError(false);
    // }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        // if (!status) {
        //     setStatusValidationError(true);
        //     isFormValid = false;
        // }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            editReferralCategory();
        }
    }
    const editReferralCategory = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                name: name,
                // status: status
            };
            await setupApiService.editReferralCategory(data.categoryId, payload);
            navigate('/main/referralMainSetup');
            toast.success('Referral Category Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setName(data.name);
            // setStatus(data.status);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Referral Category" pageTitle="Setup" />
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
                                        <Row className='align-items-center'>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="name"> Name <span className='text-danger'>*</span> </Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && <div className="invalid-feedback">Name  Required</div>}
                                                </FormGroup>
                                            </Col>

                                                {/* <FormGroup>
                                                    <Label for="status">Status</Label>
                                                    <select
                                                        className={`form-control ${statusValidationError ? 'is-invalid' : ''}`}
                                                        value={status} onChange={(e) => { handleStatusChange(e.target.value) }}
                                                    >
                                                        <option value="">--Select Status--</option>
                                                        {statusData.map((data: any, idx: any) => (
                                                            <option key={idx} value={data.status}>{data.status}</option>
                                                        ))}
                                                    </select>
                                                    {statusValidationError && <div className="invalid-feedback">Status Required</div>}
                                                </FormGroup> */}
                                                {/* <FormGroup>
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
                                                </FormGroup> */}
                                        </Row>

                                        <Col className='text-end'>
                                            <Button type="submit" color="primary">Submit</Button>
                                        </Col>
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

export default EditReferralCategory