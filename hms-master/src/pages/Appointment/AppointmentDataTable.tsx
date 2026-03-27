import React, { useEffect, useRef, useState } from "react"
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Table, Button, Modal, ModalBody, ModalHeader, FormGroup, Input } from "reactstrap";
import EditAppointment from "./EditAppointment";
import moment from "moment";
import DeleteModal from "../../Components/Common/DeleteModal";
import ErrorHandler from "../../helpers/ErrorHandler";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Paginator from "../../common/pagenator/pagenator";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";

const AppointmentDataTable = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();
    let navigate: any = useNavigate();

    const [appointmentData, setAppointmentData] = useState<any>([]);
    const [patientId, setPatientId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
    const [id, setId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const patientRef = useRef<any>(null);
    const doctorRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [doctorOptions, setDoctorOptions] = useState<[]>([]);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    //pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handleNext = () => setCurrentPage((prev) => prev + 1);
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(0);
    };

    function handleColse() {
        setmodal_backdrop(!modal_backdrop);
        getAllAppointmentData(currentPage, pageSize)
    }

    const handlePatientSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setPatientId(patientId);
    }

    const handleDoctorSearch = async () => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR"
            let result = await appointmentApiService.searchAllEmployee(url);
            setDoctorOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        // const doctorId = selectedItem?.[0]?.['employeeId'];
        setDoctorId(selectedItem);
    }

    const onSearch = async (query: any) => {
        try {
            let url = "filterAppointments?";

            if (appointmentDate) {
                url = url + "&appointmentDate=" + appointmentDate;
            }

            if (patientId) {
                url = url + "&patientId=" + patientId;
            }

            if (doctorId) {
                url = url + "&doctorId=" + doctorId;
            }

            let result = await appointmentApiService.getAllAppointment(url);
            setAppointmentData(result);
        } catch (error) {
            console.log(error);
        }
    }

    const reset = () => {
        setPatientId('');
        setAppointmentDate('');
        setDoctorId('');
        setOptions([]);
        patientRef.current.clear();
        doctorRef.current.clear();
        setDoctorOptions([]);
        getAllAppointmentData(currentPage, pageSize)
    }

    const getAllAppointmentData = async (page: number, size: number) => {
        try {
            let url = `all?page=${page}&size=${size}`;
            let result = await appointmentApiService.getAllAppointment(url);
            setAppointmentData(result);
            if (result && result.length) {
                const totalPatients = result.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return result || [];
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }

    const editAppointment = (id: any) => {
        setId(id);
        handleColse();
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await appointmentApiService.deleteAppointment(selectedId);
                toast.success('Appointment Deleted Successfully', { containerId: 'TR' });
                await getAllAppointmentData(currentPage, pageSize);
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteAppointment = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        handleDoctorSearch();
        const loadPages = async () => {
            const currentPageData = await getAllAppointmentData(currentPage, pageSize);
            setAppointmentData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    return (
        <React.Fragment>
            <div className="row">
                <Col>
                    <FormGroup>
                        <Input
                            id="appointmentDate"
                            name="appointmentDate"
                            type="date"
                            value={appointmentDate}
                            onChange={e => setAppointmentDate(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <AsyncTypeahead
                        ref={patientRef}
                        filterBy={() => true}
                        id="patient-id-search-box"
                        isLoading={isLoading}
                        labelKey="name"
                        minLength={1}
                        options={options}
                        onSearch={handlePatientSearch}
                        onChange={onSelectedPatientId}
                        placeholder="Search by patient Id"
                    />
                </Col>
                <Col>
                    <select
                        className={`form-control`}
                        value={doctorId} onChange={(e) => { onSelectedDoctorId(e.target.value) }}
                    >
                        <option value="">--Select Doctor--</option>
                        {doctorOptions.map((data: any, idx: any) => (
                            <option key={idx} value={data.employeeId}>{data.fullName}</option>
                        ))}
                    </select>
                    {/* <AsyncTypeahead
                        ref={doctorRef}
                        filterBy={() => true}
                        id="doctor-id-search-box"
                        isLoading={isLoading}
                        labelKey="fullName"
                        minLength={1}
                        options={doctorOptions}
                        onSearch={handleDoctorSearch}
                        onChange={onSelectedDoctorId}
                        placeholder="Search by Doctor Name or Id"
                    /> */}
                </Col>
                <Col>
                    <Button className="mx-1" color="primary" onClick={onSearch}>Search</Button>

                    <button className="btn btn-soft-danger waves-effect waves-light material-shadow-none" onClick={reset}> Reset </button>
                </Col>
            </div>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Appointment Date</th>
                            <th>Appointment Time</th>
                            <th>Reason For Visit</th>
                            <th>Status</th>
                            <th>Registration Fees</th>
                            <th>Payment Type</th>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "RECEPTIONIST"]}>
                                {props.title !== "Billing" && <th>Action</th>}
                            </RoleBasedComponent>
                        </tr>
                    </thead>
                    <tbody>
                        {appointmentData?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td className="text-primary">
                                    <label>
                                        {data?.patient
                                            ? `${data?.patient?.firstName} ${data?.patient?.lastName} (${data?.patient?.patientId})`
                                            : `${data?.patients?.firstName} ${data.patients?.lastName} (${data.patients?.patientId})`}
                                    </label>
                                </td>
                                <td className="text-primary text-nowrap">{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</td>
                                <td className="text-nowrap">{moment(data?.appointmentDate).format('DD/MM/YYYY')}</td>
                                <td>{moment(data?.appointmentTime, "HH:mm:ss").format("h:mm A")}</td>
                                <td className="text-primary text-nowrap">{data?.reasonForVisit || 'NA'}</td>
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
                                <td>{data.registrationFees}</td>
                                <td>{data.paymentType}</td>
                                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "RECEPTIONIST"]}>
                                    {props.title !== "Billing" && (
                                        <td>
                                            <ul className="list-inline hstack gap-2 mb-0">
                                                <li className="list-inline-item">
                                                    <Link
                                                        className="edit-item-btn"
                                                        to="#" onClick={() => editAppointment(data.appointmentId)}

                                                        title="Edit"
                                                    >
                                                        <i className="ri-pencil-fill align-bottom text-purple"></i>
                                                    </Link>
                                                </li>

                                                <li className="list-inline-item" title="Delete">
                                                    <Link
                                                        className="remove-item-btn" title="Delete" data-bs-toggle="modal" onClick={() => deleteAppointment(data.appointmentId)}

                                                        to="#"
                                                    >
                                                        <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                                    </Link>
                                                </li>
                                                {/* <li className="list-inline-item" title="View">
                                                <Link
                                                    className="view-item-btn"
                                                    to="#"
                                                >
                                                    <i className="ri-eye-fill align-bottom text-pink"></i>
                                                </Link>
                                            </li> */}
                                            </ul>
                                        </td>
                                    )}
                                </RoleBasedComponent>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                handlePageSizeChange={handlePageSizeChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                disableNext={appointmentData.length === 0 || appointmentData.length < pageSize}
            />

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />

            <Modal isOpen={modal_backdrop} toggle={() => { handleColse() }}
                backdrop={'static'} id="staticBackdrop" centered size="lg"
            >
                <ModalHeader toggle={() => { handleColse() }}>
                    Reschedule Appointment
                </ModalHeader>
                <ModalBody>
                    <EditAppointment id={id} handleClose={handleColse} />
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}
export default AppointmentDataTable