import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Row, Table, UncontrolledDropdown } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPen } from "@fortawesome/free-solid-svg-icons";
import EditPresciption from "../../IPD/InPatient/IpdContainer/Prescription/EditPrescription";
import EditCheckupDetail from "./OpdContainer/Visits/EditCheckupDetail";
import PreviewVisitDetails from "./OpdContainer/Visits/PreviewVisitDetails";
import EditIpdPatient from "../../IPD/InPatient/EditIpdPatient";
import OPDApiService from "../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import AddPrescription from "../../IPD/InPatient/IpdContainer/Prescription/AddPrescription";
import PrintComponent from "../../../Components/Common/PrintComponent";
import ManualPrescription from "../../IPD/InPatient/IpdContainer/Prescription/ManualPrescription";
import OpdBill from "./OpdContainer/Visits/OpdBill";
import { RiAddCircleFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import Paginator from "../../../common/pagenator/pagenator";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";

const OpdViewDataTable = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    const opdApiService: OPDApiService = new OPDApiService();
    let navigate: any = useNavigate();

    const [data, setData] = useState([]);
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [editPrescriptionOpen, setEditPrescriptionOpen] = useState<boolean>(false);
    // const [ipdData, setIpdData] = useState<any>([1]);
    const [moveToIpdClose, setMoveToIpdClose] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState({})
    const [manualPrescriptionOpen, setManualPrescriptionOpen] = useState<boolean>(false);
    const [printBillOpen, setPrintBillOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState(data);
    const typeaheadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("Patient Id");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");


    const handleFilterSelect = (filterType: any) => {
        setSelectedFilter(filterType);
        setSelectedSearchTerm('')
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

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

    const viewIpdOverview = (data: any) => {
        navigate('/main/OPD-overview', { state: { data: data } })
    }

    const handleClose = () => {
        setOpenAddModal(!openAddModal);
    }

    const addNew = (data: any) => {
        setSelectedData(data)
        handleClose()
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const handleEditPrescriptionClose = () => {
        setEditPrescriptionOpen(!editPrescriptionOpen);
    }

    const preview = (data: any) => {
        setPreviewData(data);
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
        if (previewModelOpen === false) {
            getAllOPD(currentPage, pageSize);
        }
    }

    const moveToIpd = (data: any) => {
        setPreviewData(data);
        handleCloseMoveToIpd();
    }

    const handleCloseMoveToIpd = () => {
        setMoveToIpdClose(!moveToIpdClose)
    }

    const printBillClose = () => {
        setPrintBillOpen(!printBillOpen)
    }

    const manualPrescription = (data: any) => {
        setPreviewData(data);
        manualPrescriptionClose();
    }

    const manualPrescriptionClose = () => {
        setManualPrescriptionOpen(!manualPrescriptionOpen)
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
        setSelectedSearchTerm(patientId);
    }


    const onSearch = async (value:any) => {
        try {
            let url = "searchTerm=" + value;
            let result = await opdApiService.searchOPDBySearchTearm(url);
            setData(result);
        } catch (error: any) {
            setData([]);
        }
    }

    const getAllOPD = async (page: number, size: number) => {
        setLoading(true);
        try {
            const url = `all?page=${page}&size=${size}`;
            let data = await opdApiService.getAllOPD(url);
            setData(data);
            if (data && data.length) {
                const totalPatients = data.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        } finally {
            setLoading(false);
        }

    }
    const reset = () => {
        setSelectedSearchTerm("");
        getAllOPD(currentPage, pageSize);
    }

    const resetOPD = () => {
        localStorage.removeItem("opdId");
        localStorage.removeItem("opdPatientId");
        localStorage.removeItem("activeTab");
    }

    useEffect(() => {
        resetOPD();
        const loadPages = async () => {
            const currentPageData = await getAllOPD(currentPage, pageSize);
            setData(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(data);
            return;
        }

        const filteredResults = data.filter((item: any) =>
            item.opdId.toString().toLowerCase().includes(searchTerm) ||
            `${item.patient?.firstName} ${item.patient?.lastName}`.toLowerCase().includes(searchTerm) ||
            `${item.doctor?.firstName} ${item.doctor?.lastName}`.toLowerCase().includes(searchTerm)
        );

        setFilteredData(filteredResults);
    }, [searchTerm, data]);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Row className="align-items-center mb-2">
                                    {/* <Col xs="auto">
                                        <UncontrolledDropdown className="card-header-dropdown pb-4">
                                            <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                                <span className="text-muted">
                                                    <FontAwesomeIcon icon={faFilter} /> Filter By: {selectedFilter} <i className="mdi mdi-chevron-down ms-1"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem onClick={() => handleFilterSelect("Patient Id")}>Patient Id</DropdownItem>
                                                <DropdownItem onClick={() => handleFilterSelect("OPD Id")}>OPD Id</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col> */}

                                    <Col>
                                        {/* {selectedFilter === "Patient Id" && (
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
                                        )} */}

                                        <input
                                            type="search"
                                            placeholder="Search by OPD No, Patient Name, or Patient Id"
                                            onChange={(e: any) => onSearch(e.target.value)}
                                            className="form-control"
                                        />
                                    </Col>
                                    {/* <Col xs="auto">
                                        <Button onClick={onSearch} className=" mx-1">Search</Button>
                                        <Button className="mx-1" color="danger" onClick={reset}>Reset</Button>
                                    </Col> */}
                                </Row>

                                {/* <input
                                    type="text"
                                    placeholder="Search by OPD No, Name, or Doctor"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control mb-3"
                                /> */}
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>OPD No </th>
                                                <th>Patient Name</th>
                                                {/* <th>Case ID</th> */}
                                                <th>Appointment Date </th>
                                                <th>Consultant </th>
                                                <th>Is Antenatal </th>
                                                <th>Previous Medical Issue </th>
                                                <th>Action  </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((data: any, idx: any) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <a href="#" onClick={(event) => {
                                                                event.preventDefault();
                                                                viewIpdOverview(data.opdId);
                                                            }}>
                                                                {data.opdId}
                                                            </a>
                                                        </td>
                                                        <td className="text-primary">{data.patient?.firstName}</td>
                                                        {/* <td>{data.caseId}</td> */}
                                                        <td>{moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</td>
                                                        <td className="text-primary">{data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId}) </td>

                                                        <td>{data.antenatal ? "Yes" : "No"}</td>
                                                        <td className="text-primary">{data.previousMedicalIssue || 'NA'} </td>
                                                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                                            <td>
                                                                <ul className="list-inline hstack gap-2 mb-0">
                                                                    <li className="list-inline-item">
                                                                        <Link
                                                                            className="add-item-btn" data-bs-toggle="modal" onClick={() => addNew(data)}
                                                                            to="#"

                                                                            title="Add Prescription"
                                                                        >
                                                                            <RiAddCircleFill size={12} className="text-primary" />
                                                                        </Link>
                                                                    </li>
                                                                    <li className="list-inline-item">
                                                                        <Link
                                                                            className="add-item-btn" data-bs-toggle="modal" onClick={() => manualPrescription(data)} title="Manual Prescription"
                                                                            to="#"
                                                                        >
                                                                            <FaFileAlt size={12} className="text-success" />
                                                                        </Link>
                                                                    </li>

                                                                    <li className="list-inline-item" title="View">
                                                                        <Link
                                                                            className="view-item-btn"
                                                                            to="#" data-bs-toggle="modal" onClick={() => preview(data)} title="View"
                                                                        >
                                                                            <i className="ri-eye-fill align-bottom text-pink"></i>
                                                                        </Link>
                                                                    </li>
                                                                    {data.dischargeDate && (
                                                                        <li className="list-inline-item" title="Move In IPD">
                                                                            <Link
                                                                                className="view-item-btn"
                                                                                to="#"
                                                                                data-bs-toggle="modal"
                                                                                onClick={() => moveToIpd(data)}
                                                                            >
                                                                                <IoIosShareAlt className="text-purple" />
                                                                            </Link>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </td>
                                                        </RoleBasedComponent>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center">No records available</td>
                                                </tr>
                                            )}
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
                                    disableNext={data.length === 0}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>


            <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Visit Details
                    <Button data-bs-toggle="modal" onClick={() => edit()}
                        className="btn btn-sm btn-soft-secondary edit-list mx-1" title="View">
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                </ModalHeader>

                <ModalBody>
                    <PreviewVisitDetails data={previewData} handleClose={handlePreviewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Add Prescription
                </ModalHeader>
                <ModalBody>
                    <AddPrescription data={selectedData} handleClose={handleClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Visit Details
                </ModalHeader>
                <ModalBody>
                    <EditCheckupDetail data={previewData} handleClose={handleEditClose} handleParentClose={handlePreviewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editPrescriptionOpen} toggle={handleEditPrescriptionClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditPrescriptionClose} className="p-3 bg-info-subtle modal-title">
                    Edit Presciption
                </ModalHeader>
                <ModalBody>
                    <EditPresciption handleClose={handleEditPrescriptionClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={moveToIpdClose} toggle={handleCloseMoveToIpd}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleCloseMoveToIpd} className="p-3 bg-info-subtle modal-title">
                    Move To IPD
                </ModalHeader>
                <ModalBody>
                    <EditIpdPatient title="moveToIPD" data={previewData} handleClose={handleCloseMoveToIpd} />
                </ModalBody>
            </Modal>

            <Modal isOpen={manualPrescriptionOpen} toggle={manualPrescriptionClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={manualPrescriptionClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    OPD Prescription
                    <PrintComponent contentId="prescriptionContent" />
                </ModalHeader>
                <ModalBody id="prescriptionContent">
                    <ManualPrescription data={previewData} />
                </ModalBody>
            </Modal>

            <Modal isOpen={printBillOpen} toggle={printBillClose}
                backdrop={'static'} id="opd-bill" centered fullscreen scrollable
            >
                <ModalHeader toggle={printBillClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    OPD Bill
                    <PrintComponent contentId="opdBill" />
                </ModalHeader>
                <ModalBody id="opdBill">
                    <OpdBill data={previewData} />
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}
export default OpdViewDataTable