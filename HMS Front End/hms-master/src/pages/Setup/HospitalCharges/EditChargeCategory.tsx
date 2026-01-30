import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import React from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../../common/FormHeader/FormHeader";

const EditChargeCategory = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [chargeTypeData, setChargeTypeData] = useState<any>([]);
    const [chargeType, setChargeType] = useState('');
    const [chargeTypeId, setChargeTypeId] = useState('');
    const [chargeTypeValidationError, setChargeTypeValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [descriptionValidationError, setDescriptionValidationError] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleChargeTypeChange = (selectedChargeType: string) => {
        const selectedItem = chargeTypeData.find((item: any) => item.chargeTypeId === selectedChargeType);

        if (selectedItem) {
            setChargeType(selectedItem.chargeType);
            setChargeTypeId(selectedItem.chargeTypeId);
        } else {
            setChargeType('');
            setChargeTypeId('');
        }

        setChargeTypeValidationError(false);
    };

    const handleDescriptionChange = (value: any) => {
        setDescription(value);
        setDescriptionValidationError(false);
    }

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

        if (!chargeTypeId) {
            setChargeTypeValidationError(true);
            isFormValid = false;
        }

        if (!description) {
            setDescriptionValidationError(true);
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
            editChargesCategory();
        }
    }
    const editChargesCategory = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                chargeType: chargeType,
                name: name,
                chargeTypeId: chargeTypeId,
                description: description
            }
            await setupApiService.editChargesCategory(data.categoryId,payload);
            navigate('/main/hospitalMain');
            toast.success('Charge Category Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }
    const getAllTmChargesType = async () => {
        try {
            let result = await setupApiService.getAllTmChargesType();
            setChargeTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data:any) => {
        // setModNo(data.modNo);
        // setChargeType(data.chargeType);
        setChargeTypeId(data.chargeTypeId);
        setName(data.name);
        setDescription(data.description);
    }

    useEffect(() => {
        getAllTmChargesType();
        if (state?.data) {
            setData(state?.data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Charge Category" pageTitle="Setup" />
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
                                                    <Label for="chargeType">Charge Type <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="select"
                                                        id="chargeType"
                                                        value={chargeTypeId}
                                                        onChange={e => handleChargeTypeChange(e.target.value)}
                                                        invalid={!!chargeTypeValidationError}
                                                    >
                                                        <option value="">Select Charge Type</option>
                                                        {chargeTypeData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.chargeTypeId}>{item.chargeType}</option>
                                                        ))}
                                                    </Input>
                                                    {chargeTypeValidationError && <div className="invalid-feedback">Charge Type Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && <div className="invalid-feedback">Name Required</div>}
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="description">Description <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="textarea"
                                                        id="description"
                                                        value={description}
                                                        onChange={e => handleDescriptionChange(e.target.value)}
                                                        invalid={!!descriptionValidationError}
                                                    />
                                                    {descriptionValidationError && <div className="invalid-feedback">Description Required</div>}
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

export default EditChargeCategory;