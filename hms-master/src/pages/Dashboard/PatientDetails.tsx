import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import patientImg from '../../assets/images/myProfile.jpg';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import moment from 'moment';
import StorageService from '../../helpers/storage/storage-service';

const patientDetails = [
    {
        patientName: 'John Doe',
        patientImg: patientImg,
        issue: 'Chest Pain',
        lastVisit: '2024-12-01',
        progress: '80%',
        status: 'Under Treatment',
        doctor: 'Dr. Smith',
        contact: '+1 234 567 890',
        appointment: '2024-12-10',
        nurse: 'Jenny',
    },
    {
        patientName: 'Jane Smith',
        patientImg: '',
        issue: 'Headache',
        lastVisit: '2024-11-25',
        progress: '50%',
        status: 'Awaiting Test Results',
        doctor: 'Dr. Miller',
        contact: '+1 234 567 891',
        appointment: '2024-12-15',
        nurse: 'Emma',
    },
    {
        patientName: 'Alice Johnson',
        patientImg: null,
        issue: 'Abdominal Pain',
        lastVisit: '2024-11-30',
        progress: '30%',
        status: 'Pending Consultation',
        doctor: 'Dr. Davis',
        contact: '+1 234 567 892',
        appointment: '2024-12-20',
        nurse: 'Olivia',
    },
    {
        patientName: 'Bob Brown',
        patientImg: patientImg,
        issue: 'Knee Injury',
        lastVisit: '2024-12-05',
        progress: '70%',
        status: 'Scheduled for Surgery',
        doctor: 'Dr. Clark',
        contact: '+1 234 567 893',
        appointment: '2024-12-12',
        nurse: 'Liam',
    },
];

const generateRandomColor = (name: any) => {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

const getStatusBadge = (status: any) => {
    switch (status) {
        case 'Pending':
            return 'badge bg-warning-subtle text-warning';
        case 'Approved':
            return 'badge bg-info-subtle text-info';
        case 'Pending Consultation':
            return 'badge bg-secondary-subtle text-secondary';
        case 'Cancel':
            return 'badge bg-danger-subtle text-danger';
        default:
            return 'badge bg-light text-dark';
    }
};

const PatientDetails = () => {
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const totalPages = Math.ceil(patientDetails.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = patientDetails.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const [doctorId, setDoctorId] = useState('');

    const [appointmentData, setAppointmentData] = useState<any>([]);
    const [appointmentDate, setAppointmentDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

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
        setDoctorId(user.user_id);
        if (user.user_id) {
            getAllAppointment(user.user_id);
        }
    }, []);
    return (
        <Card>
            <CardHeader className="d-flex align-items-center">
                <h4 className="card-title flex-grow-1 mb-0">Patient Details</h4>
                <div className="flex-shrink-0">
                    <Link to="#" className="btn btn-soft-info btn-sm material-shadow-none">Export Report</Link>
                </div>
            </CardHeader>
            <CardBody>
                <div className="table-responsive">
                    <table className="table text-center table-nowrap table-centered align-middle">
                        <thead className="bg-light text-muted">
                            <tr>
                                <th scope="col" className='text-start'>Patient Name</th>
                                <th scope="col">Reason For Visit</th>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Appointment Preority</th>
                                <th scope="col">Doctor</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointmentData.length > 0 ? (
                                appointmentData.map((item: any, idx: any) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                {item.patientImg ? (
                                                    <img src={item.patientImg} className="rounded-circle" alt={item.patientName} height="30px" />
                                                ) : (
                                                    <div
                                                        className="avatar-xxs rounded-circle me-1 material-shadow d-flex justify-content-center align-items-center"
                                                        style={{
                                                            backgroundColor: generateRandomColor(item.patients.firstName),
                                                            color: 'white',
                                                            width: '30px',
                                                            height: '30px',
                                                        }}
                                                    >
                                                        {item.patients.firstName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <p className='ms-2 mb-0'><Link to="#" className="text-reset">{item.patients.firstName}</Link></p>
                                            </div>
                                        </td>
                                        <td>{item.reasonForVisit}</td>
                                        <td>{moment(item.appointmentDate).format('DD/MM/YYYY')}</td>
                                        <td>
                                            {moment(item.appointmentTime, "HH:mm:ss").format("h:mm A")}
                                            {/* <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-1 text-muted fs-13">{item.progress || '50%'}</div>
                                            <div className="progress progress-sm flex-grow-1">
                                                <div className="progress-bar bg-success rounded" role="progressbar" style={{ width: item.progress || '50%' }}></div>
                                            </div>
                                        </div> */}
                                        </td>
                                        <td>
                                            <span className={getStatusBadge(item.status)}>{item.status}</span>
                                        </td>
                                        <td>{item.patients.contactNumber}</td>
                                        <td>
                                            <span className={
                                                `badge p-2 
                                                                ${item.appointmentPriority === 'Normal' ? 'bg-success-subtle text-success' : ''} 
                                                                ${item.appointmentPriority === 'Urgent' ? 'bg-secondary-subtle text-secondary' : ''} 
                                                                ${item.appointmentPriority === 'Very Urgent' ? 'bg-danger-subtle text-danger' : ''}`
                                            }>
                                                {item.appointmentPriority}
                                            </span>
                                        </td>
                                        <td>{item.doctor.firstName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No appointments available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="align-items-center mt-xl-3 mt-4 justify-content-between d-flex">
                    <div className="flex-shrink-0">
                        <div className="text-muted">
                            Showing <span className="fw-semibold">{currentPatients.length}</span> of <span className="fw-semibold">{patientDetails.length}</span> Results
                        </div>
                    </div>
                    <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li className="page-item" onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                            <Link to="#" className="page-link">←</Link>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <Link to="#" className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</Link>
                            </li>
                        ))}
                        <li className="page-item" onClick={() => currentPage < totalPages && paginate(currentPage + 1)}>
                            <Link to="#" className="page-link">→</Link>
                        </li>
                    </ul>
                </div>
            </CardBody>
        </Card>
    );
};

export default PatientDetails;
