import React, { useState, } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddFloor = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [floorName, setFloorName] = useState('');
    const [floorNameValidationError, setFloorNameValidationError] = useState(false);
    const [roomCount, setRoomCount] = useState<any>('');
    const [roomCountValidationError, setRoomCountValidationError] = useState(false);
    const [description, setDescription] = useState<any>('');

    const handleFloorNameChange = (value: any) => {
        setFloorName(value);
        setFloorNameValidationError(false);
    }

    const handleRoomeCountChange = (value: any) => {
        setRoomCount(value);
        setRoomCountValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!floorName) {
            setFloorNameValidationError(true);
            isFormValid = false;
        }

        if (!roomCount) {
            setRoomCountValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createFloor();
        }
    }
    const createFloor = async () => {
        try {
            const payload: any = {
                roomCount: roomCount,
                description: description,
                floorName: floorName,
            }
            await setupApiService.createFloor(payload);
            navigate('/main/bedMain');
            toast.success('Floor Details Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Floor" pageTitle="Setup" />
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
                                                    <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={floorName}
                                                        onChange={e => handleFloorNameChange(e.target.value)}
                                                        invalid={!!floorNameValidationError}
                                                    />
                                                    {floorNameValidationError && (
                                                        <div className="invalid-feedback">Name Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="roomCount">Room Count <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="roomCount"
                                                        value={roomCount}
                                                        onChange={e => handleRoomeCountChange(e.target.value)}
                                                        invalid={!!roomCountValidationError}
                                                    />
                                                    {roomCountValidationError && (
                                                        <div className="invalid-feedback">Room Count Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={12}>
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

export default AddFloor;
