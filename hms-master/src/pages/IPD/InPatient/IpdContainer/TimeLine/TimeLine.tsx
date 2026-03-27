import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faNotesMedical, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Collapse, Modal, ModalBody, ModalHeader } from "reactstrap";
import classnames from "classnames";
import EditTimeLine from "./EditTimeLine";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import moment from "moment";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const TimeLine = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
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
                if (props.title === "ipd") {
                    await iPDApiService.deleteTimeLine(selectedId);
                } else {
                    await opdApiService.deleteTimeLine(selectedId);
                }
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

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <div className="profile-timeline my-2">

            <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
            >
                {data?.timeline?.map((item: any, idx: any) => (
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
                                    <h6 className="mb-1">{item.description}</h6>
                                </div>
                            </Collapse>
                        </div>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", 'NURSE']}>
                            <div className="col-sm-2">
                                <Link to="#" onClick={() => edit(item.timeLineId)}
                                    className="btn btn-sm btn-soft-info edit-list mx-2" title="Edit">
                                    <i className="ri-pencil-line"></i>
                                </Link>
                                <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteTimeline(item.timeLineId)}
                                    className="btn btn-sm btn-soft-danger remove-list mx-2">
                                    <i className="ri-delete-bin-5-line"></i>
                                </Link>
                            </div>
                        </RoleBasedComponent>
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
                <EditTimeLine title={props.title} id={timelineId} refresh={props.refresh} data={props.data} handleColse={handleColse} />
            </ModalBody>
        </Modal>
        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default TimeLine