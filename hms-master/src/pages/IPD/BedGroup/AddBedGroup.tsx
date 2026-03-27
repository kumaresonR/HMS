import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Row } from "reactstrap"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service"
import ErrorHandler from "../../../helpers/ErrorHandler"

const statusData = [
    {
        name: "Cleaned"
    },
    {
        name: "Not Yet Cleaned"
    }
]
const roomTypeData = [
    {
        name: "AC"
    },
    {
        name: "Non AC"
    }
]
const roomStatusData = [
    {
        name: "Availabel"
    },
    {
        name: "Not Available"
    }
]
const AddBedGroup = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    let navigate: any = useNavigate();

    const [bedGroupName, setBedGroupName] = useState('');
    const [bedGroupNameValidationError, setBedGroupNameValidationError] = useState(false);
    const [status, setStatus] = useState('');
    const [statusValidationError, setStatusValidationError] = useState(false);
    const [roomNumberValidationError, setRoomNumberValidationError] = useState(false);
    const [roomTypeValidationError, setRoomTypeValidationError] = useState(false);
    const [ratePerDayValidationError, setRatePerDayValidationError] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [roomStatusValidationError, setRoomStatusValidationError] = useState(false);
    const handleBedGroupNameChange = (value: any) => {
        setBedGroupName(value);
        setBedGroupNameValidationError(false);
    }

    const handleStatusChange = (value: any) => {
        setStatus(value);
        setStatusValidationError(false);
    }

    const addRoom = () => {
        setRooms([...rooms, {
            roomNumber: '',
            roomType: '',
            status: '',
            ratePerDay: ''
        }])
    }

    const handleRoomDataChange = (index: number, field: string, value: any) => {
        const newRooms = [...rooms];
        newRooms[index] = {
            ...newRooms[index],
            [field]: value,
        }
        setRooms(newRooms);

        switch (field) {
            case 'roomNumber':
                setRoomNumberValidationError(!value);
                break;
            case 'roomType':
                setRoomTypeValidationError(!value);
                break;
            case 'status':
                setRoomStatusValidationError(!value);
                break;
            case 'ratePerDay':
                setRatePerDayValidationError(!value || isNaN(Number(value)) || Number(value) <= 0);
                break;
            default:
                break;
        }
    }

    const removeRooms = (index: any) => {
        const newRooms = [...rooms];
        newRooms.splice(index, 1);
        setRooms(newRooms);
    };
    const validateForm = () => {
        let isFormValid = true;

        if (!bedGroupName) {
            setBedGroupNameValidationError(true);
            isFormValid = false;
        }

        // Validate Rooms
        const roomErrors = rooms.map((room) => {
            const errors = {
                roomNumber: !room.roomNumber,
                roomType: !room.roomType,
                roomStatus: !room.status,
                ratePerDay: !room.ratePerDay || isNaN(Number(room.ratePerDay)) || Number(room.ratePerDay) <= 0,
            };

            // If any errors are true, the room is invalid
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        // Set validation errors for all rooms
        setRoomNumberValidationError(roomErrors.some(error => error.roomNumber));
        setRoomTypeValidationError(roomErrors.some(error => error.roomType));
        setRoomStatusValidationError(roomErrors.some(error => error.roomStatus));
        setRatePerDayValidationError(roomErrors.some(error => error.ratePerDay));

        return isFormValid;
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateBedGroupDetails();
        }
    }

    const doCreateBedGroupDetails = async () => {
        try {
            let payload: any = {
                bedGroupName: bedGroupName,
                status: "NA",
                rooms: rooms
            }
            await iPDApiService.createBedGroupDetails(payload);
            toast.success('Room Details Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            console.log("Room Details Created Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addRoom();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-around">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Bed Name <span className="text-danger">*</span></label>
                                        <Input
                                            id="bedGroupName"
                                            name="bedGroupName"
                                            type="text"
                                            value={bedGroupName}
                                            className={`${bedGroupNameValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleBedGroupNameChange(e.target.value)}
                                        />
                                        {bedGroupNameValidationError && <div className="invalid-feedback">Bed Name Required.</div>}
                                    </FormGroup>
                                </Col>

                                {/* <Col md={5}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Status <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control  ${statusValidationError ? 'is-invalid' : ''}`}
                                            value={status} onChange={(e) => { handleStatusChange(e.target.value) }}
                                        >
                                            <option value="">--Select Status--</option>
                                            {statusData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.name}>{data.name}</option>
                                            ))}
                                        </select>
                                        {statusValidationError && <div className="invalid-feedback">Status Required.</div>}
                                    </FormGroup>
                                </Col> */}
                            </Row>
                            <Col md={11} className="mx-auto">
                                <label className="text-start mb-2">Add Room</label>
                                <Button
                                    color="primary"
                                    className="btn btn-primary mx-3 mb-3 add-btn ms-3"
                                    onClick={addRoom}><FontAwesomeIcon icon={faCirclePlus} />
                                    &nbsp;Add New</Button>
                                {/* Add Room */}
                                {rooms.map((room: any, index: any) => (
                                    <Row key={index} className="align-items-center">
                                        <Col md={5}>
                                            <FormGroup>
                                                <label className="text-start mb-2">Room Number</label>
                                                <Input
                                                    className={`${roomNumberValidationError && !room.roomNumber ? 'is-invalid' : ''}`} id="roomNumber"
                                                    name="roomNumber"
                                                    type="text"
                                                    value={room.roomNumber}
                                                    onChange={e => handleRoomDataChange(index, 'roomNumber', e.target.value)}
                                                />
                                                {roomNumberValidationError && !room.roomNumber && <div className="invalid-feedback">Room Number Required.</div>}
                                            </FormGroup>
                                        </Col>

                                        <Col md={5}>
                                            <FormGroup>
                                                <label className="text-start mb-2">Room Type <span className="text-danger">*</span></label>
                                                <select
                                                    className={`form-control ${roomTypeValidationError && !room.roomType ? 'is-invalid' : ''}`}
                                                    value={room.roomType} onChange={(e) => { handleRoomDataChange(index, 'roomType', e.target.value) }}
                                                >
                                                    <option value="">--Select Room Type--</option>
                                                    {roomTypeData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.name}>{data.name}</option>
                                                    ))}
                                                </select>
                                                {roomTypeValidationError && !room.roomType && <div className="invalid-feedback">Room Type Required.</div>}
                                            </FormGroup>
                                        </Col>

                                        <Col md={5}>
                                            <FormGroup>
                                                <label className="text-start mb-2">Rate Per Day</label>
                                                <Input
                                                    className={`${ratePerDayValidationError && (!room.ratePerDay || isNaN(Number(room.ratePerDay)) || Number(room.ratePerDay) <= 0) ? 'is-invalid' : ''}`}
                                                    id="ratePerDay"
                                                    name="ratePerDay"
                                                    type="number"
                                                    value={room.ratePerDay}
                                                    onChange={e => handleRoomDataChange(index, 'ratePerDay', e.target.value)}
                                                />
                                                {ratePerDayValidationError && (!room.ratePerDay || isNaN(Number(room.ratePerDay)) || Number(room.ratePerDay) <= 0) && <div className="invalid-feedback">Rate Per Day Required.</div>}
                                            </FormGroup>
                                        </Col>
                                        <Col md={5}>
                                            <FormGroup>
                                                <label className="text-start mb-2">Status <span className="text-danger">*</span></label>
                                                <select
                                                    className={`form-control ${roomStatusValidationError && !room.status ? 'is-invalid' : ''}`}
                                                    value={room.status} onChange={(e) => { handleRoomDataChange(index, 'status', e.target.value) }}
                                                >
                                                    <option value="">--Select Status--</option>
                                                    {roomStatusData.map((data: any, idx: any) => (
                                                        <option key={idx} value={data.name}>{data.name}</option>
                                                    ))}
                                                </select>
                                                {roomStatusValidationError && !room.status && <div className="invalid-feedback">Status Required.</div>}
                                            </FormGroup>
                                        </Col>
                                        <Col xs="auto">
                                            {index !== 0 && (
                                                <Button color="danger" onClick={() => removeRooms(index)}>
                                                    <FontAwesomeIcon
                                                        className="mx-2"
                                                        icon={faXmark}
                                                    />
                                                </Button>
                                            )}
                                        </Col>
                                        <hr />
                                    </Row>
                                ))}
                            </Col>
                            <Col className="text-end">
                                <Button
                                    // size="sm"
                                    color="primary"
                                    className="btn btn-primary add-btn ms-3" >Submit</Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddBedGroup