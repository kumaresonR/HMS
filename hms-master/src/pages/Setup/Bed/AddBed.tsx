import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

const AddBed = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [bedGroupData, setBedGroupData] = useState<any>([]);
    const [bedGroupId, setbedGroupId] = useState('');
    const [bedGroupValidationError, setBedGroupValidationError] = useState(false);
    const [bedTypeData, setBedTypeData] = useState([]);
    const [bedTypeId, setBedTypeId] = useState('');
    const [bedTypeValidationError, setBedTypeValidationError] = useState(false);
    const [notAvailable, setNotAvailable] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleBedTypeChange = (value: any) => {
        setBedTypeId(value);
        setBedTypeValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const handleBedGroupChange = (value: any) => {
        setbedGroupId(value);
        setBedGroupValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (!bedTypeId) {
            setBedTypeValidationError(true);
            isFormValid = false;
        }

        if (!bedGroupId) {
            setBedGroupValidationError(true);
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
            createBed();
        }
    }
    const createBed = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                bedGroupId: bedGroupId,
                name: name,
                bedTypeId: bedTypeId,
                notAvailable: notAvailable
            }
            await setupApiService.createBed(payload);
            navigate('/main/bedMain');
            toast.success('Bed Details Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllBedType = async () => {
        try {
            let result = await setupApiService.getAllMasterBedType();
            setBedTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllBedGroup = async () => {
        try {
            let result = await setupApiService.getAllMasterBedGroup();
            setBedGroupData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBedType();
        getAllBedGroup();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Bed" pageTitle="Setup" />
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
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && (
                                                        <div className="invalid-feedback">Name Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <FormGroup>
                                                <Label for="bedType">Bed Type <span className='text-danger'> * </span></Label>
                                                <select
                                                    className={`form-control ${bedTypeValidationError ? 'is-invalid' : ''}`}
                                                    value={bedTypeId} onChange={(e) => { handleBedTypeChange(e.target.value) }}
                                                >
                                                    <option value="">--Select Bed Type--</option>
                                                    {bedTypeData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.bedTypeId}>{data.name}</option>
                                                    ))}
                                                </select>
                                                {bedTypeValidationError && <div className="invalid-feedback">Bed Type Required</div>}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="bedGroup">Bed Group <span className='text-danger'> * </span></Label>
                                                <select
                                                    className={`form-control ${bedGroupValidationError ? 'is-invalid' : ''}`}
                                                    value={bedGroupId} onChange={(e) => { handleBedGroupChange(e.target.value) }}
                                                >
                                                    <option value="">--Select Bed Group--</option>
                                                    {bedGroupData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.bedGroupId}>{data.bedGroupName}</option>
                                                    ))}
                                                </select>
                                                {bedGroupValidationError && <div className="invalid-feedback">Bed Group Required</div>}
                                            </FormGroup>

                                            {/* <Col md={12}>
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
                                                <div className="form-check">
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="visible"
                                                        checked={notAvailable}
                                                        onChange={(e) => setNotAvailable(e.target.checked)}
                                                    />
                                                    <Label className="form-check-label">Not available for use </Label>
                                                </div>
                                            </Col>

                                            <Col className='text-end'>
                                                <Button color="primary" type="submit">Submit</Button>
                                            </Col>
                                        </Row>
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

export default AddBed;
