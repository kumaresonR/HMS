import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane, Button, Table,
    Progress,
} from "reactstrap";

import Flatpickr from "react-flatpickr";
const AttendanceSetting = () => {
    const [activeVerticalTab, setactiveVerticalTab] = useState(7);
    const [passedverticalSteps, setPassedverticalSteps] = useState([1]);
    function toggleVerticalTab(tab: any) {
        if (activeVerticalTab !== tab) {
            const modifiedSteps = [...passedverticalSteps, tab];
            if (tab >= 7 && tab <= 22) {
                setactiveVerticalTab(tab);
                setPassedverticalSteps(modifiedSteps);
            }
        }
    }




    return (
        <div>

            <div>
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">Biometric Attendance Setting</h5>

                        <p className="text-muted mb-0">
                            Fill all information below
                        </p>
                    </CardHeader>
                    <CardBody>




                        <Row className="g-3 ">
                            <Col sm={6}>
                                <Label
                                    htmlFor="devices"
                                    className="form-label"
                                >
                                    Devices (Separate By Comma)
                                </Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="devices"
                                    placeholder="Enter Devices"
                                    defaultValue=""
                                />
                            </Col>




                            <Col sm={6}>
                                <Label className="form-label">Biometric Attendance</Label>
                                <div>
                                    <Input type="radio" name="biometricAttendance" value="Enabled" id="biometricAttendanceEnabled" />
                                    <Label htmlFor="biometricAttendanceEnabled" className="me-3 ms-2">Enabled</Label>
                                    <Input type="radio" name="biometricAttendance" value="Disabled" id="biometricAttendanceDisabled" />
                                    <Label htmlFor="biometricAttendanceDisabled" className="ms-2">Disabled</Label>
                                </div>
                            </Col>


                        </Row>
                    </CardBody>
                </Card>
            </div>









            <Row >
                <Col xl={12}>
                    <Card  className="p-3">
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Attendance Setting</h5>
                            <Button color="primary">Update</Button>
                        </CardHeader>
                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>     <strong>Role:</strong> Admin </h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                   
                        {/* ACCOUNTANT ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>       <strong>Role:</strong> Accountant </h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* ACCOUNTANT ATTENDANCE SETTINGS */}


                        {/* Doctor ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>       <strong>Role:</strong> Doctor </h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Doctor ATTENDANCE SETTINGS */}

                        {/* Pharmacist ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>    <strong>Role:</strong> Pharmacist </h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Pharmacist ATTENDANCE SETTINGS */}

                        {/* Pathologist ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>      <strong>Role:</strong> Pathologist</h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Pathologist ATTENDANCE SETTINGS */}


                        {/* Radiologist ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5><strong>Role:</strong> Radiologist</h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Radiologist ATTENDANCE SETTINGS */}

                        {/* Super Admin ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>     <strong>Role:</strong> Super Admin</h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Super Admin ATTENDANCE SETTINGS */}


                        {/* Receptionist ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5> <strong>Role:</strong> Receptionist</h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Receptionist ATTENDANCE SETTINGS */}


                        {/* Nurse ATTENDANCE SETTINGS */}

                        <CardBody className="shadow ">
                            <div className="mb-3">
                                <h5>   <strong>Role : Nurse </strong></h5>
                            </div>
                            <Table bordered responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Attendance Type</th>
                                        <th>Entry From (hh:mm:ss)</th>
                                        <th>Entry Upto (hh:mm:ss)</th>
                                        <th>Total Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Present (P)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />

                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Late (L)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day (F)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Half Day Second Shift (SH)</td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Flatpickr
                                                className="form-control"
                                                defaultValue="10:00:00"
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "H:i:s",
                                                    time_24hr: true,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                        {/* Nurse ATTENDANCE SETTINGS */}

                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default AttendanceSetting