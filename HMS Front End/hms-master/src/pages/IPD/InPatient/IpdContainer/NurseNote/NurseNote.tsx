import { Form, Link } from "react-router-dom"
import { Alert, Button, Card, CardBody, CardHeader, Col, Collapse, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import classnames from "classnames";
import { useEffect, useState } from "react";
import { faClipboardList, faClock, faComment, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditNurseNote from "./EditNurseNote";
import AddNurseNoteCommand from "./AddNurseNoteCommand";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import moment from "moment";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const NurseNote = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openCommandModal, setOpenCommandModal] = useState<boolean>(false);
    const [nurseNoteId, setNurseNoteId] = useState('');
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const [deleteCommentModal, setDeleteCommentModal] = useState<boolean>(false);
    const [selectedCommentId, setSelectedCommentId] = useState('');

    function handleColse() {
        setOpenModal(!openModal);
    }

    function handleCommandColse() {
        setOpenCommandModal(!openCommandModal);
    }

    const addCommand = (id: any) => {
        setNurseNoteId(id)
        handleCommandColse();
    }

    const edit = (id: any) => {
        setNurseNoteId(id)
        handleColse()
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deleteNurseNote(selectedId);
                toast.success('Nurse Note Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteNurseNote = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const handleDeleteComment = async () => {
        if (selectedCommentId) {
            try {
                await iPDApiService.deleteNurseNoteCommment(selectedCommentId);
                toast.success('Nurse Note Comment Deleted Successfully', { containerId: 'TR' });
                setDeleteCommentModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteNurseNoteComment = (id: any) => {
        setSelectedCommentId(id);
        setDeleteCommentModal(true);
    }

    // const getNurseNote = async () => {
    //     try {
    //         let data = await iPDApiService.getAllNurseNote("all");
    //         setData(data);
    //         console.log('getNurseNote data', data);
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }

    // useEffect(() => {
    //     getNurseNote();
    // }, []);
    return <>
        <div className="profile-timeline my-2">
            <Card>
                <CardBody>
                    <div
                        className="accordion accordion-flush"
                        id="accordionFlushExample"
                    >
                        {props?.data?.nurseNotes && props?.data?.nurseNotes?.length > 0 ? (
                            props?.data?.nurseNotes?.map((item: any, idx: any) => (<div className="accordion-item border-0 d-flex justify-content-between" key={idx}>
                                <div>
                                    <div className="accordion-header" id="headingOne">
                                        <Link to="#" className={classnames(
                                            "accordion-button",
                                            "p-2",
                                            "shadow-none",


                                        )}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-xs">
                                                    <div className="avatar-title bg-success rounded-circle">
                                                        <FontAwesomeIcon icon={faClipboardList} />
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6 className="fs-15 mb-0 fw-semibold">
                                                        {item.doctor?.firstName} {item.doctor?.lastName} ({item.doctor?.staffId}) -{" "}
                                                        <span className="fw-normal">
                                                            {moment(item.date).format('DD/MM/YYYY hh:mm A')}
                                                        </span>
                                                    </h6>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <Collapse
                                        id="collapseOne"
                                        className="accordion-collapse"
                                        isOpen={true}
                                    >
                                        <div className="accordion-body ms-2 ps-5 pt-0">
                                            <h6 className="mb-1">{item.note}</h6>
                                            {item.comments?.map((command: any, subIdx: any) => (
                                                <p className="text-muted" key={subIdx}>
                                                    {command.comment}
                                                    <RoleBasedComponent allowedRoles={["SUPERADMIN",'NURSE']}>
                                                        <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteNurseNoteComment(command.commentId)}
                                                            className="btn btn-sm btn-soft-danger remove-list mx-2">
                                                            <i className="ri-delete-bin-5-line"></i>
                                                        </Link>
                                                    </RoleBasedComponent>
                                                </p>
                                            ))}
                                        </div>
                                    </Collapse>
                                </div>
                                <RoleBasedComponent allowedRoles={["SUPERADMIN",'NURSE']}>
                                    <div>
                                        <Link to="#" onClick={() => edit(item)}
                                            className="btn btn-sm btn-soft-info edit-list mx-2" title="Edit">
                                            <i className="ri-pencil-line"></i>
                                        </Link>
                                        <Link to="#" onClick={() => addCommand(item.notesId)}
                                            className="btn btn-sm btn-soft-success edit-list mx-2" title="Comment">
                                            <FontAwesomeIcon icon={faComment} />
                                        </Link>
                                        <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteNurseNote(item.notesId)}
                                            className="btn btn-sm btn-soft-danger remove-list mx-2">
                                            <i className="ri-delete-bin-5-line"></i>
                                        </Link>
                                    </div>
                                </RoleBasedComponent>
                            </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <Alert color="danger">
                                    No nurse notes available to display.
                                </Alert>
                            </div>
                        )}

                        <div className="accordion-item border-0">
                            <div className="accordion-header" id="headingFour">
                                <Link to="#"
                                    className="accordion-button p-2 shadow-none"
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 avatar-xs">
                                            <div className="avatar-title bg-light text-success rounded-circle">
                                                <FontAwesomeIcon icon={faClock} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>

        <Modal isOpen={openModal} toggle={handleColse}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                Edit Nurse Note
            </ModalHeader>
            <ModalBody>
                <EditNurseNote id={nurseNoteId} refresh={props.refresh} handleColse={handleColse} />
            </ModalBody>
        </Modal >

        <Modal isOpen={openCommandModal} toggle={handleCommandColse}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleCommandColse} className="p-3 bg-info-subtle modal-title">
                Add Command
            </ModalHeader>
            <ModalBody>
                <AddNurseNoteCommand id={nurseNoteId} refresh={props.refresh} handleColse={handleCommandColse} />
            </ModalBody>
        </Modal >

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
            show={deleteCommentModal}
            onDeleteClick={handleDeleteComment}
            onCloseClick={() => setDeleteCommentModal(false)}
        />
    </>
}
export default NurseNote