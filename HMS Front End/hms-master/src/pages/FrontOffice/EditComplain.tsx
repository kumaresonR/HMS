import moment from "moment";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Card, CardBody, Button, Row, Col, FormGroup, Label, Input, Form } from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import SetupApiService from "../../helpers/services/setup/setup-api-service";
import Flatpickr from "react-flatpickr";

const EditComplainForm = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;
    
    const [complaintTypeData, setComplaintTypeData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [complaintType, setComplaintType] = useState('');
    const [complaintValidationError, setComplaintValidationError] = useState(false);
    const [source, setSource] = useState('');
    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [assigned, setAssigned] = useState('');
    const [callTypeValidationError, setCallTypeValidationError] = useState(false);
    const [date, setDate] = useState<any>('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [contact, setContact] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState("");
    const [description, setDescription] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [callDuration, setCallDuration] = useState('');
    const [note, setNote] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [documentFile, setDocument] = useState<any>('');

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

    // const onFileUploadListener = (event: any) => {
    //     const file = event.target.files[0];
    //     setDocument(file);
    // }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Read the file as a Base64 string
            reader.onload = () => {
                const fileContent = reader.result as string;
                setDocument(fileContent); // Save the Base64 string
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
            reader.readAsDataURL(file);
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
            await frontOfficeApiService.editComplain(data.id,payload);
            navigate('/main/complaintList');
            toast.success('Complain Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllComplainType = async () => {
        try {
            let result = await setupApiService.getAllComplainType();
            console.log("getAllComplainType", result);
            setComplaintTypeData(result);
        } catch (error: any) {
            console.log("getAllComplainType Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllSource = async () => {
        try {
            let result = await setupApiService.getAllSource();
            console.log("getAllSource", result);
            setSourceData(result);
        } catch (error: any) {
            console.log("getAllSource Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setComplaintType(data.complaint);
        setSource(data.source);
        setName(data.name);
        setContact(data.contact);
        setDate(data.date);
        setDescription(data.description);
        setActionTaken(data.action_taken);
        setAssigned(data.assigned);
        setNote(data.note);
    }

    useEffect(() => {
        getAllComplainType();
        getAllSource();
        if (state?.data) {
            setData(state?.data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Complain" pageTitle="Front Office " />
                    <Card>
                        <CardBody>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Edit Complain</h5>

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
                                        <Button type="submit" color="primary">Update Complain</Button>
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

export default EditComplainForm;