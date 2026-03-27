import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service";
import moment from "moment";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";

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

const EditAppointment = (props: any) => {
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const [registrationFees, setRegistrationFees] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('')
    const [patientId, setPatientId] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctor, setDoctor] = useState('');
    const [appointmentPriority, setAppointmentPriority] = useState('');
    const [statusValidationError, setStatusValidationError] = useState(false);
    const [appointmentDateValidationError, setAppointmentDateValidationError] = useState(false);
    const [appointmentTimeValidationError, setAppointmentTimeValidationError] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [formetedSlot, setFormetedSlot] = useState('');
    const [shiftData, setShiftData] = useState<any>([]);
    const [employeeData, setEmployeeData] = useState<any>({});
    const [slotData, setSlotData] = useState<any[]>([]);
    const [shiftType, setShiftType] = useState('');
    const [tokenValidationError, setTokenValidationError] = useState(false);
    const [availableTokens, setAvailableTokens] = useState<string[]>([]);
    const [bookedTokens, setBookedTokens] = useState<number[]>([]);
    const [token, setToken] = useState('');
    const [open, setOpen] = useState<boolean>(false);
    const [slotValidationError, setSlotValidationError] = useState(false);
    const [tokenDetails, setTokenDetails] = useState<any>({});

    function openTokenModel() {
        setOpen(!open);
    }

    const handleAppointmentDateChange = (value: any) => {
        setAppointmentDate(value);
        setAppointmentDateValidationError(false);
        resetTokenAndDependencies();
        const filteredShifts = shiftData.filter((shift: any) => shift.shiftDate === value);
        setSlotData(filteredShifts);
        console.log(filteredShifts);
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
        // const selectedShift = shiftData.find((shift: any) => shift.startTime === value);
        const selectedShift = slotData.find((shift: any) => shift.shiftDate === appointmentDate && shift.startTime === value);
        if (selectedShift) {
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

    const getTokenByScheduleId = async (id: any) => {
        try {
            let data = await employeeApiService.getTimeSlot(id);
            setBookedTokens(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleTokenBooking = (tokenIdx: number, token: any) => {
        setToken(`${token.label} - ${token.time}`);
        const formattedTime = moment(token.time, ["hh:mm A"]).format("HH:mm:ss");
        setAppointmentTime(formattedTime)
        setTokenDetails(token);
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

    const handleStatusChange = (value: any) => {
        setStatus(value);
        setStatusValidationError(false);
    }

    const getShiftById = async (id: any) => {
        try {
            let data = await employeeApiService.getShiftByEmployeeId(id);
            setEmployeeData(data.employee);
            setShiftData(data.shifts);
            setRegistrationFees(data.employee.doctorFee);
        } catch (error) {
            console.log(error);
        }
    };

    const getAppointmentDataById = async () => {
        try {
            let data = await appointmentApiService.getAppointmentById(props.id);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: any) => {
        setPatientId(data.patientId);
        setDoctorId(`${data.doctor?.firstName} ${data.doctor?.lastName} (${data.doctor?.staffId})`);
        setDoctor(data.doctorId);
        if (data.doctorId) {
            getShiftById(data.doctorId);
        }
        setRegistrationFees(data.registrationFees);
        setPaymentType(data.paymentType);
        setAppointmentDate(data.appointmentDate);
        if (data.appointmentDate) {
            handleAppointmentDateChange(data.appointmentDate);
        }
        setAppointmentTime(data.appointmentTime);
        setReasonForVisit(data.reasonForVisit);
        setStatus(data.status);
        setAppointmentPriority(data.appointmentPriority);
        setToken(data.tokenNo);
        setShiftType(data.shift);
        setFormetedSlot(data.slots);
        if (data.slots) {
            const startTime = data.slots.split(' - ')[0];
            const formattedStartTime = moment(startTime, 'hh:mm A').format('HH:mm:ss');
            setFormetedSlot(formattedStartTime);
            handleSlotChange(formattedStartTime);
        } else {
            setFormetedSlot('');
        }
    };


    const validateForm = () => {
        let isFormValid = true;

        if (!appointmentDate) {
            setAppointmentDateValidationError(true);
            isFormValid = false;
        }

        if (!appointmentTime) {
            setAppointmentTimeValidationError(true);
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
            doUpdate();
        }
    };

    const doUpdate = async () => {
        try {
            let payload: any = {
                patientId: patientId,
                doctorId: doctor,
                registrationFees: registrationFees,
                paymentType: paymentType,
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                reasonForVisit: reasonForVisit,
                status: status,
                // specialist: "",
                shift: shiftType,
                slots: formetedSlot,
                tokenNo: token,
                appointmentPriority: appointmentPriority
            }
            await appointmentApiService.editAppointment(props.id, payload);
            if (Object.keys(tokenDetails).length > 0) {
                await handleBookToken(tokenDetails);
            }
            toast.success('Appointment Created Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAppointmentDataById();
    }, []);

    useEffect(() => {
        if (shiftData && appointmentDate) {
            const filteredShifts = shiftData.filter(
                (shift: any) => shift.shiftDate === appointmentDate
            );
            setSlotData(filteredShifts);
            if (filteredShifts.length > 0 && !selectedSlot) {
                handleSlotChange(filteredShifts[0]);
            }
        }
    }, [shiftData, appointmentDate]);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Row>
                            <Col>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="justify-content-around">
                                        <Col md={6}>
                                            <FormGroup>
                                                <label className="text-start mb-2">Doctor <span className="text-danger">*</span></label>
                                                <Input disabled
                                                    id="doctorId"
                                                    name="doctorId"
                                                    type="text"
                                                    value={doctorId}
                                                    onChange={e => setDoctorId(e.target.value)}
                                                />
                                                {/* <select className="form-control" value={doctorId} disabled onChange={e => setDoctorId(e.target.value)}>
                                                    <option value="">--Select Doctor--</option>
                                                    {doctorData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.doctorId}>{data.name}</option>
                                                    ))}
                                                </select> */}
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
                                                    // min={today}
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
                                                {availableTokens.length > 0 ? (
                                                    <>
                                                        <Button color="primary" onClick={() => setOpen(true)}>
                                                            Time Slot <span className="text-danger">*</span>
                                                        </Button>
                                                        {token && (
                                                            <Label className="mx-2 ">Selected  : <span className="text-success">{token} </span></Label>
                                                        )}

                                                        <Modal backdrop={'static'} id="staticBackdrop"
                                                            isOpen={open} scrollable
                                                            toggle={() => openTokenModel()}
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
                                                    </>
                                                ) : (
                                                    token && <Label className="mx-2">Selected {token}</Label>
                                                )}
                                            </Col>
                                        )}


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
                                        <Col md={6}></Col>
                                    </Row>
                                    <Col className="text-end">
                                        <Button color="primary">Update</Button>
                                    </Col>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default EditAppointment