import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import FormHeader from "../../../common/FormHeader/FormHeader"
import GetPatient from "./GetPatient"
import { isOldPatient } from "../../../common/data/FakeData";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import TpaApiService from "../../../helpers/services/tpa/tpa-api-service";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const AddPatient = () => {
    const ipdApiService: IPDApiService = new IPDApiService();
    const patientApiService: PatientApiService = new PatientApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const tpaApiService: TpaApiService = new TpaApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [symptomsType, setSymptomsType] = useState<any>('');
    const [symptomsTitle, setSymptomsTitle] = useState<any>('');
    const [symptomsDescription, setSymptomsDescription] = useState('');

    const [note, setNote] = useState('');
    const [previousMedicalIssue, setPreviousMedicalIssue] = useState('');
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 16);
    const [admissionDate, setAdmissionDate] = useState('');
    const [admissionDateValidationError, setAdmissionDateValidationError] = useState(false);
    const [consultantDoctor, setConsultDoctor] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [oldPatient, setOldPatient] = useState(false);
    const [cardLimit, setCardLimit] = useState(20000);
    const [cardLimitValidationError, setCardLimitValidationError] = useState(false);
    const [casualty, setCasualty] = useState(false);
    const [bedGroup, setBedGroup] = useState('');
    const [bedGroupNumber, setBedGroupNumber] = useState('');
    const [bedGroupNumberValidationError, setBedGroupNumberValidationError] = useState(false);
    const [reference, setReference] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [insuranceId, setInsuranceId] = useState('');
    const [insuranceData, setInsuranceData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [bedGroupData, setBedGroupData] = useState<any>([]);
    const [roomData, setRoomData] = useState<any[]>([]);
    const data = { selectedPatientId, consultantDoctor, admissionDate,bedGroup,roomData, bedGroupNumber, symptomsType, symptomsTitle, symptomsDescription, note, insuranceId, reference, previousMedicalIssue, casualty, oldPatient, cardLimit, options }

    const handleAdmissionDateChange = (value: any) => {
        setAdmissionDate(value);
        setAdmissionDateValidationError(false);
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            setOptions(result)
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['employeeId'];
        setConsultDoctor(doctorId);
        setConsultantDoctorValidationError(false);
    }

    const handleCardLimitChange = (value: any) => {
        setCardLimit(value);
        setCardLimitValidationError(false);
    }

    const handleBedGroupChange = (value: any) => {
        setBedGroup(value);
        getAllRommByBedGroupId(value);
    }

    const handleBedGroupNumberChange = (value: any) => {
        setBedGroupNumber(value);
        setBedGroupNumberValidationError(false);
    }

    const handleSelectedPatientIdChange = (id: any) => {
        setSelectedPatientId(id);
        console.log("Selected Patient ID in Parent:", id);
        getPatientDataById(id)
    };

    const getPatientDataById = async (id: any) => {
        try {
            let data = await patientApiService.getPatientById(id);
            setInsuranceId(data?.insuranceProviders?.insuranceId);
        } catch (error: any) {
            return ErrorHandler(error)
        }

    }

    const handleInsuranceChange = (id: any) => {
        setInsuranceId(id);
    };

    const fetchInsuranceData = async () => {
        try {
            let res: any = await tpaApiService.getAllTpa();
            setInsuranceData(res);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllBedGroupData = async () => {
        try {
            let result = await setupApiService.getAllMasterBedGroup();
            setBedGroupData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRommByBedGroupId = async (id: any) => {
        try {
            let result = await setupApiService.getAllRommByBedGroupId(id);
            setRoomData(result || []);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!selectedPatientId) {
            toast.warning('Please Select Patient', { containerId: 'TR' });
            isFormValid = false;
        }

        if (!admissionDate) {
            setAdmissionDateValidationError(true);
            isFormValid = false;
        }

        if (!consultantDoctor) {
            setConsultantDoctorValidationError(true);
            isFormValid = false;
        }

        if (!cardLimit) {
            setCardLimitValidationError(true);
            isFormValid = false;
        }

        if (!bedGroupNumber) {
            setBedGroupNumberValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateAppointment();
        }
    };
    const doCreateAppointment = async () => {
        try {
            let payload: any = {
                patientId: selectedPatientId,
                doctorId: consultantDoctor,
                admissionDate: admissionDate,
                roomId: bedGroupNumber,
                symptomsType: symptomsType,
                symptomsTitle: symptomsTitle,
                symptomsDescription: symptomsDescription,
                note: note || 'NA',
                tpa: insuranceId || null,
                reference: reference || 'NA',
                previousMedicalIssue: previousMedicalIssue,
                casualty: casualty,
                oldPatient: oldPatient,
                creditLimit: cardLimit
            }
            await ipdApiService.createIPD(payload);
            toast.success('Admission Created Successfully', { containerId: 'TR' });
            navigate('/main/inPatient-datatable');
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        fetchInsuranceData();
        getAllBedGroupData();
    }, [])

    useEffect(() => {
        if (location?.state) {
            setOptions(location?.state?.options)
            setSelectedPatientId(location?.state?.selectedPatientId);
            setConsultDoctor(location?.state?.consultantDoctor);
            setAdmissionDate(location?.state?.admissionDate);
            setBedGroup(location?.state?.bedGroup);
            setRoomData(location?.state?.roomData);
            setBedGroupNumber(location?.state?.bedGroupNumber);
            setSymptomsType(location?.state?.symptomsType);
            setSymptomsTitle(location?.state?.symptomsTitle);
            setSymptomsDescription(location?.state?.symptomsDescription);
            setNote(location?.state?.note);
            setInsuranceId(location?.state?.insuranceId);
            setReference(location?.state?.reference);
            setPreviousMedicalIssue(location?.state?.previousMedicalIssue);
            setCasualty(location?.state?.casualty);
            setOldPatient(location?.state?.oldPatient);
            setCardLimit(location?.state?.cardLimit);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Admission" pageTitle="IPD"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Add IPD Admission",
                        data
                    }))} />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="d-flex justify-content-between">
                                <h4 className="mb-0">Patient Details</h4>
                                <Link to="/main/inPatient-datatable" className="ms-3">
                                    <Button color="light" className="bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardBody className="card-body">
                                <Row>
                                    <Col >
                                        <Form onSubmit={handleSubmit}>
                                            <GetPatient onSelectPatientId={handleSelectedPatientIdChange} selectedPatientId={selectedPatientId} />
                                            <Row>
                                                <Col lg={8}>
                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-type" className="form-label ">Symptoms Type</Label>
                                                                <Input
                                                                    id="symptoms-type"
                                                                    name="symptoms-type"
                                                                    type="text"
                                                                    value={symptomsType}
                                                                    onChange={e => setSymptomsType(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-title" className="form-label ">Symptoms Title</Label>
                                                                <Input
                                                                    id="symptoms-title"
                                                                    name="symptoms-title"
                                                                    type="text"
                                                                    value={symptomsTitle}
                                                                    onChange={e => setSymptomsTitle(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-description" className="form-label ">Symptoms Description</Label>
                                                                <textarea
                                                                    id="symptoms-description"
                                                                    name="symptoms-description"
                                                                    rows={6}
                                                                    value={symptomsDescription}
                                                                    className={`form-control`}
                                                                    onChange={e => setSymptomsDescription(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="mb-3">
                                                                <Label className="form-label">Note</Label>
                                                                <textarea
                                                                    id="note"
                                                                    name="note"
                                                                    rows={3}
                                                                    value={note}
                                                                    className={`form-control`}
                                                                    onChange={e => setNote(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="mb-3">
                                                                <Label className="form-label ">Previous Medical Issue</Label>
                                                                <textarea
                                                                    id="previousMedicalIssue"
                                                                    name="previousMedicalIssue"
                                                                    rows={3}
                                                                    value={previousMedicalIssue}
                                                                    className={`form-control`}
                                                                    onChange={e => setPreviousMedicalIssue(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg={4}>
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Admission Date <span className="text-danger">*</span></label>
                                                                <Input
                                                                    className={`${admissionDateValidationError ? 'is-invalid' : ''}`}
                                                                    id="admissionDate"
                                                                    name="admissionDate"
                                                                    type="datetime-local"
                                                                    value={admissionDate}
                                                                    min={formattedToday}
                                                                    onChange={e => handleAdmissionDateChange(e.target.value)}
                                                                />
                                                                {admissionDateValidationError && <div className="invalid-feedback">Admission Date Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">TPA </label>
                                                                <select className="form-control" value={insuranceId}
                                                                    onChange={(e) => { handleInsuranceChange(e.target.value) }} >
                                                                    <option value="">--Select TPA--</option>
                                                                    {insuranceData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.id}>{data.tpaName}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Credit Limit (₹) <span className="text-danger">*</span> </label>
                                                                <Input
                                                                    className={`${cardLimitValidationError ? 'is-invalid' : ''}`}
                                                                    id="cardLimit"
                                                                    name="cardLimit"
                                                                    type="number"
                                                                    value={cardLimit}
                                                                    onChange={e => handleCardLimitChange(e.target.value)}
                                                                />
                                                                {cardLimitValidationError && <div className="invalid-feedback">Credit Limit (₹) Required.</div>}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Reference</label>
                                                                <Input
                                                                    id="reference"
                                                                    name="reference"
                                                                    type="text"
                                                                    value={reference}
                                                                    onChange={e => setReference(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Casualty</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={casualty ? "Yes" : "No"} onChange={(e) => {
                                                                        setCasualty(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Casualty--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Old Patient</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={oldPatient ? "Yes" : "No"} onChange={(e) => {
                                                                        setOldPatient(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Old Patient--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={12} className="mb-3">
                                                            <label className="text-start mb-2">Consultant Doctor <span className="text-danger">*</span></label>
                                                            <AsyncTypeahead
                                                                filterBy={() => true}
                                                                id="patient-id-search-box"
                                                                className={` ${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                                                                isLoading={isLoading}
                                                                labelKey="fullName"
                                                                minLength={1}
                                                                options={options}
                                                                onSearch={onSearch}
                                                                onChange={onSelectedDoctorId}
                                                                placeholder="Search by Doctor Name or Id"
                                                                selected={options.filter((doctor: any) => doctor.employeeId === consultantDoctor)}
                                                            />
                                                            {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Bed</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={bedGroup} onChange={(e) => { handleBedGroupChange(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Bed --</option>
                                                                    {bedGroupData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data?.bedGroupId}>{data?.bedGroupName} - {data?.floor?.floorName}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Bed Number<span className="text-danger">*</span></label>
                                                                <select
                                                                    className={`form-control  ${bedGroupNumberValidationError ? 'is-invalid' : ''}`}
                                                                    value={bedGroupNumber} onChange={(e) => { handleBedGroupNumberChange(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Bed Number--</option>
                                                                    {roomData?.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.bedDetailsId} disabled={data.roomStatus}>
                                                                            {data.name} {data.roomStatus ? '(Booked)' : ''}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {bedGroupNumberValidationError && <div className="invalid-feedback">Bed Number Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Col className="text-center">
                                                <Button
                                                    color="primary"
                                                    className="btn btn-primary add-btn  ms-3"
                                                >
                                                    Submit
                                                </Button>
                                            </Col>

                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddPatient