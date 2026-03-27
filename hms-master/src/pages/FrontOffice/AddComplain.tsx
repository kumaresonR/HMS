import React, { useEffect, useState } from 'react';
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FrontOfficeApiService from '../../helpers/services/front-office/front-office-api-service';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import moment from 'moment';
import Flatpickr from "react-flatpickr";
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';

const AddComplainForm = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [complaintTypeData, setComplaintTypeData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [complaintType, setComplaintType] = useState('');
    const [complaintValidationError, setComplaintValidationError] = useState(false);
    const [source, setSource] = useState('');
    const [name, setName] = useState('');
    const [assigned, setAssigned] = useState('');
    const [date, setDate] = useState<any>('');
    const [contact, setContact] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState("");
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [documentFile, setDocument] = useState<any>('');
    const data = { complaintType, source, name, contact,date,description,actionTaken,assigned,note,documentFile }

    const handleComplaintByChange = (value: any) => {
        setName(value);
        setComplaintValidationError(false);
    }

    const handlePhoneChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        setContact(numericValue);
        if (numericValue.length !== 10) {
            setPhoneValidationError("Phone number must be exactly 10 digits.");
        } else {
            setPhoneValidationError("");
        }
    };

    const handleDateChange = (dates: Date[]) => {
        if (dates[0]) {
            const formattedDate = moment(dates[0]).format("DD/MM/YYYY");
            setDate(formattedDate);
        }
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setComplaintValidationError(true);
            isFormValid = false;
        }

        if (contact && !/^[0-9]{10}$/.test(contact)) {
            setPhoneValidationError("Phone number must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setPhoneValidationError("");
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createComplain();
        }
    }
    const createComplain = async () => {
        try {
            const payload: any = {
                complaint: complaintType,
                source: source,
                name: name,
                contact: contact,
                date: date,
                description: description || 'NA',
                action_taken: actionTaken || 'NA',
                assigned: assigned || 'NA',
                note: note || 'NA',
                file: documentFile
            }
            await frontOfficeApiService.createComplain(payload);
            navigate('/main/complaintList');
            toast.success('Complain Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllComplainType = async () => {
        try {
            let result = await setupApiService.getAllComplainType();
            setComplaintTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllSource = async () => {
        try {
            let result = await setupApiService.getAllSource();
            setSourceData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllComplainType();
        getAllSource();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setComplaintType(location?.state?.complaintType);
            setSource(location?.state?.source);
            setName(location?.state?.name);
            setContact(location?.state?.contact);
            setDate(location?.state?.date);
            setDescription(location?.state?.description);
            setActionTaken(location?.state?.actionTaken);
            setAssigned(location?.state?.assigned);
            setNote(location?.state?.note);
            setDocument(location?.state?.documentFile);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Complain"
                        pageTitle="Front Office "
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Complain",
                            data
                        }))} />
                    <Card>
                        <CardBody>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Add Complain</h5>

                                <Link to="/main/complaintList" className="text-end">
                                    <Button
                                        color="primary"
                                        className="btn btn-primary add-btn"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </Link>
                            </div>


                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="complainType">Complain Type</Label>
                                                    <Input
                                                        type="select"
                                                        id="complainType"
                                                        value={complaintType}
                                                        onChange={e => setComplaintType(e.target.value)}
                                                    >
                                                        <option value="">Select Complain Type</option>
                                                        {complaintTypeData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.complainType}>{item.complainType}</option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="source">Source</Label>
                                                    <Input
                                                        type="select"
                                                        id="source"
                                                        value={source}
                                                        onChange={e => setSource(e.target.value)}
                                                    >
                                                        <option value="">Select Source</option>
                                                        {sourceData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.source}>{item.source}</option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="complainBy">Complain By <span className='text-danger'>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="complainBy"
                                                        value={name}
                                                        onChange={e => handleComplaintByChange(e.target.value)}
                                                        invalid={!!complaintValidationError}
                                                    />
                                                    {complaintValidationError && <div className="invalid-feedback">Complain By Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="phone">Phone</Label>
                                                    <Input
                                                        type="text"
                                                        id="phone"
                                                        value={contact}
                                                        onChange={e => handlePhoneChange(e.target.value)}
                                                        invalid={!!phoneValidationError}
                                                        maxLength={10}
                                                    />
                                                    {phoneValidationError && <div className="invalid-feedback">{phoneValidationError}</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date">Date</Label>
                                                    <Flatpickr id="date"
                                                        className={`form-control`}
                                                        name="date"
                                                        value={date}
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                        }}
                                                        onChange={handleDateChange}
                                                        placeholder="Select date"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="actionTaken">Action Taken</Label>
                                                    <Input
                                                        type="text"
                                                        id="actionTaken"
                                                        value={actionTaken}
                                                        onChange={e => setActionTaken(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <textarea
                                                        id="description"
                                                        className={`form-control`}
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* <Col md={6}>
                                                <FormGroup>
                                                    <Label for="document">Attach Document</Label>
                                                    <Input
                                                        type="file"
                                                        id="document"
                                                        className={`form-control`}
                                                        onChange={onFileUploadListener}
                                                    />
                                                </FormGroup>
                                            </Col> */}
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="assigned">Assigned</Label>
                                                    <Input
                                                        type="text"
                                                        id="assigned"
                                                        value={assigned}
                                                        onChange={e => setAssigned(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>
                                                    <textarea
                                                        id="note"
                                                        className={`form-control`}
                                                        value={note}
                                                        onChange={e => setNote(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button type="submit" color="primary">Add Complain</Button>
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

export default AddComplainForm;
