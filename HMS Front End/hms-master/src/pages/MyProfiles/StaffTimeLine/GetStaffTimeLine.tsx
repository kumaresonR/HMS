import { Collapse, Modal, ModalBody, ModalHeader } from "reactstrap";
import DeleteModal from "../../../Components/Common/DeleteModal";
import EditStaffTimeLine from "./EditStaffTimeLine";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { useState } from "react";
import EmployeeApiService from "../../../helpers/services/employee/EmployeeApiService";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const GetStaffTimeLine = (props: any) => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    const [data, setData] = useState<any>(props.data);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [timelineId, setTimelineId] = useState();
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const edit = (id: any) => {
        setTimelineId(id);
        handleColse();
    }

    function handleColse() {
        setOpenModal(!openModal);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await employeeApiService.deleteTimeLine(selectedId);
                toast.success('Timeline Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false); 
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteTimeline = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    return <>
        <div className="profile-timeline my-2">
            <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
            >
                {props?.data?.map((item: any, idx: any) => (
                    <div className="accordion-item border-0 d-flex justify-content-between" key={idx}>
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
                                                {item.title} -{" "}
                                                <span className="fw-normal">
                                                    {moment(item.date).format('DD/MM/YYYY')}
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
                                    <h6 className="mb-1">{item.description}</h6>
                                </div>
                            </Collapse>
                        </div>
                        <div className="col-sm-2">
                            <Link to="#" onClick={() => edit(item.timelineId)}
                                className="btn btn-sm btn-soft-info edit-list mx-2" title="Edit">
                                <i className="ri-pencil-line"></i>
                            </Link>
                            <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteTimeline(item.timelineId)}
                                className="btn btn-sm btn-soft-danger remove-list mx-2">
                                <i className="ri-delete-bin-5-line"></i>
                            </Link>
                        </div>
                    </div>
                ))}

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
        </div>
        <Modal isOpen={openModal} toggle={handleColse}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                Edit Timeline
            </ModalHeader>
            <ModalBody>
                <EditStaffTimeLine id={timelineId} data={props.data} refresh={props.refresh} handleColse={handleColse} />
            </ModalBody>
        </Modal>
        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}

export default GetStaffTimeLine