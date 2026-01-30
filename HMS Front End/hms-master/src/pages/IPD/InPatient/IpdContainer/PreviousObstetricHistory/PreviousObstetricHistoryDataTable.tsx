import { faBars, faFilePdf, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import PreviewPreviousObstetricHistory from "./PreviewPreviousObstetricHistory";
import EditPreviousObstetricHistory from "./EditPreviousObstetricHistory";
import moment from "moment";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../../../../Components/Common/DeleteModal";

const PreviousObstetricHistoryDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [previewData, setPreviewData] = useState(props.data);
    const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleClosePreviewModel() {
        setOpenPreviewModal(!openPreviewModal);
    }

    const preview = (data: any) => {
        setPreviewData(data)
        handleClosePreviewModel();
    }

    const handleClose = () => {
        setOpenEditModal(!openEditModal);
    }
    const edit = () => {
        handleClose();
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deletePreviousObstetricHistory(selectedId);
                toast.success('Postnatal History Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                handleClosePreviewModel();
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteObstricHistory = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered table-nowrap align-middle  mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Place Of Delivery</th>
                            <th>Duration Of Pregnancy</th>
                            <th>Complication In Pregnancy Or Puerperium</th>
                            <th>Birth Weight</th>
                            <th>Gender</th>
                            <th>Infant Feeding</th>
                            <th>Birth Status</th>
                            <th>Alive/Dead Date</th>
                            <th>Death Cause</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props?.data?.previousObstetricHistory?.map((item: any, idx: any) => (
                            <tr key={idx}>
                                <td>{item.placeOfDelivery}</td>
                                <td>{item.durationOfPregnancy}</td>
                                <td>{item.complicationsInPregnancyOrPuerperium}</td>
                                <td>{item.birthWeight}</td>
                                <td>{item.gender}</td>
                                <td>{item.infantFeeding}</td>
                                <td>{item.birthStatus}</td>
                                <td>{item.aliveOrDeadDate
                                    ? moment(item.aliveOrDeadDate).format('DD/MM/YYYY')
                                    : 'NA'}
                                </td>
                                <td>{item.deathCause}</td>
                                <td>
                                    <span>
                                        <Button onClick={() => preview(item)}
                                            title="Preview"
                                            className="btn btn-sm btn-soft-info edit-list">
                                            <FontAwesomeIcon icon={faBars} />
                                        </Button>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={openPreviewModal} toggle={handleClosePreviewModel}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handleClosePreviewModel} className="p-3 bg-info-subtle modal-title">
                Previous Obstetric History
            </ModalHeader>

            <ModalBody>
                <Col className="text-end">
                    {/* <FontAwesomeIcon icon={faFilePdf} size="xl" className="mx-1" /> */}
                    <FontAwesomeIcon icon={faPenToSquare} size="xl" className="mx-1 text-primary" onClick={() => edit()} />
                    <FontAwesomeIcon icon={faTrashCan} size="xl" className="mx-1 text-danger" onClick={() => deleteObstricHistory(previewData.historyId)} />
                </Col>
                <PreviewPreviousObstetricHistory data={previewData} patientData={props?.data} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={openEditModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Previous Obstetric History
            </ModalHeader>

            <ModalBody>
                <EditPreviousObstetricHistory refresh={props.refresh} data={previewData} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}

export default PreviousObstetricHistoryDataTable