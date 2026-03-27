import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import React from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";

const EditBedGroup = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.data.bedGroupId;

    const data = state?.data;

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [description, setDescription] = useState<any>('');
    const [floorData, setFloorData] = useState([]);
    const [floorId, setFloorId] = useState('');
    const [floorIdValidationError, setFloorIdValidationError] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleFloorChange = (value: any) => {
        setFloorId(value);
        setFloorIdValidationError(false);
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

        if (!floorId) {
            setFloorIdValidationError(true);
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
            editBedGroup();
        }
    }
    const editBedGroup = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                description: description,
                name: name,
                floorId: floorId
            }
            await setupApiService.editBedGroup(id,payload);
            navigate('/main/bedMain');
            toast.success('Bed Group Details Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllFloor = async () => {
        try {
            let result = await setupApiService.getAllMasterFloor();
            setFloorData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllFloor();

        if (state?.data) {
            // setModNo(data.modNo);
            setDescription(data.bedGroupDescription);
            setName(data.bedGroupName);
            if(data.floor) {
                setFloorId(data.floor.floorId);
            }
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Bed Group" pageTitle="Setup" />
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
                                                <Label for="floor">Floor <span className='text-danger'> * </span></Label>
                                                <select
                                                    className={`form-control ${floorIdValidationError ? 'is-invalid' : ''}`}
                                                    value={floorId} onChange={(e) => { handleFloorChange(e.target.value) }}
                                                >
                                                    <option value="">--Select Floor--</option>
                                                    {floorData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.floorId}>{data.floorName}</option>
                                                    ))}
                                                </select>
                                                {floorIdValidationError && <div className="invalid-feedback">Floor Required</div>}
                                            </FormGroup>

                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="description">Description </Label>
                                                    <Input
                                                        type="textarea"
                                                        id="description"
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
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
        </React.Fragment >
    );
};

export default EditBedGroup;