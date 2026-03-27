import { faBars, faPen, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import PreviewVisitDetails from "../Visits/PreviewVisitDetails";
import EditCheckupDetail from "../Visits/EditCheckupDetail";
import moment from "moment";

const OPDTreatmentHistoryDataTable = (props: any) => {
    const [data, setData] = useState(props.data || {});
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [editModel, setEditModel] = useState<boolean>(false);

    const preview = (data: any) => {
        setPreviewData(data);
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
    }

    const editVisitDetails = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <h5>Treatment History</h5>
            <div className="table-responsive">
                <Table hover className="table-centered  align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>OPD No</th>
                            {/* <th>Case ID</th> */}
                            <th>Appointment Date</th>
                            <th>Symptoms</th>
                            <th>Consultant Doctor</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data?.admissions?.opdId}</td>
                            {/* <td>{data?.admissions?.caseId}</td> */}
                            <td>{moment(data?.admissions?.appointmentDate).format("DD/MM/YYYY hh:mm A")}</td>
                            <td>
                                <span>{data?.admissions?.symptomsDescription}</span>
                            </td>
                            <td>{data?.admissions?.doctor?.firstName} {data?.admissions?.doctor?.lastName} ({data?.admissions?.doctor?.staffId})</td>

                            <td>
                                <span>
                                    <Button data-bs-toggle="modal" onClick={() => preview(data)}
                                        className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                        <FontAwesomeIcon icon={faBars} />
                                    </Button>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle model-header-container modal-title">
                Visit Details
                <div>
                    <Button data-bs-toggle="modal" onClick={() => editVisitDetails()}
                        className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Edit">
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                </div>
            </ModalHeader>

            <ModalBody>
                <PreviewVisitDetails data={previewData} handleClose={handlePreviewClose} />
            </ModalBody>
        </Modal>

        <Modal isOpen={editModel} toggle={handleEditClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                Edit Visit Details
            </ModalHeader>
            <ModalBody>
                <EditCheckupDetail refresh={props.refresh} data={props.data} handleClose={handleEditClose} />
            </ModalBody>
        </Modal>
    </>
}
export default OPDTreatmentHistoryDataTable