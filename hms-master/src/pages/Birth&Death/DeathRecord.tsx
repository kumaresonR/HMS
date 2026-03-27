import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, CardHeader, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormHeader from "../../common/FormHeader/FormHeader";
import BirthDeathRecordApiService from "../../helpers/services/birthDeathRecord/birth-death-record-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import moment from "moment";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import ViewDeathRecord from "./ViewDeathRecord";
import { useModal } from "../../Components/Common/ModalContext";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DownloadDeathRecord from "./DownloadDeathCertificate";

const DeathRecord = () => {
    const birthDeathRecordApiService: BirthDeathRecordApiService = new BirthDeathRecordApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    const [deathRecordData, setDeathRecordData] = useState([]);
    const { showModal } = useModal();
    const [selectedFilter, setSelectedFilter] = useState("Patient Id");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
    const typeaheadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [patientId, setPatientId] = useState("");
    const [ipdOrOpdId, setIpdOrOpdId] = useState("");

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    let navigate: any = useNavigate();

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await birthDeathRecordApiService.deleteDeathRecord(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllDeathRecord();
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

    const deleteDeathRecord = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editDeathRecord = (id: any) => {
        navigate('/main/editDeathRecord', { state: { id: id } })
    }

    const handleFilterSelect = (filterType: any) => {
        setSelectedFilter(filterType);
        setSelectedSearchTerm('')
    };

    const onSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (ipdOrOpdId) params.append('ipdOrOpdId', ipdOrOpdId);
            if (patientId) params.append('patientName', patientId);
            const queryString = params.toString();
            let result = await birthDeathRecordApiService.searchDeathRecordBySearchTearm(queryString);
            setDeathRecordData(result);
        } catch (error: any) {
            setDeathRecordData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        getAllDeathRecord();
    }

    const getAllDeathRecord = async () => {
        try {
            let result = await birthDeathRecordApiService.getAllDeathRecord();
            setDeathRecordData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllDeathRecord();
    }, []);

    const deathRecordColumns = [
        {
            header: 'Reference No',
            accessorKey: 'deathId', enableColumnFilter: false,
            cell: (info: any) => (
                <div>

                    <span className=" text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
        {
            header: 'OPD/IPD ID',
            accessorKey: 'ipdOrOpdId', enableColumnFilter: false,
            cell: (info: any) => (
                <div>

                    <span className=" text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName', enableColumnFilter: false,
        },
        {
            header: 'Guardian Name',
            accessorKey: 'guardianName', enableColumnFilter: false,
        },
        // {
        //     header: 'Gender',
        //     accessorKey: 'gender',
        //     enableColumnFilter: false,
        //     cell: ({ getValue }: any) => getValue() || 'NA',
        // },
        {
            header: 'Death Date',
            accessorKey: 'dateOfDeath', enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {moment(info.getValue()).format('DD/MM/YYYY, h:mm A')}
                    </span>
                </div>
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
                                        <DownloadDeathRecord data={cell.row.original} />
                                    ),
                                    title: "Download Death Certificate",
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
            header: "Action", enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "DOCTOR", "NURSE"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    editDeathRecord(cell.row.original.deathId);
                                }}
                                title="Edit"
                            >
                                <i className="ri-pencil-fill align-bottom text-purple"></i>
                            </Link>
                        </li>

                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn" data-bs-toggle="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteDeathRecord(cell.row.original.deathId);
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
                                        <ViewDeathRecord data={cell.row.original} />
                                    ),
                                    title: "View Death Details",
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
                    data={deathRecordData}
                />

                <Container fluid>
                    <FormHeader title="Death Record List"
                        pageTitle="Hospital Records"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Death Record List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="deathRecordList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Death Record List</h5>
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
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <Link to="/main/addDeathRecord">  <i className="ri-add-fill me-1 align-bottom"></i> Add Death Record  </Link>
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
                                            columns={deathRecordColumns}
                                            data={deathRecordData}
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

export default DeathRecord;
