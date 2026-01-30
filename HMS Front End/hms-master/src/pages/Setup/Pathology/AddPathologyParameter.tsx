import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
    Label,
    Input,
    Button,
    Form,
    FormGroup,
    Card,
    Col,
    Container,
    Row,
    CardBody,
} from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";

const AddPathologyParameter = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [parameterName, setParameterName] = useState('');
    const [parameterNameValidationError, setParameterNameValidationError] = useState(false);
    const [unit, setUnitName] = useState('');
    const [unitValidationError, setUnitNameValidationError] = useState(false);
    const [referenceRangeFrom, setReferenceRangeFrom] = useState<any>('');
    const [referenceRangeFromValidationError, setReferenceRangeFromValidationError] = useState(false);
    const [referenceRangeTo, setReferenceRangeTo] = useState('');
    const [referenceRangeToValidationError, setReferenceRangeToValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [unitData, setUnitData] = useState<any>([]);

    const handleParameterNameChange = (value: any) => {
        setParameterName(value);
        setParameterNameValidationError(false);
    }

    const handleUnitChange = (value: any) => {
        setUnitName(value);
        setUnitNameValidationError(false);
    }

    const handleReferenceRangeFrom = (value: any) => {
        setReferenceRangeFrom(value);
        setReferenceRangeFromValidationError(false);
    }

    const handleReferenceRangeTo = (value: any) => {
        setReferenceRangeTo(value);
        setReferenceRangeToValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!parameterName) {
            setParameterNameValidationError(true);
            isFormValid = false;
        }

        if (!unit) {
            setUnitNameValidationError(true);
            isFormValid = false;
        }

        if (!referenceRangeFrom) {
            setReferenceRangeFromValidationError(true);
            isFormValid = false;
        }

        if (!referenceRangeTo) {
            setReferenceRangeToValidationError(true);
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
            createParameter();
        }
    }
    const createParameter = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                parameterName: parameterName,
                referenceRangeFrom: referenceRangeFrom,
                referenceRangeTo: referenceRangeTo,
                unit: unit,
                description: description
            }
            await setupApiService.createPathologyParameter(payload);
            navigate('/main/PathologyMainSetup');
            toast.success('Parameter Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllPathologyUnit = async () => {
        try {
            let result = await setupApiService.getAllPathologyUnit();
            setUnitData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllPathologyUnit();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Pathology Parameter" pageTitle="Setup" />
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
                        <Form onSubmit={handleSubmit}>
                            <Row >
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="parameterName">Parameter Name <span className='text-danger'> * </span></Label>
                                        <Input
                                            type="text"
                                            id="parameterName"
                                            value={parameterName}
                                            onChange={e => handleParameterNameChange(e.target.value)}
                                            invalid={!!parameterNameValidationError}
                                        />
                                        {parameterNameValidationError && (
                                            <div className="invalid-feedback">Parameter Name Required</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="unit">Unit <span className='text-danger'> * </span></Label>
                                        <Input
                                            type="select"
                                            id="unit"
                                            value={unit}
                                            onChange={e => handleUnitChange(e.target.value)}
                                            invalid={!!unitValidationError}
                                        >
                                            <option value="">Select Unit</option>
                                            {unitData.map((item: any, idx: any) => (
                                                <option key={idx} value={item.unitName}>{item.unitName}</option>
                                            ))}
                                        </Input>
                                        {unitValidationError && (
                                            <div className="invalid-feedback">Unit Required</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="referenceRangeFrom">Reference Range From <span className='text-danger'> * </span></Label>
                                        <Input
                                            type="text"
                                            id="referenceRangeFrom"
                                            value={referenceRangeFrom}
                                            onChange={e => handleReferenceRangeFrom(e.target.value)}
                                            invalid={!!referenceRangeFromValidationError}
                                        />
                                        {referenceRangeFromValidationError && (
                                            <div className="invalid-feedback">Reference Range From Required</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="referenceRangeTo">Reference Range To <span className='text-danger'> * </span></Label>
                                        <Input
                                            type="text"
                                            id="referenceRangeTo"
                                            value={referenceRangeTo}
                                            onChange={e => handleReferenceRangeTo(e.target.value)}
                                            invalid={!!referenceRangeToValidationError}
                                        />
                                        {referenceRangeToValidationError && (
                                            <div className="invalid-feedback">Reference Range To Required</div>
                                        )}
                                    </FormGroup>
                                </Col>

                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Input
                                            type="textarea"
                                            id="description"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
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
                                <Col md={12}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment >
    );
};

export default AddPathologyParameter;
