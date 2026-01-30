import { faBars, faFile, faPen, faPrescription, faPrint, faShareSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Table, UncontrolledDropdown } from "reactstrap";
import PreviewVisitDetails from "./PreviewVisitDetails";
import EditCheckupDetail from "./EditCheckupDetail";
import EditPresciption from "../../../../IPD/InPatient/IpdContainer/Prescription/EditPrescription";
import { useState } from "react";
import EditIpdPatient from "../../../../IPD/InPatient/EditIpdPatient";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AddPrescription from "../../../../IPD/InPatient/IpdContainer/Prescription/AddPrescription";

const VisitDataTable = (props: any) => {
    let navigate: any = useNavigate();
    const title = props.title;
    console.log("title", title)
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [editPrescriptionOpen, setEditPrescriptionOpen] = useState<boolean>(false);
    const [moveToIpdClose, setMoveToIpdClose] = useState<boolean>(false);
    const [seectedItem, setSeectedItem] = useState();

    const handleClose = () => {
        setOpenAddModal(!openAddModal);
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

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
    }

    const handleCloseMoveToIpd = () => {
        setMoveToIpdClose(!moveToIpdClose)
    }

    const viewIpdOverview = (data: any) => {
        props.handleIpdClick(data);
    }

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>OPD ID</th>
                            {/* <th>Case ID</th> */}
                            <th>Appointment Date</th>
                            <th>Consultant Doctor</th>
                            <th>Reference</th>
                            <th>Symptoms</th>
                            <th>Previous Medical Issue</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {props?.visitData?.totalOPDVisit?.length > 0 ? (
                            props?.visitData?.totalOPDVisit.map((item: any, idx: any) => (
                                <tr key={idx}>
                                    <td>
                                        {title ? (
                                            <a
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    viewIpdOverview(item);
                                                }}
                                            >
                                                {item.admissions?.opdId}
                                            </a>
                                        ) : (
                                            <label>{item.admissions?.opdId}</label>
                                        )}
                                    </td>
                                    {/* <td>{item.admissions?.caseId}</td> */}
                                    <td>
                                        {item.admissions?.appointmentDate
                                            ? moment(item.admissions.appointmentDate).format('DD/MM/YYYY, hh:mm A')
                                            : 'NA'}
                                    </td>
                                    <td>{item.admissions?.doctor?.firstName} {item.admissions?.doctor?.lastName} ({item.admissions?.doctor?.staffId})</td>
                                    <td>
                                        <span>{item.admissions?.reference}</span>
                                    </td>
                                    <td>{item.admissions?.symptomsDescription}</td>
                                    <td>{item.admissions?.previousMedicalIssue || 'NA'}</td>
                                    {/* <td>
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                href="#"
                                                className="btn btn-soft-secondary btn-sm"
                                                tag="button"
                                            >
                                                <i className="ri-more-fill" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem onClick={() => addNew()}>
                                                    <FontAwesomeIcon icon={faPrescription} className="me-2 text-muted" /> Add Prescription
                                                </DropdownItem>

                                                <DropdownItem onClick={() => manualPrescription()}>
                                                    <FontAwesomeIcon icon={faFile} className="me-2 text-muted" />Manual Prescription
                                                </DropdownItem>

                                                <DropdownItem onClick={() => preview(item)}>
                                                    <FontAwesomeIcon icon={faBars} className="me-2 text-muted" /> View
                                                </DropdownItem>

                                                <DropdownItem data-bs-toggle="modal" onClick={() => moveToIpd(item)}>
                                                    <FontAwesomeIcon icon={faShareSquare} className="me-2 text-muted" /> Move In IPD
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>No visits found.</td>
                            </tr>
                        )}

                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                Visit Details
                <div>
                    <Button data-bs-toggle="modal" onClick={() => edit()}
                        className="btn btn-sm btn-soft-secondary edit-list mx-1" title="View">
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                </div>
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
                <AddPrescription data={previewData} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editModel} toggle={handleEditClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                Edit Visit Details
            </ModalHeader>
            <ModalBody>
                <EditCheckupDetail handleParentClose={handlePreviewClose} handleClose={handleEditClose} data={props.data} />
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
                <EditIpdPatient title="moveToIPD" data={seectedItem} handleClose={handleCloseMoveToIpd} />
            </ModalBody>
        </Modal>
    </>
}
export default VisitDataTable