import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import FormHeader from "../../common/FormHeader/FormHeader"
import { toast } from "react-toastify"
import PatientApiService from "../../helpers/services/patient/patient-api-service"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AsyncTypeahead } from "react-bootstrap-typeahead"
import ViewPatientDetails from "./ViewPatientDetail"
import DeleteModal from "../../Components/Common/DeleteModal"
import ErrorHandler from "../../helpers/ErrorHandler"
import CreatePatient from "./CreatePatient"
import moment from "moment"
import Paginator from "../../common/pagenator/pagenator"
import CalculateAge from "../../Components/Common/CalculateAge"
import { useDispatch } from "react-redux"
import { minimizePage } from "../../slices/pageResizer/uiSlice"
import PrintComponent from "../../Components/Common/PrintComponent"
import PatientIdCard from "./PatientIdCard"
import PrintIDCard from "../../Components/Common/PrintIdCard"

const PatientDataTable = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [patientData, setPatientData] = useState<any>([]);
    const [page, setPage] = useState(0);
    const [filterBy, setFilterBy] = useState('');
    const [firstName, setFirstName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
    const [openIdCard, setOpenIdCard] = useState<boolean>(false);
    const [id, setId] = useState('');
    const [selectedData, setSelectedData] = useState('');
    const [openNewPatientModal, setOpenNewPatientModal] = useState<boolean>(false);
    const typeaheadRef = useRef<any>(null);

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

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setPatientId(patientId);
    }

    function handleClose() {
        setOpenNewPatientModal(!openNewPatientModal);
        getAllPatientData(currentPage, pageSize);
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "individualPatient?page=" + page + "&size=" + 10;

            if (patientName) {
                url = url + "&firstName=" + patientName;
            }

            if (patientId) {
                url = url + "&patientId=" + patientId;
            }

            if (dateOfBirth) {
                url = url + "&dateOfBirth=" + dateOfBirth;
            }

            if (contactNumber) {
                url = url + "&contactNumber=" + contactNumber;
            }

            let result = await patientApiService.getAllPatient(url);
            setPatientData(result);
        } catch (error:any) {
            return ErrorHandler(error)
        } finally {
            setIsLoading(false);
        }
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

    const reset = () => {
        setPatientName('');
        setPatientId('');
        setDateOfBirth('');
        setContactNumber('');
        setOptions([]);
        typeaheadRef.current.clear();
        getAllPatientData(currentPage, pageSize);
    }
    const getAllPatientData = async (page: number, size: number) => {
        try {
            const url = `all?page=${page}&size=${size}`;
            let result = await patientApiService.getAllPatient(url);
            setPatientData(result);
            if (result && result.length) {
                const totalPatients = result.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return result || [];
        } catch (error: any) {
            toast.error(error.message, { containerId: 'TR' });
            return [];
        }
    }

    const editPatient = (id: any, patientId: any) => {
        navigate('/main/edit-patient', { state: { id: id, patientId: patientId } })
    }
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await patientApiService.deletePatient(selectedId);
                toast.success('Patient Deleted Successfully', { containerId: 'TR' });
                await getAllPatientData(currentPage, pageSize);
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deletePatient = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }
    const viewPatientDetail = (id: any) => {
        setId(id);
        tog_backdrop()
    }

    const printId = (data: any) => {
        setSelectedData(data);
        openIdCardTemlate();
    }

    function openIdCardTemlate() {
        setOpenIdCard(!openIdCard);
    }

    const createNewPatient = () => {
        handleClose();
    }

    useEffect(() => {
        const loadPages = async () => {
            const currentPageData = await getAllPatientData(currentPage, pageSize);
            setPatientData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Patient Datatable"
                    pageTitle="Patient"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Patient Datatable",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">View Patient</h4>
                                <div className="d-flex align-items-center">
                                    <Button onClick={createNewPatient} color="primary"> Create Patient</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <Col>
                                        <FormGroup>
                                            <Input
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                type="date"
                                                value={dateOfBirth}
                                                onChange={e => setDateOfBirth(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <AsyncTypeahead
                                            ref={typeaheadRef}
                                            filterBy={() => true}
                                            id="patient-id-search-box"
                                            isLoading={isLoading}
                                            labelKey="name"
                                            minLength={1}
                                            options={options}
                                            onSearch={handlePatientSearch}
                                            onChange={onSelectedPatientId}
                                            placeholder="Search by Patient Id Or Name"
                                        />
                                    </Col>

                                    <Col>
                                        <FormGroup>
                                            <Input
                                                id="contactNumber"
                                                name="contactNumber"
                                                type="number"
                                                placeholder="Search By Phone Number"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col>
                                        <Button onClick={onSearch} className=" mx-1">Search</Button>
                                        <Button className="mx-1" color="danger" onClick={reset}>Reset</Button>
                                    </Col>
                                </div>
                                <div className="table-responsive">
                                    <Table hover className="table-centered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Patient Id</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Date Of Birth</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Contact Number</th>
                                                <th>Blood Group</th>
                                                <th>Action </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {patientData?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <span className="text-primary">{data.patientId}</span>
                                                    </td>
                                                    <td>  <span className="text-primary">{data.firstName}</span></td>
                                                    <td>{data.lastName || 'NA'}</td>
                                                    <td>{moment(data.dateOfBirth).format('DD/MM/YYYY')}</td>
                                                    <td ><CalculateAge dateOfBirth={data?.dateOfBirth} /></td>
                                                    <td>

                                                        {data.gender}

                                                    </td>

                                                    <td>  <span className="text-primary">{data.contactNumber} </span></td>
                                                    <td>  <span className="text-danger"> {data.bloodType || 'NA'} </span></td>
                                                    <td>
                                                        <div className="hstack gap-3 fs-15">

                                                            <ul className="list-inline hstack gap-2 mb-0">


                                                                <li className="list-inline-item">
                                                                    <Link
                                                                        className="edit-item-btn"
                                                                        to="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            editPatient(data.id, data.patientId);
                                                                        }}
                                                                        title="Edit"
                                                                    >
                                                                        <i className="ri-pencil-fill align-bottom text-purple"></i>
                                                                    </Link>
                                                                </li>

                                                                <li className="list-inline-item" title="Delete">
                                                                    <Link
                                                                        className="remove-item-btn" data-bs-toggle="modal" onClick={() => deletePatient(data.patientId)}

                                                                        to="#"
                                                                    >
                                                                        <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                                                    </Link>
                                                                </li>
                                                                <li className="list-inline-item" title="View">
                                                                    <Link
                                                                        className="view-item-btn"
                                                                        to="#" onClick={() => viewPatientDetail(data.patientId)}
                                                                    >
                                                                        <i className="ri-eye-fill align-bottom text-pink"></i>
                                                                    </Link>
                                                                </li>
                                                                <li className="list-inline-item" title="Patient Id Card">
                                                                    <Link
                                                                        className="view-item-btn"
                                                                        to="#" onClick={() => printId(data)}
                                                                    >
                                                                        <i className="ri-printer-fill align-bottom text-pink"></i>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </td>
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
                                    disableNext={patientData.length === 0 || patientData.length < pageSize}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />

            <Modal isOpen={modal_backdrop} toggle={() => { tog_backdrop() }}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={() => { tog_backdrop() }}>
                    View Patient Details
                </ModalHeader>
                <ModalBody>
                    <ViewPatientDetails id={id} />
                </ModalBody>
            </Modal>
            <Modal isOpen={openIdCard} toggle={() => { openIdCardTemlate() }}
                backdrop={'static'} id="print id" centered size="lg" scrollable
            >
                <ModalHeader toggle={() => { openIdCardTemlate() }} className="p-3 bg-info-subtle modal-title model-header-container">
                    Print Id Card
                    <PrintIDCard contentId="print" />
                </ModalHeader>
                <ModalBody id="print">
                    <PatientIdCard data={selectedData} />
                </ModalBody>
            </Modal>
            <Modal
                isOpen={openNewPatientModal}
                toggle={handleClose}
                backdrop="static"
                id="staticBackdrop"
                size="xl"
                scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Patient
                </ModalHeader>
                <ModalBody>
                    <CreatePatient handleClose={handleClose} />
                </ModalBody>
            </Modal>


        </React.Fragment>
    )
}
export default PatientDataTable