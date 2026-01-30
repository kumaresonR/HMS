import { useState } from "react";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import EditPostnatalHistory from "./EditPostnatalHistory";
import moment from "moment";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import { Link } from "react-router-dom";

const PostnatalHistoryDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [postnatalHistoryId, setPostnatalHistoryId] = useState('');
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleClose() {
        setOpenEditModal(!openEditModal);
    }

    const edit = (id: any) => {
        setPostnatalHistoryId(id);
        handleClose();
    }
    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deletePostnatalHistory(selectedId);
                toast.success('Postnatal History Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deletePostnatalHistory = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    return <>
        <Col>

            <Card >
                <CardBody>

                    <div className="table-responsive">
                        <Table hover className="table-centered align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Labor Time	</th>
                                    <th>Delivery Time</th>
                                    <th>Routine Question</th>
                                    <th>General Remark</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props?.data?.postnatalHistory && props?.data?.postnatalHistory?.length > 0 ? (
                                    props?.data?.postnatalHistory.map((item: any, idx: any) => (
                                        <tr key={idx}>
                                            <td>
                                                {moment(item.laborTime).format('DD/MM/YYYY hh:mm A')}
                                            </td>
                                            <td> {moment(item.deliveryTime).format('DD/MM/YYYY hh:mm A')}</td>
                                            <td>{item.routineQuestion}</td>
                                            <td>{item.generalRemark}</td>
                                            <td>
                                                <span>
                                                    <Link to="#" data-bs-toggle="modal" onClick={() => edit(item)}
                                                        className="btn btn-sm btn-soft-info edit-list mx-1" title="Edit">
                                                        <i className="ri-pencil-line"></i>
                                                    </Link>
                                                    <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deletePostnatalHistory(item.postnatalId)}
                                                        className="btn btn-sm btn-soft-danger remove-list mx-1">
                                                        <i className="ri-delete-bin-5-line"></i>
                                                    </Link>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted">
                                            No postnatal history available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                </CardBody>
            </Card >
        </Col>

        <Modal isOpen={openEditModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Postnatal History
            </ModalHeader>

            <ModalBody>
                <EditPostnatalHistory refresh={props.refresh} id={postnatalHistoryId} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default PostnatalHistoryDataTable