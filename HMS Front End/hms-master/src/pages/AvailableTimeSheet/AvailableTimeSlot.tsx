import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Container, Card, Row, Col, CardBody, Label, FormGroup, Form } from 'reactstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DeleteModal from '../../Components/Common/DeleteModal';
import FormHeader from '../../common/FormHeader/FormHeader';
import StorageService from '../../helpers/storage/storage-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const localizer = momentLocalizer(moment);

const AvailableTimeSlot = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const appointmentApiService: AppointmentApiService = new AppointmentApiService();
  const employeeApiService: EmployeeApiService = new EmployeeApiService();

  const [employeeId, setEmployeeId] = useState('')
  const [events, setEvents] = useState<any>([]);
  const [shiftData, setShiftData] = useState<any>([]);
  const [employeeData, setEmployeeData] = useState<any>({});
  const [nextId, setNextId] = useState(events.length + 1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [doctorName, setDoctorName] = useState('');
  const [consultationDurationMinutesValidationError, setconsultationDurationMinutesValidationError] = useState(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');

  console.log('events==>', events);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setCurrentEvent(null);
      setDurationMinutes('');
      setRepeatDays([]);
      setIsEditing(false);
    }
  };

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setCurrentEvent({ start, end, doctorName, durationMinutes: '', title: '', doctorFees: '' });
    setDurationMinutes('');
    setIsEditing(false);
    toggleModal();
  }, []);


  const handleConsultationDurationMinutesChange = (value: any) => {
    setDurationMinutes(value);
    setconsultationDurationMinutesValidationError(false);
  };

  const handleSelectEvent = useCallback(
    (event: any) => {
      setDoctorName(event.doctorName);
      setDurationMinutes(event.durationMinutes);
      setCurrentEvent(event);
      setIsEditing(true);
      toggleModal();
    },
    []
  );

  const handleRepeatDaysChange = (day: string) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const validateForm = () => {
    let isFormValid = true;

    if (!durationMinutes) {
      setconsultationDurationMinutesValidationError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSaveEvent = async () => {
    if (validateForm() && currentEvent) {
      const baseEvent = {
        ...currentEvent,
        durationMinutes,
      };

      const newEvents = repeatDays.length
        ? repeatDays.map((day) => ({
          ...baseEvent,
          start: moment.utc(baseEvent.start).day(day).toDate(),
          end: moment.utc(baseEvent.end).day(day).toDate(),
          repeatDay: day,
        }))
        : [baseEvent];

      setEvents((prev: any) => [...prev, ...newEvents]);

      try {
        if (currentEvent.id) {
          // Create payload for the edit API
          const editPayload = newEvents.map((event) => ({
            scheduleId: currentEvent.id,
            employeeId: employeeData.employeeId,
            repeatDays: event.repeatDay,
            shiftType: calculateShiftType(event.start),
            startTime: event.start.toLocaleTimeString('en-GB', { hour12: false }),
            endTime: event.end.toLocaleTimeString('en-GB', { hour12: false }),
            shiftDate: event.start.toISOString().split('T')[0],
            doctorName: employeeData.firstName,
            durationMinutes,
            deleted: false,
          }));

          // Call edit API
          await employeeApiService.editDoctorAvailability(editPayload);
        } else {
          // Create payload for the schedule API
          const schedulePayload = [
            {
              employeeId: employeeData.employeeId,
              doctorName: employeeData.firstName,
              shifts: newEvents.map((event) => ({
                shiftDate: event.start.toISOString().split('T')[0],
                startTime: event.start.toLocaleTimeString('en-GB', { hour12: false }),
                endTime: event.end.toLocaleTimeString('en-GB', { hour12: false }),
                shiftType: calculateShiftType(event.start),
                durationMinutes,
                repeatDays: event.repeatDay,
              })),
            },
          ];

          // Call schedule API
          await employeeApiService.scheduleDoctorAvailability(schedulePayload);
        }

        toggleModal();
        getShiftById(employeeId);
        toast.success('Timeslot Successfully Saved', { containerId: 'TR' });
      } catch (error: any) {
        console.error("Timeslot Failed", error);
        return ErrorHandler(error);
      }
    }
  };


  const calculateShiftType = (date: Date) => {
    const startHour = date.getHours();
    if (startHour >= 12 && startHour < 15) return "Afternoon";
    if (startHour >= 15 && startHour < 21) return "Evening";
    if (startHour >= 21 || startHour < 5) return "Night";
    return "Morning";
  };

  const deleteSlot = (id: any) => {
    setSelectedId(id);
    setDeleteModal(true);
  }

  const handleDeleteEvent = async () => {
    if (currentEvent) {

      if (selectedId) {
        try {
          await employeeApiService.deleteDoctorAvailability(selectedId);
          toast.success('Shift Deleted Successfully', { containerId: 'TR' });
          await getShiftById(employeeId);
          setDeleteModal(false);
          setModalOpen(false);
          return;
        } catch (error: any) {
          console.log("handleDelete Error")
          return ErrorHandler(error)
        }
      }
      setDeleteModal(false);
      setModalOpen(false)
    }
  };

  const getShiftById = async (id: any) => {
    try {
      let data = await employeeApiService.getShiftByEmployeeId(id);
      setEmployeeData(data.employee);
      setShiftData(data.shifts)
      console.log('AvailableTimeSlot data', data.shifts);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let user = StorageService.getUserDataFromSessionStorage();
    setDoctorName(user.name);
    setEmployeeId(user.user_id);
    if (user.user_id) {
      getShiftById(user.user_id);
    }
  }, [])

  useEffect(() => {
    const mappedEvents = shiftData.map((shift: any) => {
      const start = new Date(`${shift.shiftDate}T${shift.startTime}`);
      const end = new Date(`${shift.shiftDate}T${shift.endTime}`);
      console.log("Parsed Event Start:", start, "End:", end);

      return {
        id: shift.scheduleId,
        start,
        end,
        doctorName: shift.doctorName,
        durationMinutes: shift.durationMinutes,
        shiftType: shift.shiftType
      };
    });

    const futureEvents = mappedEvents.filter((event: any) => event.start >= new Date());
    console.log("Mapped Events:", mappedEvents);
    console.log("Future Events:", futureEvents);

    setEvents(mappedEvents);
  }, [shiftData]);


  return (
    <React.Fragment>
      <Container fluid>
        <FormHeader
          title="Available Time Slot"
          pageTitle="Available Time Sheet"
          onMinimize={() => dispatch(minimizePage({
            route: location.pathname,
            pageName: "Available Time Slot",
          }))} />
        <Row>
          <Col xs={12}>
            <Card className="card">
              <CardBody>
                <div className="height600">
                  <Calendar
                    defaultView={Views.WEEK}
                    views={[Views.WEEK, Views.DAY]}
                    events={events}
                    localizer={localizer}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for adding/editing events */}
      <Modal isOpen={modalOpen} toggle={toggleModal} id="event-modal" centered>
        <ModalHeader toggle={toggleModal} tag="h5" className="p-3 bg-info-subtle modal-title">
          {isEditing ? 'Edit Time Slot' : 'Add Time Slot'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label> Consultation Duration Minutes<span className='text-danger'>*</span></Label>
              <Input
                className={`${consultationDurationMinutesValidationError ? 'is-invalid' : ''}`}
                type="number"
                placeholder="Consultation Duration Minutes"
                value={durationMinutes}
                onChange={(e) => handleConsultationDurationMinutesChange(e.target.value)}
              />
              {consultationDurationMinutesValidationError && <div className="invalid-feedback">Number Of Tokens Required.</div>}
            </FormGroup>

            <FormGroup>
              <Label>Repeat On</Label>
              <div>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <Label key={day} check style={{ marginRight: '1rem' }}>
                    <Input
                      type="checkbox"
                      value={day}
                      checked={repeatDays.includes(day)}
                      onChange={() => handleRepeatDaysChange(day)}
                    />
                    {day}
                  </Label>
                ))}
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveEvent}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          {isEditing && (
            <Button color="danger" onClick={() => deleteSlot(currentEvent.id)}>
              Delete
            </Button>
          )}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => { setDeleteModal(false); }}
        recordId={""}
      />
    </React.Fragment>
  );
};

export default AvailableTimeSlot;