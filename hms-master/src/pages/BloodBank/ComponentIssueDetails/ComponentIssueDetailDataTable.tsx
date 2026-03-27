import { faMoneyBill, faBars, faPenToSquare, faTrashCan, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Row, Table, UncontrolledDropdown } from "reactstrap"
import { useEffect, useRef, useState } from "react"
import PrintComponent from "../../../Components/Common/PrintComponent"
import PreviewComponentIssueDetails from "../../Radiology/PreviewComponentIssueDetails"
import EditComponentIssue from "../EditComponentIssue"
import ErrorHandler from "../../../helpers/ErrorHandler"
import BloodBankApiService from "../../../helpers/services/bloodBank/BloodBankApiService"
import { toast } from "react-toastify"
import BloodBankPayment from "../BloodBankPayment"
import moment from "moment"
import DeleteModal from "../../../Components/Common/DeleteModal"
import { Link } from "react-router-dom"
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent"
import PatientApiService from "../../../helpers/services/patient/patient-api-service"
import { AsyncTypeahead } from "react-bootstrap-typeahead"

const ComponentIssueDetailDataTable = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [componentIssueData, setComponentIssueData] = useState([]);
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

    const addPayment = (data: any) => {
        setSelectedData(data);
        addPaymentClose();
    }

    const addPaymentClose = () => {
        setAddPaymentOpen(!addPaymentOpen);
        getAllComponentIssue();
    }

    const preview = (data: any) => {
        setSelectedData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
        getAllComponentIssue();
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
        getAllComponentIssue();
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
            let result = await bloodBankApiService.searchComponentIssueBySearchTearm(queryString);
            setComponentIssueData(result);
        } catch (error: any) {
            setComponentIssueData([]);
        }
    }

    const reset = () => {
        setIpdOrOpdId("");
        setPatientId("");
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        setOptions([]);
        getAllComponentIssue();
    }

    const getAllComponentIssue = async () => {
        try {
            let url = "all";
            let result = await bloodBankApiService.getAllComponentIssue(url);
            setComponentIssueData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await bloodBankApiService.deleteComponentIssue(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllComponentIssue();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteComponentIssue = (id: any) => {
        setSelectedId(id.issueComponentId);
        setDeleteModal(true);
    }

    useEffect(() => {
        getAllComponentIssue();
    }, [props.refresh]);


    return <>
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
        <div className="table-responsive">
            <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Bill No</th>
                        <th>OPD/IPD ID</th>
                        <th>Issue Date</th>
                        <th>Received To</th>
                        <th>Blood Group</th>
                        <th>Component</th>
                        {/* <th>Gender</th>
                        <th>Donor Name</th> */}
                        <th>Bags</th>
                        <th>Net Amount(₹)</th>
                        <th>Paid Amount(₹)</th>
                        <th>Balance Amount(₹)</th>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN"]}>
                            {props.title !== "Billing" && <th>Action</th>}
                        </RoleBasedComponent>
                    </tr>
                </thead>
                <tbody>
                    {componentIssueData?.map((data: any, idx: any) => (
                        <tr key={idx}>
                            <td>{data.issueComponentId} </td>
                            <td className="text-primary">{data.ipdOrOpdId || 'NA'}</td>
                            <td className="text-nowrap">{moment(data.issueDate).format('DD/MM/YYYY hh:mm A')}</td>
                            <td className="text-primary">{data.patientDetails.firstName}{data.patientDetails.lastName}({data.patientId}) </td>
                            <td className="text-danger">{data.bloodGroup} </td>
                            <td className="text-primary">{data.components} </td>
                            {/* <td>{data.gender || 'NA'}</td>
                            <td className="text-primary">{data.donorName || 'NA'}</td> */}
                            <td className="text-primary">{data.componentId}</td>
                            <td>{data.netAmount}</td>
                            <td>{data.paymentAmount}</td>
                            <td>{data.balanceAmount}</td>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN"]}>
                                {props.title !== "Billing" && (
                                    <th>
                                        <span>
                                            <Link to="#" data-bs-toggle="modal" onClick={() => addPayment(data)}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="Add payments">
                                                <FontAwesomeIcon icon={faMoneyBill} />
                                            </Link>
                                            <Link to="#" data-bs-toggle="modal" onClick={() => preview(data)}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                                <FontAwesomeIcon icon={faBars} />
                                            </Link>
                                        </span>
                                    </th>
                                )}
                            </RoleBasedComponent>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

        <Modal isOpen={previewOpen} toggle={previewClose}
            backdrop={'static'} id="staticBackdrop" centered size='xl' scrollable
        >
            <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                <h5 className="modal-title" >Bill Details</h5>
                <div className='d-flex align-items-center'>
                    <PrintComponent contentId="prescriptionContent" />
                    <FontAwesomeIcon icon={faPenToSquare} className="mx-1 text-primary pointer" onClick={() => edit()} />
                    <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger pointer" onClick={() => deleteComponentIssue(selectedData)} />
                </div>
            </ModalHeader>
            <ModalBody id="prescriptionContent">
                <PreviewComponentIssueDetails title="component-issue" data={selectedData} handleClose={previewClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editModel} toggle={handleEditClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info model-container text-white">

            </ModalHeader>
            <ModalBody>
                <EditComponentIssue data={selectedData} handleClose={handleEditClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={addPaymentOpen} toggle={addPaymentClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={addPaymentClose} className="p-3 bg-info-subtle modal-title model-header-container">
                Payments
            </ModalHeader>
            <ModalBody>
                <BloodBankPayment title="component-issue" data={selectedData} handleClose={addPaymentClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default ComponentIssueDetailDataTable