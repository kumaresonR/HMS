import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Modal, ModalHeader, ModalBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import FormHeader from "../../common/FormHeader/FormHeader";
import TableContainer from "../../Components/Common/TableContainer";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import AmbulanceApiService from "../../helpers/services/ambulance/ambulance-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import { RiAddCircleFill } from "react-icons/ri";
import AddAmbulancePayment from "./AddAmbulancePayment";
import PreviewAmbulanceCall from "./PreviewAmbulanceCall";
import PrintComponent from "../../Components/Common/PrintComponent";
import EditAmbulanceCall from "./EditAmbulanceCall";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const Ambulance = () => {
    const ambulanceApiService: AmbulanceApiService = new AmbulanceApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    const [ambulanceData, setAmbulanceData] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [editModelOpen, setEditModelOpen] = useState<boolean>(false);
    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState("Patient Id");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
    const typeaheadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState("");
    const [ipdOrOpdId, setIpdOrOpdId] = useState("");
    
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const handleFilterSelect = (filterType: any) => {
        setSelectedFilter(filterType);
        setSelectedSearchTerm('')
    };

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

    const onSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (ipdOrOpdId) params.append('ipdOrOpdId', ipdOrOpdId);
            if (patientId) params.append('patientId', patientId);
            const queryString = params.toString();
            let result = await ambulanceApiService.searchAmbulanceCallBySearchTearm(queryString);
            setAmbulanceData(result);
        } catch (error: any) {
            setAmbulanceData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        getAllAmbulanceList();
    }

    const getAllAmbulanceList = async () => {
        try {
            let result = await ambulanceApiService.getAllAmbulanceCall("all");
            setAmbulanceData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await ambulanceApiService.deleteAmbulanceCall(selectedId);
                toast.success('Ambulance Call Deleted Successfully', { containerId: 'TR' });
                await getAllAmbulanceList();
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteComponent = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editModelClose = () => {
        setEditModelOpen(!editModelOpen);
        getAllAmbulanceList();
    }

    const addPayment = (data: any) => {
        setSelectedData(data);
        addPaymentClose();
    }

    const addPaymentClose = () => {
        setAddPaymentOpen(!addPaymentOpen);
        getAllAmbulanceList();
    }

    const preview = (data: any) => {
        setSelectedData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
        getAllAmbulanceList();
    }

    useEffect(() => {
        getAllAmbulanceList();
    }, []);

    const ambulanceColumns = [
        {
            header: 'Bill No',
            accessorKey: 'billNo', enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: 'OPD/IPD ID',
            accessorKey: 'ipdOrOpdId', enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientId',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const patient = cell.row.original.patients;
                return patient ? `${patient?.firstName} ${patient?.lastName}` : 'NA';
            },
        },

        {
            header: 'Vehicle Number',
            accessorKey: 'vehicleId',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const vehicle = cell.row.original.vehicle;
                return vehicle && vehicle.vehicleNumber ? vehicle.vehicleNumber : 'NA';
            },
        },
        {
            header: 'Vehicle Model',
            accessorKey: 'vehicleModel',
            enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: 'Driver Name',
            accessorKey: 'driverName',
            enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: 'Driver Contact No',
            accessorKey: 'driverContact',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const vehicle = cell.row.original.vehicle;
                return vehicle && vehicle.driverContact ? vehicle.driverContact : 'NA';
            },
        },
        {
            header: 'Patient Address',
            accessorKey: 'patientAddress',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const patient = cell.row.original.patients;
                return patient && patient.address ? patient.address : 'NA';
            },
        },
        {
            header: 'Discount',
            accessorKey: 'discountAmount',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const rowData = cell.row.original;
                const discountAmount = rowData.discountAmount;
                const discountPercentage = rowData.discountPercentage;
                if (discountAmount !== null && discountAmount !== undefined && discountPercentage !== null && discountPercentage !== undefined) {
                    return `${discountAmount} (${discountPercentage}%)`;
                } else {
                    return 'NA';
                }
            },
        },

        {
            header: 'Net Amount (₹)',
            accessorKey: 'netAmount', enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: 'Paid Amount (₹)',
            accessorKey: 'transactions',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const totalPayment = cell.row.original.transactions?.reduce((sum: number, transaction: any) => {
                    return sum + (transaction.paymentAmount || 0);
                }, 0);
                return totalPayment ?? 'NA';
            }
        },
        {
            header: 'Balance Amount (₹)',
            accessorKey: 'balanceAmount',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const value = cell.getValue();
                return value !== null && value !== undefined ? value : 'NA';
            },
        },
        {
            header: "Action",
            cell: (cell: any) => (
                <div className="d-flex gap-2">
                    <li className="list-inline-item" title="View">
                        <Link
                            className="view-item-btn" onClick={() => preview(cell.row.original)}
                            to="#"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link
                            className="add-item-btn" data-bs-toggle="modal" onClick={() => addPayment(cell.row.original)}
                            to="#"

                            title="Add Payment"
                        >
                            <RiAddCircleFill size={12} color="text-primary" />
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link
                            className="remove-item-btn" data-bs-toggle="modal" onClick={() => deleteComponent(cell.row.original.vehicleChargeId)}
                            to="#"
                            title="Delete"
                        >
                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                        </Link>
                    </li>
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={ambulanceData}
            />

            <Container fluid>
                <FormHeader
                    title="Ambulance Call List"
                    pageTitle="Emergency Services"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Ambulance Call List",
                    }))} />
                <Row>
                    <Col lg={12}>
                        <Card id="ambulanceList">
                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm">
                                        <div>
                                            <h5 className="card-title mb-0">Ambulance Call List</h5>
                                        </div>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setIsExportCSV(true)}
                                            >
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                Export
                                            </button>
                                            <Button color="primary" className="btn btn-primary add-btn ms-2" onClick={() => navigate('/main/addAmulanceCall')}>
                                                <i className="ri-add-fill me-1 align-bottom"></i> Add Ambulance Call
                                            </Button>
                                            <Button color="primary" className="btn btn-primary add-btn ms-2" onClick={() => navigate('/main/ambulanceList')}>
                                                <i className=" ri-list-check me-1 align-bottom"></i>Ambulance List
                                            </Button>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>

                            <div className="card-body pt-0">
                                <Row className="align-items-center mb-2">
                                    <Col xs="auto">
                                        <UncontrolledDropdown className="card-header-dropdown pb-4">
                                            <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                                <span className="text-muted">
                                                    <FontAwesomeIcon icon={faFilter} /> Filter By: {selectedFilter} <i className="mdi mdi-chevron-down ms-1"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem onClick={() => handleFilterSelect("Patient Id")}>Patient Id</DropdownItem>
                                                <DropdownItem onClick={() => handleFilterSelect("ipdOrOpdId")}>OPD Or IPD ID</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>

                                    <Col>
                                        {selectedFilter === "Patient Id" && (
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
                                        )}

                                        {selectedFilter === "ipdOrOpdId" && (
                                            <input
                                                type="text"
                                                placeholder="Search by OPD Or IPD Id"
                                                value={ipdOrOpdId}
                                                onChange={(e: any) => setIpdOrOpdId(e.target.value.toUpperCase())}
                                                className="form-control"
                                            />
                                        )}
                                    </Col>
                                    <Col xs="auto">
                                        <Button onClick={onSearch} className=" mx-1">Search</Button>
                                        <Button className="mx-1" color="danger" onClick={reset}>Reset</Button>
                                    </Col>
                                </Row>
                                <div>
                                    <TableContainer
                                        columns={ambulanceColumns}
                                        data={ambulanceData}
                                        isGlobalFilter={false}
                                        isCustomerFilter={false}
                                        customPageSize={10}
                                        tableClass="table table-bordered"
                                        theadClass="thead-light"
                                        divClass="table-responsive"
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Modal isOpen={addPaymentOpen} toggle={addPaymentClose}
                    backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
                >
                    <ModalHeader toggle={addPaymentClose} className="p-3 bg-info-subtle modal-title model-header-container">
                        Payments
                    </ModalHeader>
                    <ModalBody>
                        <AddAmbulancePayment data={selectedData} handleClose={addPaymentClose} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={previewOpen} toggle={previewClose} backdrop={'static'} centered size='lg' scrollable>
                    <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                        Bill Details
                        <div className='d-flex align-items-center'>
                            <PrintComponent contentId="prescriptionContent" />
                            {/* <FontAwesomeIcon icon={faPenToSquare} className="mx-1 text-primary pointer" onClick={() => editAmbulanceDetails()} /> */}
                        </div>
                    </ModalHeader>
                    <ModalBody id="prescriptionContent">
                        <PreviewAmbulanceCall data={selectedData} handleClose={previewClose} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={editModelOpen} toggle={editModelClose} backdrop={'static'} centered fullscreen scrollable>
                    <ModalHeader toggle={editModelClose} className="p-3 bg-info-subtle model-container text-white">
                        Edit Details
                    </ModalHeader>
                    <ModalBody>
                        <EditAmbulanceCall data={selectedData} close={previewClose} handleClose={editModelClose} />
                    </ModalBody>
                </Modal>

                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDelete}
                    onCloseClick={() => setDeleteModal(false)}
                />
            </Container>
        </React.Fragment>
    );
};

export default Ambulance;
