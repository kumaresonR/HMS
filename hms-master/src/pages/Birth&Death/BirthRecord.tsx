import React, { useEffect, useRef, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import BirthDeathRecordApiService from "../../helpers/services/birthDeathRecord/birth-death-record-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import moment from "moment";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useModal } from "../../Components/Common/ModalContext";
import ViewBirthRecord from "./ViewBirthRecord";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import DownloadBirthRecord from "./DownloadBirthCertificate";

const BirthRecord = () => {
    const birthDeathRecordApiService: BirthDeathRecordApiService = new BirthDeathRecordApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();
    const { showModal } = useModal();

    const [birthRecordData, setBirthRecordData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("Patient Id");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
    const typeaheadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState("");
    const [ipdOrOpdId, setIpdOrOpdId] = useState("");

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await birthDeathRecordApiService.deleteBirthRecord(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllBirthRecord();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const deletebirthRecord = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const addBirthRecord = () => {
        navigate('/main/addBirthRecord')
    }

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
            if (patientId) params.append('motherName', patientId);
            const queryString = params.toString();
            let result = await birthDeathRecordApiService.searchBirthRecordBySearchTearm(queryString);
            setBirthRecordData(result);
        } catch (error: any) {
            setBirthRecordData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        getAllBirthRecord();
    }

    const getAllBirthRecord = async () => {
        try {
            let result = await birthDeathRecordApiService.getAllBirthRecord();
            setBirthRecordData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const editBirthRecord = (id: any) => {
        navigate('/main/editBirthRecord', { state: { id: id } })
    }

    useEffect(() => {
        getAllBirthRecord();
    }, []);

    const birthRecordColumns = [
        {
            header: 'Reference No',
            accessorKey: 'birthRecordId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue() || 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'OPD/IPD ID',
            accessorKey: 'ipdOrOpdId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue() || 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Child Name',
            accessorKey: 'childName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue() || 'N/A'}</div>
            ),
        },
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue() || 'N/A'}</div>
            ),
        },
        {
            header: 'Birth Date',
            accessorKey: 'dateOfBirth',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue()
                            ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A')
                            : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Mother Name',
            accessorKey: 'motherName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue() || 'N/A'}</div>
            ),
        },
        {
            header: 'Father Name',
            accessorKey: 'fatherName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue() || 'N/A'}</div>
            ),
        },
        {
            header: "Certificate",
            accessorKey: "certificate",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item" title="View">
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                showModal({
                                    content: (
                                        <DownloadBirthRecord data={cell.row.original} />
                                    ),
                                    title: "Download Birth Certificate",
                                    size: "lg",
                                });
                            }}
                            className="view-item-btn"
                            to="#"
                        >
                            <button className="btn btn-sm btn-success"> Download </button>
                        </Link>
                    </li>
                </ul>
            ),
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "DOCTOR", "NURSE"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    editBirthRecord(cell.row.original.birthRecordId);
                                }}
                                to="#"
                                title="Edit"
                            >
                                <i className="ri-pencil-fill align-bottom text-purple"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn"
                                data-bs-toggle="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deletebirthRecord(cell.row.original.birthRecordId);
                                }}
                                to="#"
                            >
                                <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item" title="View">
                            <Link onClick={(e) => {
                                e.preventDefault();
                                showModal({
                                    content: (
                                        <ViewBirthRecord data={cell.row.original} />
                                    ),
                                    title: "View Birth Details",
                                    size: "lg",
                                })
                            }}
                                className="view-item-btn"
                                to="#"
                            >
                                <i className="ri-eye-fill align-bottom text-pink"></i>
                            </Link>
                        </li>
                    </ul>
                </RoleBasedComponent>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={birthRecordData}
                />

                <Container fluid>
                    <FormHeader title="Birth Record List"
                        pageTitle="Birth & Deah Records"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Birth Record List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="birthRecordList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Birth Record List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "DOCTOR", "NURSE"]}>
                                                    <Button color="primary" onClick={addBirthRecord}
                                                        className="btn btn-primary add-btn ms-2">
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Birth Record
                                                    </Button>
                                                </RoleBasedComponent>
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
                                                <input
                                                    type="text"
                                                    placeholder="Search by OPD Or IPD Id"
                                                    value={patientId}
                                                    onChange={(e: any) => setPatientId(e.target.value.toUpperCase())}
                                                    className="form-control"
                                                />
                                                // <AsyncTypeahead
                                                //     ref={typeaheadRef}
                                                //     filterBy={() => true}
                                                //     id="patient-id-search-box"
                                                //     isLoading={isLoading}
                                                //     labelKey="name"
                                                //     minLength={1}
                                                //     options={options}
                                                //     onSearch={handlePatientSearch}
                                                //     onChange={onSelectedPatientId}
                                                //     placeholder="Search by Patient Id Or Name"
                                                // />
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
                                            columns={birthRecordColumns}
                                            data={birthRecordData}
                                            isGlobalFilter={false}
                                            isCustomerFilter={true}
                                            customPageSize={5}
                                            tableClass="table table-bordered"
                                            theadClass="thead-light"
                                            divClass="table-responsive"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default BirthRecord;
