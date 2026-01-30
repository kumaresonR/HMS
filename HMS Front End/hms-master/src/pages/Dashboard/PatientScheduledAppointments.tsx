import React, { useEffect, useState } from 'react';
import Flatpickr from "react-flatpickr";
import { Link } from 'react-router-dom';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import moment from 'moment';
import StorageService from '../../helpers/storage/storage-service';
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent';

const PatientScheduledAppointments = () => {
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();

    const [doctorId, setDoctorId] = useState('');
    const [appointmentData, setAppointmentData] = useState<any>([]);
    const [appointmentDate, setAppointmentDate] = useState<string>(moment().format('YYYY-MM-DD'));

    const handleAppointmentDateChange = (date: Date[]) => {
        const formattedDate = moment(date[0]).format('YYYY-MM-DD');
        setAppointmentDate(formattedDate);
    };

    const getAllAppointment = async (id: any) => {
        try {
            let url = "filterAppointments?&appointmentDate=" + appointmentDate + "&doctorId=" + id;
            let result = await appointmentApiService.getAllAppointment(url);
            console.log("Search Appointment", result);
            setAppointmentData(result);
        } catch (error) {
            console.log("Search Appointment Error");
            console.log(error);
        }
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setDoctorId(user?.user_id);
        if (user?.user_id) {
            getAllAppointment(user.user_id);
        }
    }, [appointmentDate]);

    return (
        <React.Fragment>
            <div className="card">
                <div className="card-header border-0">
                    <h4 className="card-title mb-0">Upcoming Appointments</h4>
                </div>
                <div className="card-body pt-0 upcoming-schedule-container">
                    <div className="upcoming-scheduled">
                        <Flatpickr
                            value={appointmentDate}
                            onChange={handleAppointmentDateChange}
                            className="form-control"
                            options={{
                                inline: true,
                                defaultDate: moment().format('YYYY-MM-DD')
                            }}
                        />
                    </div>
                    <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                        <div className='' >
                            <h6 className="text-uppercase fw-semibold mt-4 mb-3 text-muted">Appointments:</h6>
                            {appointmentData.length > 0 ? (
                                appointmentData.slice(0, 3).map((item: any, idx: any) => (
                                    <div className="mini-stats-wid d-flex align-items-center mt-3" key={idx}>
                                        <div className="flex-shrink-0 avatar-sm">
                                            <span className="mini-stat-icon avatar-title rounded-circle text-info bg-info-subtle fs-4">
                                                {moment(appointmentDate).format('DD')}
                                            </span>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-1">{item.patients.firstName} {item.patients.lastName} ({item.patients.patientId})</h6>
                                            <p className="text-muted mb-0">{item.reasonForVisit || 'NA'}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <p className="text-muted mb-0">{moment(item.appointmentTime, 'HH:mm:ss').format('hh:mm A')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No appointments available for the selected date.</p>
                            )}

                            <div className="mt-3 text-center">
                                <Link to="/main/view-scheduled-appointment" className="text-muted text-decoration-underline">View all Appointments</Link>
                            </div>
                        </div>
                    </RoleBasedComponent>
                </div>
            </div>

        </React.Fragment>
    );
};

export default PatientScheduledAppointments;
