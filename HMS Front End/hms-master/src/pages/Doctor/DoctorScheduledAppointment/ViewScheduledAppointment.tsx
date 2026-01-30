import React, { useEffect, useState } from "react"
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import { Link, useNavigate } from "react-router-dom";
import StorageService from "../../../helpers/storage/storage-service";
import { Container, Row, Col, Card, CardHeader, CardBody, FormGroup, Input, Label, Table, Button } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { IoArrowBack } from "react-icons/io5";
import ErrorHandler from "../../../helpers/ErrorHandler";

const ViewScheduledAppointment = () => {
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();
    let navigate: any = useNavigate();
    const [doctorId, setDoctorId] = useState('');

    const [appointmentData, setAppointmentData] = useState<any>([]);
    const [appointmentDate, setAppointmentDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

    const handleDateChange = (date: any) => {
        setAppointmentDate(moment(date[0]).format("YYYY-MM-DD"));
    };

    const getAllAppointment = async (id:any) => {
        try {
            let url = "filterAppointments?&appointmentDate=" + appointmentDate + "&doctorId=" + id;
            let result = await appointmentApiService.getAllAppointment(url);
            setAppointmentData(result);
        } catch (error:any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setDoctorId(user.user_id);
        if (user.user_id) {
            getAllAppointment(user.user_id);
        }
    }, [appointmentDate]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Patients For Today" pageTitle="Today's Appointment" />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Patients For Today</h4>
                                <Button
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-primary add-btn ms-3"
                                >
                                    <IoArrowBack /> Back
                                </Button>

                            </CardHeader>
                            <CardBody>
                                <Col md={4} className="ms-auto mb-4 d-flex align-items-center">
                                    <Label>Date:</Label>
                                    <Flatpickr
                                        className="form-control mx-2"
                                        value={appointmentDate}
                                        onChange={handleDateChange}
                                        options={{
                                            dateFormat: "Y-m-d",
                                            defaultDate: moment().toDate(),
                                        }}
                                    />
                                </Col>
                                <div className="table-responsive">
                                    <Table hover className="table-centered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Patient Id</th>
                                                <th>Patient Name</th>
                                                <th>Reason For Visit</th>
                                                <th>Appointment Preority</th>
                                                <th>Appointment Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointmentData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center">
                                                        <span>No Appointments Available</span>
                                                    </td>
                                                </tr>
                                            ) : (
                                                appointmentData.map((data: any, idx: any) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <label>{data.patients.patientId}</label>
                                                        </td>
                                                        <td>{data.patients.firstName}</td>
                                                        <td>{data.reasonForVisit}</td>
                                                        <td>
                                                            <span className={
                                                                `badge p-2 
                                                                ${data.appointmentPriority === 'Normal' ? 'bg-success-subtle text-success' : ''} 
                                                                ${data.appointmentPriority === 'Urgent' ? 'bg-secondary-subtle text-secondary' : ''} 
                                                                ${data.appointmentPriority === 'Very Urgent' ? 'bg-danger-subtle text-danger' : ''}`
                                                            }>
                                                                {data.appointmentPriority}
                                                            </span>
                                                        </td>
                                                        <td>{moment(data.appointmentTime, "HH:mm:ss").format("h:mm A")}</td>
                                                        <td>
                                                            <span className={
                                                                `badge p-2 
                                                                ${data.status === 'Approved' ? 'bg-success-subtle text-success' : ''} 
                                                                ${data.status === 'Cancel' ? 'bg-danger-subtle text-danger' : ''} 
                                                                ${data.status === 'Pending' ? 'bg-warning-subtle text-warning' : ''}`
                                                            }>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ViewScheduledAppointment