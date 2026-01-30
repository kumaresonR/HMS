import { useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import EditConsultantRegister from "./EditConsultantRegister";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import moment from "moment";
import { Link } from "react-router-dom";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const ConsultantRegisterDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [openEditModal, setOpenEditModal] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const edit = (id: any) => {
        setSelectedId(id);
        handleClose();
    }

    function handleClose() {
        setOpenEditModal(!openEditModal);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deleteConsultantRegister(selectedId);
                toast.success('ConsultantRegister Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteConsultantRegister = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Applied Date</th>
                            <th>Consultant Doctor</th>
                            <th>Instruction</th>
                            <th>Instruction Date</th>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", 'NURSE']}>
                                <th>Action</th>
                            </RoleBasedComponent>
                        </tr>
                    </thead>
                    <tbody>
                        {props?.data?.consultantRegister && props?.data?.consultantRegister?.length > 0 ? (
                            props?.data?.consultantRegister?.map((item: any, idx: any) => (
                                <tr key={idx}>
                                    <td>{moment(item.appliedDate).format('DD/MM/YYYY')}</td>
                                    <td className="text-primary">{item.doctor?.firstName} {item.doctor?.lastName} ({item.doctor?.staffId})</td>
                                    <td>{item.instruction}</td>
                                    <td>{moment(item.consultantDate).format('DD/MM/YYYY')}</td>
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", 'NURSE']}>
                                        <td>
                                            <span>
                                                <ul className="list-inline hstack gap-2 mb-0">
                                                    <li className="list-inline-item">
                                                        <Link
                                                            className="edit-item-btn"
                                                            to="#"
                                                            data-bs-toggle="modal" onClick={() => edit(item.consultantId)}
                                                            title="Edit"
                                                        >
                                                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                                                        </Link>
                                                    </li>

                                                    <li className="list-inline-item" title="Delete">
                                                        <Link
                                                            className="remove-item-btn" title="Delete" data-bs-toggle="modal" onClick={() => deleteConsultantRegister(item.consultantId)}

                                                            to="#"
                                                        >
                                                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                                        </Link>
                                                    </li>


                                                </ul>
                                                {/* <Button data-bs-toggle="modal" onClick={() => edit(item.consultantId)}
                                            className="btn btn-sm btn-soft-info edit-list mx-1" title="Edit">
                                            <i className="ri-pencil-line"></i>
                                        </Button>
                                        <Button title="Delete" data-bs-toggle="modal" onClick={() => deleteConsultantRegister(item.consultantId)}
                                            className="btn btn-sm btn-soft-danger remove-list mx-1">
                                            <i className="ri-delete-bin-5-line"></i>
                                        </Button> */}
                                            </span>
                                        </td>
                                    </RoleBasedComponent>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center text-muted">No consultant available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={openEditModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Consultant Register
            </ModalHeader>

            <ModalBody>
                <EditConsultantRegister refresh={props.refresh} id={selectedId} data={props.data} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default ConsultantRegisterDataTable