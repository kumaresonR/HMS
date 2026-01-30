import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, CardBody, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

// Define the type for an event
interface Event {
    id: number;
    title: string;
    start: Date | null;
    end: Date | null;
}

const localizer = momentLocalizer(moment);

const TimeSlots = () => {
    const [events, setEvents] = useState<Event[]>([]); // Use the Event type
    const [modalShow, setModalShow] = useState(false);
    const [newEvent, setNewEvent] = useState<Event>({ id: 0, title: "", start: null, end: null });

    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        // Open modal with prefilled start and end times
        setNewEvent({
            id: events.length,
            title: "",
            start: slotInfo.start,
            end: slotInfo.end,
        });
        setModalShow(true);
    };

    const handleSaveSlot = () => {
        if (newEvent.title && newEvent.start && newEvent.end) {
            // Save new event to the calendar
            setEvents([...events, { ...newEvent, id: events.length }]);
            setModalShow(false); // Close modal
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <div>
            <Card>

                <CardBody>
                    <h4>Time Slots</h4>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        selectable
                        defaultView="week"
                        step={30}
                        timeslots={1}
                        defaultDate={new Date()}
                        style={{ height: 500 }}
                        onSelectSlot={handleSlotSelect} // Triggered when clicking on an empty slot
                        min={new Date(new Date().setHours(0, 0, 0, 0))} // 12:00 AM
                        max={new Date(new Date().setHours(12, 0, 0, 0))} // 12:00 PM
                    />

                    {/* Modal for Adding Slots */}
                    <Modal isOpen={modalShow} toggle={() => setModalShow(false)}>
                        <ModalHeader toggle={() => setModalShow(false)}>
                            Add Slot
                        </ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label>Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter slot title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Start Time</Label>
                                    <Input
                                        type="text"
                                        value={moment(newEvent.start).format("MMMM Do YYYY, h:mm A")}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>End Time</Label>
                                    <Input
                                        type="text"
                                        value={moment(newEvent.end).format("MMMM Do YYYY, h:mm A")}
                                        readOnly
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="secondary" onClick={() => setModalShow(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveSlot}>
                                Save Slot
                            </Button>
                        </ModalFooter>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default TimeSlots;
