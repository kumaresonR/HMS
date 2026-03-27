import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import EditOperation from "./EditOperation";
import PreviewOperation from "./PreviewOperation";
import PrintComponent from "../../../../../Components/Common/PrintComponent";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import moment from "moment";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import { Link } from "react-router-dom";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const OperationDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const operations = data?.operation || data?.opdOperationDetails || [];
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [operationId, setOperationId] = useState('');
    const [selectedOperationData, setSelectedOperationData] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const edit = (id: any) => {
        setSelectedOperationData(id);
        handleClose();
    }

    const handleClose = () => {
        setOpenAddModal(!openAddModal);
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
    }

    const preview = (data: any) => {
        setPreviewData(data);
        handlePreviewClose();
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "ipd") {
                    await iPDApiService.deleteOperation(selectedId);
                } else {
                    await opdApiService.deleteOperation(selectedId);
                }
                toast.success('Operation Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteOperation = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Reference No	</th>
                            <th>Operation Date</th>
                            <th>Operation Name</th>
                            <th>Operation Category</th>
                            <th>OT Technician</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations && operations?.length > 0 ? (
                            operations?.map((item: any, idx: any) => (
                                <tr key={idx}>
                                    <td className="text-primary">
                                        {item.otReferenceNo}
                                    </td>
                                    <td>{moment(item.operationDate).format('DD/MM/YYYY hh:mm A')}</td>
                                    <td className="text-primary">{item.operationName}</td>
                                    <td>{item.operationCategory}</td>
                                    <td className="text-primary">{item.otTechnician}</td>
                                    <td>
                                        <span>
                                            <ul className="list-inline hstack gap-2 mb-0">
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                                    <li className="list-inline-item">
                                                        <Link
                                                            className="edit-item-btn"
                                                            to="#"
                                                            data-bs-toggle="modal" onClick={() => edit(item)}
                                                            title="Edit"
                                                        >
                                                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item" title="Delete">
                                                        <Link
                                                            className="remove-item-btn" data-bs-toggle="modal" onClick={() => deleteOperation(item.operationId)}

                                                            to="#"
                                                        >
                                                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                                        </Link>
                                                    </li>
                                                </RoleBasedComponent>
                                                <li className="list-inline-item" title="View">
                                                    <Link
                                                        className="view-item-btn"
                                                        to="#" data-bs-toggle="modal" onClick={() => preview(item)}
                                                    >
                                                        <i className="ri-eye-fill align-bottom text-pink"></i>
                                                    </Link>
                                                </li>
                                            </ul>



                                            {/* <Button data-bs-toggle="modal" onClick={() => preview(item)}
                                            className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                            <i className="ri-eye-line"></i>
                                        </Button> 
                                        <Button data-bs-toggle="modal" onClick={() => edit(item)}
                                            className="btn btn-sm btn-soft-info edit-list mx-1" title="Edit">
                                            <i className="ri-pencil-line"></i>
                                        </Button>
                                        <Button title="Delete" data-bs-toggle="modal" onClick={() => deleteOperation(item.operationId)}
                                            className="btn btn-sm btn-soft-danger remove-list mx-1">
                                            <i className="ri-delete-bin-5-line"></i>
                                        </Button>*/}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-muted">
                                    No operation available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle model-header-container modal-title">
                Operation Details
                <PrintComponent contentId="prescriptionContent" />
            </ModalHeader>

            <ModalBody id="prescriptionContent">
                <PreviewOperation data={previewData} handleClose={handlePreviewClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={openAddModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Operation
            </ModalHeader>

            <ModalBody>
                <EditOperation title={props.title} refresh={props.refresh} id={selectedOperationData} data={props.data} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default OperationDataTable