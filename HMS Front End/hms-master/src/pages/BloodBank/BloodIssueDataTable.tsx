import { faFilter, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from "reactstrap"
import PreviewBloodIssueDetails from "./PreviewBloodIssueDetails";
import EditBloodIssue from "./EditBloodIssue";
import PrintComponent from "../../Components/Common/PrintComponent";
import BloodBankApiService from "../../helpers/services/bloodBank/BloodBankApiService";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";
import moment from "moment";
import { RiAddCircleFill } from 'react-icons/ri';
import { Link } from "react-router-dom";
import AddBloodIssuePayment from "./AddBloodIssuePayment";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const BloodIssueDataTable = (props: any) => {
    const bloodBankApiService = new BloodBankApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    const [editModel, setEditModel] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
    const [bloodIssueData, setBloodIssueData] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState('');
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

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await bloodBankApiService.deleteBloodIssue(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await fetchData();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteBloodIssue = (id: any) => {
        setSelectedId(id.issueBloodId);
        setDeleteModal(true);
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
            if (patientId) params.append('patientId', patientId);
            const queryString = params.toString();
            let result = await bloodBankApiService.searchIssueBloodBySearchTearm(queryString);
            setBloodIssueData(result);
        } catch (error: any) {
            setBloodIssueData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        fetchData();
    }

    const fetchData = async () => {
        try {
            const data = await bloodBankApiService.getAllIssueBlood('all');
            setBloodIssueData(data);
        } catch (error: any) {
            console.log("Error fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [props.refresh]);

    const bloodIssueColumns = [
        {
            header: "Bill No", accessorKey: "issueBloodId", enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: "OPD/IPD ID", accessorKey: "ipdOrOpdId", enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue() ? info.getValue() : 'NA'}

                </div>
            ),
        },
        {
            header: "Issue Date", accessorKey: "issueDate", enableColumnFilter: false,
            cell: (cell: any) => {
                const formattedDate = moment(cell.getValue()).format('DD-MM-YYYY');
                return <span className="text-nowrap">{formattedDate}</span>;
            }

        },
        {
            header: "Received To", accessorKey: "patientId", enableColumnFilter: false,
            cell: (cell: any) => {
                const patient = cell.row.original.patientDetails;
                return patient ? `${patient?.firstName} ${patient?.lastName} (${patient?.patientId})` : 'NA';
            },
        },
        {
            header: "Blood Group", accessorKey: "bloodGroup", enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-danger">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: "Gender", accessorKey: "donorGender", enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        {
            header: "Donor Name", accessorKey: "donorName", enableColumnFilter: false,
            cell: (cell: any) => cell.getValue() ? cell.getValue() : 'NA',
        },
        { header: "Bags", accessorKey: "bagStockId", enableColumnFilter: false, },
        {
            header: "Blood Qty", accessorKey: "bloodQty", enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        { header: "Net Amount(₹)", accessorKey: "netAmount", enableColumnFilter: false, },
        { header: "Paid Amount(₹)", accessorKey: "paymentAmount", enableColumnFilter: false, },
        { header: "Balance Amount(₹)", accessorKey: "balanceAmount", enableColumnFilter: false, },
        {
            header: "Action",
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN", "ADMIN"]}>
                    {props.title !== "Billing" &&
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item">
                                <Link
                                    className="add-item-btn" onClick={() => addPayment(cell.row.original)}
                                    to="#"
                                    title="Add Payment"
                                >
                                    <RiAddCircleFill size={12} color="text-primary" />
                                </Link>
                            </li>

                            <li className="list-inline-item" title="View">
                                <Link
                                    className="view-item-btn"
                                    to="#" onClick={() => preview(cell.row.original)}
                                >
                                    <i className="ri-eye-fill align-bottom text-pink"></i>
                                </Link>
                            </li>

                        </ul>
                    }
                </RoleBasedComponent>
            ),
        },
    ];

    const preview = (data: any) => {
        setSelectedData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
        fetchData();
    }

    const addPayment = (data: any) => {
        setSelectedData(data);
        addPaymentClose();
    }

    const addPaymentClose = () => {
        setAddPaymentOpen(!addPaymentOpen);
        fetchData();
    }

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    return <>

        <Col xl={12}>
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
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={bloodIssueData}
            />

            <TableContainer
                columns={bloodIssueColumns}
                data={bloodIssueData}
                isGlobalFilter={false}
                customPageSize={10}
                tableClass="table table-bordered"
                theadClass="thead-light"
                divClass="table-responsive"
            />
        </Col>

        <Modal isOpen={previewOpen} toggle={previewClose} backdrop={'static'} centered size='lg' scrollable>
            <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                Bill Details
                <div className='d-flex align-items-center'>
                    <PrintComponent contentId="prescriptionContent" />
                    {/* <FontAwesomeIcon icon={faPenToSquare} className="mx-1 text-primary pointer" onClick={() => edit()} /> */}
                    <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger pointer" onClick={() => deleteBloodIssue(selectedData)} />
                </div>
            </ModalHeader>
            <ModalBody id="prescriptionContent">
                <PreviewBloodIssueDetails data={selectedData} handleClose={previewClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editModel} toggle={handleEditClose} backdrop={'static'} centered fullscreen scrollable>
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle model-container text-white">
                Edit Blood Issue
            </ModalHeader>
            <ModalBody>
                <EditBloodIssue data={selectedData} handleClose={handleEditClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={addPaymentOpen} toggle={addPaymentClose} backdrop={'static'} centered fullscreen scrollable>
            <ModalHeader toggle={addPaymentClose} className="p-3 bg-info-subtle modal-title model-header-container">
                Payments
            </ModalHeader>
            <ModalBody>
                <AddBloodIssuePayment data={selectedData} handleClose={addPaymentClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}

export default BloodIssueDataTable;
