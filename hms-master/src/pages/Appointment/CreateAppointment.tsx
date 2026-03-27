import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, FormGroup, Input, Form, Label, Button, Popover, PopoverHeader, PopoverBody, Modal, ModalHeader, ModalBody, Spinner } from "reactstrap"
import FormHeader from "../../common/FormHeader/FormHeader"
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service"
import { toast } from "react-toastify"
import { Link, useLocation, useNavigate } from "react-router-dom"
import moment from "moment"
import ErrorHandler from "../../helpers/ErrorHandler"
import { AsyncTypeahead } from "react-bootstrap-typeahead"
import GetPatient from "../IPD/InPatient/GetPatient"
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService"
import { IoArrowBack } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { minimizePage } from "../../slices/pageResizer/uiSlice"

// import { IoArrowBackCircle } from "react-icons/io5";

const appointmentPriorityData = [
    {
        type: "Normal"
    },
    {
        type: "Urgent"
    },
    {
        type: "Very Urgent"
    }
]

const appointmentStatus = [
    {
        name: "Pending"
    },
    {
        name: "Approved"
    },
    {
        name: "Cancel"
    }
]

const paymentModeData = [
    {
        type: "Cash"
    },
    {
        type: "Transfer To Bank Account"
    },
    {
        type: "UPI"
    },
    {
        type: "Online"
    }
]
const CreateAppointment = () => {
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();
    const [patientValidationError, setPatientValidationError] = useState(false);
    const [registrationFees, setRegistrationFees] = useState<number>();
    const [registrationFeesValidationError, setRegistrationFeesValidationError] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [formetedSlot, setFormetedSlot] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [patientId, setPatientId] = useState<any>('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [status, setStatus] = useState('Pending');
    const [paymentType, setPaymentType] = useState('');
    const [paymentTypeValidationError, setPaymentTypeValidationError] = useState(false);
    const [doctorId, setDoctorId] = useState('');
    const [doctorValidationError, setDoctorValidationError] = useState(false);
    // const [doctorData, setDoctorData] = useState([]);
    const [appointmentPriority, setAppointmentPriority] = useState('Normal');
    const [statusValidationError, setStatusValidationError] = useState(false);
    const [appointmentDateValidationError, setAppointmentDateValidationError] = useState(false);
    const [slotValidationError, setSlotValidationError] = useState(false);
    const [reasonForVisitValidationError, setReasonForVisitValidationError] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [shiftData, setShiftData] = useState<any>([]);
    const [employeeData, setEmployeeData] = useState<any>({});
    const [tokenDetails, setTokenDetails] = useState<any>({});
    const [slotData, setSlotData] = useState<any[]>([]);
    const [shiftType, setShiftType] = useState('');
    const [tokenValidationError, setTokenValidationError] = useState(false);
    const [availableTokens, setAvailableTokens] = useState<string[]>([]);
    const [bookedTokens, setBookedTokens] = useState<number[]>([]);
    const [token, setToken] = useState('');
    const [open, setOpen] = useState<boolean>(false);
    const data = { patientId, doctorId, registrationFees, paymentType, appointmentDate, appointmentTime, reasonForVisit, status, shiftType, formetedSlot, token, appointmentPriority, slotData, selectedSlot, availableTokens, options, tokenDetails }
    const [loadSpinner, setLoadSpinner] = useState(false);

    function openTokenModel() {
        setOpen(!open);
    }

    const handleSelectedPatientIdChange = (id: string | null) => {
        setSelectedPatientId(id);
        setPatientId(id);
        setPatientValidationError(false);
    };

    const handleRegistrationFeesChange = (value: any) => {
        setRegistrationFees(value);
        setRegistrationFeesValidationError(false);
    }

    const handlePaymentTypeChange = (value: any) => {
        setPaymentType(value);
        setPaymentTypeValidationError(false);
    }

    const handleAppointmentDateChange = (value: any) => {
        setAppointmentDate(value);
        setAppointmentDateValidationError(false);
        resetTokenAndDependencies();

        const filteredShifts = shiftData.filter((shift: any) => shift.shiftDate === value);
        setSlotData(filteredShifts);
    }

    const handleSlotChange = (value: any) => {
        if (!value) {
            setSelectedSlot('');
            setFormetedSlot('');
            setAvailableTokens([]);
            setToken('');
            setTokenDetails({});
            return;
        }

        setSelectedSlot(value);
        setSlotValidationError(false);

        // Set the appointmentTime to the start time of the selected shiftType
        const selectedShift = slotData.find((shift: any) => shift.shiftDate === appointmentDate && shift.startTime === value);
        if (selectedShift) {
            // Format start and end times to AM/PM format 
            const formattedStartTime = moment(selectedShift.startTime, 'HH:mm:ss').format('hh:mm A');
            const formattedEndTime = moment(selectedShift.endTime, 'HH:mm:ss').format('hh:mm A');
            setFormetedSlot(`${formattedStartTime} - ${formattedEndTime}`);
            setShiftType(selectedShift.shiftType);
            setSlotValidationError(false);
            generateAvailableTokens(selectedShift);
        }
    };
    const generateAvailableTokens = (selectedShift: any) => {
        const start = moment(selectedShift.startTime, 'HH:mm:ss');
        const end = moment(selectedShift.endTime, 'HH:mm:ss');
        getTokenByScheduleId(selectedShift.scheduleId);
        const tokens: any[] = [];

        let current = start.clone();
        let tokenIndex = 1;

        while (current.isBefore(end)) {
            tokens.push({
                label: `Token ${tokenIndex}`,
                time: current.format('hh:mm A'),
                employeeId: selectedShift.employeeId,
                scheduleId: selectedShift.scheduleId
            });

            current.add(selectedShift.durationMinutes, 'minutes');
            tokenIndex++;
        }
        console.log(tokens)
        setAvailableTokens(tokens);
    };
    const resetTokenAndDependencies = () => {
        setToken('');
        setTokenDetails({});
        setAvailableTokens([]);
        setSelectedSlot('');
        setFormetedSlot('');
        setShiftType('');
        setAppointmentTime('');
        setBookedTokens([]);
    };


    const getTokenByScheduleId = async (id: any) => {
        try {
            let data = await employeeApiService.getTimeSlot(id);
            setBookedTokens(data)
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handleTokenBooking = (tokenIdx: number, token: any) => {
        setToken(`${token.label} - ${token.time}`);
        const formattedTime = moment(token.time, ["hh:mm A"]).format("HH:mm:ss");
        setAppointmentTime(formattedTime)
        setTokenDetails(token);
        // handleBookToken(token)
        setTokenValidationError(false);
        openTokenModel();
    };

    const handleBookToken = async (token: any) => {
        try {
            let payload: any = {
                employeeId: token.employeeId,
                scheduleId: token.scheduleId,
                timeSlot: token.time,
            }
            await appointmentApiService.bookeToken(payload);
            getTokenByScheduleId(token.scheduleId)
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handleReasonForVisitChange = (value: any) => {
        setReasonForVisit(value);
        setReasonForVisitValidationError(false);
    }

    const handleStatusChange = (value: any) => {
        setStatus(value);
        setStatusValidationError(false);
    }

    const onSearch = async () => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR"
            let result = await appointmentApiService.searchAllEmployee(url);
            setOptions(result)
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        // const doctorId = selectedItem?.[0]?.['employeeId'];
        setDoctorId(selectedItem);
        if (selectedItem) {
            setShiftData([]);
            setAppointmentDate('');
            setSlotData([]);
            setSelectedSlot('');
            setRegistrationFees(0);
        }
        getShiftById(selectedItem)
        setDoctorValidationError(false);
    }

    const getShiftById = async (id: any) => {
        try {
            let data = await employeeApiService.getShiftByEmployeeId(id);
            setEmployeeData(data.employee);
            setShiftData(data.shifts);
            setRegistrationFees(data.employee.doctorFee);
            if (data.employee.doctorFee) {
                setRegistrationFeesValidationError(false);
            }
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!patientId) {
            setPatientValidationError(true);
            toast.warning('Select Patient', { containerId: 'TR' });
            isFormValid = false;
        }

        if (!doctorId) {
            setDoctorValidationError(true);
            isFormValid = false;
        }

        if (!registrationFees) {
            setRegistrationFeesValidationError(true);
            isFormValid = false;
        }

        if (!paymentType) {
            setPaymentTypeValidationError(true);
            isFormValid = false;
        }

        if (!appointmentDate) {
            setAppointmentDateValidationError(true);
            isFormValid = false;
        }

        if (!selectedSlot) {
            setSlotValidationError(true);
            isFormValid = false;
        }

        if (!token) {
            toast.error('Select Token', { containerId: 'TR' });
            isFormValid = false;
        }

        if (!reasonForVisit) {
            setReasonForVisitValidationError(true);
            isFormValid = false;
        }

        if (!status) {
            setStatusValidationError(true);
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
            setLoadSpinner(true);
            let payload: any = {
                patientId: patientId,
                doctorId: doctorId,
                registrationFees: registrationFees,
                paymentType: paymentType,
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                reasonForVisit: reasonForVisit,
                status: status,
                shift: shiftType,
                slots: formetedSlot,
                tokenNo: token,
                appointmentPriority: appointmentPriority
            }
            await appointmentApiService.createAppointment(payload);
            await handleBookToken(tokenDetails);
            toast.success('Appointment Created Successfully', { containerId: 'TR' });
            navigate('/main/appointment-datatable');
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoadSpinner(false);
        }
    }

    useEffect(() => {
        onSearch();
        if (location?.state) {
            setOptions(location?.state?.options)
            setPatientId(location?.state?.patientId);
            setDoctorId(location?.state?.doctorId);
            setSlotData(location?.state?.slotData);
            setRegistrationFees(location?.state?.registrationFees);
            setPaymentType(location?.state?.paymentType);
            setSelectedSlot(location?.state?.selectedSlot);
            setAvailableTokens(location?.state?.availableTokens);
            setAppointmentDate(location?.state?.appointmentDate);
            setAppointmentTime(location?.state?.appointmentTime);
            setReasonForVisit(location?.state?.reasonForVisit);
            setStatus(location?.state?.status);
            setShiftType(location?.state?.shiftType);
            setFormetedSlot(location?.state?.formetedSlot);
            setToken(location?.state?.token);
            setAppointmentPriority(location?.state?.appointmentPriority);
            setTokenDetails(location?.state?.tokenDetails);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Create Appointment"
                    pageTitle="Appointment"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Create Appointment",
                        data
                    }))} />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody className="card-body">
                                <div className='text-end'>
                                    <Button
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                        className="btn btn-primary add-btn mx-2"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </div>
                                <Row>
                                    <Col>
                                        <Form onSubmit={handleSubmit}>
                                            <Row className="justify-content-around">
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Patient Id <span className="text-danger">*</span></label>
                                                        <GetPatient onSelectPatientId={handleSelectedPatientIdChange} selectedPatientId={patientId} />
                                                        {patientValidationError && <div className="invalid-feedback">Patient Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Doctor <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-control  ${doctorValidationError ? 'is-invalid' : ''}`}
                                                            value={doctorId} onChange={(e) => { onSelectedDoctorId(e.target.value) }}
                                                        >
                                                            <option value="">--Select Doctor--</option>
                                                            {options.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.employeeId}>{data.fullName}</option>
                                                            ))}
                                                        </select>
                                                        {/* <AsyncTypeahead
                                                            filterBy={() => true}
                                                            id="doctor-id"
                                                            className={` ${doctorValidationError ? 'is-invalid' : ''}`}
                                                            isLoading={isLoading}
                                                            labelKey="fullName"
                                                            minLength={1}
                                                            options={options}
                                                            onSearch={onSearch}
                                                            onChange={onSelectedDoctorId}
                                                            placeholder="Search by Doctor Name or Id"
                                                            selected={options.filter((doctor: any) => doctor.employeeId === doctorId)}
                                                        /> */}
                                                        {doctorValidationError && <div className="invalid-feedback">Doctor Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Registration Fees <span className="text-danger">*</span></label>
                                                        <Input disabled
                                                            id="registrationFees"
                                                            name="registrationFees"
                                                            type="text"
                                                            value={registrationFees}
                                                            className={`${registrationFeesValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handleRegistrationFeesChange(e.target.value)}
                                                        />
                                                        {registrationFeesValidationError && <div className="invalid-feedback">Registration Fee Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Payment Type <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-control  ${paymentTypeValidationError ? 'is-invalid' : ''}`}
                                                            value={paymentType} onChange={(e) => { handlePaymentTypeChange(e.target.value) }}
                                                        >
                                                            <option value="">--Select Payment Type--</option>
                                                            {paymentModeData.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.type}>{data.type}</option>
                                                            ))}
                                                        </select>
                                                        {paymentTypeValidationError && <div className="invalid-feedback">Payment Type Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Appointment Date <span className="text-danger">*</span></label>
                                                        <Input
                                                            className={`${appointmentDateValidationError ? 'is-invalid' : ''}`}
                                                            id="appointmentDate"
                                                            name="appointmentDate"
                                                            type="date"
                                                            value={appointmentDate}
                                                            min={today}
                                                            onChange={e => handleAppointmentDateChange(e.target.value)}
                                                        />
                                                        {appointmentDateValidationError && <div className="invalid-feedback">Appointment Date Required.</div>}
                                                    </FormGroup>
                                                </Col>

                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2"> Slot <span className="text-danger">*</span> </label>
                                                        <select
                                                            className={`form-control ${slotValidationError ? 'is-invalid' : ''}`}
                                                            value={selectedSlot}
                                                            onChange={(e) => handleSlotChange(e.target.value)}
                                                        >
                                                            <option value="">--Select Slot--</option>
                                                            {slotData.length > 0 ? (
                                                                slotData.map((shift: any, idx: any) => (
                                                                    <option key={idx} value={shift.startTime}>
                                                                        {moment(shift.startTime, 'HH:mm:ss').format('hh:mm A')} - {moment(shift.endTime, 'HH:mm:ss').format('hh:mm A')}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value="" disabled>
                                                                    Doctor will not be available
                                                                </option>
                                                            )}
                                                        </select>
                                                        {slotValidationError && <div className="invalid-feedback">Slot Required.</div>}
                                                    </FormGroup>

                                                </Col>
                                                {selectedSlot && (
                                                    <Col md={6}>
                                                        <Button color="primary" onClick={() => setOpen(true)}>
                                                            Time Slot <span className="text-danger">*</span>
                                                        </Button>
                                                        {token && (
                                                            <Label className="mx-2">Selected {token}</Label>
                                                        )}

                                                        <Modal backdrop={'static'} id="staticBackdrop"
                                                            isOpen={open} scrollable
                                                            toggle={() => {
                                                                openTokenModel();
                                                            }}
                                                        >
                                                            <ModalHeader toggle={openTokenModel} className="p-3 bg-info-subtle modal-title">
                                                                Tokens
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                <Container>
                                                                    {availableTokens.length > 0 ? (
                                                                        <Row>
                                                                            {availableTokens.map((token: any, idx: any) => {
                                                                                // Check if the token is booked
                                                                                const isBooked = bookedTokens.some(
                                                                                    (booked: any) =>
                                                                                        booked.timeSlot === token.time &&
                                                                                        booked.status === "Booked"
                                                                                );
                                                                                const currentMoment = moment();
                                                                                const tokenMoment = moment(token.time, "hh:mm A");
                                                                                const isCurrentOrFuture = tokenMoment.isSameOrAfter(currentMoment);

                                                                                return (
                                                                                    <Col md={3} className="text-center" key={idx}>
                                                                                        <button
                                                                                            onClick={() => handleTokenBooking(idx, token)}
                                                                                            className={`btn btn-sm m-1 ${isBooked ? 'btn-soft-danger' : 'btn-soft-success'}`}
                                                                                            disabled={!isCurrentOrFuture || isBooked}
                                                                                        >
                                                                                            <div>
                                                                                                <span>{token.label}</span> <br />
                                                                                                <span>{token.time}</span>
                                                                                            </div>
                                                                                        </button>
                                                                                    </Col>
                                                                                );
                                                                            })}
                                                                        </Row>
                                                                    ) : (
                                                                        <p>No tokens available</p>
                                                                    )}

                                                                </Container>
                                                            </ModalBody>
                                                        </Modal>
                                                    </Col>
                                                )}

                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Reason For Visit <span className="text-danger">*</span></label>
                                                        <Input
                                                            id="reasonForVisit"
                                                            className={`form-control  ${reasonForVisitValidationError ? 'is-invalid' : ''}`}
                                                            name="reasonForVisit"
                                                            type="text"
                                                            value={reasonForVisit}
                                                            onChange={e => handleReasonForVisitChange(e.target.value)}
                                                        />
                                                        {reasonForVisitValidationError && <div className="invalid-feedback">Reason For Visit Required.</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Status <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-control  ${statusValidationError ? 'is-invalid' : ''}`}
                                                            value={status} onChange={(e) => { handleStatusChange(e.target.value) }}
                                                        >
                                                            <option value="">--Select Status--</option>
                                                            {appointmentStatus.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.name}>{data.name}</option>
                                                            ))}
                                                        </select>
                                                        {statusValidationError && <div className="invalid-feedback">Status Required.</div>}
                                                    </FormGroup>
                                                </Col>

                                                <Col md={6}>
                                                    <FormGroup>
                                                        <label className="text-start mb-2">Appointment Priority</label>
                                                        <select
                                                            className={`form-control`}
                                                            value={appointmentPriority} onChange={(e) => { setAppointmentPriority(e.target.value) }}
                                                        >
                                                            <option value="">--Select Appointment Priority--</option>
                                                            {appointmentPriorityData.map((data: any, idx: any) => (
                                                                <option key={idx} value={data.type}>{data.type}</option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}></Col>
                                            </Row>
                                            <Col className="text-center">
                                                <Button color="primary" disabled={loadSpinner} >
                                                    {loadSpinner ? <Spinner size="sm" /> : 'Submit'}

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
export default CreateAppointment