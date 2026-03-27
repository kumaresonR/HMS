import { faBars, faPen, faPrescription, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import PreviewVisitDetails from "./PreviewVisitDetails";
import AddPrescription from "../../../../IPD/InPatient/IpdContainer/Prescription/AddPrescription";
import EditCheckupDetail from "./EditCheckupDetail";
import EditPresciption from "../../../../IPD/InPatient/IpdContainer/Prescription/EditPrescription";
import PrintTable from "../../../../../Components/Common/PrintTable";
import moment from "moment";

const CheckupDatatable = (props: any) => {
    const [data, setData] = useState(props.data);
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [editPrescriptionOpen, setEditPrescriptionOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleClose = () => {
        setOpenAddModal(!openAddModal);
    }

    const addNew = () => {
        handleClose()
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const editPrescription = () => {
        handleEditPrescriptionClose();
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
    }

    const handlePrintClick = (item: any) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered  align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>OPD Checkup ID</th>
                            <th>Appointment Date</th>
                            <th>Consultant Doctor</th>
                            <th>Reference</th>
                            <th>Symptoms</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {data.visitHistory?.map((item: any, idx: any) => ( */}
                        <tr>
                            <td>
                                {data.admissions?.opdId}
                            </td>
                            <td>{moment(data.admissions?.appointmentDate).format("DD/MM/YYYY hh:mm A")}</td>
                            <td>{data.admissions?.doctor?.firstName} {data.admissions?.doctor?.lastName} ({data.admissions?.doctor?.staffId})</td>
                            <td>
                                <span>{data.admissions?.reference}</span>
                            </td>
                            <td>{data.admissions?.symptomsDescription}</td>

                            <td>
                                <span>
                                    <Button data-bs-toggle="modal" onClick={() => addNew()}
                                        className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Add Prescription">
                                        <FontAwesomeIcon icon={faPrescription} />
                                    </Button>
                                    <Button data-bs-toggle="modal" onClick={() => handlePrintClick(data)}
                                        className="btn btn-sm btn-soft-dark edit-list mx-1" title="Print">
                                        <FontAwesomeIcon icon={faPrint} />
                                    </Button>
                                    <Button data-bs-toggle="modal" onClick={() => preview(data)}
                                        className="btn btn-sm btn-soft-success edit-list mx-1" title="View">
                                        <FontAwesomeIcon icon={faBars} />
                                    </Button>
                                </span>
                            </td>
                        </tr>
                        {/* ))} */}
                    </tbody>
                </Table>
            </div>
        </Col>

        {selectedItem && <PrintTable item={selectedItem} onClose={() => setSelectedItem(null)} />}

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
                <AddPrescription refresh={props.refresh} data={previewData} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editModel} toggle={handleEditClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                Edit Visit Details
            </ModalHeader>
            <ModalBody>
                <EditCheckupDetail handleParentClose={handlePreviewClose} refresh={props.refresh} data={props.data} handleClose={handleEditClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editPrescriptionOpen} toggle={handleEditPrescriptionClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditPrescriptionClose} className="p-3 bg-info-subtle modal-title">
                Edit Presciption
            </ModalHeader>
            <ModalBody>
                <EditPresciption refresh={props.refresh} handleClose={handleEditPrescriptionClose} />
            </ModalBody>
        </Modal>
    </>
}
export default CheckupDatatable