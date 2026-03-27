import React, { useEffect, useState } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import AmbulanceApiService from '../../helpers/services/ambulance/ambulance-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';


const AddAmbulance = () => {
    const ambulanceApiService: AmbulanceApiService = new AmbulanceApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleNumberValidationError, setVehicleNumberValidationError] = useState(false);
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleModelValidationError, setVehicleModelValidationError] = useState(false);
    const [yearMade, setYearMade] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverLicense, setDriverLicense] = useState('');
    const [driverContact, setDriverContact] = useState('');
    const [driverContactValidationError, setDriverContactValidationError] = useState(false);
    const [note, setNote] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleTypeValidationError, setVehicleTypeValidationError] = useState(false);

    const handleVehicleNumberChange = (value: any) => {
        setVehicleNumber(value);
        setVehicleNumberValidationError(false);
    }

    const handleVehicleModelChange = (value: any) => {
        setVehicleModel(value);
        setVehicleModelValidationError(false);
    }

    const handleVehicleTypeChange = (value: any) => {
        setVehicleType(value);
        setVehicleTypeValidationError(false);
    }

    const handleDriverContactChange = (value: any) => {
        if (/^\d{0,10}$/.test(value)) {
            setDriverContact(value);
            setDriverContactValidationError(value.length !== 10);
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateComponent();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!vehicleNumber) {
            setVehicleNumberValidationError(true);
            isFormValid = false;
        }
        if (!vehicleModel) {
            setVehicleModelValidationError(true);
            isFormValid = false;
        }
        if (!vehicleType) {
            setVehicleTypeValidationError(true);
            isFormValid = false;
        }

        if (driverContact) {
            if (driverContact.length !== 10) {
                setDriverContactValidationError(true);
                isFormValid = false;
            }
        }

        return isFormValid;
    };

    const doCreateComponent = async () => {
        try {
            const payload: any = {
                vehicleNumber: vehicleNumber,
                vehicleModel: vehicleModel,
                yearMade: yearMade || 'NA',
                driverName: driverName || 'NA',
                driverLicense: driverLicense || 'NA',
                driverContact: driverContact || 'NA',
                vehicleType: vehicleType || 'NA',
                note: note || 'NA'
            };
            await ambulanceApiService.createAmbulanceList(payload);
            toast.success('Ambulance Details Added Successfully', { containerId: 'TR' });
            navigate('/main/ambulanceList')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        // Restore data if available
        if (location?.state) {
            setVehicleNumber(location?.state?.vehicleNumber);
            setVehicleModel(location?.state?.vehicleModel);
            setYearMade(location?.state?.yearMade);
            setDriverName(location?.state?.driverName);
            setDriverLicense(location?.state?.driverLicense);
            setDriverContact(location?.state?.driverContact);
            setVehicleType(location?.state?.vehicleType);
            setNote(location?.state?.note)
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Ambulance"
                        pageTitle="Transportation Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Ambulance",
                            data: { vehicleNumber, vehicleModel, yearMade, driverName, driverLicense, driverContact, vehicleType, note }
                        }))} />
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
                                                    <Label for="vehicleNumber">Vehicle Number <span className='text-danger'> * </span></Label>
                                                    <Input type="text"
                                                        id="vehicleNumber"
                                                        value={vehicleNumber}
                                                        onChange={e => handleVehicleNumberChange(e.target.value)}
                                                        invalid={!!vehicleNumberValidationError}
                                                    />
                                                    {vehicleNumberValidationError && <div className="invalid-feedback">Vehicle Number Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="vehicleModel">Vehicle Model <span className='text-danger'> * </span></Label>
                                                    <Input type="text"
                                                        id="vehicleModel"
                                                        value={vehicleModel}
                                                        onChange={e => handleVehicleModelChange(e.target.value)}
                                                        invalid={!!vehicleModelValidationError}
                                                    />
                                                    {vehicleModelValidationError && <div className="invalid-feedback">Vehicle Model Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="yearMade">Year Made</Label>
                                                    <Input
                                                        type="text"
                                                        id="yearMade"
                                                        value={yearMade}
                                                        onChange={e => setYearMade(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="driverName">Driver Name</Label>
                                                    <Input type="text"
                                                        id="driverName"
                                                        value={driverName}
                                                        onChange={e => setDriverName(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="driverLicense">Driver License</Label>
                                                    <Input
                                                        type="text"
                                                        id="driverLicense"
                                                        value={driverLicense}
                                                        onChange={e => setDriverLicense(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="driverContact">Driver Contact</Label>
                                                    <Input
                                                        type="text"
                                                        id="driverContact"
                                                        value={driverContact}
                                                        onChange={e => handleDriverContactChange(e.target.value)}
                                                        invalid={driverContactValidationError}
                                                    />
                                                    {driverContactValidationError && (
                                                        <div className="text-danger">
                                                            Please enter a valid 10-digit mobile number.
                                                        </div>
                                                    )}

                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="vehicleType">Vehicle Type <span className='text-danger'> * </span></Label>
                                                    <Input type="select" id="vehicleType"
                                                        value={vehicleType}
                                                        onChange={e => handleVehicleTypeChange(e.target.value)}
                                                        invalid={vehicleTypeValidationError}>
                                                        <option value="">Select Vehicle Type</option>
                                                        <option value="Owned">Owned</option>
                                                        <option value="Contractual">Contractual</option>
                                                    </Input>
                                                    {vehicleTypeValidationError && <div className="invalid-feedback">Vehicle Type Required</div>}
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>

                                                    <Input
                                                        type="textarea"
                                                        id="note"
                                                        value={note}
                                                        onChange={e => setNote(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add Ambulance</Button>
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

export default AddAmbulance;
