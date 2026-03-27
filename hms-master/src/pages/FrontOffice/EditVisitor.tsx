import moment from "moment";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Card, CardBody, Button, Row, Col, FormGroup, Label, Input, Form } from "reactstrap";
import { customStyles } from "../../common/data/FakeData";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import IPDApiService from "../../helpers/services/ipd/ipd-api-service";
import OPDApiService from "../../helpers/services/opd/opd-api-service";
import SetupApiService from "../../helpers/services/setup/setup-api-service";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

const visitData = [
    {
        name: "Staff"
    },
    {
        name: "OPD Patient"
    },
    {
        name: "IPD Patient"
    }
]
const EditVisitor = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const iPDApiService: IPDApiService = new IPDApiService();
    const oPDApiService: OPDApiService = new OPDApiService();

    let navigate: any = useNavigate();
    
    const { state } = useLocation();

    const data = state?.data;

    const [purposeData, setPurposeData] = useState([]);
    const [staffData, setStaffData] = useState<any>([]);
    const [purpose, setPurpose] = useState('');
    const [purposeValidationError, setPurposeValidationError] = useState(false);
    const [idCard, setIdCard] = useState('');
    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [visitTo, setVisitTo] = useState('');
    const [date, setDate] = useState<any>('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [contact, setContact] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState("");
    const [ipdOpdStaff, setipdOpdStaff] = useState('');
    const [relatedTo, setRelatedTo] = useState('');
    const [noOfPeople, setNoOfPeople] = useState('');
    const [inTime, setInTime] = useState('');
    const [note, setNote] = useState('');
    const [outTime, setOutTime] = useState('');
    const [documentFile, setDocument] = useState<any>('');

    const handleInTimeChange = (value: string) => {
        const timeInAMPM = moment(value, 'HH:mm').format('hh:mm A');
        setInTime(timeInAMPM);
    };

    const handleOutTimeChange = (value: string) => {
        const timeInAMPM = moment(value, 'HH:mm').format('hh:mm A');
        setOutTime(timeInAMPM);
    };
    const handlePurposeChange = (value: any) => {
        setPurpose(value);
        setPurposeValidationError(false);
    }

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
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
            setDateValidationError(false);
        }
    };

    const handleVisitTo = (value: any) => {
        setVisitTo(value);
        getAllEmployee(value);
    }

    const handleStaffId = (value: any) => {
        setipdOpdStaff(value.label);
        setRelatedTo(value.label)
    }

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

        if (!purpose) {
            setPurposeValidationError(true);
            isFormValid = false;
        }

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
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
                purpose: purpose,
                id_card: idCard || 'NA',
                name: name,
                contact: contact,
                date: date,
                visit_to: visitTo || 'NA',
                ipd_opd_staff: ipdOpdStaff || 'NA',
                no_of_people: noOfPeople,
                in_time: inTime,
                out_time: outTime,
                note: note || 'NA',
                file: documentFile
            }
            await frontOfficeApiService.editVisitors(data.id,payload);
            navigate('/main/visitorList');
            toast.success('Visitors Details Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllPurpose = async () => {
        try {
            let result = await setupApiService.getAllPurpose();
            console.log("getAllPurpose", result);
            setPurposeData(result);
        } catch (error: any) {
            console.log("getAllPurpose Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllEmployee = async (value: any) => {
        try {
            let result;
            if (value === "Staff") {
                result = await employeeApiService.getAllEmployee();
            } else if (value === "OPD Patient") {
                result = await oPDApiService.getAllOPD("all");
            } else if (value === "IPD Patient") {
                result = await iPDApiService.getAllIPD("all");
            } else {
                setStaffData([]);
                return;
            }

            console.log(`getAllEmployee - ${value}:`, result);
            setStaffData(result);
        } catch (error: any) {
            console.log("Error in getAllEmployee:", error);
            ErrorHandler(error);
        }
    };

    const setData = (data: any) => {
        setPurpose(data.purpose);
        setIdCard(data.id_card);
        setName(data.name);
        setContact(data.contact);
        setDate(data.date);
        setVisitTo(data.visit_to);
        if(data.visit_to) {
            handleVisitTo(data.visit_to);
        }
        setVisitTo(data.visit_to);
        if(data.ipd_opd_staff) {
            handleStaffId(data.ipd_opd_staff);
        }
        setipdOpdStaff(data.ipd_opd_staff);

        setRelatedTo(data.ipd_opd_staff);
        setNoOfPeople(data.no_of_people);
        setInTime(data.in_time);
        setOutTime(data.out_time);
        setNote(data.note);
    }

    useEffect(() => {
        getAllPurpose();
        if (state?.data) {
            setData(state?.data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Visitors" pageTitle="Front Office" />
                    <Card>
                        <CardBody>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Edit Visitor Details </h5>

                                <Link to="/main/visitorList" className="text-end">
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
                                                    <Label for="purpose">Purpose</Label>
                                                    <Input
                                                        type="select"
                                                        id="purpose"
                                                        value={purpose}
                                                        onChange={e => handlePurposeChange(e.target.value)}
                                                        invalid={!!purposeValidationError}>
                                                        <option value="">Select Purpose</option>
                                                        {purposeData?.map((data: any, idx: any) => (
                                                            <option key={idx} value={data.purpose}>{data.purpose}</option>
                                                        ))}
                                                    </Input>
                                                    {purposeValidationError && <div className="invalid-feedback">Purpose Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="name">Name</Label>
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
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="phone">Phone</Label>
                                                    <Input
                                                        type="text"
                                                        id="phone"
                                                        maxLength={10}
                                                        value={contact}
                                                        onChange={e => handlePhoneChange(e.target.value)}
                                                        invalid={!!phoneValidationError}
                                                    />
                                                    {phoneValidationError && <div className="invalid-feedback">{phoneValidationError}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="idCard">ID Card</Label>
                                                    <Input
                                                        type="text"
                                                        id="idCard"
                                                        value={idCard}
                                                        onChange={e => setIdCard(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="visitTo">Visit To</Label>
                                                    <Input
                                                        type="select"
                                                        id="visitTo"
                                                        value={visitTo}
                                                        onChange={e => handleVisitTo(e.target.value)}
                                                    >
                                                        <option value="">--Select--</option>
                                                        {visitData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.name}>{item.name}</option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="ipdOpdStaff">IPD/OPD/Staff</Label>
                                                    <Select
                                                        id="ipdOpdStaff"
                                                        value={{ label: ipdOpdStaff, value: ipdOpdStaff }}
                                                        onChange={handleStaffId}
                                                        options={staffData
                                                            .map((item: any) => {
                                                                if (item.staffId) {
                                                                    return {
                                                                        label: `${item.firstName} ${item.lastName} (${item.staffId})`,
                                                                        value: item.staffId,
                                                                    };
                                                                } else if (item.ipdId) {
                                                                    return {
                                                                        label: `${item.patient.firstName} ${item.patient.lastName} (${item.ipdId})`,
                                                                        value: item.ipdId,
                                                                    };
                                                                } else if (item.opdId) {
                                                                    return {
                                                                        label: `${item.patient.firstName} ${item.patient.lastName} (${item.opdId})`,
                                                                        value: item.opdId,
                                                                    };
                                                                }
                                                                return null;
                                                            })
                                                            .filter(Boolean)}
                                                        styles={customStyles}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="relatedTo">Related To</Label>
                                                    <Input
                                                        type="text"
                                                        id="relatedTo"
                                                        value={relatedTo}
                                                        onChange={e => setRelatedTo(e.target.value)}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="numberOfPersons">Number Of Persons</Label>
                                                    <Input
                                                        type="number"
                                                        id="numberOfPersons"
                                                        value={noOfPeople}
                                                        onChange={e => setNoOfPeople(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date">Date</Label>
                                                    <Flatpickr id="date"
                                                        className={`${dateValidationError ? 'is-invalid' : ''} form-control`}
                                                        name="date"
                                                        value={date}
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                        }}
                                                        onChange={handleDateChange}
                                                        placeholder="Select date"
                                                    />
                                                    {dateValidationError && <div className="invalid-feedback">Date Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="inTime">In Time</Label>
                                                    <Input
                                                        type="time"
                                                        id="inTime"
                                                        value={moment(inTime, 'hh:mm A').format('HH:mm')}
                                                        onChange={e => handleInTimeChange(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="outTime">Out Time</Label>
                                                    <Input
                                                        type="time"
                                                        id="outTime"
                                                        value={moment(outTime, 'hh:mm A').format('HH:mm')}
                                                        onChange={e => handleOutTimeChange(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>
                                                    <Input
                                                        type="text"
                                                        id="note"
                                                        value={note}
                                                        onChange={e => setNote(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="attachDocument">Attach Document</Label>
                                                    <Input
                                                        type="file"
                                                        id="document"
                                                        className={`form-control`}
                                                        onChange={onFileUploadListener}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row> */}

                                        <Button color="primary" type="submit">Update Visitor</Button>
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

export default EditVisitor;