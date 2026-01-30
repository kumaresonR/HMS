import { faClipboardList, faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Button, Collapse, Modal, ModalBody, ModalHeader } from "reactstrap"
import classnames from "classnames";
import EditMedication from "./EditMedication"
import { groupBy } from 'lodash';
import AddMedication from "./AddMedication"
import ErrorHandler from "../../../../../helpers/ErrorHandler"
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service"
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service"
import { toast } from "react-toastify"
import DeleteModal from "../../../../../Components/Common/DeleteModal"
import moment from "moment"

const MedicationList = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();
    const iPDApiService: IPDApiService = new IPDApiService();

    const [data, setData] = useState(props.data);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const groupedByDate = groupBy(data.medicationsDetails || data.medication, 'date');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [medicationId, setMedicationId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleColse() {
        setOpenModal(!openModal);
    }

    const edit = (item: any) => {
        setMedicationId(item)
        handleColse()
    }

    function handleAddModuleColse() {
        setOpenAddModal(!openAddModal);
    }

    const addNew = (date: any) => {
        setSelectedDate(date)
        handleAddModuleColse()
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "ipd") {
                    await iPDApiService.deleteMedication(selectedId);
                } else {
                    await opdApiService.deleteMedication(selectedId);
                }
                toast.success('Medication Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteMedication = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        setData(props.data); 
    }, [props.data]);

    return <>
        <div className="profile-timeline my-2">
            <div className="accordion accordion-flush" id="accordionFlushExample">
                {Object.keys(groupedByDate).length > 0 ? (
                    Object.entries(groupedByDate).map(([date, medicationsByDate], dateIdx) => (
                        <div key={dateIdx}>
                            <>
                                {Object.entries(groupBy(medicationsByDate, 'medicineName')).map(
                                    ([medicineName, meds], idx) => (
                                        <div className="accordion-item border-0 justify-content-between" key={idx}>
                                            <div>
                                                <div className="accordion-header" id={`heading${dateIdx}${idx}`}>
                                                    <Link to="#" className={classnames(
                                                        "accordion-button",
                                                        "p-2",
                                                        "shadow-none"
                                                    )}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 avatar-xs">
                                                                <div className="avatar-title bg-success rounded-circle">
                                                                    <FontAwesomeIcon icon={faClipboardList} />
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6 className="fs-15 mb-0 fw-semibold">
                                                                    {medicineName} -{" "}
                                                                    <span className="fw-normal">
                                                                        {date}
                                                                    </span>
                                                                </h6>
                                                            </div>
                                                            <div>
                                                                <Link to="#" title="Add Medication Dose" data-bs-toggle="modal" onClick={() => addNew(date)}
                                                                    className="btn btn-sm btn-soft-info remove-list mx-2">
                                                                    <i className="ri-add-circle-fill"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <Collapse
                                                    id={`collapse${dateIdx}${idx}`}
                                                    className="accordion-collapse row mb-2 ps-5 pt-0"
                                                    isOpen={true}
                                                >
                                                    {meds.map((item, itemIdx) => (
                                                        <div
                                                            className="accordion-body col-md-3 col-sm-6"
                                                            key={itemIdx}
                                                            onMouseEnter={() => setHoveredItem(item)}
                                                            onMouseLeave={() => setHoveredItem(null)}
                                                        >
                                                            <div>
                                                                <div className="d-flex">
                                                                    <h6 className="mb-4">Dose {itemIdx + 1}</h6>

                                                                    {hoveredItem === item && (
                                                                        <div>
                                                                            <Link to="#" onClick={() => edit(item)}
                                                                                className="btn btn-sm btn-soft-info edit-list mx-2" title="Edit">
                                                                                <i className="ri-pencil-line"></i>
                                                                            </Link>
                                                                            <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteMedication(item.medicationId)}
                                                                                className="btn btn-sm btn-soft-danger remove-list mx-2">
                                                                                <i className="ri-delete-bin-5-line"></i>
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="d-flex">
                                                                    <h6 className="me-3">{item?.dosage[0]?.dosage}</h6>
                                                                    <p className="text-muted">{moment(item?.dosage[0]?.dosageTime, "HH:mm:ss").format("hh:mm A")}</p>
                                                                </div>
                                                                <p className="text-muted">Remark: {item?.dosage[0]?.remarks}</p>
                                                                {/* <p>Created By: Super Admin (9001)</p> */}
                                                            </div>

                                                        </div>
                                                    ))}
                                                </Collapse>
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
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
                    ))
                ) : (
                    <div className="text-center py-4">
                        <Alert color="danger">
                            No medications available to display.
                        </Alert>
                    </div>
                )}

            </div>
        </div>

        <Modal isOpen={openAddModal} toggle={handleAddModuleColse}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleAddModuleColse} className="p-3 bg-info-subtle modal-title">
                Add Medication Dose
            </ModalHeader>
            <ModalBody>
                <AddMedication date={selectedDate} title={props.title} data={data} refresh={props.refresh} handleClose={handleAddModuleColse} />
            </ModalBody>
        </Modal>

        <Modal isOpen={openModal} toggle={handleColse}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                Edit Medication Dose
            </ModalHeader>
            <ModalBody>
                <EditMedication id={medicationId} title={props.title} data={data} refresh={props.refresh} handleColse={handleColse} />
            </ModalBody>
        </Modal >

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}

export default MedicationList